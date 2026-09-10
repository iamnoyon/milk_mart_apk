import { Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function CartTab() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FEFEFE" }}>
      <Text
        style={{
          fontSize: 24,
          fontWeight: "bold",
          textAlign: "center",
          marginTop: 20,
        }}
      >
        Cart
      </Text>
    </SafeAreaView>
  );
}
