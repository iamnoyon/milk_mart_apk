import { Text, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { usePullToRefresh } from "@/hooks/use-pull-to-refresh";

export default function OrdersTab() {
  const { refreshControl } = usePullToRefresh();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FEFEFE" }}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ flexGrow: 1 }}
        refreshControl={refreshControl}
      >
        <Text
          style={{
            fontSize: 24,
            fontWeight: "bold",
            textAlign: "center",
            marginTop: 20,
          }}
        >
          Orders
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}
