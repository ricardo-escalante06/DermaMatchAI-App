import { useState } from "react";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";

export default function InfoDot({ x, y, title, description }) {
  const [visible, setVisible] = useState(false);

  return (
    <>
      {/* Dot */}
      <Pressable
        onPress={() => setVisible(true)}
        style={[styles.dot, { left: x - 8, top: y - 8 }]} // -8 to center the 16px dot
      />

      {/* Bottom Drawer */}
      <Modal
        visible={visible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setVisible(false)}
      >
        <Pressable
          style={styles.backdrop}
          onPress={() => setVisible(false)}
        >
          <View style={styles.drawer}>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.description}>{description}</Text>
          </View>
        </Pressable>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  dot: {
    position: "absolute",
    width: 16,
    height: 16,
    borderRadius: 8, // Half of width/height for a perfect circle
    backgroundColor: "rgba(85, 146, 184, 1)",
    borderWidth: 2,
    borderColor: "#ffffff",
    zIndex: 20, // High zIndex to sit on top of image
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 5,
  },
  backdrop: {
    flex: 1,
    // backgroundColor: "rgba(0,0,0,0.2)", // Optional dimming
    justifyContent: "flex-end",
  },
  drawer: {
    backgroundColor: "#fff",
    padding: 25,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    minHeight: 180,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 10,
    color: "#2D3648",
    fontFamily: "DM Sans", // Assuming you want to keep your font consistency
  },
  description: {
    fontSize: 15,
    color: "#555",
    lineHeight: 22,
    fontFamily: "DM Sans",
  },
});