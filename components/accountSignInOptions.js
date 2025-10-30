import {
  Alert,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function AccountSignInOptions({ headerText }) {
  const circleImages = [
    require("../assets/images/googleImg.png"),
    require("../assets/images/appleImg.png"),
    require("../assets/images/microsoftImg.png"),
  ];

  return (
    <View style={styles.container}>
      {/* Top adjustable text */}
      <Text style={styles.headerText}>{headerText}</Text>

      {/* Row of circles */}
      <View style={styles.circleRow}>
        {circleImages.map((img, index) => (
          <View key={index} style={styles.circle}>
            <TouchableOpacity
              onPress={() => {
                if (index === 0) Alert.alert("GOOGLE");
                else if (index === 1) Alert.alert("APPLE");
                else if (index === 2) Alert.alert("MICROSOFT");
              }}
            >
              <Image source={img} style={styles.circleImage} />
            </TouchableOpacity>
          </View>
        ))}
      </View>

      {/* Divider with OR */}
      <View style={styles.dividerContainer}>
        <View style={styles.line} />
        <Text style={styles.orText}>OR</Text>
        <View style={styles.line} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    marginTop: 50,
    marginBottom: 20,
  },
  headerText: {
    fontFamily: "Archivo",
    fontWeight: "600",
    fontSize: 24,
    lineHeight: 29,
    textAlign: "center",
    letterSpacing: 0.01,
    color: "#2D3648",
    marginBottom: 40,
  },
  circleRow: {
    flexDirection: "row",
    justifyContent: "center", // centers row
    width: "100%",
    marginBottom: 20,
  },
  circle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#fff", // white background
    borderWidth: 2,
    borderColor: "rgba(45, 54, 72, 0.5)",
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 8,
  },
  circleImage: {
    width: 23,
    height: 23,
    resizeMode: "contain",
  },
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "73%",
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: "#2D3648",
    opacity: 0.4,
  },
  orText: {
    marginHorizontal: 10,
    fontFamily: "Poppins",
    fontWeight: "400",
    fontSize: 14,
    lineHeight: 21,
    textAlign: "center",
    letterSpacing: -0.01,
    color: "rgba(45, 54, 72, 0.6)",
  },
});
