import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
  Image,
  TextInput,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import Toast from "react-native-toast-message";
import { useDispatch, useSelector } from "react-redux";
import { useTheme } from "@/hooks/use-theme";
import { usePullToRefresh } from "@/hooks/use-pull-to-refresh";
import {
  incrementQuantity,
  decrementQuantity,
  removeFromCart,
  clearCart,
} from "@/store/cart";
import { useApplyCouponMutation } from "@/store/admin/order"

export default function CartTab() {
  const theme = useTheme();
  const dispatch = useDispatch();

  const items = useSelector((state: any) => state.cart.items);

  // API Calling
  const [ApplyCoupon, { isLoading: applyCouponeLoading }] = useApplyCouponMutation();

  const { refreshControl } = usePullToRefresh();

  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<{
    code: string;
    type: "percent" | "flat";
    value: number;
    label: string;
    discount: number;
  } | null>(null);

  const subtotal = items.reduce(
    (sum: number, item: any) => sum + item.price * item.quantity,
    0
  );

  const discount = appliedCoupon?.discount ?? 0;
  const total = Math.max(0, subtotal - discount);

  const handleApplyCoupon = async () => {
    const code = couponCode.trim().toUpperCase();
    if (!code) {
      Toast.show({ type: "error", text1: "Enter a coupon code", position: "top" });
      return;
    }
    if (items.length === 0) {
      Toast.show({ type: "error", text1: "Cart is empty", position: "top" });
      return;
    }

    const payload = {
      coupon_code: code,
      products: items.map((item: any) => ({
        id: item.id,
        quantity: item.quantity,
      })),
    };
    console.log(payload)

    try {
      const res: any = await ApplyCoupon(payload).unwrap();
      const data = res?.data ?? {};
      const originalTotal = Number(data.total ?? subtotal);
      const finalPrice = Number(data.final_price ?? originalTotal);
      const discountValue = Math.max(0, originalTotal - finalPrice);
      const returnedCode = data.coupon_code ?? code;

      setAppliedCoupon({
        code: returnedCode,
        type: "flat",
        value: discountValue,
        label: res?.message ?? "Coupon applied",
        discount: discountValue,
      });
      setCouponCode("");
      Toast.show({
        type: "success",
        text1: "Coupon applied",
        text2: res?.message ?? `${returnedCode} applied`,
        position: "top",
      });
    } catch (err: any) {
      const message =
        err?.data?.message ?? err?.data?.detail ?? "Invalid or expired coupon";
      Toast.show({ type: "error", text1: message, position: "top" });
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    Toast.show({ type: "info", text1: "Coupon removed", position: "top" });
  };

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
      <Pressable
        onPress={() => router.push(`/home/categories/product/${item.id}`)}
        style={({ pressed }) => [
          styles.imageWrap,
          { backgroundColor: theme.backgroundElement },
          { transform: [{ scale: pressed ? 0.95 : 1 }] },
        ]}
      >
        <Image
          source={{ uri: item.image }}
          style={styles.image}
          contentFit="cover"
        />
      </Pressable>

      <View style={styles.info}>
        <View style={{ flex: 1, gap: 4 }}>
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
        </View>

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
        refreshControl={refreshControl}
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
        {appliedCoupon ? (
          <View
            style={[
              styles.couponApplied,
              { backgroundColor: "#e9f3d8", borderColor: "#57810d" },
            ]}
          >
            <View style={styles.couponAppliedLeft}>
              <MaterialCommunityIcons name="ticket-percent" size={18} color="#57810d" />
              <View>
                <Text style={styles.couponCode}>{appliedCoupon.code}</Text>
                <Text style={styles.couponLabel}>{appliedCoupon.label}</Text>
              </View>
            </View>
            <Pressable onPress={handleRemoveCoupon} hitSlop={8}>
              <MaterialCommunityIcons name="close" size={18} color="#57810d" />
            </Pressable>
          </View>
        ) : (
          <View
            style={[
              styles.couponField,
              { backgroundColor: theme.backgroundElement },
            ]}
          >
            <MaterialCommunityIcons
              name="ticket-percent-outline"
              size={18}
              color={theme.textSecondary}
            />
            <TextInput
              value={couponCode}
              onChangeText={setCouponCode}
              placeholder="Enter coupon code"
              placeholderTextColor={theme.textSecondary}
              autoCapitalize="characters"
              style={[styles.couponInput, { color: theme.text }]}
              returnKeyType="done"
            />
            <Pressable
              onPress={handleApplyCoupon}
              disabled={applyCouponeLoading}
              style={({ pressed }) => [
                styles.applyBtn,
                { opacity: applyCouponeLoading || pressed ? 0.6 : 1 },
              ]}
            >
              <Text style={styles.applyBtnText}>
                {applyCouponeLoading ? "Applying..." : "Apply Coupon"}
              </Text>
            </Pressable>
          </View>
        )}

        <View style={styles.summaryRow}>
          <Text style={[styles.summaryLabel, { color: theme.textSecondary }]}>
            Subtotal ({items.length} items)
          </Text>
          <Text style={[styles.summaryValue, { color: theme.text }]}>
            ৳{subtotal.toFixed(2)}
          </Text>
        </View>

        {appliedCoupon && (
          <View style={styles.summaryRow}>
            <Text style={[styles.summaryLabel, { color: "#57810d" }]}>
              Coupon Discount
            </Text>
            <Text style={[styles.summaryValue, { color: "#57810d" }]}>
              -৳{discount.toFixed(2)}
            </Text>
          </View>
        )}

        <View
          style={[styles.divider, { backgroundColor: theme.backgroundElement }]}
        />

        <View style={styles.totalRow}>
          <Text style={[styles.totalLabel, { color: theme.text }]}>Total</Text>
          <Text style={styles.totalAmount}>৳{total.toFixed(2)}</Text>
        </View>

        <Pressable
          onPress={() =>
            router.push({
              pathname: "/checkout",
              params: {
                coupon_code: appliedCoupon?.code ?? "",
                final_price: Math.max(0, subtotal - discount).toFixed(2),
              },
            })
          }
          style={({ pressed }) => [
            styles.checkoutBtn,
            { transform: [{ scale: pressed ? 0.98 : 1 }] },
          ]}
        >
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
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    gap: 8,
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
  qtyControls: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
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
    gap: 4,
  },
  couponField: {
    flexDirection: "row",
    alignItems: "center",
    height: 46,
    borderRadius: 6,
    paddingLeft: 12,
    paddingRight: 4,
    gap: 8,
  },
  couponInput: {
    flex: 1,
    height: "100%",
    fontSize: 14,
    fontWeight: "600",
    paddingVertical: 0,
  },
  applyBtn: {
    backgroundColor: "#57810d",
    paddingHorizontal: 16,
    height: 38,
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  applyBtnText: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "700",
  },
  couponApplied: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  couponAppliedLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  couponCode: {
    fontSize: 14,
    fontWeight: "700",
    color: "#57810d",
  },
  couponLabel: {
    fontSize: 12,
    color: "#4e7707",
  },
  summaryRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  summaryLabel: {
    fontSize: 14,
    fontWeight: "500",
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: "600",
  },
  divider: {
    height: 1,
    marginVertical: 2,
  },
  totalRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: "700",
  },
  totalAmount: {
    fontSize: 22,
    fontWeight: "800",
    color: "#57810d",
  },
  checkoutBtn: {
    backgroundColor: "#57810d",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 2,
  },
  checkoutText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
});
