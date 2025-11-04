import { useState } from "react";
import {
    Image,
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import RoutineItem from "../components/RoutineItem";

export default function FullRoutineScreen({ navigation, route }) {
  const [sortModalVisible, setSortModalVisible] = useState(false);
  const [sortOption, setSortOption] = useState("Name");

  let items = route.params?.items || [];

  // Apply sorting based on option
  if (sortOption === "Name") {
    items = [...items].sort((a, b) => a.name.localeCompare(b.name));
  } else if (sortOption === "Price") {
    items = [...items].sort((a, b) => (a.price || 0) - (b.price || 0));
  } else if (sortOption === "Type") {
    items = [...items].sort((a, b) => a.type.localeCompare(b.type));
  }

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

      <Text style={styles.title}>Your Full Routine!</Text>

      {/* Sort Button with Hamburger Icon */}
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

      {/* Grid of Routine Items */}
      <View style={styles.gridContainer}>
        {items.map((item, index) => (
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
  arrow: {
    width: 20,
    height: 20,
    resizeMode: "contain",
  },
  title: {
    width: 238, 
    height: 24, 
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
    alignSelf: "flex-start",
    // backgroundColor: "#EDEDED",
    paddingVertical: 6,
    // paddingHorizontal: 12,
    marginTop: 10,
    borderRadius: 12,
    marginBottom: 10,
  },
  sortButtonText: {
    fontFamily: "DM Sans",
    fontWeight: "500",
    fontSize: 14,
    color: "#000",
  },
  hamburger: {
    marginRight: 8,
    justifyContent: "space-between",
    height: 12,
  },
  line: {
    width: 16,
    height: 1,
    backgroundColor: "#000",
    borderRadius: 1,
  },
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  gridItem: {
    width: "48%",
    marginBottom: 20,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: 200,
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingVertical: 10,
  },
  modalOption: {
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  modalOptionText: {
    fontFamily: "DM Sans",
    fontWeight: "500",
    fontSize: 16,
  },
});
