import { useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Animated,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useDispatch } from "react-redux";
import Toast from "react-native-toast-message";
import { useTheme } from "@/hooks/use-theme";
import { useGetProductbyIdQuery } from "@/store/admin/products";
import { addToCart } from "@/store/cart";

export default function ProductDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const theme = useTheme();
  const dispatch = useDispatch();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const { data: productData } = useGetProductbyIdQuery({ id }, { skip: !id });

  const product = productData?.data;

  const handleAddToCart = () => {
    if (!product) return;

    for (let i = 0; i < quantity; i++) {
      dispatch(addToCart({
        id: product.id,
        name: product.name,
        image: product.image,
        price: product.price,
        weight: product.weight,
        weight_type: product.weight_type,
      }));
    }

    setAdded(true);
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 1.05,
        duration: 120,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 120,
        useNativeDriver: true,
      }),
    ]).start();

    Toast.show({
      type: "success",
      text1: "Added to cart",
      text2: `${quantity} × ${product.name}`,
      position: "bottom",
      visibilityTime: 1500,
    });

    setTimeout(() => setAdded(false), 800);
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={[styles.imageWrap, { backgroundColor: theme.backgroundElement }]}>
          <Image
            source={{ uri: product?.image }}
            style={styles.image}
            contentFit="cover"
          />
        </View>

        <View style={styles.content}>
          <View style={styles.header}>
            <View style={{ flex: 1 }}>
              <Text style={[styles.name, { color: theme.text }]}>{product?.name}</Text>
              <Text style={[styles.weight, { color: theme.textSecondary }]}>
                {product?.weight + " " + product?.weight_type}
              </Text>
            </View>
            <Text style={styles.price}>৳{product?.price?.toFixed(2)}</Text>
          </View>

          <View style={[styles.divider, { backgroundColor: theme.backgroundElement }]} />

          <Text style={[styles.descTitle, { color: theme.text }]}>Description</Text>
          <Text style={[styles.desc, { color: theme.textSecondary }]}>
            {product?.description || "-"}
          </Text>
        </View>
      </ScrollView>

      <View
        style={[
          styles.bottomBar,
          { backgroundColor: theme.background, borderTopColor: theme.backgroundElement },
        ]}
      >
        {/* <View style={styles.quantityWrap}>
          <Pressable
            onPress={() => setQuantity((q) => Math.max(1, q - 1))}
            style={({ pressed }) => [
              styles.qtyBtn,
              { backgroundColor: theme.backgroundElement, transform: [{ scale: pressed ? 0.9 : 1 }] },
            ]}
          >
            <MaterialCommunityIcons name="minus" size={18} color={theme.text} />
          </Pressable>
          <Text style={[styles.qtyText, { color: theme.text }]}>{quantity}</Text>
          <Pressable
            onPress={() => setQuantity((q) => q + 1)}
            style={({ pressed }) => [
              styles.qtyBtn,
              { backgroundColor: theme.backgroundElement, transform: [{ scale: pressed ? 0.9 : 1 }] },
            ]}
          >
            <MaterialCommunityIcons name="plus" size={18} color={theme.text} />
          </Pressable>
        </View> */}
        <Pressable
          onPress={handleAddToCart}
          style={({ pressed }) => [
            styles.addBtn,
            {
              backgroundColor: added ? "#2e6b00" : "#57810d",
              transform: [{ scale: pressed ? 0.96 : 1 }],
            },
          ]}
        >
          <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
            <MaterialCommunityIcons
              name={added ? "check" : "cart-plus"}
              size={20}
              color="#fff"
            />
          </Animated.View>
          <Text style={styles.addBtnText}>
            {added ? "Added!" : "Add to Cart"}
          </Text>
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
    justifyContent: "flex-end",
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
