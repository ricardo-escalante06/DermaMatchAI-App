import { Image } from "expo-image";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import PastFaceScan from "../components/PastFaceScan";

export default function PastScansScreen({ navigation, route }) {
  const scans = route.params?.scans || [];

  const displayedScans =
    scans.length > 0
      ? scans
      : [
          {
            id: 1,
            created_at: "2025-08-20T00:00:00Z",
            skinType: "Dry, Oily",
            scan_image_url: null,
            products: ["Product A", "Product B", "Product C"],
          },
          {
            id: 2,
            created_at: "2025-07-15T00:00:00Z",
            skinType: "Normal",
            scan_image_url: null,
            products: ["Product D", "Product E"],
          },
        ];

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
        {displayedScans.length > 0 ? (
          displayedScans.map((scan, index) => (
            <View
              key={scan.id}
              style={{
                marginBottom: index !== displayedScans.length - 1 ? 20 : 0,
              }}
            >
              <PastFaceScan
                image={
                  scan.scan_image_url
                    ? { uri: scan.scan_image_url }
                    : require("../assets/images/dermaTestScan.png")
                }
                scanDate={new Date(scan.created_at).toLocaleDateString()}
                skinType={scan.skinType || "Unknown"}
                products={
                  scan.products
                    ? scan.products.map((p) => p.name || p).join(", ")
                    : "No products"
                }
                onPress={() =>
                  navigation.navigate("View Scan", { scan: scan })
                }
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
    paddingTop: 60,
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
    marginLeft: 40,
    marginBottom: 20,
    marginTop: 80,
  },
  scrollContent: {
    paddingBottom: 40,
    paddingHorizontal: 40,
    backgroundColor: "#fff",
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
