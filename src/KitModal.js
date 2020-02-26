import {Animated, Dimensions, StyleSheet, Text, View} from 'react-native';
import {
  NativeViewGestureHandler,
  PanGestureHandler,
  State,
  TapGestureHandler,
} from 'react-native-gesture-handler';
import React, {Component, ReactElement} from 'react';

import styled from 'styled-components/native';
// import { colorForScheme } from '../theming/Theming';
// import Colors from '../theming/Colors';

const colorForScheme = ({default: def}) => def;
const Colors = {N100: '#ddd'};

const windowHeight = Dimensions.get('window').height;
const windowWidth = Dimensions.get('window').width;
const SNAP_POINTS_FROM_TOP = [windowHeight * 0.1, windowHeight];

const START = SNAP_POINTS_FROM_TOP[0];
const END = SNAP_POINTS_FROM_TOP[SNAP_POINTS_FROM_TOP.length - 1];

//********************************************************************************
// Types
//********************************************************************************
interface IProps {
  isVisible: boolean;
  toggleModal?: Function;
  header?: ReactElement;
  body?: ReactElement;
  snapPointsFromTop?: number[];
}

interface IState {
  lastSnap: number;
}

//********************************************************************************
// Component
//********************************************************************************

export default class KitModal extends Component<IProps, IState> {
  //********************************************************************************
  // Properties
  //********************************************************************************
  state = {
    lastSnap: END,
  };

  masterdrawer: any = React.createRef();
  drawer: any = React.createRef();
  drawerheader: any = React.createRef();
  scroll: any = React.createRef();

  _snapPointsFromTop = SNAP_POINTS_FROM_TOP;

  _lastScrollYValue = 0;
  _lastScrollY = new Animated.Value(0);

  _onRegisterLastScroll = Animated.event(
    [{nativeEvent: {contentOffset: {y: this._lastScrollY}}}],
    {
      useNativeDriver: true,
    },
  );

  _dragY = new Animated.Value(0);
  _onGestureEvent = Animated.event(
    [{nativeEvent: {translationY: this._dragY}}],
    {
      useNativeDriver: true,
    },
  );

  _reverseLastScrollY = Animated.multiply(
    new Animated.Value(-1),
    this._lastScrollY,
  );

  _translateYOffset = new Animated.Value(END);
  _translateY = Animated.add(
    this._translateYOffset,
    Animated.add(this._dragY, this._reverseLastScrollY),
  ).interpolate({
    inputRange: [START, END],
    outputRange: [START, END],
    extrapolate: 'clamp',
  });

  //********************************************************************************
  // Methods
  //********************************************************************************

  _onHeaderHandlerStateChange = ({nativeEvent}: any) => {
    if (nativeEvent.oldState === State.BEGAN) {
      this._lastScrollY.setValue(0);
    }
    this._onHandlerStateChange({nativeEvent});
  };

  _onHandlerStateChange = ({nativeEvent}: any) => {
    if (nativeEvent.oldState === State.ACTIVE) {
      let {velocityY, translationY} = nativeEvent;
      translationY -= this._lastScrollYValue;
      const dragToss = 0.05;
      const endOffsetY =
        this.state.lastSnap + translationY + dragToss * velocityY;

      let destSnapPoint = SNAP_POINTS_FROM_TOP[0];
      for (let i = 0; i < SNAP_POINTS_FROM_TOP.length; i++) {
        const snapPoint = SNAP_POINTS_FROM_TOP[i];
        const distFromSnap = Math.abs(snapPoint - endOffsetY);
        if (distFromSnap < Math.abs(destSnapPoint - endOffsetY)) {
          destSnapPoint = snapPoint;
        }
      }
      this.setState({lastSnap: destSnapPoint});
      if (
        destSnapPoint ===
          this._snapPointsFromTop[this._snapPointsFromTop.length - 1] &&
        this.props.toggleModal
      )
        this.props.toggleModal();
      this._translateYOffset.extractOffset();
      this._translateYOffset.setValue(translationY);
      this._translateYOffset.flattenOffset();
      this._dragY.setValue(0);
      Animated.spring(this._translateYOffset, {
        velocity: velocityY,
        tension: 68,
        friction: 12,
        toValue: destSnapPoint,
        useNativeDriver: true,
      }).start();
    }
  };

