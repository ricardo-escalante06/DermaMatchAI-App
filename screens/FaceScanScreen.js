import { CameraView, useCameraPermissions } from "expo-camera";
import { Image } from "expo-image";
import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
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

import InfoDot from "../components/InfoDot";

import { decode as atob } from "base-64";
import * as FileSystem from "expo-file-system/legacy"; // or "expo-file-system" depending on your version

export default function FaceScanScreen({ navigation }) {
  const [facing, setFacing] = useState("front");
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef(null);
  const [modalVisible, setModalVisible] = useState(true);
  const [animationStart, setAnimationStart] = useState(false);

  // State to hold full photo details including width/height
  const [capturedPhotoDetails, setCapturedPhotoDetails] = useState(null);
  const [imageLayout, setImageLayout] = useState({ width: 0, height: 0 });

  const [photoTaken, setPhotoTaken] = useState(false);
  const [startClicked, setStartClicked] = useState(false);

  const [questionairModalVisible, setQuestionairModalVisible] = useState(false);
  const [modalStep, setModalStep] = useState(1);

  const [skinSensitivity, setSkinSensitivity] = useState(0);
  const [makeupUsage, setMakeupUsage] = useState(null);

  // --- API 1 States (Image Scan) ---
  const [loadingResults, setLoadingResults] = useState(false);
  const [scanResult, setScanResult] = useState(null);

  // --- API 2 States (Routine) ---
  const [loadingRoutine, setLoadingRoutine] = useState(false);
  const [routineResult, setRoutineResult] = useState(null);

  const delay = (ms) => new Promise((res) => setTimeout(res, ms));
  const [userId, setUserId] = useState(null);
  const duration = 4000;

  const [isSaving, setIsSaving] = useState(false);

  // --- API ENDPOINTS ---
  const BASE_URL = "https://dermamatch-mvp-1.onrender.com";
  const SCAN_API_URL = `${BASE_URL}/recommend-image`;
  const ROUTINE_API_URL = `${BASE_URL}/recommend-routine`;

  useEffect(() => {
    async function loadUserId() {
      const id = await fetchUserId();
      if (id) setUserId(id);
    }
    loadUserId();
  }, []);

  async function fetchUserId() {
    const { data: sessionData, error } = await supabase.auth.getSession();
    if (error || !sessionData?.session) return null;
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

  // --- HELPER: Upload Photo to Supabase Storage ---
  async function uploadPhoto(currentUserId, uri) {
    try {
      // 1. Read file as base64
      const base64 = await FileSystem.readAsStringAsync(uri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      // 2. Convert base64 to ArrayBuffer for Supabase
      const toByteArray = (str) => {
        const binaryString = atob(str);
        const len = binaryString.length;
        const bytes = new Uint8Array(len);
        for (let i = 0; i < len; i++) {
          bytes[i] = binaryString.charCodeAt(i);
        }
        return bytes;
      };

      const fileData = toByteArray(base64);

      // 3. Create unique filename
      const fileName = `user-${currentUserId}/scan-${Date.now()}.jpg`;

      // 4. Upload
      const { data, error } = await supabase.storage
        .from("scan-images") // Make sure this bucket exists in Supabase Storage
        .upload(fileName, fileData, {
          contentType: "image/jpeg",
          upsert: true,
        });

      if (error) throw error;

      // 5. Get Public URL
      const { data: urlData } = supabase.storage
        .from("scan-images")
        .getPublicUrl(fileName);

      return urlData.publicUrl;
    } catch (err) {
      console.error("Upload failed:", err.message);
      throw err;
    }
  }

  // --- HELPER: Save Metadata to Database ---
  async function saveScanToDatabase(
    currentUserId,
    scanImageUrl,
    analysisData,
    routineData
  ) {
    try {
      if (!currentUserId) throw new Error("User ID is required");

      // Validate Routine Data (products)
      let validProducts = null;
      if (
        routineData &&
        (Array.isArray(routineData) || typeof routineData === "object")
      ) {
        validProducts = routineData;
      } else {
        console.warn("Invalid products data, saving as null");
      }

      // Validate Face Analysis Data (face_results)
      let validAnalysis = null;
      if (
        analysisData &&
        (Array.isArray(analysisData) || typeof analysisData === "object")
      ) {
        validAnalysis = analysisData;
      } else {
        console.warn("Invalid analysis data, saving as null");
      }

      // Insert into DB
      const { data, error } = await supabase.from("scans").insert([
        {
          user_id: currentUserId,
          scan_image_url: scanImageUrl,
          products: validProducts, // Maps to 'products' column (jsonb)
          face_results: validAnalysis, // Maps to 'face_results' column (jsonb)
        },
      ]);

      if (error) throw error;

      console.log("Scan saved to database successfully.");
      return data;
    } catch (err) {
      console.error("Failed to save scan to DB:", err.message);
      // We don't return null here so the UI can decide if it wants to proceed anyway
      // or throw; but for now, we just log it.
      return null;
    }
  }

  async function takePhoto() {
    if (!cameraRef.current) return;

    // Quality 0.8 is good for uploads (reduces size while keeping detail)
    const photo = await cameraRef.current.takePictureAsync({
      base64: true,
      exif: true,
      quality: 0.5,
    });

    setStartClicked(true);
    setCapturedPhotoDetails(photo);
    setPhotoTaken(true);
    await delay(250);
    setAnimationStart(true);
    await delay(duration + 250);
    setQuestionairModalVisible(true);
  }

  // Helper to convert slider value (0-4) to text for the API
  function getSensitivityLabel(value) {
    const labels = [
      "Resistant",
      "Normal",
      "Mildly Sensitive",
      "Sensitive",
      "Very Sensitive",
    ];
    return labels[value] || "Normal";
  }

  async function handleContinue() {
    if (isSaving) return; // Prevent double clicks
    setIsSaving(true);

    try {
      console.log("Starting save process...");

      // 1. Upload Photo to get URL
      // (Ensure we have a userId, if not, try to fetch it again or fail)
      const currentId = userId || (await fetchUserId());
      if (!currentId) throw new Error("No user ID found");

      const publicUrl = await uploadPhoto(currentId, capturedPhotoDetails.uri);
      console.log("Image uploaded:", publicUrl);

      // 2. Save Data to Supabase Table
      await saveScanToDatabase(currentId, publicUrl, scanResult, routineResult);

      // 3. Navigate
      navigation.replace("MainTabs", {
        userId: currentId,
        screen: "ShoppingPageScreen",
        params: {
          routine: routineResult,
          scanAnalysis: scanResult,
        },
      });
    } catch (e) {
      console.error("Error saving/navigating:", e);
      alert(
        "There was an error saving your results, but we will take you to your routine."
      );

      // Optional: Navigate anyway even if save failed?
      navigation.replace("MainTabs", {
        userId: userId,
        screen: "ShoppingPageScreen",
        params: {
          routine: routineResult,
          scanAnalysis: scanResult,
        },
      });
    } finally {
      setIsSaving(false);
    }
  }

  // --- API CALL 2: GET ROUTINE ---
  async function fetchRoutine(sensitivityValue, makeupValue) {
    setLoadingRoutine(true);

    try {
      console.log("Fetching Routine from API...");

      const formData = new FormData();

      // 1. Image
      formData.append("image", {
        uri: capturedPhotoDetails.uri,
        name: "photo.jpg",
        type: "image/jpeg",
      });

      // 2. Survey Data
      // Map the numeric slider to a string for better AI context
      const sensitivityString = getSensitivityLabel(sensitivityValue);

      const surveyAnswers = {
        skin_sensitivity: sensitivityString,
        makeup_frequency: makeupValue,
      };

      formData.append("data", JSON.stringify(surveyAnswers));

      const response = await fetch(ROUTINE_API_URL, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Routine API Error: ${response.status}`);
      }

      const data = await response.json();

      console.log("Routine Loaded:", data);

      setRoutineResult(data.routine);
      // await delay(8000);
    } catch (err) {
      console.error("Error fetching routine:", err);
      // Optional: Handle error state in UI here
    } finally {
      setLoadingRoutine(false);
    }
  }

  // --- API CALL 1: GET IMAGE RESULTS ---
  async function getResults(sensitivityAnswer, makeupAnswer) {
    setLoadingResults(true);
    setQuestionairModalVisible(false);

    try {
      console.log(
        "Fetching Image Analysis from API...",
        capturedPhotoDetails.uri
      );

      const formData = new FormData();
      formData.append("image", {
        uri: capturedPhotoDetails.uri,
        name: "photo.jpg",
        type: "image/jpeg",
      });

      const response = await fetch(SCAN_API_URL, {
        method: "POST",
        body: formData,
      });

      // console.log(formData);

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Server Error Response:", errorText);
        throw new Error(
          `Scan API Error: ${response.status} \nServer says: ${errorText}`
        );
      }

      const data = await response.json();
      console.log("Scan Data Received:", data);

      // The API returns { analysis: [...], all_landmarks: [...] }
      // We only need 'analysis' for the dots.
      if (data.analysis) {
        setScanResult(data.analysis);
      } else {
        setScanResult([]); // Fallback if empty
      }

      setLoadingResults(false);

      // IMMEDIATELLY Start the second API call for the routine
      fetchRoutine(sensitivityAnswer, makeupAnswer);
    } catch (err) {
      console.error("Error in getResults:", err);
      alert("Failed to analyze image: " + err.message);
      setLoadingResults(false);
    }
  }

  return (
    <View style={styles.container}>
      {!photoTaken && (
        <TouchableOpacity
          onPress={() => navigation.replace("MainTabs", { userId: userId })}
          style={styles.arrowContainer}
        >
          <Image
            source={require("../assets/images/arrow.png")}
            style={styles.arrow}
          />
        </TouchableOpacity>
      )}

      {/* Main Visual Area */}
      <View
        style={{ flex: 1, position: "relative" }}
        onLayout={(e) => setImageLayout(e.nativeEvent.layout)}
      >
        {!capturedPhotoDetails ? (
          <CameraView
            style={styles.camera}
            facing={facing}
            ref={cameraRef}
            mirror={true}
          />
        ) : (
          <>
            <Image
              source={capturedPhotoDetails.uri}
              style={styles.capturedPhotoStyle}
              contentFit="cover"
            />

            {/* --- DOT RENDERING LOGIC --- */}
            {scanResult &&
              imageLayout.width > 0 &&
              capturedPhotoDetails &&
              scanResult.map((pt, idx) => {
                const viewW = imageLayout.width;
                const viewH = imageLayout.height;
                const imgW = capturedPhotoDetails.width;
                const imgH = capturedPhotoDetails.height;

                // 1. Calculate Scale (Math.max is for COVER)
                const scale = Math.max(viewW / imgW, viewH / imgH);

                // 2. Rendered Size
                const renderedW = imgW * scale;
                const renderedH = imgH * scale;

                // 3. Offsets
                const offsetX = (renderedW - viewW) / 2;
                const offsetY = (renderedH - viewH) / 2;

                // 4. MIRROR FIX (Flip X)
                const mirroredX = 100 - pt.x;

                // 5. Final Calculation
                const screenX = ((mirroredX / 100) * renderedW) - offsetX;
                const screenY = ((pt.y / 100) * renderedH) - offsetY;

                return (
                  <InfoDot
                    key={idx}
                    x={screenX}
                    y={screenY}
                    title={pt.title}
                    description={pt.description}
                  />
                );
              })}

            {/* --- NEW TOP BANNER (Visible when scan results exist) --- */}
            {scanResult && !loadingResults && (
              <View style={styles.resultBanner}>
                <Text style={styles.bannerTitle}>Your Results Are Ready</Text>
                <Text style={styles.bannerSubtitle}>
                  Click each dot to learn more
                </Text>
              </View>
            )}
          </>
        )}

        {/* FaceOval - Visible ONLY during scanning phase */}
        {!loadingResults && !scanResult && (
          <View style={styles.faceOvalContainer} pointerEvents="none">
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
        )}

        {/* Initial Start Button */}
        {!photoTaken && (
          <View style={styles.buttonContainer}>
            {!startClicked && (
              <TouchableOpacity style={styles.button} onPress={takePhoto}>
                <Text style={styles.text}>Click HERE to start</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      </View>

      {/* --- BOTTOM BOX: HANDLES LOADING -> CONTINUE --- */}

      {/* 1. Loading Routine State */}
      {loadingRoutine && (
        <View style={styles.routineBox}>
          <ActivityIndicator
            size="small"
            color="#5592B8"
            style={{ marginRight: 10 }}
          />
          <Text style={styles.routineBoxText}>Building your routine...</Text>
        </View>
      )}

      {/* 2. Routine Done State */}
      {!loadingRoutine && routineResult && (
        <TouchableOpacity
          style={[styles.routineBox, { backgroundColor: "#FFFFFF" }]}
          onPress={handleContinue}
        >
          <Text style={[styles.routineBoxText, { fontWeight: "700" }]}>
            Click to Continue
          </Text>
        </TouchableOpacity>
      )}

      {/* ... (Modals: Intro & Questionnaire) ... */}
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
            <View style={styles.imageWrapper}>
              <Image
                source={require("../assets/images/instructions.gif")}
                style={styles.modalImage}
                contentFit="cover"
                transition={200}
                recyclingKey="instructions-gif"
                autoplay
                loop
              />
            </View>
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
                onPress={() =>
                  navigation.replace("MainTabs", { userId: userId })
                }
              >
                <Text style={styles.modalButtonNoText}>No</Text>
              </Pressable>
            </View>
          </View>
        </LinearGradient>
      </Modal>

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
                <Text style={styles.sensitivityTitle}>Skin Sensitivity</Text>
                <Text style={styles.sensitivitySubtitle}>
                  How sensitive is your skin to products or external weather
                  conditions?
                </Text>
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
                <View style={styles.sliderLabels}>
                  <Text style={styles.sliderLabel}>Not Sensitive</Text>
                  <Text style={styles.sliderLabel}>Sensitive</Text>
                  <Text style={styles.sliderLabel}>Super Sensitive</Text>
                </View>
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
          transform: [{ translateX: -25 }, { translateY: -25 }],
          zIndex: 20,
        }}
      />

      <LinearGradient
        colors={["#3478A2", "transparent"]}
        start={{ x: 0.5, y: 1 }}
        end={{ x: 0.5, y: 0 }}
        style={styles.bottomGradient}
      />

      {loadingResults && (
        <View style={styles.loadingScreen}>
          <GradientSpinner loading={loadingResults} />
          <View style={{ alignItems: "center", marginTop: 16 }}>
            <Text style={styles.loadingText}>
              Analyzing Your <Text style={styles.bold}>Skin</Text>...
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
  // ... (Other existing styles) ...
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
    lineHeight: 24,
    textAlign: "center",
    letterSpacing: 0.01,
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

  // --- NEW STYLES ---

  // Top Banner Styles
  resultBanner: {
    position: "absolute",
    width: 315,
    height: 82,
    top: 147,
    alignSelf: "center",
    backgroundColor: "rgba(23, 115, 176, 0.36)",
    borderRadius: 9,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
    zIndex: 50,
  },
  bannerTitle: {
    fontFamily: "DM Sans",
    fontStyle: "normal",
    fontWeight: "500",
    fontSize: 24,
    lineHeight: 29,
    textAlign: "center",
    letterSpacing: 0.24,
    color: "#FFFFFF",
    marginBottom: 4,
  },
  bannerSubtitle: {
    fontFamily: "DM Sans",
    fontStyle: "normal",
    fontWeight: "300",
    fontSize: 13,
    lineHeight: 16,
    textAlign: "center",
    letterSpacing: 0.13,
    color: "#FFFFFF",
  },

  // Bottom Box Styles
  routineBox: {
    position: "absolute",
    bottom: 50,
    alignSelf: "center",
    width: 332,
    height: 59,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3.84,
    elevation: 5,
  },
  routineBoxText: {
    fontFamily: "DM Sans",
    fontSize: 14,
    color: "#2D3648",
  },

  // ... (Modal Styles unchanged) ...
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
  imageWrapper: {
    width: 200,
    height: 300,
    overflow: "hidden",
    alignSelf: "center",
  },
  modalImage: {
    width: 200,
    height: 400,
    top: -80,
    position: "absolute",
    resizeMode: "cover",
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
    height: 250,
  },
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
  },
  sliderLabel: {
    fontFamily: "DM Sans",
    fontSize: 11,
    fontWeight: "300",
    color: "#A0A0A0",
    textAlign: "center",
    width: "33%",
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
  radioGroup: {
    marginTop: 30,
    width: "100%",
    paddingHorizontal: 40,
    gap: 16,
  },
  radioRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  radioCircle: {
    width: 16,
    height: 16,
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
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#5592B8",
  },
  radioLabel: {
    fontFamily: "DM Sans",
    fontStyle: "normal",
    fontWeight: "300",
    fontSize: 14,
    lineHeight: 16,
    letterSpacing: 0.01,
    color: "#A0A0A0",
  },
  radioLabelSelected: {
    color: "#2D3648",
    fontWeight: "500",
  },
  modalStep2Buttons: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 12,
    width: "100%",
    marginTop: 40,
  },
  backButton: {
    width: 78,
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
    lineHeight: 17,
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
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 100,
  },
  loadingText: {
    width: 294,
    height: 58,
    fontFamily: "Archivo",
    fontStyle: "normal",
    fontWeight: "400",
    fontSize: 24,
    lineHeight: 29,
    textAlign: "center",
    letterSpacing: 0.01 * 24,
    color: "#000000",
    alignSelf: "center",
    marginTop: 30,
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
