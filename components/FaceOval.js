import { useEffect, useRef } from "react";
import { Animated, StyleSheet, View } from "react-native";

export default function FaceOval({
  width = 450,
  height = 325,
  ticks = 24,
  tickWidth = 4,
  tickHeight = 15,
  activeColor = "#1773B0",
  inactiveColor = "#ccc",
  duration = 1200,
  startAnimation = false,
}) {
  const animation = useRef(new Animated.Value(0)).current;

  //   useEffect(() => {
  //     Animated.loop(
  //       Animated.timing(animation, {
  //         toValue: ticks,
  //         duration: duration,
  //         useNativeDriver: false, // backgroundColor cannot use native driver
  //       })
  //     ).start();
  //   }, []);

  useEffect(() => {
    if (startAnimation) {
      Animated.timing(animation, {
        toValue: ticks,
        duration: duration,
        useNativeDriver: false,
      }).start();
    }
  }, [startAnimation]);

  const tickViews = [];
  const a = width / 2; // horizontal radius
  const b = height / 2; // vertical radius

  for (let i = 0; i < ticks; i++) {
    const angle = (i / ticks) * 2 * Math.PI - Math.PI / 2;

    // Tick position along the oval
    const x = a + a * Math.cos(angle) - tickWidth / 2;
    const y = b + b * Math.sin(angle) - tickHeight / 2;

    // Rotate tick to point toward the center
    const rotation = angle + Math.PI / 2; // rotate so it points outward
    const color = animation.interpolate({
      inputRange: [i, i + 1],
      outputRange: [activeColor, inactiveColor],
      extrapolate: "clamp",
    });

    tickViews.push(
      <Animated.View
        key={i}
        style={[
          styles.tick,
          {
            width: tickWidth,
            height: tickHeight,
            borderRadius: tickWidth / 2,
            backgroundColor: color,
            position: "absolute",
            left: x,
            top: y,
            transform: [{ rotate: `${rotation}rad` }],
          },
        ]}
      />
    );
  }

  return <View style={{ width, height }}>{tickViews}</View>;
}

const styles = StyleSheet.create({
  tick: {},
});
