import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useSelector, useDispatch } from "react-redux";
import Toast from "react-native-toast-message";
import { useTheme } from "@/hooks/use-theme";
import { usePlaceOrderMutation } from "@/store/admin/order";
import { clearCart } from "@/store/cart";

const DELIVERY_FEE = 50;

const ADDRESS = {
  name: "Noyon Sarker",
  phone: "01889010237",
  lines: ["House 15, Road 10, Avenue B", "Mirpur DOSH"],
};

export default function CheckoutScreen() {
  const theme = useTheme();
  const dispatch = useDispatch();
  const items = useSelector((state: any) => state.cart.items);
  const { coupon_code, final_price } = useLocalSearchParams<{
    coupon_code?: string;
    final_price?: string;
  }>();

  const [PlaceOrder, { isLoading: placeOrderLoading }] = usePlaceOrderMutation();

  const rawSubtotal = items.reduce(
    (sum: number, item: any) => sum + item.price * item.quantity,
    0
  );
  const subtotal =
    final_price && final_price !== "" ? Number(final_price) : rawSubtotal;
  const total = subtotal + DELIVERY_FEE;

  const handlePlaceOrder = async () => {
    if (items.length === 0) {
      Toast.show({
        type: "error",
        text1: "Cart is empty",
        position: "bottom",
      });
      return;
    }

    const payload = {
      products: items.map((item: any) => ({
        id: item.id,
        quantity: item.quantity,
      })),
      coupon_code: coupon_code ?? "",
      delivery_fee: DELIVERY_FEE,
      payment_method: "cash_on_delivery",
    };

    try {
      const res: any = await PlaceOrder(payload).unwrap();
      const orderId = res?.data?.id;
      dispatch(clearCart());
      Toast.show({
        type: "success",
        text1: "Order placed",
        text2: res?.message ?? "Your order has been placed successfully",
        position: "bottom",
      });
      if (orderId !== undefined && orderId !== null) {
        router.replace(`/order/${orderId}`);
      } else {
        router.replace("/home/orders");
      }
    } catch (err: any) {
      const message =
        err?.data?.message ??
        err?.data?.detail ??
        "Failed to place order. Please try again.";
      Toast.show({ type: "error", text1: message, position: "bottom" });
    }
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.background }]}
      edges={["top", "bottom"]}
    >
      <View
        style={[
          styles.header,
          {
            backgroundColor: theme.background,
            borderBottomColor: theme.backgroundElement,
          },
        ]}
      >
        <Pressable
          onPress={() => router.back()}
          hitSlop={10}
          style={styles.backBtn}
        >
          <MaterialCommunityIcons
            name="arrow-left"
            size={24}
            color={theme.text}
          />
        </Pressable>
        <Text style={[styles.headerTitle, { color: theme.text }]}>Checkout</Text>
        <View style={styles.backBtn} />
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={[styles.sectionLabel, { color: theme.textSecondary }]}>
          DELIVERY ADDRESS
        </Text>
        <View
          style={[
            styles.card,
            {
              backgroundColor: theme.backgroundElement,
              borderColor: theme.backgroundElement,
            },
          ]}
        >
          <View style={styles.addressHeader}>
            <View style={{ flex: 1 }}>
              <Text style={[styles.addressName, { color: theme.text }]}>
                {ADDRESS.name}
              </Text>
              <Text style={[styles.addressPhone, { color: theme.textSecondary }]}>
                {ADDRESS.phone}
              </Text>
            </View>
          </View>
          <View
            style={[
              styles.divider,
              { backgroundColor: theme.backgroundSelected },
            ]}
          />
          {ADDRESS.lines.map((line, idx) => (
            <Text
              key={idx}
              style={[styles.addressLine, { color: theme.text }]}
            >
              {line}
            </Text>
          ))}
          <View style={styles.addressFooter}>
            <MaterialCommunityIcons
              name="map-marker"
              size={16}
              color="#57810d"
            />
            <Text style={styles.addressFooterText}>Delivery address</Text>
          </View>
        </View>

        <Text style={[styles.sectionLabel, { color: theme.textSecondary }]}>
          PAYMENT METHOD
        </Text>
        <View
          style={[
            styles.card,
            {
              backgroundColor: theme.backgroundElement,
              borderColor: theme.backgroundElement,
            },
          ]}
        >
          <MaterialCommunityIcons
            name="cash"
            size={26}
            color="#57810d"
          />
          <View style={{ flex: 1 }}>
            <Text style={[styles.paymentTitle, { color: theme.text }]}>
              Cash on Delivery
            </Text>
            <Text style={[styles.paymentSub, { color: theme.textSecondary }]}>
              Pay with cash when your order is delivered
            </Text>
          </View>
          <View style={[styles.radio, { borderColor: "#57810d" }]}>
            <View style={styles.radioDot} />
          </View>
        </View>

        <Text style={[styles.sectionLabel, { color: theme.textSecondary }]}>
          ORDER SUMMARY
        </Text>
        <View
          style={[
            styles.card,
            {
              backgroundColor: theme.backgroundElement,
              borderColor: theme.backgroundElement,
            },
          ]}
        >
          <View style={styles.summaryRow}>
            <Text style={[styles.summaryLabel, { color: theme.textSecondary }]}>
              Subtotal ({items.length} items)
            </Text>
            <Text style={[styles.summaryValue, { color: theme.text }]}>
              ৳{rawSubtotal.toFixed(2)}
            </Text>
          </View>
          {coupon_code && (
            <View style={styles.summaryRow}>
              <Text style={[styles.summaryLabel, { color: "#57810d" }]}>
                Coupon ({coupon_code})
              </Text>
              <Text style={[styles.summaryValue, { color: "#57810d" }]}>
                -৳{(rawSubtotal - subtotal).toFixed(2)}
              </Text>
            </View>
          )}
          <View style={styles.summaryRow}>
            <Text style={[styles.summaryLabel, { color: theme.textSecondary }]}>
              Delivery Fee
            </Text>
            <Text style={[styles.summaryValue, { color: theme.text }]}>
              ৳{DELIVERY_FEE.toFixed(2)}
            </Text>
          </View>
          <View
            style={[
              styles.divider,
              { backgroundColor: theme.backgroundSelected },
            ]}
          />
          <View style={styles.summaryRow}>
            <Text style={[styles.totalLabel, { color: theme.text }]}>Total</Text>
            <Text style={[styles.totalAmount, { color: "#57810d" }]}>
              ৳{total.toFixed(2)}
            </Text>
          </View>
        </View>
      </ScrollView>

      <View
        style={[
          styles.footer,
          {
            backgroundColor: theme.background,
            borderTopColor: theme.backgroundElement,
          },
        ]}
      >
        <Pressable
          onPress={handlePlaceOrder}
          disabled={placeOrderLoading}
          style={({ pressed }) => [
            styles.placeOrderBtn,
            {
              opacity: placeOrderLoading || pressed ? 0.7 : 1,
              transform: [{ scale: pressed ? 0.98 : 1 }],
            },
          ]}
        >
          <Text style={styles.placeOrderText}>
            {placeOrderLoading ? "Placing Order..." : "Place Order"}
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
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
    paddingHorizontal: 8,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  backBtn: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
  },
  content: {
    padding: 16,
    paddingBottom: 24,
    gap: 12,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 0.6,
    marginTop: 8,
    marginBottom: 4,
    paddingHorizontal: 4,
  },
  card: {
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    gap: 6,
  },
  addressHeader: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    gap: 8,
  },
  addressIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  addressName: {
    fontSize: 15,
    fontWeight: "700",
  },
  addressPhone: {
    fontSize: 13,
    marginTop: 2,
  },
  addressFooter: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    gap: 6,
    marginTop: 6,
  },
  addressFooterText: {
    fontSize: 12,
    color: "#57810d",
    fontWeight: "600",
  },
  divider: {
    height: 1,
    width: "100%",
    marginVertical: 6,
  },
  addressLine: {
    fontSize: 13,
    width: "100%",
    lineHeight: 19,
  },
  paymentTitle: {
    fontSize: 15,
    fontWeight: "700",
  },
  paymentSub: {
    fontSize: 12,
    marginTop: 2,
  },
  radio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    justifyContent: "center",
    alignItems: "center",
  },
  radioDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#57810d",
  },
  summaryRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
  },
  summaryLabel: {
    fontSize: 14,
    fontWeight: "500",
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: "600",
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: "700",
  },
  totalAmount: {
    fontSize: 20,
    fontWeight: "800",
  },
  footer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
  },
  placeOrderBtn: {
    backgroundColor: "#57810d",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  placeOrderText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
});
