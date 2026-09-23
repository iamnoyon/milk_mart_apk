import { useState, useRef, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  Dimensions,
  Pressable,
  FlatList,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Image } from "expo-image";
import { useDispatch } from "react-redux";
import { useTheme } from "@/hooks/use-theme";
import { usePullToRefresh } from "@/hooks/use-pull-to-refresh";
import ProductCard from "@/components/ProductCard";
import Skeleton from "@/components/Skeleton";
import { addToCart } from "@/store/cart";
import { useGetCategoryListQuery } from "@/store/admin/category"
import { useGetProductListQuery } from "@/store/admin/products"

const { width: SCREEN_WIDTH } = Dimensions.get("window");

const BANNERS = [
  { id: "1", title: "Fresh Milk Daily", subtitle: "Up to 20% off", color: "#092C0E" },
  { id: "2", title: "New Arrivals", subtitle: "Check it out", color: "#1a5c24" },
  { id: "3", title: "Free Delivery", subtitle: "On orders over $50", color: "#2d7a38" },
];

const NUM_COLUMNS = 2;
const SKELETON_ROWS = 3;
const SKELETON_COUNT = SKELETON_ROWS * NUM_COLUMNS;


export default function HomeTab() {
  const theme = useTheme();
  const dispatch = useDispatch();
  const [search, setSearch] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollRef = useRef<ScrollView>(null);

  const { data: categoryData, isLoading: categoryLoading, refetch: refetchCategories } = useGetCategoryListQuery({})
  const { data: productList, isLoading: productLoading, refetch: refetchProducts } = useGetProductListQuery({})

  const { refreshControl } = usePullToRefresh([refetchCategories, refetchProducts]);

  const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const index = Math.round(e.nativeEvent.contentOffset.x / SCREEN_WIDTH);
    setActiveIndex(index);
  };

  const renderProduct = useCallback(({ item }: { item: any }) => (
    <ProductCard
      product={item}
      variant="grid"
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
  ), [dispatch]);

  const renderSkeleton = useCallback(() => (
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
  ), [theme.background, theme.backgroundElement]);

  const flatData = productLoading
    ? Array.from({ length: SKELETON_COUNT })
    : productList?.data ?? [];

  const keyExtractor = useCallback((item: any, index: number) =>
    productLoading ? `skeleton-${index}` : item.id.toString()
  , [productLoading]);

  return (
    <FlatList
      style={[styles.container, { backgroundColor: theme.background }]}
      contentContainerStyle={{ flexGrow: 1 }}
      refreshControl={refreshControl}
      showsVerticalScrollIndicator={false}
      data={flatData}
      keyExtractor={keyExtractor}
      renderItem={productLoading ? renderSkeleton : renderProduct}
      numColumns={NUM_COLUMNS}
      columnWrapperStyle={styles.row}
      ListHeaderComponent={
        <View>
          {/* Search Bar */}
          <View style={[styles.searchBox, { backgroundColor: theme.backgroundElement }]}>
            <MaterialCommunityIcons name="magnify" size={20} color={theme.textSecondary} />
            <TextInput
              placeholder="Search products..."
              placeholderTextColor={theme.textSecondary}
              value={search}
              onChangeText={setSearch}
              style={[styles.searchInput, { color: theme.text }]}
            />
          </View>

          {/* Carousel */}
          <View style={styles.carouselContainer}>
            <ScrollView
              ref={scrollRef}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              onScroll={onScroll}
              scrollEventThrottle={16}
            >
              {BANNERS.map((banner) => (
                <View
                  key={banner.id}
                  style={[styles.banner, { backgroundColor: banner.color }]}
                >
                  <Text style={styles.bannerTitle}>{banner.title}</Text>
                  <Text style={styles.bannerSubtitle}>{banner.subtitle}</Text>
                </View>
              ))}
            </ScrollView>

            {/* Dots */}
            <View style={styles.dots}>
              {BANNERS.map((_, i) => (
                <View
                  key={i}
                  style={[
                    styles.dot,
                    { backgroundColor: i === activeIndex ? theme.tint : theme.backgroundElement },
                  ]}
                />
              ))}
            </View>
          </View>

          {/* Categories Row */}
          <View style={styles.categoriesSection}>
            <View style={styles.categoryRow}>
              {categoryLoading
                ? Array.from({ length: 5 }).map((_, i) => (
                    <View key={i} style={styles.categoryItem}>
                      <Skeleton width={48} height={48} borderRadius={14} />
                      <Skeleton width={44} height={10} borderRadius={4} style={{ marginTop: 6 }} />
                    </View>
                  ))
                : (() => {
                    const categories = categoryData?.data ?? [];
                    const hasMore = categories.length > 5;
                    const visible = hasMore ? categories.slice(0, 4) : categories;
                    return (
                      <>
                        {visible.map((cat) => (
                          <Pressable
                            key={cat.id}
                            onPress={() => router.push({ pathname: `/home/categories/${cat.id}`, params: { name: cat.name } })}
                            style={styles.categoryItem}
                          >
                            <View style={[styles.iconBg, { backgroundColor: '#e9f3d8' }]}>
                              <MaterialCommunityIcons name={cat.icon as any} size={32} color='#4e7707' />
                            </View>
                            <Text style={[styles.categoryName, { color: theme.text }]} numberOfLines={1}>
                              {cat.name}
                            </Text>
                          </Pressable>
                        ))}
                        {hasMore && (
                          <Pressable
                            key="more"
                            onPress={() => router.push("/home/categories")}
                            style={styles.categoryItem}
                          >
                            <View style={[styles.iconBg, { backgroundColor: '#e9f3d8' }]}>
                              <MaterialCommunityIcons name="dots-grid" size={24} color='#4e7707' />
                            </View>
                            <Text style={[styles.categoryName, { color: theme.text }]} numberOfLines={1}>
                              More
                            </Text>
                          </Pressable>
                        )}
                      </>
                    );
                  })()}
            </View>
          </View>

          {/* Best Seller Header */}
          <View style={styles.bestSellerSection}>
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: theme.text }]}>
                Best Seller
              </Text>
              {(productList?.data?.length ?? 0) > 0 && (
                <Pressable onPress={() => router.push("/home/categories/product")}>
                  <Text style={[styles.seeMore, { color: '#57810d' }]}>
                    See more
                  </Text>
                </Pressable>
              )}
            </View>
          </View>
        </View>
      }
      ListFooterComponent={
        <View style={styles.deliveryBannerSection}>
          <View
            style={[
              styles.deliveryBanner,
              { backgroundColor: '#e9f3d8' },
            ]}
          >
            <View style={styles.deliveryTextWrap}>
              <Text style={[styles.deliveryTitle, { color: '#57810d' }]}>
                Free Delivery
              </Text>
              <Text style={[styles.deliverySubtitle, { color: theme.textSecondary }]}>
                On orders over <Text style={{ fontWeight: "700" }}>৳500</Text>
              </Text>
            </View>

            <Image
              source={require("@/assets/images/deliver-bike-svgrepo-com.svg")}
              style={styles.deliveryImage}
              contentFit="contain"
            />
          </View>
        </View>
      }
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 16,
    marginTop: 12,
    paddingHorizontal: 12,
    height: 44,
    borderRadius: 10,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
  },
  carouselContainer: {
    marginTop: 8,
  },
  banner: {
    width: SCREEN_WIDTH - 32,
    marginHorizontal: 16,
    borderRadius: 12,
    padding: 24,
    height: 140,
    justifyContent: "center",
  },
  bannerTitle: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "700",
  },
  bannerSubtitle: {
    color: "#ddd",
    fontSize: 14,
    marginTop: 4,
  },
  dots: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 12,
    gap: 6,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  categoriesSection: {
    marginTop: 12,
    paddingHorizontal: 16,
  },
  categoryRow: {
    flexDirection: "row",
    gap: 8,
  },
  categoryItem: {
    alignItems: "center",
    width: 60,
    gap: 6,
  },
  iconBg: {
    width: 48,
    height: 48,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
  },
  categoryName: {
    fontSize: 11,
    fontWeight: "500",
    textAlign: "center",
  },
  bestSellerSection: {
    marginTop: 20,
    paddingHorizontal: 16,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
  },
  seeMore: {
    fontSize: 13,
    fontWeight: "600",
  },
  row: {
    justifyContent: "space-between",
    paddingHorizontal: 16,
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
  deliveryBannerSection: {
    marginTop: 12,
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  deliveryBanner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: 14,
    paddingHorizontal: 18,
    height: 80,
    overflow: "hidden",
  },
  deliveryTextWrap: {
    flex: 1,
    gap: 4,
  },
  deliveryTitle: {
    fontSize: 18,
    fontWeight: "800",
  },
  deliverySubtitle: {
    fontSize: 13,
  },
  deliveryImage: {
    width: 90,
    height: 60,
  },
});
