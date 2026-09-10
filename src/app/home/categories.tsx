import { View, Text, StyleSheet, Pressable, FlatList } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { router } from "expo-router";
import { useTheme } from "@/hooks/use-theme";

const CATEGORIES = [
  { id: "1", name: "Milk", total: 24 },
  { id: "2", name: "Cheese", total: 18 },
  { id: "3", name: "Butter", total: 12 },
  { id: "4", name: "Yogurt", total: 30 },
  { id: "5", name: "Cream", total: 15 },
  { id: "6", name: "Ice Cream", total: 22 },
  { id: "7", name: "Sweets", total: 9 },
  { id: "8", name: "Beverages", total: 27 },
];

export default function CategoriesTab() {
  const theme = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <FlatList
        data={CATEGORIES}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <Text style={[styles.headerTitle, { color: theme.text }]}>
            All Categories
          </Text>
        }
        renderItem={({ item }) => (
          <Pressable
            onPress={() => router.push("/home/categories")}
            style={({ pressed }) => [
              styles.card,
              {
                backgroundColor: theme.background,
                borderColor: theme.backgroundElement,
                opacity: pressed ? 0.7 : 1,
              },
            ]}
          >
            <View
              style={[
                styles.imageWrap,
                { backgroundColor: theme.backgroundElement },
              ]}
            >
              <Image
                source={require("@/assets/images/welcome.webp")}
                style={styles.image}
                contentFit="contain"
              />
            </View>

            <View style={styles.info}>
              <Text style={[styles.title, { color: theme.text }]}>
                {item.name}
              </Text>
              <Text style={[styles.total, { color: theme.textSecondary }]}>
                {item.total} Products
              </Text>
            </View>

            <MaterialCommunityIcons
              name="chevron-right"
              size={24}
              color={theme.textSecondary}
            />
          </Pressable>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 24,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 12,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 14,
    padding: 10,
    marginBottom: 12,
    gap: 12,
  },
  imageWrap: {
    width: 56,
    height: 56,
    borderRadius: 12,
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  info: {
    flex: 1,
    gap: 4,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
  },
  total: {
    fontSize: 13,
  },
});
