import { supabase } from "./supabaseClient";

async function getToken() {
  const { data, error } = await supabase.auth.getSession();
  if (error) throw error;
  if (!data.session) throw new Error("No active session");

  const token = data.session.access_token;
  return token;
}

// Signup function
export async function signUpUser(name, email, password) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { full_name: name } },
  });
  return { data, error };
}

// Login function
export async function loginUser(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  return { data, error };
}

// Get User
export async function getUser() {
  const { data, error } = await supabase.auth.getUser();
  return { data, error };
}

// add user if not exists
export async function addNewUser() {
  try {
    // get current logged-in user
    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError) throw userError;
    if (!userData?.user) throw new Error("No user logged in");

    const user = userData.user;

    const { data: existingProfile } = await supabase
      .from("profiles")
      .select()
      .eq("user_id", user.id)
      .single();

    if (!existingProfile) {
      const { data, error } = await supabase
        .from("profiles")
        .insert({
          user_id: user.id,
          name: user.user_metadata?.full_name || "",
        })
        .select();

      if (error) throw error;
      // console.log("Profile created:", data);
    } else {
      // console.log("Profile already exists:", existingProfile);
    }
  } catch (err) {
    console.error("Failed to add user:", err);
  }
}

