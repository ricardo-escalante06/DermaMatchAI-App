import { useEffect, useState } from "react";
import {
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import FaceScanObject from "../components/FaceScanObject";
import GradientBoxContainer from "../components/GradientBoxContainer";
import TeaserRecommendedRoutine from "../components/TeaserRecommendedRoutine";

import { supabase } from "../supabase/supabaseClient";

export default function HomePageScreen({ navigation, route }) {
  const [userId, setUserId] = useState(null);

  const [hasScans, setHasScans] = useState(false);
  const [scanCount, setScanCount] = useState(null);

  const [mostRecentScan, setMostRecentScan] = useState(null);

  const [name, setName] = useState("Jennifer");
  const [numberDays, setNumberDays] = useState(0);
  const [items, setItems] = useState([]);

  const [image, setImage] = useState("");
  const [scanDate, setScanDate] = useState("08/20/2025");
  const [skinType, setSkinType] = useState("Dry, Oily");
  const [products, setProducts] = useState([
    "Item Name",
    " Item Name",
    "Item...",
  ]);

  const screenHeight = Dimensions.get("window").height;

  function handleStartFaceScan() {
    console.log("Start Face Scan button pressed");
    // navigation.navigate("Face Scan");
  }

  useEffect(() => {
    async function fetchUserId() {
      const { data: sessionData } = await supabase.auth.getSession();
      if (sessionData?.session?.user?.id) {
        setUserId(sessionData.session.user.id);
      }
    }
    fetchUserId();
  }, []);

  useEffect(() => {
    if (!userId) return;

    async function fetchScans() {
      try {
        // console.log(userId);

        const scans = await getUserScans(userId); // fetch scans for the user
        const count = scans.length;
        setScanCount(count);

        if (count > 0) {
          setHasScans(true);
          // Get the most recent scan
          const recent = scans[0];
          setMostRecentScan(recent);

          // Derive items from scan products
          setItems(recent.products || []);

          const imageUrl = recent.scan_image_url;
          setImage(imageUrl);

          // Calculate number of days since scan
          const scanDate = new Date(recent.created_at);
          const today = new Date();
          const diffTime = today - scanDate; // in ms
          const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
          setNumberDays(diffDays);
        } else {
          setHasScans(false);
        }
      } catch (err) {
        console.error("Error fetching scans:", err);
        setHasScans(false);
      }
    }

    fetchScans();
  }, [userId]);

  async function getUserScans(userId) {
    const { data, error } = await supabase
      .from("scans")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data;
  }

  return (
    <ScrollView
      style={styles.scrollView}
      contentContainerStyle={[styles.container, { minHeight: screenHeight }]}
      showsVerticalScrollIndicator={false}
    >
      {/* Heading Section */}
      <View style={styles.headingContainer}>
        <View style={styles.textContainer}>
          {hasScans ? (
            <>
              <Text style={styles.welcomeText}>Good Morning,</Text>
            </>
          ) : (
            <Text style={styles.welcomeText}>Welcome,</Text>
          )}
          <Text style={styles.nameText}>{name}</Text>
        </View>
        <Image
          source={require("../assets/images/homepagelogo.png")}
          style={styles.headingImage}
        />
      </View>

      {hasScans ? (
        <>
          <Text style={styles.sectionTitle}>Your Progress</Text>
          <GradientBoxContainer number={numberDays} />

          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Your Past Scans</Text>
            <TouchableOpacity
              onPress={() => console.log("See all Past Scans pressed")}
            >
              <Text style={styles.seeAllText}>See all</Text>
            </TouchableOpacity>
          </View>

          <View
            style={{ width: "100%", alignItems: "center", marginBottom: 20 }}
          >
            {/* Back layers */}
            <View style={[styles.layer1]} />
            <View style={[styles.layer2]} />

            {/* Main FaceScanObject on top */}
            <FaceScanObject
              style={{ zIndex: 3 }}
              image={{ uri: image }}
              scanDate={mostRecentScan?.created_at || ""}
              // skinType={mostRecentScan?.skin_type || "Unknown"}
              products={(items || []).map((p) => p.name).join(", ")}
              onPress={() => navigation.navigate("Past Scans")}
            />
          </View>

          {/* <FaceScanObject
            // image={image}
            image={require("../assets/images/dermaTestScan.png")}
            scanDate={scanDate}
            skinType={skinType}
            products={products}
            onPress={() => console.log("idk")}
          /> */}

          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { maxWidth: 227 }]}>
              Your Current Recommended Skincare Routine
            </Text>
            <TouchableOpacity
              onPress={() => console.log("See all Skincare Routine pressed")}
            >
              <Text style={styles.seeAllText}>See all</Text>
            </TouchableOpacity>
          </View>

          <TeaserRecommendedRoutine items={items} />

          {/* Bottom right button */}
          <View style={styles.bottomButtonContainer}>
            <TouchableOpacity
              style={styles.bottomButton}
              onPress={() => console.log("Subscribe pressed")}
            >
              <Text style={styles.bottomButtonText}>Subscribe to Routine</Text>
            </TouchableOpacity>
          </View>
        </>
      ) : (
        <View style={styles.noScansContainer}>
          <Text style={styles.noScansText}>
            You have no results or progress
          </Text>
          <TouchableOpacity
            style={styles.scanButton}
            onPress={handleStartFaceScan}
          >
            <Text style={styles.scanButtonText}>Take your first scan</Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: "#fff",
  },
  container: {
    paddingVertical: 40,
    paddingHorizontal: 40,
    backgroundColor: "#fff",
  },
  headingContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 30,
    marginBottom: 20,
    width: "100%",
  },
  textContainer: {
    flex: 1,
    marginTop: 40,
  },
  welcomeText: {
    width: 144,
    height: 24,
    fontFamily: "DM Sans",
    fontWeight: "600",
    fontSize: 20,
    lineHeight: 24,
    letterSpacing: 0.01,
    color: "#000000",
  },
  nameText: {
    width: 144,
    height: 43,
    fontFamily: "DM Sans",
    fontWeight: "300",
    fontSize: 36,
    lineHeight: 43,
    letterSpacing: 0.01,
    color: "#000000",
    marginTop: 8,
  },
  headingImage: {
    width: 160,
    height: 160,
    resizeMode: "contain",
    marginLeft: 40,
  },
  noScansContainer: {
    width: 311,
    height: 219,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 40,
    alignSelf: "center",
    paddingHorizontal: 10,
    // paddingVertical: 50,
  },

  noScansText: {
    width: 245,
    fontFamily: "DM Sans",
    fontWeight: "600",
    fontSize: 16,
    lineHeight: 19,
    textAlign: "center",
    letterSpacing: 0.01,
    color: "#000000",
    marginBottom: 40,
    marginTop: 20,
  },

  scanButton: {
    width: 174,
    height: 33,
    backgroundColor: "#000000",
    borderRadius: 20,
    justifyContent: "center", // vertical centering
    alignItems: "center", // horizontal centering
  },

  scanButtonText: {
    fontFamily: "DM Sans",
    fontStyle: "normal",
    fontWeight: "400", // matches your Figma
    fontSize: 12, // matches Figma Label
    lineHeight: 24, // vertically center in button
    letterSpacing: -0.01,
    color: "#FFFFFF",
    textAlign: "center",
  },

  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    marginTop: 20, // space above the section
    // marginBottom: 10, // space below the title before the box
    marginBottom: 8,
  },

  sectionTitle: {
    fontFamily: "DM Sans",
    fontWeight: "600",
    fontSize: 16,
    lineHeight: 19,
    letterSpacing: 0.01,
    color: "#000000",
    marginBottom: 8,
  },

  seeAllText: {
    fontFamily: "DM Sans",
    fontWeight: "400",
    fontSize: 10,
    lineHeight: 12,
    letterSpacing: 0.01,
    color: "rgba(0, 0, 0, 0.5)",
    textAlign: "right",
  },

  bottomButtonContainer: {
    width: "100%",
    alignItems: "flex-end", // right align
    marginTop: 20,
    marginBottom: 90, // space from bottom of ScrollView
  },

  bottomButton: {
    backgroundColor: "#1773B0",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },

  bottomButtonText: {
    fontFamily: "DM Sans",
    fontWeight: "500",
    fontSize: 14,
    lineHeight: 20,
    color: "#FFFFFF",
    textAlign: "center",
  },

  box: {
    width: "100%",
    height: 200,
    backgroundColor: "#ccc",
    borderRadius: 12,
    marginBottom: 30, // space between boxes
  },

  layer1: {
    position: "absolute",
    width: 300,
    height: 208,
    backgroundColor: "#E3EDF4",
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    top: 20,
    zIndex: 2,
  },
  layer2: {
    position: "absolute",
    width: 270,
    height: 186,
    backgroundColor: "#CDD5D9",
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    top: 50, // slight offset to create layering
    zIndex: 1,
  },
});
