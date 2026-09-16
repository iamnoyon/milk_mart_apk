import { Text, Pressable, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { useAuth } from "@/components/Auth/AuthProvider";
import { usePullToRefresh } from "@/hooks/use-pull-to-refresh";

export default function ProfileTab() {
  const { logout } = useAuth();
  const { refreshControl } = usePullToRefresh();

  const handleLogout = async () => {
    await logout();
    router.replace("/");
  };

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
          Profile
        </Text>

        <Pressable
          onPress={handleLogout}
          style={({ pressed }) => ({
            marginTop: 40,
            marginHorizontal: 24,
            height: 50,
            borderRadius: 10,
            backgroundColor: pressed ? "#cc3333" : "#dd4444",
            justifyContent: "center",
            alignItems: "center",
            opacity: pressed ? 0.9 : 1,
          })}
        >
          <Text
            style={{
              color: "#FFF",
              fontSize: 16,
              fontWeight: "600",
            }}
          >
            Logout
          </Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}
