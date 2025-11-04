import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Image, StyleSheet, TouchableOpacity, View } from "react-native";
import CameraPageScreen from "../screens/FaceScanScreen";
import HomePageScreen from "../screens/HomePageScreen";
import ProfilePageScreen from "../screens/ProfilePageScreen";
import ShoppingPageScreen from "../screens/ShoppingPageScreen";

import homepageicon from "../assets/images/homepageicon.png";
import homepageiconFilled from "../assets/images/homepageiconFilled.png";

import camerapageicon from "../assets/images/camerapageicon.png";
import camerapageiconFilled from "../assets/images/camerapageiconFilled.png";

import shoppingpageicon from "../assets/images/shoppingpageicon.png";
import shoppingpageiconFilled from "../assets/images/shoppingpageiconFilled.png";

import profilepageicon from "../assets/images/profilepageicon.png";
import profilepageiconFilled from "../assets/images/profilepageiconFilled.png";


const Tab = createBottomTabNavigator();
const TAB_WIDTH = 351;

export default function MyTabs(route) {
  const userId = route.params
   if (!userId) {
    console.warn("userId not found in MyTabs route params!");
  }

  return (
    <Tab.Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName="ShoppingPageScreen"
      tabBar={(props) => <CustomTabBar {...props} />}
    >
      <Tab.Screen
        name="HomePageScreen"
        component={HomePageScreen}
        initialParams={{ userId }} 
      />
      <Tab.Screen
        name="CameraPageScreen"
        component={CameraPageScreen}
        initialParams={{ userId }}
      />
      <Tab.Screen
        name="ShoppingPageScreen"
        component={ShoppingPageScreen}
        initialParams={{ userId }}
      />
      <Tab.Screen
        name="ProfilePageScreen"
        component={ProfilePageScreen}
        initialParams={{ userId }}
      />
    </Tab.Navigator>
  );
}

function CustomTabBar({ state, descriptors, navigation }) {
  const routeName = state.routes[state.index].name;
  if (routeName === "CameraPageScreen") return null;

  const icons = {
    HomePageScreen: {
      filled: homepageiconFilled,
      outline: homepageicon,
    },
    CameraPageScreen: {
      filled: camerapageiconFilled,
      outline: camerapageicon,
    },
    ShoppingPageScreen: {
      filled: shoppingpageiconFilled,
      outline: shoppingpageicon,
    },
    ProfilePageScreen: {
      filled: profilepageiconFilled,
      outline: profilepageicon,
    },
  };

  return (
    <View style={styles.tabBarContainer}>
      {state.routes.map((route, index) => {
        const isFocused = state.index === index;
        const iconSource = isFocused
          ? icons[route.name].filled
          : icons[route.name].outline;

        return (
          <TouchableOpacity
            key={route.key}
            onPress={() => navigation.navigate(route.name)}
            style={styles.tabButton}
          >
            <Image
              source={iconSource}
              style={{ width: 24, height: 24 }}
              resizeMode="contain"
            />
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  tabBarContainer: {
    position: "absolute",
    bottom: 35,
    width: TAB_WIDTH,
    height: 46,
    backgroundColor: "#FFFFFF",
    borderRadius: 100,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    alignSelf: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  tabButton: {
    flex: 1,
    alignItems: "center",
  },
});
