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
    <ScrollView
      style={[styles.container, { backgroundColor: theme.background }]}
      showsVerticalScrollIndicator={false}
    >
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
            <View key={cat.id} style={styles.categoryItem}>
              <View style={[styles.iconBg, { backgroundColor: theme.backgroundElement }]}>
                <MaterialCommunityIcons name={cat.icon as any} size={24} color={theme.tint} />
              </View>
              <Text style={[styles.categoryName, { color: theme.text }]} numberOfLines={1}>
                {cat.name}
              </Text>
            </View>
          ))}

          {/* More Card */}
          <Pressable
            onPress={() => router.push("/home/categories")}
            style={styles.categoryItem}
          >
            <View style={[styles.iconBg, { backgroundColor: theme.tint }]}>
              <MaterialCommunityIcons name="dots-horizontal" size={24} color="#fff" />
            </View>
            <Text style={[styles.categoryName, { color: theme.text }]} numberOfLines={1}>
              More
            </Text>
          </Pressable>
        </View>
      </View>
    </ScrollView>
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
    height: 160,
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
});
