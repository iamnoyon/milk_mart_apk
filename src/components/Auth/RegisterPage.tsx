import React, { useState } from "react";
import {
  Text,
  TextInput,
  Pressable,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import DropDownPicker from "react-native-dropdown-picker";
import { router } from "expo-router";

export default function RegisterPage() {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    area: "",
    avenue: "",
    road: "",
    house: "",
    flat: "",
  });

  // Area dropdown
  const [areaOpen, setAreaOpen] = useState(false);
  const [areaItems, setAreaItems] = useState([
    { label: "Mirpur", value: "mirpur" },
    { label: "Dhanmondi", value: "dhanmondi" },
    { label: "Uttara", value: "uttara" },
    { label: "Mohammadpur", value: "mohammadpur" },
    { label: "Gulshan", value: "gulshan" },
  ]);

  // Avenue dropdown
  const [avenueOpen, setAvenueOpen] = useState(false);
  const [avenueItems, setAvenueItems] = useState([
    { label: "A", value: "A" },
    { label: "B", value: "B" },
    { label: "C", value: "C" },
    { label: "D", value: "D" },
  ]);

  const handleChange = (field: keyof typeof form, value: string) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleRegister = () => {
    console.log("Registration Data:", form);
    router.push({ pathname: "/otp-verify", params: { phone: form.phone } });
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
            paddingHorizontal: 24,
            paddingVertical: 30,
            paddingBottom: 40,
          }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <Text
            style={{
              fontSize: 30,
              fontWeight: "600",
              color: "#237223",
              marginBottom: 25,
            }}
          >
            Create Account
          </Text>

          {/* Name */}
          <Text style={labelStyle}>Full Name</Text>

          <TextInput
            value={form.name}
            onChangeText={(value) => handleChange("name", value)}
            placeholder="e.g. Mr. John"
            placeholderTextColor="#999"
            style={inputStyle}
          />

          {/* Phone */}
          <Text style={labelStyle}>Phone Number</Text>

          <TextInput
            value={form.phone}
            onChangeText={(value) => handleChange("phone", value)}
            placeholder="01889010237"
            placeholderTextColor="#999"
            keyboardType="phone-pad"
            autoComplete="tel"
            style={inputStyle}
          />

          {/* Area */}
          <Text style={labelStyle}>Area</Text>

          <DropDownPicker
            open={areaOpen}
            value={form.area || null}
            items={areaItems}
            setOpen={(open) => {
              setAreaOpen(open);

              // Close Avenue when Area opens
              if (open) {
                setAvenueOpen(false);
              }
            }}
            setValue={(callback) => {
              const value =
                typeof callback === "function"
                  ? callback(form.area || null)
                  : callback;

              handleChange("area", value || "");

              // Reset avenue when area changes
              handleChange("avenue", "");
            }}
            setItems={setAreaItems}
            placeholder="Select area"
            listMode="SCROLLVIEW"
            style={dropdownStyle}
            dropDownContainerStyle={dropdownContainerStyle}
            textStyle={dropdownTextStyle}
            placeholderStyle={dropdownPlaceholderStyle}
            zIndex={3000}
            zIndexInverse={1000}
          />

          {/* Road + Avenue */}
          <View
            style={{
              flexDirection: "row",
              gap: 12,
              marginTop: 18,
              zIndex: 2000,
            }}
          >
            {/* Road */}
            <View style={{ flex: 1 }}>
              <Text style={labelStyle}>Road</Text>

              <TextInput
                value={form.road}
                onChangeText={(value) => handleChange("road", value)}
                placeholder="e.g. 10"
                placeholderTextColor="#999"
                keyboardType="numeric"
                style={inputStyle}
              />
            </View>

            {/* Avenue */}
            <View
              style={{
                flex: 1,
                zIndex: 2000,
              }}
            >
              <Text style={labelStyle}>Avenue</Text>

              <DropDownPicker
                open={avenueOpen}
                value={form.avenue || null}
                items={avenueItems}
                disabled={!form.area}
                setOpen={(open) => {
                  setAvenueOpen(open);

                  // Close Area when Avenue opens
                  if (open) {
                    setAreaOpen(false);
                  }
                }}
                setValue={(callback) => {
                  const value =
                    typeof callback === "function"
                      ? callback(form.avenue || null)
                      : callback;

                  handleChange("avenue", value || "");
                }}
                setItems={setAvenueItems}
                placeholder={
                  form.area ? "Select avenue" : "Select area first"
                }
                listMode="SCROLLVIEW"
                style={dropdownStyle}
                dropDownContainerStyle={dropdownContainerStyle}
                textStyle={dropdownTextStyle}
                placeholderStyle={dropdownPlaceholderStyle}
                disabledStyle={{
                  backgroundColor: "#F5F5F5",
                  borderColor: "#E0E0E0",
                }}
                zIndex={2000}
                zIndexInverse={2000}
              />
            </View>
          </View>

          {/* House + Flat */}
          <View
            style={{
              flexDirection: "row",
              gap: 12,            }}
          >
            {/* House */}
            <View style={{ flex: 1 }}>
              <Text style={labelStyle}>House</Text>

              <TextInput
                value={form.house}
                onChangeText={(value) => handleChange("house", value)}
                placeholder="e.g. 1240"
                placeholderTextColor="#999"
                keyboardType="numeric"
                style={inputStyle}
              />
            </View>

            {/* Flat */}
            <View style={{ flex: 1 }}>
              <Text style={labelStyle}>Flat</Text>

              <TextInput
                value={form.flat}
                onChangeText={(value) => handleChange("flat", value)}
                placeholder="e.g. B10"
                placeholderTextColor="#999"
                style={inputStyle}
              />
            </View>
          </View>

          {/* Register */}
          <Pressable
            onPress={handleRegister}
            style={({ pressed }) => ({
              height: 55,
              marginTop: 10,
              marginBottom: 20,
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
              Create Account
            </Text>
          </Pressable>

          {/* Login */}
          <Text
            style={{
              textAlign: "center",
              fontSize: 15,
              color: "#666",
            }}
          >
            Already have an account?{" "}
            <Text
              onPress={() => router.push("/login")}
              style={{
                color: "#6E9620",
                fontWeight: "700",
              }}
            >
              Login
            </Text>
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

/* =========================
   Styles
========================= */

const labelStyle = {
  fontSize: 15,
  fontWeight: "600" as const,
  color: "#333",
  marginBottom: 8,
};

const inputStyle = {
  height: 55,
  borderWidth: 1,
  borderColor: "#D5D5D5",
  borderRadius: 10,
  paddingHorizontal: 16,
  fontSize: 16,
  color: "#222",
  backgroundColor: "#FFF",
  marginBottom: 14,
};

const dropdownStyle = {
  height: 55,
  minHeight: 55,
  borderWidth: 1,
  borderColor: "#D5D5D5",
  borderRadius: 10,
  paddingHorizontal: 16,
  backgroundColor: "#FFF",
};

const dropdownContainerStyle = {
  borderWidth: 1,
  borderColor: "#D5D5D5",
  borderRadius: 10,
  backgroundColor: "#FFF",
};

const dropdownTextStyle = {
  fontSize: 16,
  color: "#222",
};

const dropdownPlaceholderStyle = {
  fontSize: 16,
  color: "#999",
};