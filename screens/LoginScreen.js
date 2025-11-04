import { Image } from "expo-image";
import { useState } from "react";
import {
  ImageBackground,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import AccountSignInOptions from "../components/accountSignInOptions";
import { addNewUser, loginUser } from "../supabase/auth";

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);

  async function submit(email, password) {
    const { data, error } = await loginUser(email, password);

    if (error) {
      alert(error.message);
    } else {
      await addUser();
      // alert("Login Successful!");
      navigation.navigate("Face Scan");
    }
  }

  async function addUser() {
    try {
      await addNewUser();
    } catch (err) {
      console.error("Failed to add user:", err);
    }
  }

  return (
    <View style={styles.main}>
      <ImageBackground
        source={require("../assets/images/headerBackground.png")}
        style={styles.headerContainer}
      >
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image
            source={require("../assets/images/arrow.png")}
            style={styles.arrow}
          />
        </TouchableOpacity>
      </ImageBackground>

      <AccountSignInOptions headerText={"Welcome Back!"} />

      <View style={styles.container}>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="rgba(0, 0, 0, 0.5)"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        <View style={styles.inputContainer}>
          <TextInput
            key={passwordVisible ? "visible" : "hidden"}
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="rgba(0, 0, 0, 0.5)"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!passwordVisible}
            autoCapitalize="none"
          />
          <TouchableOpacity
            onPress={() => setPasswordVisible(!passwordVisible)}
          >
            <Image
              source={require("../assets/images/passwordEye.png")}
              style={styles.inputIcon}
            />
          </TouchableOpacity>
        </View>

        <View style={{ width: "100%", maxWidth: 295 }}>
          <TouchableOpacity style={{ alignSelf: "flex-end" }}>
            <Text style={styles.forgotPassword}>Forgot Password</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={[
            styles.signUpbutton,
            (!email || !password) && {
              backgroundColor: "#ccc",
            },
          ]}
          onPress={() => submit(email, password)}
          disabled={!email || !password}
        >
          <Text style={styles.signUpbuttonText}>LOGIN</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  main: {
    backgroundColor: "#ffffff",
    width: "100%",
    height: "100%",
    padding: 0,
  },

  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: "#ffffff",
    paddingHorizontal: 55,
  },

  headerContainer: {
    width: "100%",
    height: 190,
    justifyContent: "center",
    alignItems: "flex-start",
  },

  arrow: {
    width: 20,
    height: 20,
    resizeMode: "contain",
    marginLeft: 30,
    marginTop: -10,
  },

  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#2D3648",
    borderRadius: 6,
    paddingHorizontal: 12,
    backgroundColor: "#fff",
    width: 295,
    height: 48,
    marginVertical: 10,
  },

  input: {
    flex: 1, // takes remaining space
    fontSize: 16,
    color: "#000",
  },

  inputIcon: {
    width: 26,
    height: 20,
    tintColor: "#2D3648",
  },

  signUpbutton: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 24,
    gap: 8,
    width: 300,
    height: 53,
    backgroundColor: "#2D3648",
    borderRadius: 20,
    marginTop: 75,
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

  forgotPassword: {
    fontFamily: "DM Sans",
    fontStyle: "normal",
    fontWeight: "400",
    fontSize: 13,
    lineHeight: 18,
    letterSpacing: -0.01,
    textDecorationLine: "underline",
    color: "#2D3648",
    // Align right
    alignSelf: "flex-end",
  },
});
