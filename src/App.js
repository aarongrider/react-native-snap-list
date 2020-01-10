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
  Text,
  Dimensions,
  SafeAreaView,
} from 'react-native';
import { LoremIpsum } from "lorem-ipsum";

const { height } = Dimensions.get('window');

import Paginator from './Paginator';

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
    value: lorem.generateParagraphs(6)
  },
  {
    key: '2',
    value: lorem.generateParagraphs(3)
  },
  {
    key: '3',
    value: lorem.generateParagraphs(1)
  },
  {
    key: '4',
    value: lorem.generateParagraphs(7)
  },
  {
    key: '5',
    value: lorem.generateParagraphs(6)
  }
]

export default class App extends Component {

  constructor() {
    super();
  }

  _renderItem = ({ item, index, separators }) => {
    return (
      <View style={{ flex: 1, margin: 30 }}>
        <Text style={{ fontSize: 42, textAlign: 'center', paddingBottom: 16 }}>{item.key}</Text>
        <Text style={{ fontSize: 16, lineHeight: 30 }}>{item.value}</Text>
      </View>
    )
  }

  render() {
    return (
      <SafeAreaView>
        <Paginator data={DATA} renderItem={this._renderItem} />
      </SafeAreaView>
    );
  }

}
