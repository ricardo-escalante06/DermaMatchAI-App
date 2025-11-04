import { ScrollView, StyleSheet, Text, View, Dimensions } from "react-native";

export default function HomePageScreen({ navigation, route }) {
  const screenHeight = Dimensions.get("window").height;

  return (
    <ScrollView
      style={styles.scrollView}
      contentContainerStyle={[styles.container, { minHeight: screenHeight }]}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.noScansContainer}>
        <Text style={styles.noScansText}>Shopping Page</Text>
        <Text style={styles.noScansText}>(Comming Soon) ...</Text>
      </View>
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
