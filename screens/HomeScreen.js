import { useFonts } from "expo-font";
import { Image } from "expo-image";
import { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import LogoFillAnimation from "../components/LogoFillAnimation"; // import your component

export default function HomeScreen({ navigation }) {
  const [modalVisible, setModalVisible] = useState(false);
  const [gifLoading, setGifLoading] = useState(true); // change later

  const [fontsLoaded] = useFonts({
    "Urbanist-SemiBold": require("../assets/fonts/Urbanist-SemiBold.ttf"),
    "Urbanist-Regular": require("../assets/fonts/Urbanist-Regular.ttf"),
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setGifLoading(false);
    }, 4250);

    return () => clearTimeout(timer);
  }, []);

  if (gifLoading) {
    return (
      <View style={styles.loadingContainer}>
        <LogoFillAnimation /> 
      </View>
    );
  }

  return (
    <View style={styles.loginScreen}>
      <View style={styles.loginScreenLogocontainer}>
        <Image
          source={require("../assets/images/dermamatch_logo_color.png")}
          style={styles.loginScreenLogo}
        />

        {/* <Image
          source={require("./assets/images/dermamatch_logo_text.png")}
          style={styles.loginScreenLogoText}
        /> */}

        <Text style={styles.loginScreenLogoText}>
          DermaMatch <Text style={styles.loginScreenLogoTextAI}>AI</Text>
        </Text>
      </View>

      <View style={styles.buttonGroup}>
        <Text style={styles.welcomeText}>Welcome!</Text>
        <TouchableOpacity
          style={styles.signUpbutton}
          onPress={() => navigation.navigate("SignUp")}
        >
          <Text style={styles.signUpbuttonText}>SIGN UP</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.loginUpbutton}
          onPress={() => navigation.navigate("Login")}
        >
          <Text style={styles.loginbuttonText}>LOG IN TO EXISTING ACCOUNT</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: "absolute",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)", // dark background
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 40,
    borderRadius: 12,
    alignItems: "center",
    width: 300,
  },
  buttonOptions: {
    flexDirection: "row",
  },
  gif: {
    width: 186,
    height: 194,
  },

  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ffffff",
  },

  loadingGif: {
    width: 125,
    height: 125,
    resizeMode: "contain",
    backgroundColor: "#ffffff",
  },

  loginScreenLogo: {
    width: 88,
    height: 88,
    resizeMode: "contain",
    backgroundColor: "#fff",
  },

  loginScreenLogoText: {
    fontFamily: "Urbanist-SemiBold",
    fontWeight: "400",
    fontSize: 45,
    lineHeight: 68 * 1.5, // 150% of height approximation
    letterSpacing: -0.01 * 45, // Convert em to points
    color: "#5592B8",
  },

  loginScreenLogoTextAI: {
    fontFamily: "Urbanist-Regular",
    fontWeight: "600",
    fontSize: 45,
    lineHeight: 68 * 1.5, // 150% of height approximation
    letterSpacing: -0.01 * 45, // Convert em to points
    color: "#5592B8",
  },

  loginScreen: {
    flex: 1,
    justifyContent: "flex-start", // put children at the top instead of center
    alignItems: "center",
    backgroundColor: "#ffffff",
    paddingTop: 70, // adjust how high you want logos
  },

  loginScreenLogocontainer: {
    marginTop: 60,
    gap: 40, // if RN 0.71+, else use marginBottom
    alignItems: "center",
  },

  buttonGroup: {
    marginTop: "65%", // spacing between logo and buttons
    gap: 20, // if RN 0.71+, else use marginBottom
    alignItems: "center",
  },

  welcomeText: {
    fontFamily: "Archivo",
    fontStyle: "normal",
    fontWeight: "400",
    fontSize: 24,
    lineHeight: 29, // 120% of 24px ≈ 29px
    textAlign: "center",
    letterSpacing: 0.01,
    color: "#2D3648",
  },

  signUpbutton: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 24,
    gap: 8,
    width: 295,
    height: 53,
    backgroundColor: "#2D3648",
    borderRadius: 20,
  },

  signUpbuttonText: {
    fontFamily: "DM Sans",
    fontStyle: "normal",
    fontWeight: "700",
    fontSize: 18,
    lineHeight: 24,
    textAlign: "center",
    letterSpacing: -0.01,
    color: "#FFFFFF",
  },

  loginUpbutton: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 24,
    gap: 8, // RN 0.71+ only
    width: 295,
    height: 52,
    borderWidth: 2,
    borderColor: "#2D3648",
    borderRadius: 20,
  },

  loginbuttonText: {
    fontFamily: "DM Sans",
    fontStyle: "normal",
    fontWeight: "700",
    fontSize: 16,
    lineHeight: 20,
    textAlign: "center",
    letterSpacing: -0.01,
    color: "#2D3648",
  },
});
