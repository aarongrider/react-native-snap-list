/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import {
  Animated,
  Dimensions,
  FlatList,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {PanGestureHandler, State} from 'react-native-gesture-handler';
import React, {Component} from 'react';

import {LoremIpsum} from 'lorem-ipsum';
import Toast from 'react-native-simple-toast';

const {height, width} = Dimensions.get('window');

const USE_NATIVE_DRIVER = true;

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

export default class App extends Component {
  lastElement = 0;
  currentElement = 0;
  offset = 0;
  flatList = React.createRef();

  constructor(props) {
    super();

    this.state = {
      height: 0,
      transitioningIndex: false,
      flatListScrollEnabled: false,
      outerPanHandlerEnabled: false,
    };

    this._translateY = new Animated.Value(0);
    this._lastOffset = {x: 0, y: 0};
    this._onGestureEvent = Animated.event(
      [
        {
          nativeEvent: {
            translationY: this._translateY,
          },
        },
      ],
      {useNativeDriver: USE_NATIVE_DRIVER},
    );
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
    console.log('onscroll');
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

    console.log('Scroll Direction: ' + scrollDirection);
    this.offset = currentOffset;

    const detectMargin = 50;
    const atBottom =
      event.nativeEvent.layoutMeasurement.height +
        event.nativeEvent.contentOffset.y >=
      event.nativeEvent.contentSize.height - detectMargin;
    const atTop = event.nativeEvent.contentOffset.y <= detectMargin;
    if (atBottom) console.log('atBottom');
    if (atTop) console.log('atTop');

    if (atBottom) {
      this.setState({outerPanHandlerEnabled: true});
    }

    // // if at top and no change in direction
    // if ((atTop || atBottom) && currentOffset == this.offset) {
    //   console.log('if at top or bottom and no change in direction');
    //   this.setState({flatListScrollEnabled: true});
    // }
    // // if at top and moving up
    // else if (atTop && scrollDirection === 'up') {
    //   console.log('if at top and moving up');
    //   this.setState({flatListScrollEnabled: true});
    // }
    // // if at bottom and moving down
    // else if (atBottom && scrollDirection === 'down') {
    //   console.log('at bottom and moving down');
    //   this.setState({flatListScrollEnabled: true});
    // } else {
    //   this.setState({flatListScrollEnabled: false});
    // }
  };

  _renderItem = ({item, index, separators}) => {
    return (
      <ScrollView
        scrollEventThrottle={1}
        onScrollBeginDrag={event => {
          this._onScrollBegin(event);
        }}
        onScroll={event => {
          this._onScroll(event);
        }}
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
    if (layoutHeight && layoutHeight !== this.state.height) {
      this.setState({height: layoutHeight});
    }
  };

  _onHandlerStateChange = event => {
    if (event.nativeEvent.oldState === State.ACTIVE) {
      this._lastOffset.x += event.nativeEvent.translationX;
      this._lastOffset.y += event.nativeEvent.translationY;
      this._translateX.setOffset(this._lastOffset.x);
      this._translateX.setValue(0);
      this._translateY.setOffset(this._lastOffset.y);
      this._translateY.setValue(0);
    }
  };

  onHandlerStateChanged = e => {
    if (e.nativeEvent.oldState === State.ACTIVE) {
      console.log(e.nativeEvent);
      // Animated.add(this.translateY, e.nativeEvent.translationY);
      console.log('this translate y ', this.translateY._value);
      this.translateY.setValue(
        this.translateY._value + e.nativeEvent.translationY,
      );
    }
  };

  onScrollEndReached = e => {
    console.log('end reached');
  };

  render() {
    return (
      <SafeAreaView style={{backgroundColor: 'gray', flex: 1}}>
        <View
          style={{backgroundColor: 'white', flex: 1}}
          onLayout={this._onLayout}>
          <PanGestureHandler
            enabled={this.state.outerPanHandlerEnabled}
            onGestureEvent={this._onGestureEvent}
            onHandlerStateChange={this._onHandlerStateChanged}>
            <Animated.ScrollView
              scrollEnabled={!this.state.outerPanHandlerEnabled}
              scrollEventThrottle={10}
              onScroll={this._onScroll}
              style={[
                styles.box,
                {
                  transform: [{translateY: this._translateY}],
                },
              ]}>
              <Text
                style={{
                  fontSize: 42,
                  textAlign: 'center',
                  paddingBottom: 16,
                }}>
                1
              </Text>
              <Text style={{fontSize: 16, lineHeight: 30}}>
                {lorem.generateParagraphs(5)}
              </Text>
            </Animated.ScrollView>

            {/* <Animated.View
                style={[
                  {
                    backgroundColor: '#42a5f5',
                    borderRadius: circleRadius,
                    height: circleRadius * 2,
                    width: circleRadius * 2,
                  },
                  {
                    transform: [
                      {
                        translateX: Animated.add(
                          this._touchX,
                          new Animated.Value(-circleRadius),
                        ),
                      },
                    ],
                  },
                ]}
              /> */}
            {/* <FlatList
                // style={{flex: 1}}
                ref={this.flatList}
                extraData={this.state.height}
                onLayout={this._onFlatListLayout}
                scrollEnabled={this.state.flatListScrollEnabled}
                onScrollEndDrag={() => this._onScrollEndDrag()}
                // pagingEnabled={true}
                horizontal={false}
                onViewableItemsChanged={this._onIndexChanged}
                showsVerticalScrollIndicator={false}
                showsHorizontalScrollIndicator={false}
                data={DATA}
                renderItem={this._renderItem}
                onViewableItemsChanged={this._onViewableItemsChanged}
              /> */}
          </PanGestureHandler>
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({});
