import { BlurView } from "expo-blur";
import { Camera } from "expo-camera";
import { useEffect, useState } from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import FaceOval from "../components/FaceOval";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

// Oval dimensions
const OVAL_WIDTH = 325;
const OVAL_HEIGHT = 445;

export default function FaceScanOverlay() {
  const [hasPermission, setHasPermission] = useState(null);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  if (hasPermission === null) return <View />;
  if (hasPermission === false)
    return (
      <View>
        <Text>No access to camera</Text>
      </View>
    );

  const ovalX = (SCREEN_WIDTH - OVAL_WIDTH) / 2;
  const ovalY = (SCREEN_HEIGHT - OVAL_HEIGHT) / 2;

  return (
    <View style={styles.container}>
      <Camera style={styles.camera} />

      {/* Top Blur */}
      <BlurView
        intensity={90}
        tint="dark"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: SCREEN_WIDTH,
          height: ovalY,
        }}
      />

      {/* Bottom Blur */}
      <BlurView
        intensity={90}
        tint="dark"
        style={{
          position: "absolute",
          top: ovalY + OVAL_HEIGHT,
          left: 0,
          width: SCREEN_WIDTH,
          height: SCREEN_HEIGHT - (ovalY + OVAL_HEIGHT),
        }}
      />

      {/* Left Blur */}
      <BlurView
        intensity={90}
        tint="dark"
        style={{
          position: "absolute",
          top: ovalY,
          left: 0,
          width: ovalX,
          height: OVAL_HEIGHT,
        }}
      />

      {/* Right Blur */}
      <BlurView
        intensity={90}
        tint="dark"
        style={{
          position: "absolute",
          top: ovalY,
          left: ovalX + OVAL_WIDTH,
          width: SCREEN_WIDTH - (ovalX + OVAL_WIDTH),
          height: OVAL_HEIGHT,
        }}
      />

      {/* FaceOval animation */}
      <View
        style={{
          position: "absolute",
          top: ovalY,
          left: ovalX,
          width: OVAL_WIDTH,
          height: OVAL_HEIGHT,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <FaceOval
          width={325}
          height={445}
          ticks={100}
          tickWidth={3}
          tickHeight={20}
          activeColor="#FFFFFF"
          inactiveColor="#179BD7"
          duration={10000}
          startAnimation={false}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  camera: {
    flex: 1,
  },
});
