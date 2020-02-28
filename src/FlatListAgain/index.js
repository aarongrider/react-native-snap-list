import {Dimensions, FlatList, ScrollView, Text, View} from 'react-native';
import React, {useRef, useState} from 'react';

import {LoremIpsum} from 'lorem-ipsum';

const {height, width} = Dimensions.get('window');

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

export default function App() {
  const [curItemIndex, setCurItemIndex] = useState(1);
  const [heights, setHeights] = useState({});
  const [flatListScrollEnabled, setFlatListScrollEnabled] = useState(false);
  const flatListRef = useRef();

  const _onFlatListScroll = ({nativeEvent}) => {
    console.log(nativeEvent.contentOffset.y, height * 2);
    if (Math.abs(nativeEvent.contentOffset.y - height * 2) < 20) {
      setFlatListScrollEnabled(false);
    }
  };

  const _onScroll = ({nativeEvent}) => {
    // console.log(nativeEvent.contentOffset.y);
    if (
      nativeEvent.contentOffset.y === 0 ||
      Math.abs(nativeEvent.contentOffset.y - heights['2']) < 800
    ) {
      setFlatListScrollEnabled(true);
    }
  };

  const _onLayout = (e, key) => {
    const h = {...heights};
    h[key] = e.nativeEvent.layout.height;
    setHeights(h);
  };

  const _renderItem = ({item, index, separators}) => {
    return (
      <ScrollView
        scrollEventThrottle={1}
        onScroll={_onScroll}
        // onScrollBeginDrag={event => {
        //   this._onScrollBegin(event);
        // }}
        // onScroll={event => {
        //   this._onScroll(event);
        // }}
        height={height}>
        <View style={{padding: 50}} onLayout={e => _onLayout(e, item.key)}>
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

  return (
    <FlatList
      ref={flatListRef}
      onScroll={_onFlatListScroll}
      initialScrollIndex={1}
      // extraData={this.state.height}
      // onLayout={this._onFlatListLayout}
      scrollEnabled={flatListScrollEnabled}
      // onScrollEndDrag={() => this._onScrollEndDrag()}
      // onViewableItemsChanged={this._onIndexChanged}
      showsVerticalScrollIndicator={false}
      showsHorizontalScrollIndicator={false}
      data={DATA}
      renderItem={_renderItem}
      // onViewableItemsChanged={this._onViewableItemsChanged}
    />
  );
}

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
