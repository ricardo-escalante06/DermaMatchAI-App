import { useState } from "react";
import {
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function HomePageScreen({ navigation }) {
  const [hasScans, setHasScans] = useState(false);
  const name = "Jennifer";
  const screenHeight = Dimensions.get("window").height;

  function handleStartFaceScan() {
    console.log("Start Face Scan button pressed");
    // navigation.navigate("Face Scan");
  }

  return (
    <ScrollView
      style={styles.scrollView}
      contentContainerStyle={[styles.container, { minHeight: screenHeight }]}
      showsVerticalScrollIndicator={false}
    >
      {/* Heading Section */}
      <View style={styles.headingContainer}>
        <View style={styles.textContainer}>
          <Text style={styles.welcomeText}>Welcome,</Text>
          <Text style={styles.nameText}>{name}</Text>
        </View>
        <Image
          source={require("../assets/images/homepagelogo.png")}
          style={styles.headingImage}
        />
      </View>

      {hasScans ? (
        <>
          <View style={styles.box} />
          <View style={styles.box} />
          <View style={styles.box} />
          <View style={styles.box} />

          <View style={styles.box} />

          <View style={styles.box} />
        </>
      ) : (
        <View style={styles.noScansContainer}>
          <Text style={styles.noScansText}>
            You have no results or progress
          </Text>
          <TouchableOpacity style={styles.scanButton} onPress={handleStartFaceScan}>
            <Text style={styles.scanButtonText}>Start Face Scan</Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: "#fff",
  },
  container: {
    paddingVertical: 40,
    paddingHorizontal: 40,
    backgroundColor: "#fff",
  },
  headingContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 30,
    marginBottom: 30,
    width: "100%",
  },
  textContainer: {
    flex: 1,
  },
  welcomeText: {
    width: 144,
    height: 24,
    fontFamily: "DM Sans",
    fontWeight: "600",
    fontSize: 20,
    lineHeight: 24,
    letterSpacing: 0.01,
    color: "#000000",
  },
  nameText: {
    width: 144,
    height: 43,
    fontFamily: "DM Sans",
    fontWeight: "300",
    fontSize: 36,
    lineHeight: 43,
    letterSpacing: 0.01,
    color: "#000000",
    marginTop: 8,
  },
  headingImage: {
    width: 160,
    height: 160,
    resizeMode: "contain",
    marginLeft: 40,
  },
  box: {
    width: "100%",
    height: 200,
    backgroundColor: "#ccc",
    marginBottom: 20,
  },
  noScansContainer: {
    width: 311,
    height: 219,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 40,
    alignSelf: "center",
    paddingHorizontal: 10,
    // paddingVertical: 50,
  },

  noScansText: {
    width: 245,
    fontFamily: "DM Sans",
    fontWeight: "600",
    fontSize: 16,
    lineHeight: 19,
    textAlign: "center",
    letterSpacing: 0.01,
    color: "#000000",
    marginBottom: 40,
    marginTop: 20,
  },

  scanButton: {
    width: 174,
    height: 33,
    backgroundColor: "#000000",
    borderRadius: 20,
    justifyContent: "center", // vertical centering
    alignItems: "center", // horizontal centering
  },

  scanButtonText: {
    fontFamily: "DM Sans",
    fontStyle: "normal",
    fontWeight: "400", // matches your Figma
    fontSize: 12, // matches Figma Label
    lineHeight: 24, // vertically center in button
    letterSpacing: -0.01,
    color: "#FFFFFF",
    textAlign: "center",
  },
});
