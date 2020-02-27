import {Animated, Dimensions, SafeAreaView, Text, View} from 'react-native';
import {
  FlatList,
  PanGestureHandler,
  ScrollView,
  State,
} from 'react-native-gesture-handler';
import React, {createRef, useEffect, useRef, useState} from 'react';

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

export default function AppWithHooks() {
  const [panHandlerEnabled, setPanHandlerEnabled] = useState(true);
  const [flatListEnabled, setFlatListEnabled] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [scrollViewRefs, setScrollViewRefs] = useState([]);

  const outerRef = useRef(null);
  const innerRef = useRef(null);

  const heights = {};

  const _translateYValue = new Animated.Value(0);
  let lastOffset = 0;

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

  const _onHandlerStateChange = event => {
    if (event.nativeEvent.oldState === State.ACTIVE) {
      lastOffset += event.nativeEvent.translationY;
      _translateYValue.setOffset(lastOffset);
      _translateYValue.setValue(0);

      console.log('height, offset ', heights[currentIndex], lastOffset);
      // if (Math.abs(heights[currentIndex] + lastOffset) <= height) {
      //   scrollViewRefs[currentIndex].current.scrollToEnd({animated: false});
      //   setPanHandlerEnabled(false);
      //   setFlatListEnabled(true);
      //   setCurrentIndex(currentIndex + 1);
      // }

      console.log('scrollViewRef', scrollViewRefs[currentIndex].current);
      // scrollViewRef.current.scrollTo({y: -lastOffset});
    }
  };

  const renderItem = ({item, index, separators}) => {
    return (
      <Animated.ScrollView
        ref={scrollViewRefs[index]}
        style={{height, backgroundColor: item.color}}
        // onScrollBeginDrag={_onRegisterLastScroll}
        scrollEventThrottle={1}>
        <Animated.View
          onLayout={({nativeEvent}) =>
            (heights[index] = nativeEvent.layout.height)
          }
          style={[
            {padding: 50},
            {transform: [{translateY: _translateYValue}]},
          ]}>
          <Text
            style={{
              fontSize: 42,
              textAlign: 'center',
              paddingBottom: 16,
            }}>
            {item.key}
          </Text>
          <Text style={{fontSize: 16, lineHeight: 30}}>{item.value}</Text>
        </Animated.View>
      </Animated.ScrollView>
    );
  };

  const _onHandlerStateChangeddd = ({nativeEvent}: any) => {
    if (nativeEvent.oldState === State.ACTIVE) {
      // let {velocityY, translationY} = nativeEvent;
      // translationY -= this._lastScrollYValue;
      // const dragToss = 0.05;
      // const endOffsetY =
      //   this.state.lastSnap + translationY + dragToss * velocityY;
      // let destSnapPoint = SNAP_POINTS_FROM_TOP[0];
      // for (let i = 0; i < SNAP_POINTS_FROM_TOP.length; i++) {
      //   const snapPoint = SNAP_POINTS_FROM_TOP[i];
      //   const distFromSnap = Math.abs(snapPoint - endOffsetY);
      //   if (distFromSnap < Math.abs(destSnapPoint - endOffsetY)) {
      //     destSnapPoint = snapPoint;
      //   }
      // }
      // this.setState({lastSnap: destSnapPoint});
      // if (
      //   destSnapPoint ===
      //     this._snapPointsFromTop[this._snapPointsFromTop.length - 1] &&
      //   this.props.toggleModal
      // )
      //   this.props.toggleModal();
      // this._translateYOffset.extractOffset();
      // this._translateYOffset.setValue(translationY);
      // this._translateYOffset.flattenOffset();
      // this._dragY.setValue(0);
      // Animated.spring(this._translateYOffset, {
      //   velocity: velocityY,
      //   tension: 68,
      //   friction: 12,
      //   toValue: destSnapPoint,
      //   useNativeDriver: true,
      // }).start();
    }
  };

  useEffect(() => {
    if (scrollViewRefs.length === 0) {
      setScrollViewRefs(elRefs =>
        Array(3)
          .fill()
          .map((_, i) => scrollViewRefs[i] || createRef()),
      );
    }
  }, [scrollViewRefs]);

  return (
    <SafeAreaView style={{backgroundColor: 'gray', flex: 1}}>
      <View style={{backgroundColor: 'white', flex: 1}}>
        {/* <Animated.FlatList
            scrollEnabled={flatListEnabled}
            // onScrollEndDrag={() => this._onScrollEndDrag()}
            // onViewableItemsChanged={this._onIndexChanged}
            showsVerticalScrollIndicator={false}
            data={DATA}
            renderItem={renderItem}
            // onViewableItemsChanged={this._onViewableItemsChanged}
            style={{height}}
          /> */}

        <PanGestureHandler
          ref={outerRef}
          simultaneousHandlers={[innerRef, ...scrollViewRefs]}
          shouldCancelWhenOutside={false}
          onGestureEvent={_onGestureEvent}
          onHandlerStateChange={_onHandlerStateChange}>
          <Animated.View style={{flex: 1}}>
            {/* <BodyScrollView
                  style={{marginBottom: SNAP_POINTS_FROM_TOP[0]}}
                  bounces={false}
                  onScrollBeginDrag={this._onRegisterLastScroll}
                  scrollEventThrottle={1}>
                  {this.props.body}
                </BodyScrollView> */}
            <FlatList
              waitFor={outerRef}
              scrollEnabled={false}
              // onScrollEndDrag={() => this._onScrollEndDrag()}
              // onViewableItemsChanged={this._onIndexChanged}
              showsVerticalScrollIndicator={false}
              data={DATA}
              renderItem={renderItem}
              // onViewableItemsChanged={this._onViewableItemsChanged}
              style={{height}}
            />
          </Animated.View>
        </PanGestureHandler>
      </View>
    </SafeAreaView>
  );
}

const DATA = [
  {
    key: '1',
    color: 'red',
    value: lorem.generateParagraphs(3),
  },
  {
    key: '2',
    color: 'blue',
    value: lorem.generateParagraphs(5),
  },
  {
    key: '3',
    color: 'green',
    value: lorem.generateParagraphs(5),
  },
];
