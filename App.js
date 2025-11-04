import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import FaceScanScreen from "./screens/FaceScanScreen";
// import FaceScanScreen from "./components/FaceScanOverlay";
import HomeScreen from "./screens/HomeScreen";
import LoginScreen from "./screens/LoginScreen";
import PastScansScreen from "./screens/PastScansScreen";
import SignUpScreen from "./screens/SignUpScreen";

import FullRoutine from "./screens/FullRoutine";
import ViewScanScreen from "./screens/ViewScanScreen";


import myTabs from "./navigation/myTabs";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="SignUp"
          component={SignUpScreen}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="Face Scan"
          component={FaceScanScreen}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="Past Scans"
          component={PastScansScreen}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="View Scan"
          component={ViewScanScreen}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="Full Routine"
          component={FullRoutine}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="MainTabs"
          component={myTabs}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
