import {Animated, Dimensions, Text, View} from 'react-native';
import {PanGestureHandler, State} from 'react-native-gesture-handler';
import React, {useEffect, useState} from 'react';

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

export default function App() {
  const [data, setData] = useState(['blue', 'red', 'green']);
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
        d.splice(2, 0, 'pink');
        console.log('data', d);
        setData(d);
        _translateYValue.setOffset(_lastOffset);
        _translateYValue.setValue(0);
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
      h.splice(index, 0, e.nativeEvent.layout.height);
      setHeights(h);
      setTotalHeight(totalHeight + e.nativeEvent.layout.height);
    }
  };

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
          {data.map((color, i) => (
            <>
              <Text
                style={{
                  paddingVertical: 20,
                  fontSize: 25,
                  fontWeight: 'bold',
                  textAlign: 'center',
                }}>
                {color}
              </Text>
              <Text
                key={i}
                style={{backgroundColor: color}}
                onLayout={e => _onLayout(e, i)}>
                {lorem.generateParagraphs(5)}
              </Text>
            </>
          ))}
        </Animated.View>
      </PanGestureHandler>
    </>
  );
}
