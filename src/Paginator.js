import React from 'react';
import { FlatList, Animated, Platform, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import Toast from 'react-native-simple-toast';

const IOS = Platform.OS === 'ios';

const VIEWABILITY_CONFIG = {
  viewAreaCoveragePercentThreshold: 20,
};

const Paginator = ({
  data,
  renderItem,
  keyExtractor,
}) => {
  const scrollValue = React.useRef(new Animated.Value(0));

  let lastElement = 0;
  let currentElement = 0;
  //let visibleElement = 0;
  const flatlist = React.useRef();

  const onViewableItemsChanged = (info) => {
    if (info.viewableItems.length > 0) {
      const firstIndex = info.viewableItems[0].index;
      const lastIndex = info.viewableItems[info.viewableItems.length - 1].index;

      //const firstElement = `${firstIndex + 1}`
      //const lastElement = `${lastIndex + 1}`
      //Toast.show("Top: " + firstSection + ", Bottom: " + lastSection, Toast.SHORT);

      if (firstIndex !== currentElement) {
        currentElement = firstIndex;
      }
      else if (lastIndex !== currentElement) {
        currentElement = lastIndex;
      }

      //Toast.show("" + currentElement, Toast.SHORT);
    }
  };

  const onScrollEndDrag = (e) => {
    //const speed = e.nativeEvent.velocity.x;
    /*
    if (IOS) {
      if (speed > 1 && currentElement < data.length - 1) {
        currentElement += 1;
      }
      if (speed < -1 && currentElement > 0) {
        currentElement -= 1;
      }
    }
    */
    //  needs to be tested
    /*
    if (!IOS) {
      if (speed < -1 && visibleElement < data.length - 1) {
        visibleElement += 1;
      }
      if (speed > 1 && visibleElement > 0) {
        visibleElement -= 1;
      }
    }
    */

    if (currentElement != lastElement) {
      lastElement = currentElement;
      //flatlist.current.scrollToItem({ item: data[currentElement] });
      flatlist.current.scrollToIndex({ index: currentElement, animated: true, viewPosition: 0.0 });
    }

    //flatlist.current.scrollToIndex({ index: visibleElement, animated: true, viewPosition: 0.5 });
  };

  return (
    <FlatList
      onScroll={Animated.event([{
        nativeEvent: { contentOffset: { y: scrollValue.current } },
      }])}
      data={data}
      renderItem={renderItem}
      showsHorizontalScrollIndicator={true}
      keyExtractor={keyExtractor}
      ref={flatlist}
      viewabilityConfig={VIEWABILITY_CONFIG}
      onViewableItemsChanged={onViewableItemsChanged}
      onScroll={onScrollEndDrag}
    />
  );
};

Paginator.propTypes = {
  data: PropTypes.arrayOf(PropTypes.shape({})),
  renderItem: PropTypes.func,
  keyExtractor: PropTypes.func,
};

const styles = StyleSheet.create({
});

export default Paginator;