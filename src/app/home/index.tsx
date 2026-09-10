import { useState, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  Dimensions,
  Pressable,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Image } from "expo-image";
import { useTheme } from "@/hooks/use-theme";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

const BANNERS = [
  { id: "1", title: "Fresh Milk Daily", subtitle: "Up to 20% off", color: "#092C0E" },
  { id: "2", title: "New Arrivals", subtitle: "Check it out", color: "#1a5c24" },
  { id: "3", title: "Free Delivery", subtitle: "On orders over $50", color: "#2d7a38" },
];

const CATEGORIES = [
  { id: "1", name: "Milk", icon: "cow" },
  { id: "2", name: "Cheese", icon: "cheese" },
  { id: "3", name: "Butter", icon: "food" },
  { id: "4", name: "Yogurt", icon: "cup-water" },
  {id: "5", name: "More", icon: "dots-horizontal"}
];

const BEST_SELLERS = [
  { id: "1", name: "Fresh Cow Milk", weight: "1 Liter", price: 4.99, icon: "cow" },
  { id: "2", name: "Cheddar Cheese", weight: "500 gram", price: 7.5, icon: "cheese" },
  { id: "3", name: "Salted Butter", weight: "250 gram", price: 3.25, icon: "food" },
  { id: "4", name: "Greek Yogurt", weight: "1 kg", price: 6.0, icon: "cup-water" },
];

export default function HomeTab() {
  const theme = useTheme();
  const [search, setSearch] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollRef = useRef<ScrollView>(null);

  const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const index = Math.round(e.nativeEvent.contentOffset.x / SCREEN_WIDTH);
    setActiveIndex(index);
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
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
          {CATEGORIES.map((cat) => (
            <Pressable
              key={cat.id}
              onPress={() => router.push("/home/categories")}
              style={styles.categoryItem}
            >
              <View style={[styles.iconBg, { backgroundColor: '#e9f3d8' }]}>
                <MaterialCommunityIcons name={cat.icon as any} size={24} color='#4e7707' />
              </View>
              <Text style={[styles.categoryName, { color: theme.text }]} numberOfLines={1}>
                {cat.name}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>

      {/* Best Seller */}
      <View style={styles.bestSellerSection}>
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            Best Seller
          </Text>
          <Pressable onPress={() => router.push("/home/categories")}>
            <Text style={[styles.seeMore, { color: '#57810d'}]}>
              See more
            </Text>
          </Pressable>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.bestSellerList}
        >
          {BEST_SELLERS.map((product) => (
            <View
              key={product.id}
              style={[styles.productCard, { backgroundColor: theme.background }]}
            >
              <View
                style={[
                  styles.productImage,
                  { backgroundColor: theme.backgroundElement },
                ]}
              >
                <Image
                  source={require("@/assets/images/welcome.webp")}
                  style={styles.productImageContent}
                  contentFit="cover"
                />
              </View>

              <Text
                style={[styles.productName, { color: theme.text }]}
                numberOfLines={1}
              >
                {product.name}
              </Text>
              <Text style={[styles.productWeight, { color: theme.textSecondary }]}>
                {product.weight}
              </Text>

              <View style={styles.productBottom}>
                <Text style={[styles.productPrice, { color: '#57810d' }]}>
                  ${product.price.toFixed(2)}
                </Text>
                <Pressable
                  style={[styles.addButton, { backgroundColor: '#57810d' }]}
                >
                  <MaterialCommunityIcons name="plus" size={18} color="#fff" />
                </Pressable>
              </View>
            </View>
          ))}
        </ScrollView>
      </View>

      {/* Delivery Banner */}
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
            <Text
              style={[styles.deliverySubtitle, { color: theme.textSecondary }]}
            >
              On orders over ৳500
            </Text>
          </View>

          <Image
            source={require("@/assets/images/deliver-bike-svgrepo-com.svg")}
            style={styles.deliveryImage}
            contentFit="contain"
          />
        </View>
      </View>
    </View>
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
    justifyContent: "space-between",
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
  productCard: {
    width: 150,
    borderRadius: 12,
    padding: 10,
    borderWidth: 1,
    borderColor: "#eee",
  },
  productImage: {
    height: 110,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    marginHorizontal: -10,
    marginTop: -10,
    marginBottom: 8,
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
  },
  productImageContent: {
    width: "100%",
    height: "100%",
  },
  productName: {
    fontSize: 14,
    fontWeight: "600",
  },
  productWeight: {
    fontSize: 12,
    marginTop: 2,
  },
  productBottom: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 10,
  },
  productPrice: {
    fontSize: 15,
    fontWeight: "700",
  },
  addButton: {
    width: 30,
    height: 30,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
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
