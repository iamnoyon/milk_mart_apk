import { useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList, Pressable, Modal } from "react-native";
import { router } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useDispatch } from "react-redux";
import { useTheme } from "@/hooks/use-theme";
import ProductCard from "@/components/ProductCard";
import Skeleton from "@/components/Skeleton";
import { useGetCategoryListQuery } from "@/store/admin/category";
import { useLazyGetProductsByCategoryIdQuery } from "@/store/admin/products";
import { addToCart } from "@/store/cart";

const SKELETON_ROWS = 3;
const SKELETON_COLS = 2;
const SKELETON_COUNT = SKELETON_ROWS * SKELETON_COLS;

export default function ProductIndex() {
  const theme = useTheme();
  const dispatch = useDispatch();
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [showFilter, setShowFilter] = useState(false);

  const { data: categoryData } = useGetCategoryListQuery();
  const [trigger, { data: productsData, isFetching }] =
    useLazyGetProductsByCategoryIdQuery();

  useEffect(() => {
    trigger({ id: selectedCategory });
  }, [selectedCategory, trigger]);

  const isLoading = isFetching && !productsData;

  const renderItem = ({ item }: { item: any }) => (
    <ProductCard
      product={item}
      onPress={() => {
        if (item?.id == null) return;
        router.push(`/home/categories/product/${item.id}`);
      }}
      onAdd={() =>
        dispatch(
          addToCart({
            id: item.id,
            name: item.name,
            image: item.image,
            price: item.price,
            weight: item.weight,
            weight_type: item.weight_type,
          })
        )
      }
    />
  );

  const renderSkeletonItem = () => (
    <View
      style={[
        styles.productSkeleton,
        {
          backgroundColor: theme.background,
          borderColor: theme.backgroundElement,
        },
      ]}
    >
      <Skeleton width="100%" height={110} borderRadius={12} />
      <Skeleton width="80%" height={14} borderRadius={4} style={{ marginTop: 10 }} />
      <Skeleton width="50%" height={11} borderRadius={4} style={{ marginTop: 6 }} />
      <View style={styles.skeletonBottomRow}>
        <Skeleton width={60} height={15} borderRadius={4} />
        <Skeleton width={30} height={30} borderRadius={8} />
      </View>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <FlatList
        data={isLoading ? Array.from({ length: SKELETON_COUNT }) : productsData?.data ?? []}
        keyExtractor={(_, index) => `skeleton-${index}`}
        numColumns={2}
        contentContainerStyle={styles.listContent}
        columnWrapperStyle={styles.row}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View style={styles.filterHeader}>
            <Text style={[styles.headerTitle, { color: theme.text }]}>
              All Products
            </Text>
            <Pressable
              onPress={() => setShowFilter(true)}
              style={[styles.filterBtn, { backgroundColor: theme.backgroundElement }]}
            >
              <MaterialCommunityIcons name="filter-variant" size={20} color={theme.text} />
              <Text style={[styles.filterBtnText, { color: theme.text }]}>Filter</Text>
            </Pressable>
          </View>
        }
        renderItem={isLoading ? renderSkeletonItem : renderItem}
      />

      <Modal visible={showFilter} transparent animationType="fade">
        <Pressable style={styles.modalOverlay} onPress={() => setShowFilter(false)}>
          <View style={[styles.modalContent, { backgroundColor: theme.background, borderColor: theme.backgroundElement }]}>
            <Text style={[styles.modalTitle, { color: theme.text }]}>
              Filter by Category
            </Text>

            <Pressable
              onPress={() => {
                setSelectedCategory("ALL");
                setShowFilter(false);
              }}
              style={[
                styles.filterItem,
                {
                  backgroundColor:
                    selectedCategory === "ALL" ? "#e9f3d8" : "transparent",
                  borderColor:
                    selectedCategory === "ALL"
                      ? "#57810d"
                      : theme.backgroundElement,
                },
              ]}
            >
              <Text
                style={[
                  styles.filterItemText,
                  { color: selectedCategory === "ALL" ? "#57810d" : theme.text },
                ]}
              >
                All
              </Text>
              {selectedCategory === "ALL" && (
                <MaterialCommunityIcons name="check" size={18} color="#57810d" />
              )}
            </Pressable>

            {categoryData?.data?.map((cat: any) => (
              <Pressable
                key={cat.id}
                onPress={() => {
                  setSelectedCategory(String(cat.id));
                  setShowFilter(false);
                }}
                style={[
                  styles.filterItem,
                  {
                    backgroundColor:
                      String(cat.id) === selectedCategory
                        ? "#e9f3d8"
                        : "transparent",
                    borderColor:
                      String(cat.id) === selectedCategory
                        ? "#57810d"
                        : theme.backgroundElement,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.filterItemText,
                    {
                      color:
                        String(cat.id) === selectedCategory
                          ? "#57810d"
                          : theme.text,
                    },
                  ]}
                >
                  {cat.name}
                </Text>
                {String(cat.id) === selectedCategory && (
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
  productSkeleton: {
    flex: 1,
    borderRadius: 12,
    padding: 10,
    borderWidth: 1,
    marginBottom: 12,
    maxWidth: "48%",
  },
  skeletonBottomRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 10,
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
