
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function FaceScanObject({
  image,
  scanDate,
  skinType,
  products,
  onPress,
  style,
}) {
  return (
    <View style={[styles.container, style]}>
      {/* Left Image */}
      <Image source={image} style={styles.image} resizeMode="cover" />

      {/* Right Content */}
      <View style={styles.rightContent}>
        {/* Date */}
        <Text style={styles.textLine}>
          <Text style={styles.normal}>Scan on </Text>
          <Text style={[styles.bold, {fontSize: 12}]}>{scanDate}</Text>
        </Text>

        {/* Skin Type */}
        <Text style={styles.textLine}>
          <Text style={styles.bold}>Skin type: </Text>
          <Text style={styles.normal}>{skinType}</Text>
        </Text>

        {/* Products */}
        <Text style={styles.textLine}>
          <Text style={styles.bold}>Skin Care Products: </Text>
          <Text style={styles.normal}>{products}</Text>
        </Text>

        {/* Button */}
        <TouchableOpacity style={styles.button} onPress={onPress}>
          <Text style={styles.buttonText}>View More</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    width: "100%",
    height: 219,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#EDEDED",
    borderRadius: 20,
    paddingHorizontal: 25,
    paddingVertical: 10,
    alignItems: "center",
  },
  image: {
    width: 121,
    height: 181,
    borderRadius: 11,
  },
  rightContent: {
    flex: 1,
    marginLeft: 15,
    justifyContent: "space-between",
    height: "100%",
    paddingVertical: 10,
  },
  textLine: {
    marginBottom: 4,
    flexWrap: "wrap",
  },
  bold: {
    fontFamily: "DM Sans",
    fontWeight: "600",
    fontSize: 10,
    lineHeight: 12,
    color: "#000000",
  },
  normal: {
    fontFamily: "DM Sans",
    fontWeight: "400",
    fontSize: 10,
    lineHeight: 12,
    color: "#000000",
  },
  button: {
    backgroundColor: "#000000",
    borderRadius: 20,
    height: 33,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
    paddingHorizontal: 15,
  },
  buttonText: {
    fontFamily: "DM Sans",
    fontWeight: "400",
    fontSize: 12,
    lineHeight: 24,
    color: "#FFFFFF",
    textAlign: "center",
  },
});
