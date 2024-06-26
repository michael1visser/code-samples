import React from "react";
import { StyleSheet, Image } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  useAnimatedStyle,
  withSpring,
  interpolate,
  runOnJS,
  useSharedValue,
} from "react-native-reanimated";

import { LETS_WATCH_COLORS } from "../styleSheet";

export interface SwipeablePosterProps {
  poster: any;
  handleSwipeLeft: (posterId: number) => any;
  handleSwipeRight: (posterId: number) => any;
  setCurrentTranslation: (e: number) => any;
}

export const SwipeablePoster = (props: SwipeablePosterProps) => {
  const { poster, handleSwipeLeft, handleSwipeRight, setCurrentTranslation } =
    props;

  const translateX = useSharedValue(0);

  const pan = Gesture.Pan()
    .onUpdate((e) => {
      console.log(e.translationX);
      runOnJS(setCurrentTranslation)(e.translationX);
      return (translateX.value = e.translationX);
    })
    .onEnd((e) => {
      if (translateX.value <= -200) {
        runOnJS(handleSwipeLeft)(poster.id);
        runOnJS(setCurrentTranslation)(0);
      } else if (translateX.value >= 200) {
        runOnJS(handleSwipeRight)(poster.id);
        runOnJS(setCurrentTranslation)(0);
      } else {
        console.log(poster.id);
        return (translateX.value = withSpring(0, {
          restDisplacementThreshold: 5,
          restSpeedThreshold: 5,
        }));
      }
    });

  const swipeStyle = useAnimatedStyle(() => {
    const opacity = interpolate(Math.abs(translateX.value), [0, 250], [1, 0.9]);
    return {
      transform: [
        {
          translateX: translateX.value,
        },
        {
          translateY: Math.abs(translateX.value) * 0.3,
        },
        {
          rotate: `${translateX.value * 0.1}deg`,
        },
      ],
      opacity: opacity,
    };
  });

  return (
    <GestureDetector gesture={pan} key={poster.id}>
      <Animated.View
        key={poster?.name}
        style={[moviePosterStyle.poster, swipeStyle]}
      >
        <Image
          source={{ uri: poster?.url }}
          style={moviePosterStyle.posterImage}
        />
      </Animated.View>
    </GestureDetector>
  );
};

const moviePosterStyle = StyleSheet.create({
  poster: {
    height: 600,
    width: 400,
    zIndex: 1,
    position: "absolute",
    top: 30,
    shadowColor: "#333333",
    shadowOffset: { width: 10, height: 10 },
    shadowOpacity: 0.6,
    shadowRadius: 15,
  },
  posterImage: {
    flex: 1,
    resizeMode: "cover",
    overflow: "hidden",
    borderColor: LETS_WATCH_COLORS.PRIMARY_RED,
    borderRadius: 20,
    borderWidth: 4,
  },
});