  //********************************************************************************
  // Lifecycle
  //********************************************************************************
  constructor(props: IProps) {
    super(props);

    this._lastScrollY.addListener(({value}) => {
      this._lastScrollYValue = value;
    });

    if (props.snapPointsFromTop)
      this._snapPointsFromTop = props.snapPointsFromTop;
  }

  componentDidUpdate = ({isVisible}: IProps) => {
    if (!isVisible && this.props.isVisible) {
      // Show the modal
      const velocityY = -2800;
      const destSnapPoint = this._snapPointsFromTop[0];
      this.setState({lastSnap: destSnapPoint});
      Animated.spring(this._translateYOffset, {
        velocity: velocityY,
        tension: 68,
        friction: 12,
        toValue: destSnapPoint,
        useNativeDriver: true,
      }).start();
    }
  };

  render() {
    const translateYAnimation = {transform: [{translateY: this._translateY}]};
    const {isVisible} = this.props;
    return (
      <TapGestureHandler
        ref={this.masterdrawer}
        maxDurationMs={100000}
        maxDeltaY={this.state.lastSnap - SNAP_POINTS_FROM_TOP[0]}>
        <ModalWrapper isVisible={isVisible} pointerEvents="box-none">
          <Animated.View
            style={[StyleSheet.absoluteFillObject, translateYAnimation]}
            testID="kitModal">
            <PanGestureHandler
              ref={this.drawerheader}
              simultaneousHandlers={[this.scroll, this.masterdrawer]}
              shouldCancelWhenOutside={false}
              onGestureEvent={this._onGestureEvent}
              onHandlerStateChange={this._onHeaderHandlerStateChange}>
              <ModalHeader>
                <Handle />
                {this.props.header}
              </ModalHeader>
            </PanGestureHandler>
            <PanGestureHandler
              ref={this.drawer}
              simultaneousHandlers={[this.scroll, this.masterdrawer]}
              shouldCancelWhenOutside={false}
              onGestureEvent={this._onGestureEvent}
              onHandlerStateChange={this._onHandlerStateChange}>
              <Animated.View style={{flex: 1}}>
                <NativeViewGestureHandler
                  ref={this.scroll}
                  waitFor={this.masterdrawer}
                  simultaneousHandlers={this.drawer}>
                  <BodyScrollView
                    style={{marginBottom: SNAP_POINTS_FROM_TOP[0]}}
                    bounces={false}
                    onScrollBeginDrag={this._onRegisterLastScroll}
                    scrollEventThrottle={1}>
                    {this.props.body}
                  </BodyScrollView>
                </NativeViewGestureHandler>
              </Animated.View>
            </PanGestureHandler>
          </Animated.View>
        </ModalWrapper>
      </TapGestureHandler>
    );
  }
}

//********************************************************************************
// Styles
//********************************************************************************
const ModalWrapper = styled.View`
  position: absolute;
  width: ${windowWidth};
  height: ${windowHeight};
  background-color: rgba(
    0,
    0,
    0,
    ${({isVisible}: IProps) => (isVisible ? 0.4 : 0)}
  );
  elevation: 4;
`;

const ModalHeader = styled(Animated.View)`
  background-color: ${colorForScheme({default: Colors.N100})};
  height: 100;
  width: 100%;
  align-items: center;
  border-top-left-radius: 20;
  border-top-right-radius: 20;
`;

const Handle = styled.View`
  background-color: lightgray;
  height: 2;
  width: 50;
  border-radius: 2;
  margin-top: 8px;
`;

const BodyScrollView = styled(Animated.ScrollView)`
  background-color: #fff;
  margin-bottom: ${SNAP_POINTS_FROM_TOP[0]};
`;
