import { Pressable, Text } from "react-native";
import React, { Component } from "react";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { Image } from "expo-image";
import { router } from "expo-router";

export class WelcomePage extends Component {
  render() {
    return (
      <SafeAreaProvider>
        <SafeAreaView
          style={{
            backgroundColor: "#FEFEFE",
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Image
            source={require("@/assets/images/welcome.webp")}
            style={{
              width: 300,
              height: 300,
            }}
          />

          {/* Get Started */}
          <Pressable
            style={({ pressed }) => ({
              backgroundColor: pressed ? "#82a83a" : "#6e9620",
              paddingVertical: 14,
              paddingHorizontal: 94,
              borderRadius: 10,
              alignItems: "center",
              opacity: pressed ? 0.9 : 1,
              marginTop: 20,
            })}
            onPress={() => {
              router.push("/register");
            }}
          >
            <Text
              style={{
                color: "#FFFFFF",
                fontSize: 20,
                fontWeight: "600",
              }}
            >
              Get Started
            </Text>
          </Pressable>

          {/* Login Link */}
          <Text
            style={{
              marginTop: 18,
              fontSize: 15,
              color: "#666666",
            }}
          >
            Already have an account?{" "}
            <Text
              onPress={() => {
                router.push("/login");
              }}
              style={{
                color: "#6e9620",
                fontWeight: "700",
              }}
            >
              Login
            </Text>
          </Text>
        </SafeAreaView>
      </SafeAreaProvider>
    );
  }
}

export default WelcomePage;