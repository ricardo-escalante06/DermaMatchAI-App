import { Image } from "expo-image";
import { useState } from "react";
import {
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import AccountSignInOptions from "../components/accountSignInOptions";
import { signUpUser } from "../supabase/auth";

export default function SignUpScreen({ navigation }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [passwordVisible, setPasswordVisible] = useState(false);
  const [passwordVisible2, setPasswordVisible2] = useState(false);

  const [acceptedTerms, setAcceptedTerms] = useState(false);

  async function submit(name, email, password, confirmPass) {
    if (password != confirmPass) {
      alert("Passwords are NOT the same - Please try again");
      return;
    }

    const { data, error } = await signUpUser(name, email, password);

    if (error) {
      alert(error.message);
    } else {
      alert("Signup successful! Check your email.");
      navigation.navigate("Login");
    }
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
      >
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

          <AccountSignInOptions headerText={"Create Your Skin Profile"} />

          <View style={styles.container}>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Name"
                placeholderTextColor="rgba(0, 0, 0, 0.5)"
                value={name}
                onChangeText={setName}
                autoCapitalize="none"
              />
            </View>

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

            <View style={styles.inputContainer}>
              <TextInput
                key={passwordVisible2 ? "visible" : "hidden"}
                style={styles.input}
                placeholder="Confirm Password"
                placeholderTextColor="rgba(0, 0, 0, 0.5)"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry={!passwordVisible2}
                autoCapitalize="none"
              />
              <TouchableOpacity
                onPress={() => setPasswordVisible2(!passwordVisible2)}
              >
                <Image
                  source={require("../assets/images/passwordEye.png")}
                  style={styles.inputIcon}
                />
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={styles.radioContainer}
              onPress={() => setAcceptedTerms(!acceptedTerms)}
            >
              <View style={styles.circle}>
                {acceptedTerms && <View style={styles.circleDot} />}
              </View>

              <Text style={styles.radioLabel}>
                I accept the{" "}
                <Text
                  style={{ textDecorationLine: "underline" }}
                  onPress={() => alert("TOS!")}
                >
                  Terms and Conditions
                </Text>
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.signUpbutton,
                (!name ||
                  !email ||
                  !password ||
                  !acceptedTerms ||
                  !confirmPassword) && { backgroundColor: "#ccc" },
              ]}
              onPress={() => submit(name, email, password, confirmPassword)}
              disabled={
                !name || !email || !password || !acceptedTerms || !confirmPassword
              }
            >
              <Text style={styles.signUpbuttonText}>SIGN UP</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    backgroundColor: "#fff",
  },
  main: {
    backgroundColor: "#ffffff",
    width: "100%",
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
    width: "100%",
    maxWidth: 320,
    height: 48,
    marginVertical: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#000",
  },
  inputIcon: {
    width: 26,
    height: 20,
    tintColor: "#2D3648",
  },
  radioContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 15,
    width: 295,
    alignSelf: "flex-start",
  },
  circle: {
    width: 15,
    height: 15,
    borderWidth: 1,
    borderColor: "#2D3648",
    borderRadius: 7.5,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  circleDot: {
    width: 9,
    height: 9,
    backgroundColor: "#2D3648",
    borderRadius: 4.5,
  },
  radioLabel: {
    fontSize: 14,
    color: "#2D3648",
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
    marginTop: 5,
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
});
