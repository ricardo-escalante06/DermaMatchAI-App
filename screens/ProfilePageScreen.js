import { StyleSheet, Text, View } from "react-native";

export default function ProfilePageScreen({ navigation }) {
  
  return (
    <View style={styles.loginScreen}>
      <Text>Profile Page Screen</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  loginScreen: {
    flex: 1,
    justifyContent: "flex-start", // put children at the top instead of center
    alignItems: "center",
    backgroundColor: "#ffffff",
    paddingTop: 70, // adjust how high you want logos
  },
});
