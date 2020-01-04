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
} from 'react-native';

import SafeAreaContext from 'react-native-safe-area-context';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import { LoremIpsum } from "lorem-ipsum";
import ViewPager from '@react-native-community/viewpager';

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

  constructor() {
    super();
  }

  _onIndexChanged = () => {
    console.log("Index: ")
    //ReactNativeHapticFeedback.trigger("impactLight");
    //SafeAreaContext.
  }

  _renderSeparator = () => {
    return (
      <View style={{ backgroundColor: 'red' }}>
        <Text style={{ flex: 1, fontSize: 42, textAlign: 'center' }}>Section Header</Text>
      </View>
    )
  }

  _isCloseToBottom = ({ layoutMeasurement, contentOffset, contentSize }) => {
    const paddingToBottom = 20;
    return layoutMeasurement.height + contentOffset.y >=
      contentSize.height - paddingToBottom;
  }

  _renderItem = ({ item, index, separators }) => {
    return (
      <ScrollView
        height={height}
        scrollEnabled={true}
        style={styles.scrollView}>
        <Text style={{ fontSize: 42, textAlign: 'center', paddingBottom: 16 }}>{item.key}</Text>
        <Text style={{ fontSize: 16, lineHeight: 30 }}>{lorem.generateParagraphs(10)}</Text>
      </ScrollView >
    )
  }

  render() {
    return (
      <>
        <FlatList
          scrollEnabled={false}
          pagingEnabled={true}
          horizontal={false}
          onViewableItemsChanged={this._onIndexChanged}
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          data={DATA}
          renderItem={this._renderItem}
        />
      </>
    );
  }
}

const styles = StyleSheet.create({
  scrollView: {
  }
});
