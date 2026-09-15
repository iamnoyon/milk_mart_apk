import { View, Text, StyleSheet, FlatList, Pressable } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useDispatch } from "react-redux";
import { useTheme } from "@/hooks/use-theme";
import ProductCard from "@/components/ProductCard";
import { addToCart } from "@/store/cart";
import { useGetProductsByCategoryIdQuery } from "@/store/admin/products";

const PRODUCTS = [
  { id: "1", name: "Fresh Cow Milk", weight: "1 Liter", price: 4.99 },
  { id: "2", name: "Cheddar Cheese", weight: "500 gram", price: 7.5 },
  { id: "3", name: "Salted Butter", weight: "250 gram", price: 3.25 },
  { id: "4", name: "Greek Yogurt", weight: "1 kg", price: 6.0 },
  { id: "5", name: "Paneer", weight: "400 gram", price: 5.5 },
  { id: "6", name: "Cream Cheese", weight: "200 gram", price: 4.0 },
  { id: "7", name: "Mozzarella", weight: "500 gram", price: 8.0 },
  { id: "8", name: "Ghee", weight: "500 ml", price: 12.0 },
];

export default function CategoryDetail() {
  const { id, name } = useLocalSearchParams<{ id: string; name: string }>();
  const theme = useTheme();
  const dispatch = useDispatch();
  const { data: productList} = useGetProductsByCategoryIdQuery({id}, {skip:!id})

  const renderItem = ({ item }: { item: any }) => (
    <ProductCard
      product={item}
      onPress={() => router.push(`/home/categories/product/${item.id}`)}
      onAdd={() => dispatch(addToCart({
        id: item.id,
        name: item.name,
        image: item.image,
        price: item.price,
        weight: item.weight,
        weight_type: item.weight_type,
      }))}
    />
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <FlatList
        data={productList?.data}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={styles.listContent}
        columnWrapperStyle={styles.row}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View style={[styles.banner, { backgroundColor: "#e9f3d8" }]}>
            <View style={styles.bannerContent}>
              <Text style={styles.bannerTitle}>{name || `Category ${id}`}</Text>
              <Text style={styles.bannerSubtitle}>{productList?.total} Products</Text>
            </View>
            <View style={styles.bannerIconWrap}>
              <MaterialCommunityIcons name="tag-text" size={24} color="#57810d" />
            </View>
          </View>
        }
        renderItem={renderItem}
      />
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
  banner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 16,
  },
  bannerContent: {
    flex: 1,
    gap: 4,
  },
  bannerTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#57810d",
  },
  bannerSubtitle: {
    fontSize: 13,
    color: "#4e7707",
    fontWeight: "500",
  },
  bannerIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#d4e8b8",
    justifyContent: "center",
    alignItems: "center",
  },
  row: {
    justifyContent: "space-between",
  },
});
