import { useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Animated,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Image } from "expo-image";
import Toast from "react-native-toast-message";
import { useTheme } from "@/hooks/use-theme";

interface Product {
  id: number;
  name: string;
  weight: number;
  weight_type: string;
  price: number;
  image: string;
  categoryId: number;
  quantity: number;
  status: boolean;
}

interface ProductCardProps {
  product: Product;
  variant?: "horizontal" | "grid";
  onPress?: () => void;
  onAdd?: () => void;
  style?: object;
}

export default function ProductCard({
  product,
  variant = "grid",
  onPress,
  onAdd,
  style,
}: ProductCardProps) {
  const theme = useTheme();
  const [added, setAdded] = useState(false);
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const containerStyle =
    variant === "horizontal" ? styles.cardHorizontal : styles.cardGrid;

  const handleAdd = () => {
    onAdd?.();

    setAdded(true);
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 1.3,
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
      text2: product.name,
      position: "bottom",
      visibilityTime: 1500,
    });

    setTimeout(() => setAdded(false), 600);
  };

  return (
    <Pressable
      onPress={onPress}
      style={[
        containerStyle,
        { backgroundColor: theme.background, borderColor: theme.backgroundElement },
        style,
      ]}
    >
      <View
        style={[styles.image, { backgroundColor: theme.backgroundElement }]}
      >
        <Image
          source={{ uri: product.image }}
          style={styles.imageContent}
          contentFit="cover"
        />
      </View>

      <Text style={[styles.name, { color: theme.text }]} numberOfLines={1}>
        {product.name}
      </Text>
      <Text style={[styles.weight, { color: theme.textSecondary }]}>
        {product.weight} {product.weight_type}
      </Text>

      <View style={styles.bottom}>
        <Text style={[styles.price, { color: "#57810d" }]}>
          ৳{product.price.toFixed(2)}
        </Text>
        <Pressable
          onPress={handleAdd}
          hitSlop={8}
          style={({ pressed }) => [
            styles.addButton,
            {
              backgroundColor: added ? "#2e6b00" : "#57810d",
              transform: [{ scale: pressed ? 0.9 : 1 }],
            },
          ]}
        >
          <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
            <MaterialCommunityIcons
              name={added ? "check" : "plus"}
              size={18}
              color="#fff"
            />
          </Animated.View>
        </Pressable>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  cardHorizontal: {
    width: 150,
    borderRadius: 12,
    padding: 10,
    borderWidth: 1,
  },
  cardGrid: {
    flex: 1,
    borderRadius: 12,
    padding: 10,
    borderWidth: 1,
    marginBottom: 12,
    maxWidth: "48%",
  },
  image: {
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
  imageContent: {
    width: "100%",
    height: "100%",
  },
  name: {
    fontSize: 14,
    fontWeight: "600",
  },
  weight: {
    fontSize: 12,
    marginTop: 2,
  },
  bottom: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 10,
  },
  price: {
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
});
