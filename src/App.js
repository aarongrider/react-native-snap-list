/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Text,
  Dimensions,
  FlatList,
  SafeAreaView,
} from 'react-native';
import { LoremIpsum } from "lorem-ipsum";

import Toast from 'react-native-simple-toast';

const { height, width } = Dimensions.get('window');

const lorem = new LoremIpsum({
  sentencesPerParagraph: {
    max: 8,
    min: 4
  },
  wordsPerSentence: {
    max: 16,
    min: 4
  }
});

const DATA = [
  {
    key: '1',
    value: lorem.generateParagraphs(10)
  },
  {
    key: '2',
    value: lorem.generateParagraphs(5)
  },
  {
    key: '3',
    value: lorem.generateParagraphs(3)
  },
  {
    key: '4',
    value: lorem.generateParagraphs(1)
  },
  {
    key: '5',
    value: lorem.generateParagraphs(7)
  }
]

export default class App extends Component {

  lastElement = 0;
  currentElement = 0;
  offset = 0;
  flatList = React.createRef();

  state = {
    height: 0,
    transitioningIndex: false,
    flatListScrollEnabled: false
  }

  constructor() {
    super();
  }

  _onViewableItemsChanged = (info) => {
    if (info.viewableItems.length > 0) {
      const firstIndex = info.viewableItems[0].index;
      const lastIndex = info.viewableItems[info.viewableItems.length - 1].index;

      if (firstIndex !== this.currentElement) {
        this.currentElement = firstIndex;
      }
      else if (lastIndex !== this.currentElement) {
        this.currentElement = lastIndex;
      }

      this._onIndexChanged()
    }
  };

  _onScrollEndDrag = (e) => {
    console.log("_onScrollEndDrag")

    if (this.state.transitioningIndex) {
      console.log("disable flatlist dragging")
      this.setState({ flatListScrollEnabled: false })
    }
  };

  _onIndexChanged = () => {
    const index = this.currentElement + 1
    Toast.show("Index is now: " + index, Toast.SHORT);
    this.setState({ transitioningIndex: true })

    // TODO: Add haptic feedback
    //ReactNativeHapticFeedback.trigger("impactLight");
  }

  _onScroll = (event) => {
    const layoutHeight = event.nativeEvent.layoutMeasurement.height
    const contentHeight = event.nativeEvent.contentSize.height

    console.log("Content offset:" + event.nativeEvent.contentOffset.y)
    console.log("Content size:" + event.nativeEvent.contentSize.height)
    console.log("layout height:" + event.nativeEvent.layoutMeasurement.height)

    /// Detect scrolling direction
    const currentOffset = event.nativeEvent.contentOffset.y;
    const dif = currentOffset - (this.offset || 0);
    let scrollDirection = 'unclear';

    if (Math.abs(dif) < 3) {
      scrollDirection = 'unclear'
    } else if (dif < 0) {
      scrollDirection = 'up'
    } else {
      scrollDirection = 'down'
    }

    console.log("Scroll Direction: " + scrollDirection)
    this.offset = currentOffset;

    const detectMargin = 50
    const atBottom = event.nativeEvent.layoutMeasurement.height + event.nativeEvent.contentOffset.y >= event.nativeEvent.contentSize.height - detectMargin;
    const atTop = event.nativeEvent.contentOffset.y <= detectMargin;
    if (atBottom) console.log("atBottom")
    if (atTop) console.log("atTop")

    // if at top and moving up
    if (atTop && scrollDirection === 'up') {
      console.log('if at top and moving up')
      this.setState({ flatListScrollEnabled: true })
    }
    // if at bottom and moving down
    else if (atBottom && scrollDirection === 'down') {
      console.log('at bottom and moving down')
      this.setState({ flatListScrollEnabled: true })
    }
    else {
      this.setState({ flatListScrollEnabled: false })
    }
  }

  _renderItem = ({ item, index, separators }) => {
    return (
      <ScrollView scrollEventThrottle={1} onScroll={event => { this._onScroll(event) }} height={this.state.height}>
        <View style={{ padding: 50 }}>
          <Text style={{ fontSize: 42, textAlign: 'center', paddingBottom: 16 }}>{item.key}</Text>
          <Text style={{ fontSize: 16, lineHeight: 30 }}>{item.value}</Text>
        </View>
      </ScrollView>
    )
  }

  _onLayout = (event) => {
    const layoutHeight = event.nativeEvent.layout.height
    if (layoutHeight && layoutHeight != this.state.height) {
      this.setState({ height: layoutHeight });
    }
  }

  render() {
    return (
      <SafeAreaView style={{ backgroundColor: 'gray', flex: 1 }}>
        <View style={{ backgroundColor: 'white', flex: 1 }} onLayout={this._onLayout}>
          <FlatList
            style={{ flex: 1 }}
            ref={this.flatList}
            extraData={this.state.height}
            onLayout={this._onFlatListLayout}
            scrollEnabled={this.state.flatListScrollEnabled}
            onScrollEndDrag={() => this._onScrollEndDrag()}
            pagingEnabled={true}
            horizontal={false}
            onViewableItemsChanged={this._onIndexChanged}
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
            data={DATA}
            renderItem={this._renderItem}
            onViewableItemsChanged={this._onViewableItemsChanged}
          />
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
});
