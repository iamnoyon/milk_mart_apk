import { View, Text, Pressable, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useTheme } from "@/hooks/use-theme";

export default function AppHeader() {
  const theme = useTheme();

  return (
    <SafeAreaView edges={["top"]} style={{ backgroundColor: theme.background }}>
      <View style={[styles.container, { borderBottomColor: theme.backgroundElement }]}>
        <View style={styles.left}>
          <MaterialCommunityIcons name="map-marker" size={20} color={theme.tint} />
          <Text style={[styles.label, { color: theme.text }]}>Deliver to</Text>
        </View>

        <Pressable style={styles.bell}>
          <MaterialCommunityIcons name="bell-outline" size={24} color={theme.text} />
          <View style={[styles.badge, { backgroundColor: theme.tint }]} />
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    height: 36,
    borderBottomWidth: 1,
  },
  left: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
  },
  bell: {
    position: "relative",
    padding: 4,
  },
  badge: {
    position: "absolute",
    top: 4,
    right: 4,
    width: 8,
    height: 8,
    borderRadius: 4,
  },
});
