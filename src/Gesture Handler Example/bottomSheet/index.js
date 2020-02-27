import {Animated, Dimensions, StyleSheet, Text, View} from 'react-native';
import {
  NativeViewGestureHandler,
  PanGestureHandler,
  State,
  TapGestureHandler,
} from 'react-native-gesture-handler';
import React, {Component, useEffect, useRef, useState} from 'react';

import {LoremIpsum} from '../common';
import {USE_NATIVE_DRIVER} from '../config';

const HEADER_HEIGHT = 50;
const windowHeight = Dimensions.get('window').height;
// const SNAP_POINTS_FROM_TOP = [0, windowHeight * 0.5, windowHeight * 0.8];

const data = [1, 2, 3, 4, 5];
const colors = ['red', 'blue', 'green', 'yellow', 'pink'];

export class BottomSheet extends Component {
  outerViewRef = React.createRef();
  drawer = React.createRef();
  drawerheader = React.createRef();
  scroll = React.createRef();
  scrollOne = React.createRef();
  scrollTwo = React.createRef();
  scrollThree = React.createRef();

  constructor(props) {
    super(props);
    const START = 0;
    const END = windowHeight;

    this.scrollRefs = Array(data.length).fill(React.createRef());

    this._lastScrollYValue = 0;
    this._lastScrollY = new Animated.Value(0);
    this._onRegisterLastScroll = Animated.event(
      [
        {
          nativeEvent: {
            contentOffset: {y: this._lastScrollY},
          },
        },
      ],
      {useNativeDriver: USE_NATIVE_DRIVER},
    );
    this._lastScrollY.addListener(({value}) => {
      this._lastScrollYValue = value;
    });

    this._dragOffset = 0;
    this._dragY = new Animated.Value(0);
    this._onGestureEvent = Animated.event(
      [{nativeEvent: {translationY: this._dragY}}],
      {useNativeDriver: USE_NATIVE_DRIVER},
    );

    this._reverseLastScrollY = Animated.multiply(
      new Animated.Value(-1),
      this._lastScrollY,
    );

    this._translateYOffset = new Animated.Value(END);
    this._translateY = Animated.add(
      this._translateYOffset,
      Animated.add(this._dragY, this._reverseLastScrollY),
    ).interpolate({
      inputRange: [START, END],
      outputRange: [START, END],
      extrapolate: 'clamp',
    });
  }
  // _onHeaderHandlerStateChange = ({nativeEvent}) => {
  //   if (nativeEvent.oldState === State.BEGAN) {
  //     this._lastScrollY.setValue(0);
  //   }
  //   this._onHandlerStateChange({nativeEvent});
  // };
  _onHandlerStateChange = ({nativeEvent}) => {
    if (nativeEvent.oldState === State.ACTIVE) {
      let {translationY} = nativeEvent;
      // translationY -= this._lastScrollYValue;
      // console.log(
      //   'last scroll y value',
      //   this._lastScrollYValue,
      //   this._lastScrollY,
      // );
      console.log('drag y', this._dragY._value);
      // this._dragY.setValue(translationY);

      this._dragOffset += nativeEvent.translationY;
      this._dragY.setOffset(this._dragOffset);
      this._dragY.setValue(0);
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
      // this._translateYOffset.extractOffset();
      // this._translateYOffset.setValue(translationY);
      // this._translateYOffset.flattenOffset();
      // this._dragY.setValue(0);
      // Animated.spring(this._translateYOffset, {
      //   velocity: velocityY,
      //   tension: 68,
      //   friction: 12,
      //   toValue: destSnapPoint,
      //   useNativeDriver: USE_NATIVE_DRIVER,
      // }).start();
    }
  };

  render() {
    console.log('scroll refs', this.scrollRefs);
    return (
      <View style={StyleSheet.absoluteFillObject} pointerEvents="box-none">
        <PanGestureHandler
          ref={this.outerViewRef}
          waitFor={[...this.scrollRefs]}
          onGestureEvent={this._onGestureEvent}
          onHandlerStateChange={this._onHandlerStateChange}>
          <Animated.View
            style={[
              StyleSheet.absoluteFillObject,
              {
                transform: [{translateY: this._dragY}],
              },
            ]}>
            {data.map((_, i) => (
              <PanGestureHandler
                key={i}
                ref={this.drawer}
                waitFor={this.scrollRefs[i]}
                // simultaneousHandlers={[...this.scrollRefs, this.outerViewRef]}
                onGestureEvent={this._onGestureEvent}
                onHandlerStateChange={this._onHandlerStateChange}>
                <Animated.View
                  style={[styles.container, {backgroundColor: colors[i]}]}>
                  <NativeViewGestureHandler ref={this.scrollRefs[i]}>
                    <Animated.ScrollView
                      style={[styles.scrollView]}
                      onScrollBeginDrag={this._onRegisterLastScroll}
                      scrollEventThrottle={1}>
                      <LoremIpsum />
                      <LoremIpsum />
                      <LoremIpsum />
                    </Animated.ScrollView>
                  </NativeViewGestureHandler>
                </Animated.View>
              </PanGestureHandler>
            ))}
          </Animated.View>
        </PanGestureHandler>
      </View>
    );
  }
}

export default class Example extends Component {
  render() {
    return (
      <View style={styles.container}>
        <BottomSheet />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    height: 400,
  },
  header: {
    height: HEADER_HEIGHT,
    backgroundColor: 'red',
  },
});
