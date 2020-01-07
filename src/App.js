/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component } from 'react';
import {
  StyleSheet,
  ScrollView,
  View,
  Text,
  Dimensions,
  FlatList,
  Platform,
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
    key: '1'
  },
  {
    key: '2'
  },
  {
    key: '3'
  },
  {
    key: '4'
  },
  {
    key: '5'
  }
]

export default class App extends Component {

  flatList = React.createRef();

  state = {
    flatListScrollEnabled: false
  }

  constructor() {
    super();
  }

  _onIndexChanged = () => {
    console.log("Index: ")
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

    //console.log(event.nativeEvent.contentOffset.y)
  }

  _renderItem = ({ item, index, separators }) => {
    return (
      <ScrollView
        height={height}
        nestedScrollEnabled={true}>
        <Text style={{ fontSize: 42, textAlign: 'center', paddingBottom: 16 }}>{item.key}</Text>
        <Text style={{ fontSize: 16, lineHeight: 30 }}>{lorem.generateParagraphs(10)}</Text>
      </ScrollView>
    )
  }

  _renderItemAndroid = ({ item, index, separators }) => {
    return (
      <View style={{flex: 1}}>
        <Text style={{ fontSize: 42, textAlign: 'center', paddingBottom: 16 }}>{item.key}</Text>
        <Text style={{ fontSize: 16, lineHeight: 30 }}>{lorem.generateParagraphs(10)}</Text>
      </View>
    )
  }

  _renderiOS() {
    return (
      <FlatList
        ref={this.flatList}
        pagingEnabled={true}
        horizontal={false}
        onViewableItemsChanged={this._onIndexChanged}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        data={DATA}
        renderItem={this._renderItem}
      />
    );
  }

  _renderAndroid() {
    return (
      <FlatList
        ref={this.flatList}
        snapToAlignment='start'
        horizontal={false}
        onViewableItemsChanged={this._onIndexChanged}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        data={DATA}
        onEndReached={this._onEndReached}
        renderItem={this._renderItemAndroid}
      />
    );
  }

  render() {
    if (Platform.OS == 'ios') return this._renderiOS();
    else return this._renderAndroid();
  }
}

const styles = StyleSheet.create({
});
