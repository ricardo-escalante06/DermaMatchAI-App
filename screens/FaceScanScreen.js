import { CameraView, useCameraPermissions } from "expo-camera";
import { Image } from "expo-image";
import { useRef, useState } from "react";
import {
  Alert,
  Button,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function FaceScanScreen({ navigation }) {
  const [facing, setFacing] = useState("front"); // 'front' | 'back'
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef(null);
  const [modalVisible, setModalVisible] = useState(true);
  const [capturedPhotoUri, setCapturedPhotoUri] = useState(null);

  if (!permission) return <View />;

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>
          We need your permission to show the camera
        </Text>
        <Button onPress={requestPermission} title="Grant permission" />
      </View>
    );
  }

  function toggleCameraFacing() {
    setFacing((current) => (current === "back" ? "front" : "back"));
  }

  async function takePhoto() {
    if (!cameraRef.current) return;

    try {
      const photo = await cameraRef.current.takePictureAsync({
        base64: true,
        exif: true,
      });

      setCapturedPhotoUri(photo.uri);

      const formData = new FormData();
      formData.append("image", {
        uri: photo.uri,
        name: "photo.jpg",
        type: "image/jpeg",
      });

      // const response = await fetch("https://dermamatch-mvp-1.onrender.com/recommend-image", {
      //   method: "POST",
      //   body: formData,
      // });

      // const data = await response.json();
      // console.log("Upload response:", data);

      // sents you to main tabs!
      navigation.replace("MainTabs");
    } catch (error) {
      console.error("Error taking/uploading picture:", error);
    }
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => navigation.replace("MainTabs")}
        style={styles.arrowContainer}
      >
        <Image
          source={require("../assets/images/arrow.png")}
          style={styles.arrow}
        />
      </TouchableOpacity>
      {!capturedPhotoUri ? (
        <>
          <CameraView
            style={styles.camera}
            facing={facing}
            ref={cameraRef}
            mirror={true}
          />

          <Modal
            animationType="fade"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {
              Alert.alert("Modal has been closed.");
              setModalVisible(false);
            }}
          >
            <View style={styles.modalBackground}>
              <View style={styles.modalView}>
                <Text style={styles.modalSteps}>Step 1 of 2</Text>

                <Text style={styles.modalHeading}>Face Scanning</Text>

                {/* //gif in here soon */}
                <Image
                  source={require("../assets/images/penguinGif.gif")}
                  style={styles.modalImage}
                ></Image>

                <Text style={styles.modalText}>
                  Do you consent to participate in DermaMatch AI skin scan? or
                  some phrase like that
                </Text>

                {/* Button Row */}
                <View style={styles.buttonRow}>
                  <Pressable
                    style={styles.modalButtonYes}
                    onPress={() => setModalVisible(false)}
                  >
                    <Text style={styles.modalButtonYesText}>Yes</Text>
                  </Pressable>

                  <Pressable
                    style={styles.modalButtonNo}
                    onPress={() => console.log("No pressed")}
                  >
                    <Text style={styles.modalButtonNoText}>No</Text>
                  </Pressable>
                </View>
              </View>
            </View>
          </Modal>

          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={takePhoto}>
              <Text style={styles.text}>Take Photo</Text>
            </TouchableOpacity>
          </View>
        </>
      ) : (
        <Image source={capturedPhotoUri} style={styles.capturedPhotoStyle} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  message: {
    textAlign: "center",
    paddingBottom: 10,
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    position: "absolute",
    bottom: 64,
    flexDirection: "row",
    backgroundColor: "transparent",
    width: "100%",
    paddingHorizontal: 64,
  },
  button: {
    flex: 1,
    alignItems: "center",
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
  },
  capturedPhotoStyle: {
    flex: 1,
  },
  modalBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 10,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },

  modalSteps: {
    alignSelf: "center", // horizontal centering
    width: 78,
    height: 19,
    fontFamily: "DM Sans",
    fontStyle: "normal",
    fontWeight: "400",
    fontSize: 16,
    lineHeight: 19, // 120% of font-size, matches height
    textAlign: "center",
    letterSpacing: 0.01,
    color: "#A0A0A0",
    marginBottom: 8,
  },

  modalHeading: {
    alignSelf: "center",
    width: 172,
    height: 29,
    fontFamily: "Archivo",
    fontStyle: "normal",
    fontWeight: "700",
    fontSize: 24,
    lineHeight: 29, // matches height
    textAlign: "center",
    letterSpacing: 0.01,
    color: "#2D3648",
    marginBottom: 20,
  },

  modalText: {
    width: 218,
    height: 51,
    fontFamily: "DM Sans",
    fontStyle: "normal",
    fontWeight: "300",
    fontSize: 14,
    lineHeight: 17, // 120% of font size
    letterSpacing: 0.01,
    color: "#000000",
    marginVertical: 20,
  },

  modalImage: {
    width: 186,
    height: 194,
    alignSelf: "center", // center horizontally
  },

  buttonRow: {
    flexDirection: "row", // align buttons horizontally
    justifyContent: "space-between",
    width: 150,
  },
  modalButtonYes: {
    width: 71,
    height: 31,
    backgroundColor: "#2D3648",
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
  },

  modalButtonYesText: {
    fontFamily: "Archivo",
    fontStyle: "normal",
    fontWeight: "400",
    fontSize: 14,
    lineHeight: 17,
    textAlign: "center",
    letterSpacing: 0.01,
    color: "#FFFFFF",
  },

  modalButtonNo: {
    width: 71,
    height: 31,
    backgroundColor: "#ffffffff",
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#2D3648",
  },

  modalButtonNoText: {
    fontFamily: "Archivo",
    fontStyle: "normal",
    fontWeight: "400",
    fontSize: 14,
    lineHeight: 17,
    textAlign: "center",
    letterSpacing: 0.01,
    color: "#000000ff",
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
});
