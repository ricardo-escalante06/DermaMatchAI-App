import * as FileSystem from "expo-file-system/legacy";
import { supabase } from "../supabase/supabaseClient";

/**
 * Uploads a local photo to Supabase Storage
 * @param {string} photoUri - Local file URI (from camera or gallery)
 * @returns {string} public URL of uploaded photo
 */
export async function uploadPhotoToStorage(photoUri) {
  try {
    // Get the current user
    const { data: { session } } = await supabase.auth.getSession();
    const userId = session?.user?.id;
    if (!userId) throw new Error("No user session found");

    // Create a unique filename
    const fileName = `user-${userId}/photo-${Date.now()}.jpg`;

    // Read local file as Base64
    const fileBase64 = await FileSystem.readAsStringAsync(photoUri, {
      encoding: "base64",
    });

    // Upload to Supabase storage
    const { data, error } = await supabase.storage
      .from("scan-images")
      .upload(fileName, fileBase64, {
        contentType: "image/jpeg",
        upsert: true,
        base64: true,
      });

    if (error) throw error;

    // Get public URL
    const { publicUrl, error: urlError } = supabase.storage
      .from("scan-images")
      .getPublicUrl(fileName);

    if (urlError) throw urlError;

    return publicUrl;
  } catch (err) {
    console.error("Failed to upload photo:", err);
    throw err;
  }
}

/**
 * Saves a scan along with products
 * @param {string} localPhotoUri - Local file URI for the scan photo
 * @param {Array} products - Array of product objects
 * @returns {Object} { scan: ..., products: ... }
 */
export async function saveScanWithProducts(localPhotoUri, products) {
  try {
    // Get current user
    const { data: { session } } = await supabase.auth.getSession();
    const userId = session?.user?.id;
    if (!userId) throw new Error("No user session found");

    // 1️⃣ Upload scan photo
    const scan_image_url = await uploadPhotoToStorage(localPhotoUri);

    // 2️⃣ Insert scan into 'scans' table
    const { data: scanData, error: scanError } = await supabase
      .from("scans")
      .insert([{ user_id: userId, scan_image_url }])
      .select()
      .single();

    if (scanError) throw scanError;

    const scanId = scanData.id; // scan row ID

    // 3️⃣ Insert products into 'products' table
    const productsToInsert = products.map((p) => ({
      ...p,
      user_id: userId,
      scan_id: scanId,
      image_url: p.imageUrl, // directly use URL
    }));

    const { data: productData, error: productError } = await supabase
      .from("products")
      .insert(productsToInsert)
      .select();

    if (productError) throw productError;

    return { scan: scanData, products: productData };
  } catch (err) {
    console.error("Failed to save scan and products:", err);
    throw err;
  }
}
