// PastScansScreen.js
import { Image } from "expo-image";
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import PastFaceScan from "../components/PastFaceScan";

export default function PastScansScreen({
  navigation,
  scans,
  itemSpacing = 20,
}) {
  // scans: array of objects [{ id, date, skinType, products }, ...]

  const tempScans = [
    {
      id: 1,
      date: "08/20/2025",
      skinType: "Dry, Oily",
      products: ["Product A", "Product B", "Product C"],
    },
    {
      id: 2,
      date: "07/15/2025",
      skinType: "Normal",
      products: ["Product D", "Product E"],
    },
  ];

  scans = scans || tempScans;

  return (
    <View style={styles.container}>
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

      {/* Title */}
      <Text style={styles.title}>Your Past Scans</Text>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {scans && scans.length > 0 ? (
          scans.map((scan, index) => (
            <View
              key={index}
              style={{
                marginBottom: index !== scans.length - 1 ? itemSpacing : 0,
              }}
            >
              <PastFaceScan
                image={require("../assets/images/dermaTestScan.png")}
                scanDate={scan.date}
                skinType={scan.skinType}
                products={scan.products.join(", ")}
                onPress={() => console.log("View More")}
              />
            </View>
          ))
        ) : (
          <Text style={styles.noScansText}>No past scans available.</Text>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 60, // for top spacing
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
  title: {
    fontFamily: "Archivo",
    fontWeight: "500",
    fontSize: 20,
    lineHeight: 24,
    textAlign: "left",
    letterSpacing: 0.01,
    color: "#000000",
    marginLeft: 40, // matches ScrollView horizontal padding
    marginBottom: 20, // space below title
    marginTop: 80,
  },
  scrollContent: {
    paddingBottom: 40,
    paddingHorizontal: 40,
    backgroundColor: "#fff",
  },
  scanBox: {
    width: "100%",
    backgroundColor: "#E3EDF4",
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  scanText: {
    fontFamily: "DM Sans",
    fontSize: 12,
    fontWeight: "500",
    color: "#000",
    marginBottom: 4,
  },
  noScansText: {
    fontFamily: "DM Sans",
    fontSize: 14,
    fontWeight: "500",
    textAlign: "center",
    marginTop: 50,
    color: "#888",
  },
});
