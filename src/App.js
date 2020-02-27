/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import {
  Dimensions,
  FlatList,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, {Component} from 'react';

import {LoremIpsum} from 'lorem-ipsum';
import {SpringScrollView} from 'react-native-spring-scrollview';
import Toast from 'react-native-simple-toast';
import InfiniteScroll from './InfiniteScroll';

const {HEIGHT, WIDTH} = Dimensions.get('window');

const lorem = new LoremIpsum({
  sentencesPerParagraph: {
    max: 8,
    min: 4,
  },
  wordsPerSentence: {
    max: 16,
    min: 4,
  },
});

const DATA = [
  {
    key: '1',
    value: lorem.generateParagraphs(10),
  },
  {
    key: '2',
    value: lorem.generateParagraphs(5),
  },
  {
    key: '3',
    value: lorem.generateParagraphs(3),
  },
  {
    key: '4',
    value: lorem.generateParagraphs(1),
  },
  {
    key: '5',
    value: lorem.generateParagraphs(7),
  },
];

const largeListData = {items: DATA};

export default class App extends Component {
  lastElement = 0;
  currentElement = 0;
  offset = 0;
  flatList = React.createRef();

  state = {
    height: 0,
    transitioningIndex: false,
    flatListScrollEnabled: false,
  };

  constructor() {
    super();
  }

  _onViewableItemsChanged = info => {
    if (info.viewableItems.length > 0) {
      const firstIndex = info.viewableItems[0].index;
      const lastIndex = info.viewableItems[info.viewableItems.length - 1].index;

      if (firstIndex !== this.currentElement) {
        this.currentElement = firstIndex;
      } else if (lastIndex !== this.currentElement) {
        this.currentElement = lastIndex;
      }

      this._onIndexChanged();
    }
  };

  _onScrollBegin = event => {
    console.log('_onScrollBegin');
    this._onScroll(event);
  };

  _onScrollEndDrag = e => {
    console.log('_onScrollEndDrag');

    if (this.state.transitioningIndex) {
      console.log('disable flatlist dragging');
      this.setState({flatListScrollEnabled: false});
    }
  };

  _onIndexChanged = () => {
    const index = this.currentElement + 1;
    Toast.show('Index is now: ' + index, Toast.SHORT);
    this.setState({transitioningIndex: true});

    // TODO: Add haptic feedback
    //ReactNativeHapticFeedback.trigger("impactLight");
  };

  _onScroll = event => {
    //console.log('onscroll', event.nativeEvent);
    // const layoutHeight = event.nativeEvent.layoutMeasurement.height;
    // const contentHeight = event.nativeEvent.contentSize.height;

    //console.log("Content offset:" + event.nativeEvent.contentOffset.y)
    //console.log("Content size:" + event.nativeEvent.contentSize.height)
    //console.log("layout height:" + event.nativeEvent.layoutMeasurement.height)

    /// Detect scrolling direction
    const currentOffset = event.nativeEvent.contentOffset.y;
    const dif = currentOffset - (this.offset || 0);
    let scrollDirection = 'unclear';

    if (Math.abs(dif) < 3) {
      scrollDirection = 'unclear';
    } else if (dif < 0) {
      scrollDirection = 'up';
    } else {
      scrollDirection = 'down';
    }

    //console.log("Scroll Direction: " + scrollDirection)
    this.offset = currentOffset;

    const detectMargin = 50;
    const atBottom =
      event.nativeEvent.layoutMeasurement.height +
        event.nativeEvent.contentOffset.y >=
      event.nativeEvent.contentSize.height - detectMargin;
    const atTop = event.nativeEvent.contentOffset.y <= detectMargin;
    //if (atBottom) console.log("atBottom")
    //if (atTop) console.log("atTop")

    // if at top and no change in direction
    if ((atTop || atBottom) && currentOffset === this.offset) {
      console.log('if at top or bottom and no change in direction');
      this.setState({flatListScrollEnabled: true});
    }
    // if at top and moving up
    else if (atTop && scrollDirection === 'up') {
      console.log('if at top and moving up');
      this.setState({flatListScrollEnabled: true});
    }
    // if at bottom and moving down
    else if (atBottom && scrollDirection === 'down') {
      console.log('at bottom and moving down');
      this.setState({flatListScrollEnabled: true});
    } else {
      this.setState({flatListScrollEnabled: false});
    }
  };

  _renderSpringItem = ({item, index, separators}) => {
    return (
      <SpringScrollView
        scrollEventThrottle={1}
        onScrollBeginDrag={event => {
          this._onScrollBegin(event);
        }}
        onScroll={this._onScroll}
        height={this.state.height}>
        <View style={{padding: 50}}>
          <Text
            style={{
              fontSize: 42,
              textAlign: 'center',
              paddingBottom: 16,
            }}>
            {item.key}
          </Text>
          <Text style={{fontSize: 16, lineHeight: 30}}>{item.value}</Text>
        </View>
      </SpringScrollView>
    );
  };

  _renderItem = ({item, index, separators}) => {
    return (
      <ScrollView
        scrollEventThrottle={1}
        onScrollBeginDrag={event => {
          this._onScrollBegin(event);
        }}
        onScroll={this._onScroll}
        height={this.state.height}>
        <View style={{padding: 50}}>
          <Text
            style={{
              fontSize: 42,
              textAlign: 'center',
              paddingBottom: 16,
            }}>
            {item.key}
          </Text>
          <Text style={{fontSize: 16, lineHeight: 30}}>{item.value}</Text>
        </View>
      </ScrollView>
    );
  };

  _onLayout = event => {
    const layoutHeight = event.nativeEvent.layout.height;
    if (layoutHeight && layoutHeight != this.state.height) {
      this.setState({height: layoutHeight});
    }
  };

  _renderIndexPath = ({section: section, row: row}) => {
    return (
      <ScrollView>
        <View style={{padding: 50}}>
          <Text
            style={{
              fontSize: 42,
              textAlign: 'center',
              paddingBottom: 16,
            }}>
            {DATA[row].key}
          </Text>
          <Text style={{fontSize: 16, lineHeight: 30}}>{DATA[row].value}</Text>
        </View>
      </ScrollView>
    );
  };

  _onPanGestureEvent = (event: PanGestureHandlerGestureEvent) => {
    console.log(event.nativeEvent);
    console.log(this.flatList)
    this.flatList.scrollToOffset({
      x: 0,
      y: event.nativeEvent.translationY,
      animated: true,
    });
  };

  render() {
    return (
      <SafeAreaView style={{backgroundColor: 'gray', flex: 1}}>
        <InfiniteScroll />
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  section: {
    flex: 1,
    backgroundColor: 'gray',
    justifyContent: 'center',
    alignItems: 'center',
  },
  row: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  line: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 1,
    backgroundColor: '#EEE',
  },
});
