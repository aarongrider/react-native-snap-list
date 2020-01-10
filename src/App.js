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
  Animated
} from 'react-native';
import { LoremIpsum } from "lorem-ipsum";

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

  flatList = React.createRef();

  state = {
    scrollAnim: new Animated.Value(0),
    height: 0
  }

  constructor() {
    super();
  }

  _onIndexChanged = () => {
    //console.log("Index: ")
    //ReactNativeHapticFeedback.trigger("impactLight");
    //SafeAreaContext.
  }

  _onEndReached = () => {
    console.log("on end reached")
  }

  _onScroll = (event) => {
    const layoutHeight = event.nativeEvent.layoutMeasurement.height
    const contentHeight = event.nativeEvent.contentSize.height
    const viewSize = contentHeight - layoutHeight
    //console.log("View size: " + viewSize)

    const contentOffset = event.nativeEvent.contentOffset.y
    //console.log("Content offset: " + contentOffset)

    const diff = contentOffset - viewSize

    if (diff >= 0 || diff <= -1) {
      this.setState({ flatListScrollEnabled: true })
    }

    /*
    layoutMeasurement: { width: 414, height: 896 }
    contentSize: { width: 414, height: 2346.5 }
    */

    const atBottom = event.nativeEvent.layoutMeasurement.height + event.nativeEvent.contentOffset.y >= event.nativeEvent.contentSize.height - 30;
    console.log(atBottom)
    if (atBottom) {
      console.log("close to bottom")
      console.log("Content offset:" + event.nativeEvent.contentOffset.y)
      console.log("Content size:" + event.nativeEvent.contentSize.height)
      console.log("layout height:" + event.nativeEvent.layoutMeasurement.height)
      const offset = (event.nativeEvent.layoutMeasurement.height + event.nativeEvent.contentOffset.y) - event.nativeEvent.contentSize.height;
      console.log(offset)
      this.flatList.current.scrollToOffset({ offset: offset, animated: false })
    }
  }

  _renderItem = ({ item, index, separators }) => {
    return (
      <ScrollView
        scrollEventThrottle={1}
        onScroll={event => { this._onScroll(event) }}
        height={this.state.height}
        scrollEnabled={true}>
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

  componentDidMount() {
    /*
    this.state.scrollAnim.addListener(({ value }) => {
      console.log('onscroll')
      this.flatList.current.scrollToOffset({ offset: value, animated: false })
    });
    */
  }

  render() {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <View style={{ flex: 1 }} onLayout={this._onLayout}>
          <FlatList
            style={{ flex: 1 }}
            ref={this.flatList}
            extraData={this.state.height}
            onLayout={this._onFlatListLayout}
            scrollEnabled={false}
            pagingEnabled={true}
            horizontal={false}
            onViewableItemsChanged={this._onIndexChanged}
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
            data={DATA}
            renderItem={this._renderItem}
          />
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
});
