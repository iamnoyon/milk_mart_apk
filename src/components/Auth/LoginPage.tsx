import { useResendOTPForRegisterdUserToLoginMutation } from "@/store/auth";
import { Image } from "expo-image";
import { router } from "expo-router";
import React, { useState } from "react";
import { Text, TextInput, Pressable, View, ScrollView, KeyboardAvoidingView, Platform, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";

export default function LoginPage() {
    const [phone, setPhone] = useState("");

    const [ResendOTP] = useResendOTPForRegisterdUserToLoginMutation()

    const handlePhoneChange = (value: string) => {
        const digitsOnly = value.replace(/\D/g, "");
        if (digitsOnly.length <= 11) {
            setPhone(digitsOnly);
        }
    };

    const handleSendOTP = () => {
        if (!phone) {
            Alert.alert("Validation Error", "Please enter your phone number.");
            return;
        }

        if (!/^01\d{9}$/.test(phone)) {
            Alert.alert(
                "Invalid Phone Number",
                "Phone number must be exactly 11 digits and start with 01.\n\nExample: 01889010237"
            );
            return;
        }

        console.log("Phone:", phone);
        ResendOTP({ phone: phone })
            .unwrap()
            .then((res) => {
                if (res?.status_code === 200 || res?.success) {
                    router.push({ pathname: "/otp-verify", params: { phone: phone } });
                }
            })
            .catch((error) => {
                Toast.show({
                    type: "error",
                    text1: "Login failed",
                    text2: error?.data?.detail,
                });
                if(error?.status == 404){
                    router.push('/register')
                }
            });
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
                        Phone Number <Text style={{ color: "red" }}>*</Text>
                    </Text>

                    <TextInput
                        value={phone}
                        onChangeText={handlePhoneChange}
                        placeholder="01889010237"
                        placeholderTextColor="#999"
                        keyboardType="phone-pad"
                        autoComplete="tel"
                        maxLength={11}
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

                    <Text
                        style={{
                            fontSize: 12,
                            color: "#777",
                            marginTop: 8,
                            marginBottom: 14,
                        }}
                    >
                        Enter an 11-digit mobile number starting with 01
                    </Text>

                    {/* Send OTP Button */}
                    <Pressable
                        onPress={handleSendOTP}
                        disabled={phone.length !== 11}
                        style={({ pressed }) => ({
                            height: 55,

                            marginTop: 20,
                            borderRadius: 10,
                            backgroundColor: pressed ? "#82A83A" : "#6E9620",
                            justifyContent: "center",
                            alignItems: "center",
                            opacity: pressed || phone.length !== 11 ? 0.5 : 1
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