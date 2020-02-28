import {Animated, Dimensions, Text, View} from 'react-native';
import {PanGestureHandler, State} from 'react-native-gesture-handler';
import React, {useEffect, useRef, useState} from 'react';

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

  const _translateYValue = new Animated.Value(0);
  let _lastOffset = 0;

  const _onGestureEvent = Animated.event(
    [
      {
        nativeEvent: {
          translationY: _translateYValue,
        },
      },
    ],
    {useNativeDriver: true},
  );

  const _onHandlerStateChange = ({nativeEvent}) => {
    if (nativeEvent.oldState === State.ACTIVE) {
      _lastOffset += nativeEvent.translationY;
      // console.log('last offset: ', _lastOffset, totalHeight);
      console.log('offset - screen height', _lastOffset - SCREEN_HEIGHT);

      if (_lastOffset > 0) {
        console.log('not enough to load next', _translateYValue._value);
        _translateYValue.setOffset(0);
        _lastOffset = 0;
        Animated.spring(_translateYValue, {
          toValue: 0,
          useNativeDriver: true,
        }).start();
      } else if (_lastOffset - SCREEN_HEIGHT < -totalHeight) {
        console.log('reached the end');
        const d = [...data];
        d.splice(0, 1);
        d.splice(d.length - 1, 0, {id: 4, val: 'pink'});
        console.log('data', d);
        setTotalHeight(0);
        setData(d);
        console.log('last offset: ', _lastOffset);
        // _translateYValue.setOffset(_lastOffset);
        // _translateYValue.setValue(0);
        Animated.timing(_translateYValue, {
          toValue: _lastOffset,
          duration: 800,
          useNativeDriver: true,
        }).start();
      } else {
        _translateYValue.setOffset(_lastOffset);
        _translateYValue.setValue(0);
      }
    }
  };

  const _onLayout = (e, index) => {
    if (heights[index]) {
      return;
    } else {
      const h = [...heights];
      h.push(e.nativeEvent.layout.height);
      setHeights(h);
      setTotalHeight(totalHeight + e.nativeEvent.layout.height);
    }
  };

  // const prevDataRef = useRef();
  // useEffect(() => {
  //   prevDataRef.current = data;
  // });
  // const prevData = prevDataRef.current;

  // useEffect(() => {
  //   if (prevData && prevData[0].id !== data[0].id) {

  //   }
  // }, [_translateYValue, data, heights, prevData]);

  return (
    <>
      <PanGestureHandler
        onGestureEvent={_onGestureEvent}
        onHandlerStateChange={_onHandlerStateChange}>
        <Animated.View
          style={{
            paddingHorizontal: 40,
            transform: [{translateY: _translateYValue}],
          }}>
          {data.map((item, i) => (
            <View key={item.id} onLayout={e => _onLayout(e, i)}>
              <Text
                style={{
                  paddingVertical: 20,
                  fontSize: 25,
                  fontWeight: 'bold',
                  textAlign: 'center',
                }}>
                {item.val} / {i + 1} / {Math.round(heights[i])}
              </Text>
              <Text key={i} style={{backgroundColor: item.val}}>
                {lorem.generateParagraphs(5)}
              </Text>
            </View>
          ))}
        </Animated.View>
      </PanGestureHandler>
    </>
  );
}
