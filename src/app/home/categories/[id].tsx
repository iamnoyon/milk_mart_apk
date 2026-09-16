import { View, Text, StyleSheet, FlatList } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useDispatch } from "react-redux";
import { useTheme } from "@/hooks/use-theme";
import { usePullToRefresh } from "@/hooks/use-pull-to-refresh";
import ProductCard from "@/components/ProductCard";
import Skeleton from "@/components/Skeleton";
import { addToCart } from "@/store/cart";
import { useGetProductsByCategoryIdQuery } from "@/store/admin/products";

const SKELETON_ROWS = 2;
const SKELETON_COLS = 2;
const SKELETON_COUNT = SKELETON_ROWS * SKELETON_COLS;

export default function CategoryDetail() {
  const { id, name } = useLocalSearchParams<{ id: string; name: string }>();
  const theme = useTheme();
  const dispatch = useDispatch();
  const { data: productList, isLoading, refetch } = useGetProductsByCategoryIdQuery(
    { id },
    { skip: !id }
  );

  const { refreshControl } = usePullToRefresh([refetch]);

  const renderItem = ({ item }: { item: any }) => (
    <ProductCard
      product={item}
      onPress={() => router.push(`/home/categories/product/${item.id}`)}
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
        data={isLoading ? Array.from({ length: SKELETON_COUNT }) : productList?.data}
        keyExtractor={(_, index) => `skeleton-${index}`}
        numColumns={2}
        contentContainerStyle={styles.listContent}
        columnWrapperStyle={isLoading ? styles.row : styles.row}
        showsVerticalScrollIndicator={false}
        refreshControl={refreshControl}
        ListHeaderComponent={
          isLoading ? (
            <View
              style={[
                styles.banner,
                { backgroundColor: theme.backgroundElement },
              ]}
            >
              <View style={styles.bannerContent}>
                <Skeleton width={140} height={20} borderRadius={6} />
                <Skeleton width={90} height={13} borderRadius={4} style={{ marginTop: 8 }} />
              </View>
              <Skeleton width={44} height={44} borderRadius={22} />
            </View>
          ) : (
            <View style={[styles.banner, { backgroundColor: "#e9f3d8" }]}>
              <View style={styles.bannerContent}>
                <Text style={styles.bannerTitle}>{name || `Category ${id}`}</Text>
                <Text style={styles.bannerSubtitle}>{productList?.total} Products</Text>
              </View>
              <View style={styles.bannerIconWrap}>
                <MaterialCommunityIcons
                  name={productList?.categoryIcon || "tag-text"}
                  size={24}
                  color="#57810d"
                />
              </View>
            </View>
          )
        }
        renderItem={isLoading ? renderSkeletonItem : renderItem}
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
});
