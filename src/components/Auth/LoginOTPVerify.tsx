import { useUserLoginOTPVerifyMutation } from "@/store/auth";
import { saveToken } from "@/utils/authStorage";
import { Image } from "expo-image";
import { router } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Text,
  TextInput,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  View,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";

interface VerifyOtpPageProps {
    phone?: string;
    onVerify?: (otp: string) => void;
    onResend?: () => void;
}

export default function VerifyOtpPage({
    phone = "",
    onVerify,
    onResend,
}: VerifyOtpPageProps) {
    const [otp, setOtp] = useState(["", "", "", "", ""]);
    const [resendTimer, setResendTimer] = useState(120);

    // API
    const [Login, {data: loginRes, isLoading}] = useUserLoginOTPVerifyMutation();

    const inputRefs = useRef<(TextInput | null)[]>([]);

    useEffect(() => {
        if (resendTimer <= 0) return;

        const timer = setInterval(() => {
            setResendTimer((prev) => prev - 1);
        }, 1000);

        return () => clearInterval(timer);
    }, [resendTimer]);

    const handleChange = (value: string, index: number) => {
        // Only allow numbers
        const digit = value.replace(/[^0-9]/g, "").slice(-1);

        const newOtp = [...otp];
        newOtp[index] = digit;

        setOtp(newOtp);

        // Move to next input
        if (digit && index < otp.length - 1) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyPress = (
        key: string,
        index: number
    ) => {
        if (key === "Backspace" && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handleVerify = () => {
        const otpValue = otp.join("");

        Login({ phone, otp: otpValue })
        .unwrap()
        .then(async (res) => {
            console.log("OTP verification successful:", res);
            if(res?.status_code === 200 || res?.success) {
                await saveToken(res?.token);
                router.push("/home");
                Toast.show({
                type: 'success',
                text1: 'OTP Verified!',
                text2: 'User LoggedIn successfull!'
            })
            }
            onVerify?.(otpValue);
        })
        .catch((error) => {
            Toast.show({
                type: 'error',
                text1: 'Faild OTP verification!',
                text2: error?.data?.detail
            })
            console.log("OTP verification failed:", error);
            // Handle error (e.g., show a message to the user)
        });
        onVerify?.(otpValue);
    };

    const handleResend = () => {
        if (resendTimer > 0) {
            return;
        }

        setOtp(["", "", "", "", ""]);
        setResendTimer(60);

        inputRefs.current[0]?.focus();

        onResend?.();
    };

    const isComplete = otp.every((digit) => digit !== "");

    return (
        <SafeAreaView
            style={{
                flex: 1,
                backgroundColor: "#FEFEFE",
            }}
        >
            <KeyboardAvoidingView
                style={{
                    flex: 1,
                }}
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
                    <View style={{ alignItems: "center", marginBottom: 10 }}>

                        <Image
                            source={require("@/assets/images/welcome.webp")}
                            style={{
                                width: 200,
                                height: 200,
                            }}
                        />
                    </View>
                    {/* Header */}
                    {/* <Text
                        style={{
                            fontSize: 30,
                            fontWeight: "700",
                            color: "#237223",
                            marginBottom: 8,
                        }}
                    >
                        Verify OTP
                    </Text> */}

                    <Text
                        style={{
                            fontSize: 16,
                            color: "#666",
                            lineHeight: 24,
                            marginBottom: 8,
                        }}
                    >
                        Enter the 5-digit verification code
                    </Text>

                    {phone ? (
                        <Text
                            style={{
                                fontSize: 15,
                                color: "#666",
                                marginBottom: 30,
                            }}
                        >
                            We sent a code to{" "}
                            <Text
                                style={{
                                    color: "#222",
                                    fontWeight: "600",
                                }}
                            >
                                {phone}
                            </Text>
                        </Text>
                    ) : (
                        <View style={{ marginBottom: 30 }} />
                    )}

                    {/* OTP Inputs */}
                    <View
                        style={{
                            flexDirection: "row",
                            justifyContent: "space-between",
                            marginBottom: 30,
                        }}
                    >
                        {otp.map((digit, index) => (
                            <TextInput
                                key={index}
                                ref={(ref) => {
                                    inputRefs.current[index] = ref;
                                }}
                                value={digit}
                                onChangeText={(value) =>
                                    handleChange(value, index)
                                }
                                onKeyPress={({ nativeEvent }) =>
                                    handleKeyPress(nativeEvent.key, index)
                                }
                                keyboardType="number-pad"
                                maxLength={1}
                                selectTextOnFocus
                                textAlign="center"
                                style={{
                                    width: 55,
                                    height: 58,
                                    borderWidth: 1,
                                    borderColor: digit
                                        ? "#6E9620"
                                        : "#D5D5D5",
                                    borderRadius: 10,
                                    fontSize: 24,
                                    fontWeight: "600",
                                    color: "#222",
                                    backgroundColor: "#FFF",
                                }}
                            />
                        ))}
                    </View>

                    {/* Verify Button */}
                    <Pressable
                        onPress={handleVerify}
                        disabled={!isComplete || isLoading}
                        style={({ pressed }) => ({
                            height: 55,
                            borderRadius: 10,
                            backgroundColor: !isComplete || isLoading
                                ? "#C8D5A8"
                                : pressed
                                    ? "#82A83A"
                                    : "#6E9620",
                            justifyContent: "center",
                            alignItems: "center",
                            opacity: pressed && isComplete ? 0.9 : 1,
                        })}
                    >
                        <Text
                            style={{
                                color: "#FFF",
                                fontSize: 17,
                                fontWeight: "600",
                            }}
                        >
                            {isLoading ? "Verifying..." : "Verify OTP"}
                        </Text>
                    </Pressable>

                    {/* Resend OTP */}
                    <View
                        style={{
                            marginTop: 22,
                            alignItems: "center",
                        }}
                    >
                        <Text
                            style={{
                                fontSize: 15,
                                color: "#666",
                            }}
                        >
                            Didn't receive the code?{" "}
                            <Text
                                onPress={handleResend}
                                style={{
                                    color:
                                        resendTimer > 0
                                            ? "#999"
                                            : "#6E9620",
                                    fontWeight: "700",
                                }}
                            >
                                Resend OTP
                            </Text>
                        </Text>

                        {/* Timer */}
                        {resendTimer > 0 && (
                            <Text
                                style={{
                                    marginTop: 8,
                                    fontSize: 14,
                                    color: "#888",
                                }}
                            >
                                Resend available in {resendTimer}s
                            </Text>
                        )}
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}