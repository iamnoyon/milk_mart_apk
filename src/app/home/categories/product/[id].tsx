import { useEffect, useRef } from "react";
import { View, Text, StyleSheet, ScrollView, Pressable } from "react-native";
import { useLocalSearchParams, router, useNavigation } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useTheme } from "@/hooks/use-theme";

const PRODUCTS: Record<string, { name: string; weight: string; price: number; description: string }> = {
  "1": { name: "Fresh Cow Milk", weight: "1 Liter", price: 4.99, description: "Fresh and pure cow milk sourced directly from local farms. Rich in calcium and essential nutrients for a healthy lifestyle." },
  "2": { name: "Cheddar Cheese", weight: "500 gram", price: 7.5, description: "Aged cheddar cheese with a rich, sharp flavor. Perfect for sandwiches, burgers, and cooking." },
  "3": { name: "Salted Butter", weight: "250 gram", price: 3.25, description: "Creamy salted butter made from fresh cream. Ideal for cooking, baking, and spreading." },
  "4": { name: "Greek Yogurt", weight: "1 kg", price: 6.0, description: "Thick and creamy Greek yogurt packed with protein. Great for breakfast or as a healthy snack." },
  "5": { name: "Paneer", weight: "400 gram", price: 5.5, description: "Soft and fresh paneer made from pure milk. Perfect for curries, tikka, and other Indian dishes." },
  "6": { name: "Cream Cheese", weight: "200 gram", price: 4.0, description: "Smooth and spreadable cream cheese. Great for bagels, dips, and cheesecakes." },
  "7": { name: "Mozzarella", weight: "500 gram", price: 8.0, description: "Fresh mozzarella cheese with a mild, milky flavor. Perfect for pizza and pasta." },
  "8": { name: "Ghee", weight: "500 ml", price: 12.0, description: "Pure cow ghee with a rich aroma. Ideal for cooking, frying, and traditional recipes." },
};

export default function ProductDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const theme = useTheme();
  const navigation = useNavigation();
  const popping = useRef(false);

  useEffect(() => {
    const unsubscribe = navigation.addListener("beforeRemove", (e) => {
      if (popping.current) return;
      e.preventDefault();
      popping.current = true;
      router.replace("/home/categories/product");
    });
    return unsubscribe;
  }, [navigation]);

  const product = PRODUCTS[id || ""] || { name: "Product", weight: "", price: 0, description: "" };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={[styles.imageWrap, { backgroundColor: theme.backgroundElement }]}>
          <Image
            source={require("@/assets/images/welcome.webp")}
            style={styles.image}
            contentFit="cover"
          />
        </View>

        <View style={styles.content}>
          <View style={styles.header}>
            <View style={{ flex: 1 }}>
              <Text style={[styles.name, { color: theme.text }]}>{product.name}</Text>
              <Text style={[styles.weight, { color: theme.textSecondary }]}>{product.weight}</Text>
            </View>
            <Text style={styles.price}>${product.price.toFixed(2)}</Text>
          </View>

          <View style={[styles.divider, { backgroundColor: theme.backgroundElement }]} />

          <Text style={[styles.descTitle, { color: theme.text }]}>Description</Text>
          <Text style={[styles.desc, { color: theme.textSecondary }]}>{product.description}</Text>
        </View>
      </ScrollView>

      <View style={[styles.bottomBar, { backgroundColor: theme.background, borderTopColor: theme.backgroundElement }]}>
        <View style={styles.quantityWrap}>
          <Pressable style={[styles.qtyBtn, { backgroundColor: theme.backgroundElement }]}>
            <MaterialCommunityIcons name="minus" size={18} color={theme.text} />
          </Pressable>
          <Text style={[styles.qtyText, { color: theme.text }]}>1</Text>
          <Pressable style={[styles.qtyBtn, { backgroundColor: theme.backgroundElement }]}>
            <MaterialCommunityIcons name="plus" size={18} color={theme.text} />
          </Pressable>
        </View>
        <Pressable style={styles.addBtn}>
          <MaterialCommunityIcons name="cart-plus" size={20} color="#fff" />
          <Text style={styles.addBtnText}>Add to Cart</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  imageWrap: {
    height: 280,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  content: {
    padding: 16,
  },
  header: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
  },
  name: {
    fontSize: 20,
    fontWeight: "700",
  },
  weight: {
    fontSize: 14,
    marginTop: 4,
  },
  price: {
    fontSize: 20,
    fontWeight: "800",
    color: "#57810d",
  },
  divider: {
    height: 1,
    marginVertical: 16,
  },
  descTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 8,
  },
  desc: {
    fontSize: 14,
    lineHeight: 22,
  },
  bottomBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
  },
  quantityWrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  qtyBtn: {
    width: 34,
    height: 34,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  qtyText: {
    fontSize: 16,
    fontWeight: "700",
  },
  addBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#57810d",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
  },
  addBtnText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "700",
  },
});
