import {Dimensions, ScrollView, Text, View} from 'react-native';
import React, {useRef, useState} from 'react';

import {LoremIpsum} from 'lorem-ipsum';

const {height: SCREEN_HEIGHT, width: SCREEN_WIDTH} = Dimensions.get('window');

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

const d = [
  {id: 1, val: 'blue'},
  {id: 2, val: 'red'},
  {id: 3, val: 'green'},
];

export default function App() {
  const [data, setData] = useState(d);
  const [heights, setHeights] = useState([]);
  const [totalHeight, setTotalHeight] = useState(0);
  const [firstHeight, setFirstHeight] = useState(0);

  const scrollViewRef = useRef(null);

  let _yOffset = 0;
  let scrollIsThrottled = false;
  let contentSizeChangeThrottled = false;
  let layoutIsThrottled = false;

  const _onScroll = ({nativeEvent}) => {
    if (!scrollIsThrottled) {
      scrollIsThrottled = true;
      handleOnScroll(nativeEvent);
      setTimeout(() => (scrollIsThrottled = false), 2300);
    }
  };

  const handleOnScroll = nativeEvent => {
    console.log(_yOffset);
    if (nativeEvent.contentOffset.y !== 0) {
      _yOffset = nativeEvent.contentOffset.y;
    }
    if (isCloseToBottom(nativeEvent)) {
      const newData = [...data];
      // const newData = curData.slice(1);
      console.log('last item id ', newData[newData.length - 1].id);
      newData.push({
        id: newData[newData.length - 1].id + 1,
        val: getRandomColor(),
      });
      console.log('new data', newData);
      setData(newData);
    }
    if (isCloseToTop(nativeEvent)) {
      //
    }
  };

  const isCloseToTop = ({layoutMeasurement, contentOffset, contentSize}) => {
    return contentOffset.y === 0;
  };

  const isCloseToBottom = ({layoutMeasurement, contentOffset, contentSize}) => {
    const paddingToBottom = 200;
    return (
      layoutMeasurement.height + contentOffset.y >=
      contentSize.height - paddingToBottom
    );
  };

  const _onContentSizeChange = (contentWidth, contentHeight) => {
    if (!contentSizeChangeThrottled) {
      contentSizeChangeThrottled = true;
      console.log('content size change', _yOffset);
      scrollViewRef.current.scrollTo({x: 0, y: _yOffset, animated: false});
      setTimeout(() => (contentSizeChangeThrottled = false), 1000);
    }
  };

  const _onLayout = (e, index) => {
    if (!layoutIsThrottled) {
      layoutIsThrottled = true;
      console.log('index', index);
      if (index === 0) {
        setFirstHeight(e.nativeEvent.layout.height);
      } else if (index === 1) {
        console.log('scroll there');
        scrollViewRef.current.scrollTo({x: 0, y: firstHeight, animated: false});
      }
      setTimeout(() => (layoutIsThrottled = false), 1000);
    }
  };

  return (
    <ScrollView
      ref={scrollViewRef}
      onScroll={_onScroll}
      onContentSizeChange={_onContentSizeChange}>
      {data.map((item, i) => (
        <View key={item.id} onLayout={e => _onLayout(e, i)}>
          <Text
            style={{
              paddingVertical: 20,
              fontSize: 25,
              fontWeight: 'bold',
              textAlign: 'center',
            }}>
            {item.val} / {item.id}
          </Text>
          <Text key={i} style={{backgroundColor: item.val}}>
            {lorem.generateParagraphs(8)}
          </Text>
        </View>
      ))}
    </ScrollView>
  );
}

function getRandomColor() {
  var letters = '0123456789ABCDEF';
  var color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}
