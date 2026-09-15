import { useState } from "react";
import { View, Text, StyleSheet, FlatList, Pressable, Modal } from "react-native";
import { router } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useTheme } from "@/hooks/use-theme";
import ProductCard from "@/components/ProductCard";

const CATEGORIES = [
  { id: "all", name: "All" },
  { id: "1", name: "Milk" },
  { id: "2", name: "Cheese" },
  { id: "3", name: "Butter" },
  { id: "4", name: "Yogurt" },
  { id: "5", name: "Cream" },
  { id: "6", name: "Ice Cream" },
];

const PRODUCTS = [
  { id: "1", name: "Fresh Cow Milk", weight: "1 Liter", price: 4.99, categoryId: "1" },
  { id: "2", name: "Cheddar Cheese", weight: "500 gram", price: 7.5, categoryId: "2" },
  { id: "3", name: "Salted Butter", weight: "250 gram", price: 3.25, categoryId: "3" },
  { id: "4", name: "Greek Yogurt", weight: "1 kg", price: 6.0, categoryId: "4" },
  { id: "5", name: "Paneer", weight: "400 gram", price: 5.5, categoryId: "2" },
  { id: "6", name: "Cream Cheese", weight: "200 gram", price: 4.0, categoryId: "5" },
  { id: "7", name: "Mozzarella", weight: "500 gram", price: 8.0, categoryId: "2" },
  { id: "8", name: "Ghee", weight: "500 ml", price: 12.0, categoryId: "3" },
  { id: "9", name: "Lassi", weight: "500 ml", price: 3.0, categoryId: "4" },
  { id: "10", name: "Vanilla Ice Cream", weight: "500 ml", price: 6.5, categoryId: "6" },
];

export default function ProductIndex() {
  const theme = useTheme();
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [showFilter, setShowFilter] = useState(false);

  const filteredProducts = selectedCategory === "all"
    ? PRODUCTS
    : PRODUCTS.filter((p) => p.categoryId === selectedCategory);

  const renderItem = ({ item }: { item: (typeof PRODUCTS)[number] }) => (
    <ProductCard
      product={item}
      onPress={() => router.push(`/home/categories/product/${item.id}`)}
    />
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <FlatList
        data={filteredProducts}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={styles.listContent}
        columnWrapperStyle={styles.row}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View style={styles.filterHeader}>
            <Text style={[styles.headerTitle, { color: theme.text }]}>All Products</Text>
            <Pressable
              onPress={() => setShowFilter(true)}
              style={[styles.filterBtn, { backgroundColor: theme.backgroundElement }]}
            >
              <MaterialCommunityIcons name="filter-variant" size={20} color={theme.text} />
              <Text style={[styles.filterBtnText, { color: theme.text }]}>Filter</Text>
            </Pressable>
          </View>
        }
        renderItem={renderItem}
      />

      <Modal visible={showFilter} transparent animationType="fade">
        <Pressable style={styles.modalOverlay} onPress={() => setShowFilter(false)}>
          <View style={[styles.modalContent, { backgroundColor: theme.background, borderColor: theme.backgroundElement }]}>
            <Text style={[styles.modalTitle, { color: theme.text }]}>Filter by Category</Text>
            {CATEGORIES.map((cat) => (
              <Pressable
                key={cat.id}
                onPress={() => {
                  setSelectedCategory(cat.id);
                  setShowFilter(false);
                }}
                style={[
                  styles.filterItem,
                  {
                    backgroundColor: selectedCategory === cat.id ? "#e9f3d8" : "transparent",
                    borderColor: selectedCategory === cat.id ? "#57810d" : theme.backgroundElement,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.filterItemText,
                    { color: selectedCategory === cat.id ? "#57810d" : theme.text },
                  ]}
                >
                  {cat.name}
                </Text>
                {selectedCategory === cat.id && (
                  <MaterialCommunityIcons name="check" size={18} color="#57810d" />
                )}
              </Pressable>
            ))}
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    padding: 16,
  },
  filterHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
  },
  filterBtn: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    gap: 6,
  },
  filterBtnText: {
    fontSize: 14,
    fontWeight: "600",
  },
  row: {
    justifyContent: "space-between",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    paddingTop: 60,
    paddingHorizontal: 16,
  },
  modalContent: {
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 16,
  },
  filterItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 8,
  },
  filterItemText: {
    fontSize: 15,
    fontWeight: "600",
  },
});
