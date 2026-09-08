import { Image } from "expo-image";
import { router } from "expo-router";
import React, { useState } from "react";
import { Text, TextInput, Pressable, View, ScrollView, KeyboardAvoidingView, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function LoginPage() {
    const [phone, setPhone] = useState("");

    const handleSendOTP = () => {
        console.log("Phone:", phone);
        router.push({ pathname: "/otp-verify", params: { phone: phone } });

    };

    return (
        <SafeAreaView
            style={{
                flex: 1,
                backgroundColor: "#FEFEFE",
            }}
        >
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === "ios" ? "padding" : undefined}
            >
                <ScrollView
                    contentContainerStyle={{
                        flexGrow: 1,
                        paddingHorizontal: 24,
                        paddingTop: 40,
                        paddingBottom: 40,
                    }}
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                >
                    <View style={{ alignItems: "center", marginBottom: 30 }}>
                        <Image
                            source={require("@/assets/images/welcome.jpeg")}
                            style={{
                                width: 200,
                                height: 200,
                            }}
                        />
                    </View>

                    {/* Phone Input */}
                    <Text
                        style={{
                            fontSize: 15,
                            fontWeight: "600",
                            color: "#333",
                            marginBottom: 8,
                        }}
                    >
                        Phone Number
                    </Text>

                    <TextInput
                        value={phone}
                        onChangeText={setPhone}
                        placeholder="Enter phone number"
                        placeholderTextColor="#999"
                        keyboardType="phone-pad"
                        autoComplete="tel"
                        style={{
                            height: 55,
                            borderWidth: 1,
                            borderColor: "#D5D5D5",
                            borderRadius: 10,
                            paddingHorizontal: 16,
                            fontSize: 16,
                            color: "#222",
                            backgroundColor: "#FFF",
                        }}
                    />

                    {/* Send OTP Button */}
                    <Pressable
                        onPress={handleSendOTP}
                        style={({ pressed }) => ({
                            height: 55,
                            marginTop: 20,
                            borderRadius: 10,
                            backgroundColor: pressed ? "#82A83A" : "#6E9620",
                            justifyContent: "center",
                            alignItems: "center",
                            opacity: pressed ? 0.9 : 1,
                        })}
                    >
                        <Text
                            style={{
                                color: "#FFF",
                                fontSize: 17,
                                fontWeight: "600",
                            }}
                        >
                            Send OTP
                        </Text>
                    </Pressable>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}