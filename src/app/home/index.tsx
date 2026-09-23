import { useState, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  Dimensions,
  Pressable,
  FlatList,
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
import { Carousel } from "react-native-reanimated-carousel";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const BANNER_HEIGHT = 150;
const BANNER_WIDTH = SCREEN_WIDTH - 32;

const BANNERS = [
  { id: "1", title: "Fresh Milk Daily", subtitle: "Up to 20% off", color: "#092C0E", url: 'https://res.cloudinary.com/l0jhrvez/image/upload/v1790153633/uploads/doglpjo9drslrbegsgbc.jpg' },
  { id: "2", title: "New Arrivals", subtitle: "Check it out", color: "#1a5c24", url: 'https://res.cloudinary.com/l0jhrvez/image/upload/v1790153712/uploads/lbtvftaiuw4lta95xgle.jpg' },
  { id: "3", title: "Free Delivery", subtitle: "On orders over $50", color: "#2d7a38", url: 'https://res.cloudinary.com/l0jhrvez/image/upload/v1790153784/uploads/u2bpzpvexso0z8bvogjl.jpg' },
];

const SKELETON_COUNT = 4;


export default function HomeTab() {
  const theme = useTheme();
  const dispatch = useDispatch();
  const [search, setSearch] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);

  const { data: categoryData, isLoading: categoryLoading, refetch: refetchCategories } = useGetCategoryListQuery({})
  const { data: productList, isLoading: productLoading, refetch: refetchProducts } = useGetProductListQuery({})

  const { refreshControl } = usePullToRefresh([refetchCategories, refetchProducts]);

  const renderBanner = useCallback(({ item }: { item: typeof BANNERS[number] }) => (
    <View style={styles.banner}>
      <Image
        source={{ uri: item.url }}
        style={StyleSheet.absoluteFill}
        contentFit="cover"
      />
      <View style={styles.bannerContent}>
        <Text style={styles.bannerTitle}>{item.title}</Text>
        <Text style={styles.bannerSubtitle}>{item.subtitle}</Text>
      </View>
    </View>
  ), []);

  const handleAddToCart = useCallback((product: any) => {
    dispatch(addToCart({
      id: product.id,
      name: product.name,
      image: product.image,
      price: product.price,
      weight: product.weight,
      weight_type: product.weight_type,
    }));
  }, [dispatch]);

  const handleProductPress = useCallback((product: any) => {
    router.push(`/home/categories/product/${product.id}`);
  }, []);

  return (
    <FlatList
      key="home-vertical"
      style={[styles.container, { backgroundColor: theme.background }]}
      contentContainerStyle={{ flexGrow: 1 }}
      refreshControl={refreshControl}
      showsVerticalScrollIndicator={false}
      scrollEnabled={false}
      data={[]}
      keyExtractor={(_, index) => `empty-${index}`}
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
            <Carousel
              data={BANNERS}
              renderItem={renderBanner}
              loop
              autoplay
              autoplayInterval={4000}
              onSnapToItem={(index) => setActiveIndex(index)}
              style={{ width: SCREEN_WIDTH, height: BANNER_HEIGHT + 16 }}
            />

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
                    See All
                  </Text>
                </Pressable>
              )}
            </View>

            {/* Best Seller Horizontal Scroll */}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.bestSellerList}
            >
              {productLoading
                ? Array.from({ length: SKELETON_COUNT }).map((_, i) => (
                    <View
                      key={`skeleton-${i}`}
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
                  ))
                : productList?.data?.map((product: any) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      variant="horizontal"
                      onPress={() => handleProductPress(product)}
                      onAdd={() => handleAddToCart(product)}
                    />
                  ))}
            </ScrollView>
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
    width: BANNER_WIDTH,
    marginHorizontal: 16,
    borderRadius: 12,
    height: BANNER_HEIGHT,
    overflow: "hidden",
    justifyContent: "center",
  },
  bannerContent: {
    padding: 24,
    zIndex: 1,
  },
  bannerTitle: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "800",
  },
  bannerSubtitle: {
    color: "#fff",
    fontSize: 14,
    marginTop: 4,
    fontWeight: "500",
  },
  dots: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 0,
    gap: 5,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
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
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
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
  bestSellerList: {
    paddingHorizontal: 16,
    gap: 12,
  },
  productSkeleton: {
    width: 150,
    borderRadius: 12,
    padding: 10,
    borderWidth: 1,
    borderColor: "transparent",
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
