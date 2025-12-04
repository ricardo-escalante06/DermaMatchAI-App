import { useEffect, useState } from "react";
import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import RoutineItem from "../components/RoutineItem";
import { supabase } from "../supabase/supabaseClient";

export default function ProductPageScreen({ navigation }) {
  const [sortModalVisible, setSortModalVisible] = useState(false);
  const [sortOption, setSortOption] = useState("Type");
  const [userId, setUserId] = useState(null);
  const [items, setItems] = useState([]);

  async function getUserScans(userId) {
    const { data, error } = await supabase
      .from("scans")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data;
  }

  // ✅ Fetch user ID + most recent scan on load
  useEffect(() => {
    async function loadData() {
      const { data: sessionData } = await supabase.auth.getSession();
      const uid = sessionData?.session?.user?.id;
      if (!uid) return;

      setUserId(uid);

      const scans = await getUserScans(uid);
      if (!scans || scans.length === 0) return;

      const recentScan = scans[0]; // most recent
      const scanItems = recentScan.products || [];
      setItems(scanItems);
    }

    loadData();
  }, []);

  // ✅ Sorting logic
  let sortedItems = [...items];
  if (sortOption === "Name") {
    sortedItems.sort((a, b) => a.name.localeCompare(b.name));
  } else if (sortOption === "Price") {
    sortedItems.sort((a, b) => (a.price || 0) - (b.price || 0));
  } else if (sortOption === "Type") {
    sortedItems.sort((a, b) => a.type.localeCompare(b.type));
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Back Arrow
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={styles.arrowContainer}
      >
        <Image
          source={require("../assets/images/blackArrow.png")}
          style={styles.arrow}
        />
      </TouchableOpacity> */}

      <Text style={styles.title}>Your Full Routine!</Text>

      {/* Sort Button */}
      <TouchableOpacity
        style={styles.sortButton}
        onPress={() => setSortModalVisible(true)}
      >
        <View style={styles.hamburger}>
          <View style={styles.line} />
          <View style={styles.line} />
          <View style={styles.line} />
        </View>
        <Text style={styles.sortButtonText}>Sort By: {sortOption}</Text>
      </TouchableOpacity>

      {/* Items Grid */}
      <View style={styles.gridContainer}>
        {sortedItems.map((item, index) => (
          <RoutineItem
            key={index}
            name={item.name}
            store={item.store}
            type={item.type}
            price={item.price}
            image={item.imageUrl}
            style={styles.gridItem}
          />
        ))}
      </View>

      {/* Sort Modal */}
      <Modal
        transparent
        visible={sortModalVisible}
        animationType="fade"
        onRequestClose={() => setSortModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          onPress={() => setSortModalVisible(false)}
        >
          <View style={styles.modalContent}>
            {["Name", "Price", "Type"].map((option) => (
              <TouchableOpacity
                key={option}
                style={styles.modalOption}
                onPress={() => {
                  setSortOption(option);
                  setSortModalVisible(false);
                }}
              >
                <Text style={styles.modalOptionText}>{option}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>
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
  arrow: { width: 20, height: 20, resizeMode: "contain" },
  title: {
    fontFamily: "DM Sans",
    fontWeight: "600",
    fontSize: 18,
    lineHeight: 24,
    marginTop: 60,
    color: "#000",
  },
  sortButton: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
    marginBottom: 10,
  },
  sortButtonText: {
    fontFamily: "DM Sans",
    fontWeight: "500",
    fontSize: 14,
    color: "#000",
  },
  hamburger: { marginRight: 8, justifyContent: "space-between", height: 12 },
  line: { width: 16, height: 1, backgroundColor: "#000", borderRadius: 1 },
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  gridItem: { width: "48%", marginBottom: 20 },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: { width: 200, backgroundColor: "#fff", borderRadius: 12 },
  modalOption: { paddingVertical: 12, paddingHorizontal: 20 },
  modalOptionText: { fontFamily: "DM Sans", fontSize: 16 },
});
