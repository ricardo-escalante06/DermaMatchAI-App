import { decode as atob } from "base-64";
import { CameraView, useCameraPermissions } from "expo-camera";
import * as FileSystem from "expo-file-system/legacy";
import { Image } from "expo-image";
import { useRef, useState } from "react";
import {
  Button,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { supabase } from "../supabase/supabaseClient";

import { LinearGradient } from "expo-linear-gradient";
import FaceOval from "../components/FaceOval";

import Slider from "@react-native-community/slider";
import GradientSpinner from "../components/GradientSpinner";

export default function FaceScanScreen({ navigation }) {
  const [facing, setFacing] = useState("front"); // 'front' | 'back'
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef(null);
  const [modalVisible, setModalVisible] = useState(true);
  const [animationStart, setAnimationStart] = useState(false);
  const [capturedPhotoUri, setCapturedPhotoUri] = useState(null);
  const [photoTaken, setPhotoTaken] = useState(false);
  const [startClicked, setStartClicked] = useState(false);

  const [questionairModalVisible, setQuestionairModalVisible] = useState(false);
  const [modalStep, setModalStep] = useState(1);

  const [skinSensitivity, setSkinSensitivity] = useState(0);
  const [makeupUsage, setMakeupUsage] = useState(null);

  const [loadingResults, setLoadingResults] = useState(false);
  const [scanResult, setScanResult] = useState(null);

  const delay = (ms) => new Promise((res) => setTimeout(res, ms));

  const [userId, setUserId] = useState(null);

  const duration = 4000;

  async function uploadPhoto(user_id) {
    // Read file as base64
    const base64 = await FileSystem.readAsStringAsync(capturedPhotoUri, {
      encoding: FileSystem.EncodingType.Base64,
    });

    // Convert base64 → Uint8Array (Supabase expects this)
    const bytes = Uint8Array.from(atob(base64), (c) => c.charCodeAt(0));

    const fileName = `user-${user_id}/photo-${Date.now()}.jpg`;

    const { data, error } = await supabase.storage
      .from("scan-images")
      .upload(fileName, bytes, {
        contentType: "image/jpeg",
        upsert: true,
      });

    if (error) {
      console.error("Upload failed:", error);
      throw error;
    }

    const { data: urlData } = supabase.storage
      .from("scan-images")
      .getPublicUrl(fileName);

    return urlData.publicUrl;
  }

  async function saveScanToDatabase(userId, scanImageUrl, products = null) {
    try {
      if (!userId) throw new Error("User ID is required");

      const { data, error } = await supabase.from("scans").insert([
        {
          user_id: userId,
          scan_image_url: scanImageUrl,
          products: products, // should be a JS object or array; Supabase converts to jsonb
        },
      ]);

      if (error) throw error;

      console.log("Scan saved to database:", data);
      return data;
    } catch (err) {
      console.error("Failed to save scan to DB:", err.message);
      throw err;
    }
  }

  async function fetchUserId() {
    const { data: sessionData, error } = await supabase.auth.getSession();
    if (error) {
      console.log("Error fetching session:", error.message);
      return null;
    }
    if (!sessionData?.session) {
      console.log("No active session, user not logged in");
      return null;
    }
    return sessionData.session.user.id;
  }

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

  async function getResults(sensitivityAnswer, makeupAnswer) {
    setLoadingResults(true);

    try {
      const userId = await fetchUserId();
      setUserId(userId);
      if (!userId) {
        alert("Please log in first!");
        return;
      }

      const formData = new FormData();

      formData.append("image", {
        uri: capturedPhotoUri,
        name: "photo.jpg",
        type: "image/jpeg",
      });

      const answers = {
        question1: sensitivityAnswer,
        question2: makeupAnswer,
      };

      formData.append("data", JSON.stringify(answers));

      // const response = await fetch(
      //   "https://dermamatch-mvp-1.onrender.com/recommend-image",
      //   {
      //     method: "POST",
      //     body: formData,
      //   }
      // );

      // const text = await response.text();
      // let data;
      // try {
      //   data = JSON.parse(text);
      //   console.log("Parsed JSON response:", data);
      // } catch (err) {
      //   console.error("Failed to parse JSON:", err, "\nRaw response:", text);
      //   return;
      // }

      const data = [
        {
          imageUrl:
            "https://incidecoder-content.storage.googleapis.com/4af1f671-feef-4683-b78c-ce2fc4a25c60/products/skincare-by-dr-v-trio-blemish-face-wash/skincare-by-dr-v-trio-blemish-face-wash_front_photo_original.jpeg",
          name: "Skincare by Dr. V Trio Blemish Face Wash",
          price: 15,
          store: "Amazon",
          type: "CLEANSER",
        },
        {
          imageUrl:
            "https://incidecoder-content.storage.googleapis.com/694142fa-e0a9-4c88-af6f-55a88063306d/products/dr-g-aclear-balancing-toner/dr-g-aclear-balancing-toner_front_photo_original.jpeg",
          name: "Dr. G AClear Balancing Toner",
          price: 20,
          store: "Ulta",
          type: "TONER",
        },
        {
          imageUrl:
            "https://incidecoder-content.storage.googleapis.com/e309372a-9f13-427f-a9b1-a30d4286c88e/products/fauno-serum-regenerador-niacinamida-y-uva-fauno/fauno-serum-regenerador-niacinamida-y-uva-fauno_front_photo_original.jpeg",
          name: "Fauno Serum Regenerador Niacinamida Y UVA Fauno",
          price: 30,
          store: "Amazon",
          type: "SERUM",
        },
        {
          imageUrl:
            "https://incidecoder-content.storage.googleapis.com/deae880c-67c1-430b-82f0-032cb5220a11/products/aurora-dionis-dermacosmetics-ndeg13-nourishing-gel-more-skin-types-hydraterend-voedend-herstellend/aurora-dionis-dermacosmetics-ndeg13-nourishing-gel-more-skin-types-hydraterend-voedend-herstellend_front_photo_original.jpeg",
          name: "Aurora Dionis Dermacosmetics N°13 Nourishing Gel - More Skin Types ¦ Hydraterend Voedend Herstellend",
          price: 25,
          store: "Amazon",
          type: "MOISTURIZER",
        },
        {
          imageUrl:
            "https://incidecoder-content.storage.googleapis.com/e9b074b1-db9d-4109-b22a-1e46779569b9/products/dr-g-green-mild-up-sun-spf-50-pa-2021/dr-g-green-mild-up-sun-spf-50-pa-2021_front_photo_original.jpeg",
          name: "Dr. G Green Mild Up Sun+ SPF 50+ Pa++++ (2021)",
          price: 24,
          store: "YesStyle",
          type: "SUNSCREEN",
        },
      ];

      const imageUrl = await uploadPhoto(userId);
      setScanResult(imageUrl);

      saveScanToDatabase(userId, imageUrl, data);

      navigation.replace("MainTabs");
    } catch (err) {
      console.error("Failed to save scan2:", err);
      alert("Failed to save scan: " + err.message);
    } finally {
      setLoadingResults(false);
    }
  }

  async function takePhoto() {
    if (!cameraRef.current) return;
    const photo = await cameraRef.current.takePictureAsync({
      base64: true,
      exif: true,
    });
    setStartClicked(true);
    setCapturedPhotoUri(photo.uri);
    setPhotoTaken(true);
    await delay(250);
    setAnimationStart(true);
    await delay(duration + 250);
    setQuestionairModalVisible(true);
  }

  return (
    <View style={styles.container}>
      {!photoTaken && (
        <TouchableOpacity
          onPress={() => navigation.replace("MainTabs")}
          style={styles.arrowContainer}
        >
          <Image
            source={require("../assets/images/arrow.png")}
            style={styles.arrow}
          />
        </TouchableOpacity>
      )}

      {/* Camera or captured image */}
      <View style={{ flex: 1 }}>
        {!capturedPhotoUri ? (
          <CameraView
            style={styles.camera}
            facing={facing}
            ref={cameraRef}
            mirror={true}
          />
        ) : (
          <Image source={capturedPhotoUri} style={styles.capturedPhotoStyle} />
        )}

        {/* FaceOval always visible */}
        <View style={styles.faceOvalContainer}>
          <FaceOval
            width={325}
            height={445}
            ticks={100}
            tickWidth={3}
            tickHeight={20}
            activeColor="#FFFFFF"
            inactiveColor="#179BD7"
            duration={duration}
            startAnimation={animationStart}
          />
        </View>

        {/* Take Photo button disappears after clicked */}
        {!photoTaken && (
          <View style={styles.buttonContainer}>
            {!startClicked && (
              <TouchableOpacity style={styles.button} onPress={takePhoto}>
                <Text style={styles.text}>Click to start</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      </View>

      {/* Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <LinearGradient
          colors={["#5592B8", "#FFECA4"]}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 1 }}
          style={styles.modalBackground}
        >
          <View style={styles.modalView}>
            <Text style={styles.modalSteps}>Step 1 of 2</Text>
            <Text style={styles.modalHeading}>Face Scanning</Text>

            <Image
              source={require("../assets/images/penguinGif.gif")}
              style={styles.modalImage}
            />

            <Text style={styles.modalText}>
              Do you consent to participate in DermaMatch AI skin scan?
            </Text>

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
        </LinearGradient>
      </Modal>

      {/* Questionnaire Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={questionairModalVisible}
        onRequestClose={() => setQuestionairModalVisible(false)}
      >
        <View style={styles.qBackdrop}>
          <View style={styles.qBox}>
            <Text style={styles.qStepText}>Step {modalStep} of 2</Text>

            {modalStep === 1 && (
              <View style={{ alignItems: "center", width: "100%" }}>
                {/* Title */}
                <Text style={styles.sensitivityTitle}>Skin Sensitivity</Text>

                {/* Subtitle */}
                <Text style={styles.sensitivitySubtitle}>
                  How sensitive is your skin to products or external weather
                  conditions?
                </Text>

                {/* Slider */}
                <Slider
                  style={{ width: "90%", marginTop: 15 }}
                  minimumValue={0}
                  maximumValue={4}
                  step={1}
                  value={skinSensitivity}
                  onValueChange={setSkinSensitivity}
                  minimumTrackTintColor="#5592B8"
                  maximumTrackTintColor="#E1E5EB"
                  thumbTintColor="#5592B8"
                />

                {/* Labels under slider */}
                <View style={styles.sliderLabels}>
                  <Text style={styles.sliderLabel}>Not Sensitive</Text>
                  <Text style={styles.sliderLabel}>Sensitive</Text>
                  <Text style={styles.sliderLabel}>Super Sensitive</Text>
                </View>

                {/* Continue Button */}
                <Pressable
                  style={styles.nextButton}
                  onPress={() => setModalStep(2)}
                >
                  <Text style={styles.nextButtonText}>Next</Text>
                </Pressable>
              </View>
            )}

            {modalStep === 2 && (
              <View style={{ alignItems: "center", width: "100%" }}>
                <Text style={styles.sensitivityTitle}>Makeup Usage</Text>

                <Text style={styles.sensitivitySubtitle}>
                  How often do you use makeup?
                </Text>

                {/* Radio List */}
                <View style={styles.radioGroup}>
                  {["Daily", "A few times a week", "Rarely, or never"].map(
                    (option) => (
                      <Pressable
                        key={option}
                        style={styles.radioRow}
                        onPress={() => setMakeupUsage(option)}
                      >
                        <View
                          style={[
                            styles.radioCircle,
                            makeupUsage === option &&
                              styles.radioCircleSelected,
                          ]}
                        >
                          {makeupUsage === option && (
                            <View style={styles.radioDot} />
                          )}
                        </View>
                        <Text
                          style={[
                            styles.radioLabel,
                            makeupUsage === option && styles.radioLabelSelected,
                          ]}
                        >
                          {option}
                        </Text>
                      </Pressable>
                    )
                  )}
                </View>

                {/* Buttons Row */}
                <View style={styles.modalStep2Buttons}>
                  <Pressable
                    style={[styles.backButton]}
                    onPress={() => setModalStep(1)}
                  >
                    <Text style={styles.backButtonText}>Back</Text>
                  </Pressable>

                  <Pressable
                    style={styles.finishButton}
                    onPress={() => {
                      if (!makeupUsage) return;
                      setQuestionairModalVisible(false);
                      getResults(skinSensitivity, makeupUsage);
                    }}
                  >
                    <Text style={styles.finishButtonText}>Finish</Text>
                  </Pressable>
                </View>
              </View>
            )}
          </View>
        </View>
      </Modal>

      <Image
        source={require("../assets/images/dermaLogoTrans.png")}
        style={{
          position: "absolute",
          top: "90%",
          left: "50%",
          width: 50,
          height: 50,
          resizeMode: "contain",
          transform: [
            { translateX: -25 }, // half width
            { translateY: -25 }, // half height
          ],
          zIndex: 20, // above camera & gradient
        }}
      />
      {/* Bottom gradient overlay */}
      <LinearGradient
        colors={["#3478A2", "transparent"]} // Blue → nothing
        start={{ x: 0.5, y: 1 }}
        end={{ x: 0.5, y: 0 }}
        style={styles.bottomGradient}
      />

      {loadingResults && (
        <View style={styles.loadingScreen}>
          <GradientSpinner loading={loadingResults} />

          <View style={{ alignItems: "center", marginTop: 16 }}>
            <Text style={styles.loadingText}>
              Finding The <Text style={styles.bold}>Perfect</Text> Routine{" "}
              <Text style={styles.boldUnderline}>For you</Text>
            </Text>
          </View>
        </View>
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
  capturedPhotoStyle: {
    flex: 1,
  },
  buttonContainer: {
    position: "absolute",
    bottom: 150,
    flexDirection: "row",
    backgroundColor: "transparent",
    width: "100%",
    paddingHorizontal: 64,
    zIndex: 20,
  },
  button: {
    flex: 1,
    alignItems: "center",
  },
  text: {
    fontFamily: "DM Sans",
    fontStyle: "normal",
    fontWeight: "500",
    fontSize: 20,
    lineHeight: 24, // line-height in px, 120% of 20px ≈ 24
    textAlign: "center",
    letterSpacing: 0.01, // React Native uses em-ish units as decimal
    color: "#FFFFFF",
    textShadowColor: "rgba(0, 0, 0, 0.25)",
    textShadowOffset: { width: 0, height: 4 },
    textShadowRadius: 4,
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
  faceOvalContainer: {
    position: "absolute",
    top: 180,
    left: 0,
    right: 0,
    alignItems: "center",
    zIndex: 10,
  },
  modalBackground: {
    position: "absolute",
    flex: 1,
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 10,
    padding: 35,
    alignItems: "center",
    elevation: 5,
  },
  modalSteps: {
    width: 78,
    height: 19,
    fontFamily: "DM Sans",
    fontWeight: "400",
    fontSize: 16,
    lineHeight: 19,
    textAlign: "center",
    color: "#A0A0A0",
    marginBottom: 8,
  },
  modalHeading: {
    width: 172,
    height: 29,
    fontFamily: "Archivo",
    fontWeight: "700",
    fontSize: 24,
    lineHeight: 29,
    textAlign: "center",
    color: "#2D3648",
    marginBottom: 20,
  },
  modalText: {
    width: 218,
    height: 51,
    fontFamily: "DM Sans",
    fontWeight: "300",
    fontSize: 14,
    lineHeight: 17,
    textAlign: "center",
    color: "#000",
    marginVertical: 20,
  },
  modalImage: {
    width: 186,
    height: 194,
    alignSelf: "center",
  },
  buttonRow: {
    flexDirection: "row",
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
    fontWeight: "400",
    fontSize: 14,
    lineHeight: 17,
    textAlign: "center",
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
    fontWeight: "400",
    fontSize: 14,
    lineHeight: 17,
    textAlign: "center",
    color: "#000",
  },
  bottomGradient: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    height: 250, // same as your original rectangle height
  },

  /** Questionnaire */
  qBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
  },
  qBox: {
    width: "85%",
    backgroundColor: "#fff",
    padding: 25,
    borderRadius: 12,
    alignItems: "center",
  },
  qStepText: { fontSize: 14, color: "#888", marginBottom: 15 },

  stepContainer: { alignItems: "center", width: "100%", marginVertical: 12 },
  fade: { opacity: 0.35 },

  sensitivityTitle: {
    fontFamily: "DM Sans",
    fontSize: 18,
    fontWeight: "600",
    color: "#2D3648",
    textAlign: "center",
  },
  sensitivitySubtitle: {
    fontFamily: "DM Sans",
    fontSize: 14,
    fontWeight: "400",
    textAlign: "center",
    marginTop: 12,
    width: "80%",
    color: "#000",
  },

  sliderLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    // marginTop: 20,
  },

  sliderLabel: {
    fontFamily: "DM Sans",
    fontSize: 11,
    fontWeight: "300",
    color: "#A0A0A0",
    textAlign: "center",
    width: "33%",
  },

  rowRight: {
    width: "100%",
    alignItems: "flex-end",
    marginTop: 18,
  },

  nextButton: {
    backgroundColor: "#5592B8",
    marginTop: 50,
    width: 78,
    height: 35,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "flex-end",
  },
  nextButtonText: {
    fontFamily: "DM Sans",
    fontSize: 14,
    color: "#FFF",
  },

  qTitle: {
    fontFamily: "DM Sans",
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 20,
  },

  qBtn: {
    backgroundColor: "#179BD7",
    paddingVertical: 12,
    borderRadius: 8,
    marginVertical: 6,
    width: "100%",
    alignItems: "center",
  },
  qBtnText: {
    color: "#fff",
    fontSize: 16,
    textAlign: "center",
    fontFamily: "DM Sans",
  },

  bottomGradient: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    height: 250,
  },

  radioGroup: {
    marginTop: 30,
    width: "100%",
    paddingHorizontal: 40,
    gap: 16, // a little bigger gap
  },

  radioRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12, // slightly more space
  },

  radioCircle: {
    width: 16, // bigger
    height: 16, // bigger
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: "#D9D9D9",
    justifyContent: "center",
    alignItems: "center",
  },

  radioCircleSelected: {
    borderColor: "#5592B8",
  },

  radioDot: {
    width: 8, // bigger
    height: 8, // bigger
    borderRadius: 4,
    backgroundColor: "#5592B8",
  },

  radioLabel: {
    fontFamily: "DM Sans",
    fontStyle: "normal",
    fontWeight: "300",
    fontSize: 14, // slightly bigger
    lineHeight: 16,
    letterSpacing: 0.01,
    color: "#A0A0A0",
  },

  radioLabelSelected: {
    color: "#2D3648", // darker when selected
    fontWeight: "500",
  },

  modalStep2Buttons: {
    flexDirection: "row",
    justifyContent: "flex-end", // align to right
    gap: 12, // space between buttons
    width: "100%",
    marginTop: 40,
  },

  backButton: {
    width: 78, // match your rectangle width
    height: 35,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#D9D9D9",
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
  },

  backButtonText: {
    fontFamily: "DM Sans",
    fontWeight: "500",
    fontSize: 14,
    lineHeight: 17, // 120% of 14px
    letterSpacing: 0.01,
    color: "#A0A0A0",
    textAlign: "center",
  },

  finishButton: {
    width: 78,
    height: 35,
    backgroundColor: "#5592B8",
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
  },

  finishButtonText: {
    fontFamily: "DM Sans",
    fontWeight: "500",
    fontSize: 14,
    color: "#FFFFFF",
    textAlign: "center",
  },

  loadingScreen: {
    ...StyleSheet.absoluteFillObject, // covers the entire screen
    backgroundColor: "#FFFFFF", // white background
    justifyContent: "center",
    alignItems: "center",
    zIndex: 100, // ensures it sits above everything else
  },

  loadingText: {
    width: 294,
    height: 58,
    fontFamily: "Archivo",
    fontStyle: "normal",
    fontWeight: "400",
    fontSize: 24,
    lineHeight: 29, // 120%
    textAlign: "center",
    letterSpacing: 0.01 * 24,
    color: "#000000",
    alignSelf: "center", // replaces absolute positioning
    marginTop: 30, // adjust based on layout
  },
  bold: {
    fontWeight: "700",
  },
  boldUnderline: {
    fontWeight: "700",
    textDecorationLine: "underline",
    fontStyle: "italic",
  },
});
