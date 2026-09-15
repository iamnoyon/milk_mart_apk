import { View, Text, StyleSheet, FlatList, Pressable, Image } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import { useTheme } from "@/hooks/use-theme";
import {
  incrementQuantity,
  decrementQuantity,
  removeFromCart,
  clearCart,
} from "@/store/cart";

export default function CartTab() {
  const theme = useTheme();
  const dispatch = useDispatch();

  const items = useSelector((state: any) => state.cart.items);

  const subtotal = items.reduce(
    (sum: number, item: any) => sum + item.price * item.quantity,
    0
  );

  const renderItem = ({ item }: { item: any }) => (
    <View
      style={[
        styles.card,
        {
          backgroundColor: theme.background,
          borderColor: theme.backgroundElement,
        },
      ]}
    >
      <View
        style={[styles.imageWrap, { backgroundColor: theme.backgroundElement }]}
      >
        <Image
          source={{ uri: item.image }}
          style={styles.image}
          contentFit="cover"
        />
      </View>

      <View style={styles.info}>
        <Text
          style={[styles.name, { color: theme.text }]}
          numberOfLines={1}
        >
          {item.name}
        </Text>
        <Text style={[styles.weight, { color: theme.textSecondary }]}>
          {item.weight} {item.weight_type}
        </Text>
        <Text style={styles.price}>৳{(item.price * item.quantity).toFixed(2)}</Text>

        <View style={styles.qtyRow}>
          <View style={styles.qtyControls}>
            <Pressable
              onPress={() => dispatch(decrementQuantity(item.id))}
              style={[styles.qtyBtn, { backgroundColor: theme.backgroundElement }]}
            >
              <MaterialCommunityIcons
                name={item.quantity <= 1 ? "trash-can-outline" : "minus"}
                size={16}
                color={theme.text}
              />
            </Pressable>
            <Text style={[styles.qtyText, { color: theme.text }]}>
              {item.quantity}
            </Text>
            <Pressable
              onPress={() => dispatch(incrementQuantity(item.id))}
              style={[styles.qtyBtn, { backgroundColor: theme.backgroundElement }]}
            >
              <MaterialCommunityIcons name="plus" size={16} color={theme.text} />
            </Pressable>
          </View>
        </View>
      </View>

      <Pressable
        onPress={() => dispatch(removeFromCart(item.id))}
        style={styles.removeBtn}
      >
        <MaterialCommunityIcons
          name="close"
          size={20}
          color={theme.textSecondary}
        />
      </Pressable>
    </View>
  );

  if (items.length === 0) {
    return (
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <View style={styles.empty}>
          <View
            style={[
              styles.emptyIcon,
              { backgroundColor: theme.backgroundElement },
            ]}
          >
            <MaterialCommunityIcons
              name="cart-outline"
              size={64}
              color={theme.textSecondary}
            />
          </View>
          <Text style={[styles.emptyTitle, { color: theme.text }]}>
            Your cart is empty
          </Text>
          <Text style={[styles.emptySub, { color: theme.textSecondary }]}>
            Add some products to get started
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.text }]}>My Cart</Text>
        <Pressable onPress={() => dispatch(clearCart())}>
          <Text style={styles.clearText}>Clear All</Text>
        </Pressable>
      </View>

      <FlatList
        data={items}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />

      <View
        style={[
          styles.footer,
          {
            backgroundColor: theme.background,
            borderTopColor: theme.backgroundElement,
          },
        ]}
      >
        <View style={styles.totalRow}>
          <Text style={[styles.totalLabel, { color: theme.textSecondary }]}>
            Subtotal ({items.length} items)
          </Text>
          <Text style={styles.totalAmount}>৳{subtotal.toFixed(2)}</Text>
        </View>
        <Pressable style={styles.checkoutBtn}>
          <Text style={styles.checkoutText}>Checkout</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  title: {
    fontSize: 22,
    fontWeight: "800",
  },
  clearText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#57810d",
  },
  list: {
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  card: {
    flexDirection: "row",
    alignItems: "flex-start",
    borderWidth: 1,
    borderRadius: 14,
    padding: 12,
    marginBottom: 12,
    gap: 12,
  },
  imageWrap: {
    width: 80,
    height: 80,
    borderRadius: 12,
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  info: {
    flex: 1,
    gap: 4,
  },
  name: {
    fontSize: 15,
    fontWeight: "600",
  },
  weight: {
    fontSize: 12,
  },
  price: {
    fontSize: 15,
    fontWeight: "700",
    color: "#57810d",
    marginTop: 4,
  },
  qtyRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 6,
  },
  qtyControls: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  qtyBtn: {
    width: 28,
    height: 28,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  qtyText: {
    fontSize: 15,
    fontWeight: "700",
    minWidth: 18,
    textAlign: "center",
  },
  removeBtn: {
    padding: 4,
  },
  empty: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
    gap: 12,
  },
  emptyIcon: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "700",
  },
  emptySub: {
    fontSize: 14,
    textAlign: "center",
  },
  footer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    gap: 12,
  },
  totalRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  totalLabel: {
    fontSize: 14,
    fontWeight: "500",
  },
  totalAmount: {
    fontSize: 20,
    fontWeight: "800",
    color: "#57810d",
  },
  checkoutBtn: {
    backgroundColor: "#57810d",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  checkoutText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
});
