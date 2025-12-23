import React from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { ToastProvider } from "react-native-toast-notifications";
import LoginScreen from "./src/screens/LoginScreen";
import GrowerProfileScreen from "./src/screens/GrowerProfileScreen";
import GrowerLandDetails from "./src/screens/GrowerLandDetails";
import FieldOverseer from "./src/screens/FieldOverseer";
import GenerateSlip from "./src/screens/GenerateSlip";
import MeasureTool from "./src/screens/MapViewScreen";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import AdminScreen from "./src/screens/AdminScreen";
import LogoutButton from "./src/components/LogOutButton";

const Stack = createStackNavigator();

export default function App() {
  return (
    <ToastProvider
      placement="top"
      offsetTop={30}
      swipeEnabled={true}
      textStyle={{ fontSize: 16 }}
      renderType={{
        custom: (toast) => (
          <View style={{ padding: 15 }}>
            <Text>{toast.message}</Text>
          </View>
        ),
      }}
    >
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Login"
          screenOptions={{
            contentStyle: styles.screenBackground, // ✅ Apply sky-blue background globally
            headerTitleStyle: styles.headerTitle,
          }}
        >
          <Stack.Screen name="Login" component={LoginScreen}  options={{
        title: "Login/लॉग इन",
        headerStyle: { backgroundColor: "#2E7D32" },   // 👈 background color
        headerTintColor: "#fff",                      // 👈 title & icon color
        headerTitleStyle: { fontSize: 20, fontWeight: "600" },
    }} />
          {/*

          <Stack.Screen
            name="GrowerProfile"
            component={GrowerProfileScreen}
            options={({ navigation }) => ({
              title: "Grower Profile/ग्रोवर नोंदणी",
               headerStyle: { backgroundColor: "#2E7D32" },   // 👈 background color
               headerTintColor: "#fff",                      // 👈 title & icon color
             headerTitleStyle: { fontSize: 20, fontWeight: "600" },                   // 👈 title & icon color
              headerLeft: () => (
                <TouchableOpacity
                  onPress={() => navigation.goBack()}
                  style={styles.headerLeftContainer}
                >
                  <FontAwesome6 name="chevron-left" size={24} color="#FFFAF0" />
                </TouchableOpacity>
              ),
              headerRight: () => <LogoutButton navigation={navigation} />,
            })}
          />
          

          <Stack.Screen
            name="GrowerLandDetails"
            component={GrowerLandDetails}
            options={({ navigation }) => ({
              title: "Grower Land Details/शेती नोंद",
              headerStyle: { backgroundColor: "#2E7D32" },   // 👈 background color
             headerTintColor: "#fff",                      // 👈 title & icon color
             headerTitleStyle: { fontSize: 20, fontWeight: "600" },
              headerLeft: () => (
                <TouchableOpacity
                  onPress={() => navigation.goBack()}
                  style={styles.headerLeftContainer}
                >
                  <FontAwesome6 name="chevron-left" size={24} color="#FFFAF0" />
                </TouchableOpacity>
              ),
              headerRight: () => <LogoutButton navigation={navigation} />,
            })}
          />
      */}
          <Stack.Screen
            name="FieldOverseer"
            component={FieldOverseer}
            options={({ navigation }) => ({
              title: "Field Overseer Details",
              headerStyle: { backgroundColor: "#2E7D32" },   // 👈 background color
              headerTintColor: "#fff",                      // 👈 title & icon color
              headerTitleStyle: { fontSize: 20, fontWeight: "600" },
              headerLeft: () => (
                <TouchableOpacity
                  onPress={() => navigation.goBack()}
                  style={styles.headerLeftContainer}
                >
                  <FontAwesome6 name="chevron-left" size={24} color="#FFFAF0" />
                </TouchableOpacity>
              ),
              headerRight: () => <LogoutButton navigation={navigation} />,
            })}
          />

          <Stack.Screen
            name="GenerateSlip"
            component={GenerateSlip}
            options={({ navigation }) => ({
              title: "Generate Slip",
              headerStyle: { backgroundColor: "#2E7D32" },   // 👈 background color
              headerTintColor: "#fff",                      // 👈 title & icon color
              headerTitleStyle: { fontSize: 20, fontWeight: "600" },
              headerLeft: () => (
                <TouchableOpacity
                  onPress={() => navigation.goBack()}
                  style={styles.headerLeftContainer}
                >
                  <FontAwesome6 name="chevron-left" size={24} color="#FFFAF0" />
                </TouchableOpacity>
              ),
              headerRight: () => <LogoutButton navigation={navigation} />,
            })}
          />

          <Stack.Screen
            name="MeasureTool"
            component={MeasureTool}
            options={({ navigation }) => ({
              title: "Google Earth View",
              headerStyle: { backgroundColor: "#2E7D32" },   // 👈 background color
              headerTintColor: "#fff",                      // 👈 title & icon color
              headerTitleStyle: { fontSize: 20, fontWeight: "600" },
              unmountOnBlur: false,
              headerLeft: () => (
                <TouchableOpacity
                  onPress={() => navigation.goBack()}
                  style={styles.headerLeftContainer}
                >
                  <FontAwesome6 name="chevron-left" size={24} color="#FFFAF0" />
                </TouchableOpacity>
              ),
              headerRight: () => <LogoutButton navigation={navigation} />,
            })}
          />

          <Stack.Screen
            name="Admin"
            component={AdminScreen}
            options={({ navigation }) => ({
              title: "Admin Dashboard",
              headerStyle: { backgroundColor: "#2E7D32" },   // 👈 background color
              headerTintColor: "#fff",                      // 👈 title & icon color
              headerTitleStyle: { fontSize: 20, fontWeight: "600" },
              headerLeft: () => (
                <TouchableOpacity
                  onPress={() => navigation.goBack()}
                  style={styles.headerLeftContainer}
                >
                  <FontAwesome6 name="chevron-left" size={24} color="#FFFAF0" />
                </TouchableOpacity>
              ),
              headerRight: () => <LogoutButton navigation={navigation} />,
            })}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </ToastProvider>
  );
}

const styles = StyleSheet.create({
  headerTitle: {
    marginTop: -4,
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  headerLeftContainer: {
    paddingHorizontal: 8,
    paddingVertical: 5,
    margin: 8,
  },
  // ✅ Sky-blue background applied globally
  screenBackground: {
    flex: 1,
    backgroundColor: "skyblue",
  },
});
