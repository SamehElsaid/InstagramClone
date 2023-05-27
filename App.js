import { ActivityIndicator, StatusBar, Text, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "./screens/HomeScreen";
import { Provider } from "react-redux";
import store from "./Redux/Store";
import NewPostScreen from "./screens/NewPostScreen";
import { SafeAreaProvider } from "react-native-safe-area-context";
import LoginScreen from "./screens/LoginScreen";
import SingUp from "./screens/SingUp";
import Toast from "react-native-toast-message";
import GetUser from "./components/GetUser";
import { useState } from "react";
import AccountUser from "./screens/AccountUser";
import Messages from "./screens/Messages";
import CustomMessage from "./screens/CustomMessage";

const Stack = createNativeStackNavigator();

function App() {
  const [loading, setLoading] = useState(false);

  return (
    <SafeAreaProvider style={{ backgroundColor: "black" }}>
      <Provider store={store}>
        {loading && (
          <View className="absolute || w-full || h-full || bg-black || z-10 || flex-row || justify-center || items-center">
            <ActivityIndicator size="large" color="white" />
          </View>
        )}
        <NavigationContainer>
          <GetUser loading={loading} setLoading={setLoading} />
          <StatusBar backgroundColor="black" barStyle={"light-content"} />
          <Stack.Navigator
            initialRouteName="Login"
            screenOptions={{
              headerShown: false,
            }}
          >
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="NewPostScreen" component={NewPostScreen} />
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="SingUp" component={SingUp} />
            <Stack.Screen name="AccountUser" component={AccountUser} />
            <Stack.Screen name="Messages" component={Messages} />
            <Stack.Screen name="CustomMessage" component={CustomMessage} />
          </Stack.Navigator>
        </NavigationContainer>
        <Toast />
      </Provider>
    </SafeAreaProvider>
  );
}

export default App;
