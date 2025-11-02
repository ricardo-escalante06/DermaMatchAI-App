import { LinearGradient } from "expo-linear-gradient";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function GradientInfoBox({
  number = 4,
  numberLabel = "days",
  title = "since your last scan",
  subtitle = "We recommend a scan every 2 weeks!",
  buttonText = "Rescan Now",
  onPressButton = () => {},
}) {
  return (
    <LinearGradient
      colors={["#5592B8", "#90B9D2"]}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 1 }}
      style={styles.gradientBox}
    >
      <View style={styles.innerContainer}>
        {/* Section 1 */}
        <View style={styles.section1}>
          <Text style={styles.numberText}>{number}</Text>
          <Text style={styles.numberLabel}>{numberLabel}</Text>
        </View>

        {/* Section 2 */}
        <View style={styles.section2}>
          <Text style={styles.titleText}>{title}</Text>
          <Text style={styles.subtitleText}>{subtitle}</Text>
        </View>

        {/* Section 3 */}
        <TouchableOpacity style={styles.button} onPress={onPressButton}>
          <Text style={styles.buttonText}>{buttonText}</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradientBox: {
    width: "100%",
    height: 88,
    borderRadius: 20,
    paddingHorizontal: 16,
    justifyContent: "center",
    marginVertical: 8,
  },
  innerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  /* ========== LEFT NUMBER SECTION (matches figma) ========== */
  section1: {
    alignItems: "center",
    width: 60,
    marginBottom: 6,
  },
  numberText: {
    fontFamily: "DM Sans",
    fontWeight: "600",
    fontSize: 48,
    lineHeight: 58,
    letterSpacing: 0.01,
    color: "#FFFFFF",
    textAlign: "center",
  },
  numberLabel: {
    fontFamily: "DM Sans",
    fontWeight: "600",
    fontSize: 15,
    lineHeight: 18,
    letterSpacing: 0.01,
    color: "#FFFFFF",
    textAlign: "center",
    marginTop: -6, // pulls label closer to number like figma
  },

  /* ========== MIDDLE TEXT AREA ========== */
  section2: {
    flex: 1,
    justifyContent: "center",
    paddingLeft: 12,
  },
  titleText: {
    fontFamily: "DM Sans",
    fontWeight: "500",
    fontSize: 12,
    lineHeight: 14,
    letterSpacing: 0.01,
    color: "#FFEFAD", // matches figma gold text
    marginBottom: 2,
  },
  subtitleText: {
    fontFamily: "DM Sans",
    fontWeight: "300",
    fontSize: 8,
    lineHeight: 10,
    letterSpacing: 0.01,
    color: "#FFFFFF",
    marginTop: 2,
  },

  /* ========== BUTTON ========== */
  button: {
    width: 127,
    height: 33,
    backgroundColor: "#F9FDFF",
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 10,

    // Shadow (iOS + Android)
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  },

  buttonText: {
    fontFamily: "DM Sans",
    fontWeight: "500", // Figma weight
    fontSize: 14,
    lineHeight: 24,
    textAlign: "center",
    letterSpacing: -0.01,
    color: "#000000",
  },
});
