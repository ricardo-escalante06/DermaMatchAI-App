import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import TeaserRecommendedRoutine from "../components/TeaserRecommendedRoutine";

export default function ViewScanScreen({ navigation, route }) {
  const scan = route.params?.scan;
  const items = scan?.products || [];

  const formattedDate = scan?.created_at
    ? new Date(scan.created_at).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "";

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Back Arrow */}
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={styles.arrowContainer}
      >
        <Image
          source={require("../assets/images/blackArrow.png")}
          style={styles.arrow}
        />
      </TouchableOpacity>

      {/* Scan Date */}
      <Text style={styles.dateText}>{formattedDate}</Text>

      {/* Face Image */}
      <Image
        source={
          scan?.scan_image_url
            ? { uri: scan.scan_image_url }
            : require("../assets/images/dermaTestScan.png")
        }
        style={styles.faceImage}
      />

      {/* Current Recommended Skincare Routine */}
      <View style={styles.sectionHeader}>
        <Text style={[styles.sectionTitle, { maxWidth: 227 }]}>
          Your Current Recommended Skincare Routine
        </Text>
      </View>
      <TeaserRecommendedRoutine items={items} />

      {/* Your Face Results Section */}
      <View style={styles.sectionHeader}>
        <Text style={[styles.sectionTitle, { maxWidth: 227 }]}>
          Your Face Results (COMING SOON) ...
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 40,
    paddingTop: 60,
    paddingBottom: 40,
    backgroundColor: "#fff",
  },
  arrowContainer: {
    position: "absolute",
    top: 80,
    left: 40,
    zIndex: 10,
  },
  arrow: {
    width: 20,
    height: 20,
    resizeMode: "contain",
  },
  dateText: {
    fontFamily: "DM Sans",
    fontWeight: "500",
    fontSize: 18,
    color: "#000",
    marginBottom: 10,
    textAlign: "center",
    marginTop: 50,
  },
  faceImage: {
    width: "100%",
    height: 300,
    borderRadius: 20,
    marginBottom: 20,
    resizeMode: "cover",
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    marginTop: 20,
    marginBottom: 8,
  },
  sectionTitle: {
    fontFamily: "DM Sans",
    fontWeight: "600",
    fontSize: 16,
    lineHeight: 19,
    letterSpacing: 0.01,
    color: "#000000",
  },
});
