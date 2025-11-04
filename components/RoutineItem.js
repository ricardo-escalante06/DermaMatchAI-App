// TeaserRoutineItem.js
import { Image, StyleSheet, Text, View } from "react-native";

export default function RoutineItem({ image, name, store, type, price, style }) {
  const badgeStyles = getBadgeStyles(type);

  return (
    <View style={[styles.itemBox, style]}>
      {/* Spacer for top */}
      <View style={{ flex: 1 }} />

      {/* Image Box */}
      <View style={styles.imageBox}>
        {image && (
          <Image
            source={{ uri: image }}
            style={styles.image}
            resizeMode="cover"
          />
        )}
      </View>

      {/* Bottom Info Section */}
      <View style={styles.infoContainer}>
        <Text style={styles.itemName} numberOfLines={2} ellipsizeMode="tail">
          {name}
        </Text>
        <Text style={styles.itemStore}>{store}</Text>

        {/* Badge aligned to the right */}
        <View style={[styles.rightBadge, badgeStyles.container]}>
          <Text style={[styles.badgeText, badgeStyles.text]}>{type}</Text>
        </View>

        {price && <Text style={styles.priceText}>${price}</Text>}
      </View>
    </View>
  );
}

function getBadgeStyles(type) {
  switch (type.toLowerCase()) {
    case "sunscreen":
      return {
        container: { backgroundColor: "#FFF9E2" },
        text: { color: "#D5A700" },
      };
    case "moisturizer":
      return {
        container: { backgroundColor: "#EDF2F7" },
        text: { color: "#5592B8" },
      };
    case "toner":
      return {
        container: { backgroundColor: "rgba(201, 74, 74, 0.12)" },
        text: { color: "#C94A4A" },
      };
    case "cleanser":
      return {
        container: { backgroundColor: "rgba(62, 159, 50, 0.12)" },
        text: { color: "#42922E" },
      };
    case "serum":
      return {
        container: { backgroundColor: "rgba(112, 50, 150, 0.12)" },
        text: { color: "#792E92" },
      };
    default:
      return {
        container: { backgroundColor: "#ccc" },
        text: { color: "#000" },
      };
  }
}

const styles = StyleSheet.create({
  itemBox: {
    // width: 187,

    height: 323,
    // marginRight: 12,
    borderRadius: 20,
    backgroundColor: "#F5F5F5",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  imageBox: {
    // width: 144,
    width: "80%",
    height: 144,
    marginBottom: 20,
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "#F5F5F5",
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  infoContainer: {
    width: "100%",
    height: 133,
    backgroundColor: "rgba(85,146,184,0.1)",
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 10,
    // justifyContent: "flex-start",
    justifyContent: "space-between", // top info and bottom price
    alignItems: "flex-start", // stack items from top
  },
  itemName: {
    fontFamily: "Archivo",
    fontWeight: "400",
    fontSize: 14,
    lineHeight: 17,
    color: "#000",
    marginBottom: 2,
  },
  itemStore: {
    fontFamily: "DM Sans",
    fontWeight: "500",
    fontSize: 10,
    lineHeight: 12,
    color: "rgba(0,0,0,0.5)",
    marginBottom: 6, // spacing between store and badge
  },
  rightBadge: {
    alignSelf: "flex-end", // push badge to right
    width: 78,
    height: 28,
    borderRadius: 25,
    backgroundColor: "#CDE3CB",
    justifyContent: "center",
    alignItems: "center",
  },
  badgeText: {
    fontFamily: "DM Sans",
    fontWeight: "600",
    fontSize: 10,
    lineHeight: 12,
    color: "#42922E",
  },
  priceText: {
    fontFamily: "DM Sans",
    fontWeight: "700",
    fontSize: 20,
    lineHeight: 24,
    color: "#000",
    alignSelf: "flex-start", // bottom-left
  },
});
