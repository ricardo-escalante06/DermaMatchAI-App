import MaskedView from "@react-native-masked-view/masked-view";
import { useEffect } from "react";
import { Image, StyleSheet, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

export default function LogoFillAnimation() {
  const fillProgress = useSharedValue(0);

  useEffect(() => {
    // Animate fill from 0 to 1 over 4 seconds
    fillProgress.value = withTiming(1, { duration: 4000 });
  }, []);

  // Animated style to reveal the gradient
  const revealStyle = useAnimatedStyle(() => ({
    height: fillProgress.value * 125, // animate height from 0 → full logo
  }));

  return (
    <View style={styles.container}>
      {/* Base logo (outline) */}
      <Image
        source={require("../assets/images/dermamatch_logo_toFill.png")}
        style={styles.logo}
      />

      {/* Masked gradient fill */}
      <MaskedView
        style={styles.maskedView}
        maskElement={
          <Image
            source={require("../assets/images/dermamatch_logo_toFill.png")}
            style={styles.logo}
          />
        }
      >
        <View style={styles.fillContainer}>
          <Animated.View style={[styles.reveal, revealStyle]}>
            {/* Gradient or colored image stays fixed */}
            <Image
              source={require("../assets/images/colorBox.png")}
              style={styles.logo}
            />
          </Animated.View>
        </View>
      </MaskedView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
  },
  logo: {
    width: 125,
    height: 125,
  },
  maskedView: {
    width: 125,
    height: 125,
    position: "absolute",
  },
  fillContainer: {
    width: 125,
    height: 125,
    overflow: "hidden", // only reveal the part of the gradient that should show
  },
  reveal: {
    width: 125,
    overflow: "hidden",
    position: "absolute",
    bottom: 0, // grow from bottom
  },
});
