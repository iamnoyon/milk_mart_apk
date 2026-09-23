import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Image,
  ScrollView,
  ActivityIndicator,
  Linking,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useGetOrderQuery } from "@/store/admin/order";
import { usePullToRefresh } from "@/hooks/use-pull-to-refresh";

type OrderStatus = "pending" | "confirmed" | "in_transit" | "delivered";

const STEPS = [
  { key: "pending", label: "Pending" },
  { key: "confirmed", label: "Confirmed" },
  { key: "delivered", label: "Delivered" },
];

const STATUS_INDEX: Record<OrderStatus, number> = {
  pending: 0,
  confirmed: 1,
  in_transit: 1,
  delivered: 2,
};

function formatDate(iso?: string) {
  if (!iso) return "—";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }) +
    " · " +
    d.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
}

export default function OrderDetailsScreen() {
  const params = useLocalSearchParams<{ id?: string }>();
  const orderId = params.id;

  const { data, isLoading, isError, refetch } = useGetOrderQuery(
    { id: orderId ?? "" },
    { skip: !orderId }
  );

  const order = data?.data ?? {};
  const displayId = order.order_number ?? orderId ?? "";
  const placedOn = formatDate(order.createdAt);
  const status = (order.status ?? "pending") as OrderStatus;
  const currentStep = STATUS_INDEX[status] ?? 0;

  const deliveryman = order.deliveryman ?? null;
  const hasDeliveryman = Boolean(deliveryman?.name || deliveryman?.phone);

  const items: any[] = Array.isArray(order.items) ? order.items : [];
  const subtotal = Number(order.subtotal ?? 0);
  const deliveryFee = Number(order.delivery_fee ?? 0);
  const totalPrice = Number(order.total_price ?? subtotal + deliveryFee);
  const couponValue = Number(order.coupon_value ?? 0);
  const appliedCoupon = order.applied_coupon ?? "";

  const { refreshControl } = usePullToRefresh([refetch]);

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
        <View style={[styles.header, { backgroundColor: "#57810d" }]}>
          <Pressable
            onPress={() => router.replace("/home/orders")}
            hitSlop={10}
            style={styles.backBtn}
          >
            <MaterialCommunityIcons
              name="arrow-left"
              size={24}
              color="#fff"
            />
          </Pressable>
          <Text style={styles.headerTitle}>Order Tracking</Text>
          <View style={styles.backBtn} />
        </View>
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#57810d" />
        </View>
      </SafeAreaView>
    );
  }

  if (isError || !orderId) {
    return (
      <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
        <View style={[styles.header, { backgroundColor: "#57810d" }]}>
          <Pressable
            onPress={() => router.replace("/home/orders")}
            hitSlop={10}
            style={styles.backBtn}
          >
            <MaterialCommunityIcons
              name="arrow-left"
              size={24}
              color="#fff"
            />
          </Pressable>
          <Text style={styles.headerTitle}>Order Tracking</Text>
          <View style={styles.backBtn} />
        </View>
        <View style={styles.center}>
          <MaterialCommunityIcons
            name="alert-circle-outline"
            size={56}
            color="#e53935"
          />
          <Text style={styles.errorTitle}>Order not found</Text>
          <Text style={styles.errorSub}>
            We couldn't load this order. Please try again.
          </Text>
          <Pressable style={styles.retryBtn} onPress={() => refetch()}>
            <Text style={styles.retryText}>Retry</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      <View style={styles.header}>
        <Pressable
          onPress={() => router.replace("/home/orders")}
          hitSlop={10}
          style={styles.backBtn}
        >
          <MaterialCommunityIcons name="arrow-left" size={24} color="#fff" />
        </Pressable>
        <Text style={styles.headerTitle}>Order Tracking</Text>
        <View style={styles.backBtn} />
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={refreshControl}
      >
        <View style={styles.trackingHeader}>
          <View>
            <Text style={styles.trackingLabel}>Order ID</Text>
            <Text style={styles.trackingOrderId}>#{displayId}</Text>
          </View>
          <View style={{ alignItems: "flex-end" }}>
            <Text style={styles.trackingLabel}>Placed on</Text>
            <Text style={styles.trackingDate}>{placedOn}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Order Status</Text>
          <View style={styles.stepsWrap}>
            {STEPS.map((step, idx) => {
              const isDone = idx < currentStep;
              const isActive = idx === currentStep;
              const isLast = idx === STEPS.length - 1;
              return (
                <View
                  key={step.key}
                  style={[styles.stepRow, isLast && { marginBottom: 0 }]}
                >
                  <View style={styles.stepIndicatorCol}>
                    <View
                      style={[
                        styles.stepDot,
                        isDone && styles.stepDotDone,
                        isActive && styles.stepDotActive,
                      ]}
                    >
                      <MaterialCommunityIcons
                        name="check"
                        size={14}
                        color={(isActive || isDone) ? "#fff" : "#9098A1"}
                      />
                    </View>
                    {!isLast && (
                      <View
                        style={[
                          styles.stepLine,
                          isDone && styles.stepLineDone,
                        ]}
                      />
                    )}
                  </View>
                  <View style={styles.stepTextCol}>
                    <Text
                      style={[
                        styles.stepLabel,
                        (isActive || isDone) && styles.stepLabelActive,
                      ]}
                    >
                      {step.label}
                    </Text>
                    {isActive && (
                      <Text style={styles.stepHint}>In progress</Text>
                    )}
                  </View>
                </View>
              );
            })}
          </View>
        </View>

        {items.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              Order Items ({items.length})
            </Text>
            <View style={styles.itemsCard}>
              {items.map((item: any, idx: number) => (
                <View
                  key={item.id ?? `${item.product_id}-${idx}`}
                  style={[
                    styles.itemRow,
                    idx === items.length - 1 && { borderBottomWidth: 0 },
                  ]}
                >
                  <View style={styles.itemThumb}>
                    <MaterialCommunityIcons
                      name="food-apple-outline"
                      size={20}
                      color="#57810d"
                    />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.itemName}>
                      {item.product_name}
                    </Text>
                    <Text style={styles.itemMeta}>
                      Qty {item.quantity} · ৳{Number(item.price).toFixed(2)} each
                    </Text>
                  </View>
                  <Text style={styles.itemTotal}>
                    ৳{(Number(item.price) * item.quantity).toFixed(2)}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Price Summary</Text>
          <View style={styles.priceCard}>
            <View style={styles.priceRow}>
              <Text style={styles.priceLabel}>Subtotal</Text>
              <Text style={styles.priceValue}>৳{subtotal.toFixed(2)}</Text>
            </View>
            {appliedCoupon && couponValue > 0 && (
              <View style={styles.priceRow}>
                <Text style={[styles.priceLabel, { color: "#57810d" }]}>
                  Coupon ({appliedCoupon})
                </Text>
                <Text style={[styles.priceValue, { color: "#57810d" }]}>
                  -৳{couponValue.toFixed(2)}
                </Text>
              </View>
            )}
            <View style={styles.priceRow}>
              <Text style={styles.priceLabel}>Delivery Fee</Text>
              <Text style={styles.priceValue}>৳{deliveryFee.toFixed(2)}</Text>
            </View>
            <View style={styles.priceDivider} />
            <View style={styles.priceRow}>
              <Text style={styles.priceTotalLabel}>Total</Text>
              <Text style={styles.priceTotalValue}>
                ৳{totalPrice.toFixed(2)}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          {hasDeliveryman ? (
            <View style={styles.deliveryCard}>
              <View style={styles.deliveryCardHeader}>
                <Text style={styles.deliveryCardTitle}>Delivery Person</Text>
              </View>
              <View style={styles.deliveryRow}>
                <View style={styles.deliveryAvatarWrap}>
                  {deliveryman?.image ? (
                    <Image
                      source={{ uri: deliveryman.image }}
                      style={styles.deliveryAvatar}
                    />
                  ) : (
                    <View style={styles.deliveryAvatarFallback}>
                      <MaterialCommunityIcons
                        name="account"
                        size={28}
                        color="#57810d"
                      />
                    </View>
                  )}
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.deliveryName}>
                    {deliveryman?.name ?? "Delivery person"}
                  </Text>
                  <Text style={styles.deliveryPhone}>
                    {deliveryman?.phone ?? ""}
                  </Text>
                </View>
                {deliveryman?.phone && (
                  <Pressable
                    style={styles.callBtn}
                    onPress={() =>
                      Linking.openURL(`tel:${deliveryman.phone}`)
                    }
                    hitSlop={6}
                  >
                    <MaterialCommunityIcons
                      name="phone"
                      size={18}
                      color="#fff"
                    />
                  </Pressable>
                )}
              </View>
            </View>
          ) : (
            <View style={styles.deliveryEmpty}>
              <View style={styles.deliveryCardHeader}>
                <Text style={styles.deliveryCardTitle}>Delivery Person</Text>
              </View>
              <View style={styles.deliveryRow}>
                <View style={styles.deliveryEmptyIcon}>
                  <MaterialCommunityIcons
                    name="truck-delivery-outline"
                    size={28}
                    color="#57810d"
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.deliveryEmptyTitle}>
                    Not assigned yet
                  </Text>
                  <Text style={styles.deliveryEmptySub}>
                    Your delivery person will be assigned soon
                  </Text>
                </View>
              </View>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FEFEFE",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 8,
    paddingVertical: 12,
    backgroundColor: "#57810d",
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
    color: "#fff",
  },
  content: {
    paddingBottom: 24,
  },
  trackingHeader: {
    backgroundColor: "#57810d",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingHorizontal: 20,
    paddingTop: 4,
    paddingBottom: 20,
  },
  trackingLabel: {
    fontSize: 11,
    fontWeight: "600",
    color: "rgba(255,255,255,0.8)",
    letterSpacing: 0.4,
    marginBottom: 2,
  },
  trackingOrderId: {
    fontSize: 16,
    fontWeight: "800",
    color: "#fff",
  },
  trackingDate: {
    fontSize: 13,
    fontWeight: "600",
    color: "#fff",
  },
  section: {
    marginTop: 18,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: "#60646C",
    letterSpacing: 0.5,
    marginBottom: 10,
  },
  stepsWrap: {
    backgroundColor: "#F0F0F3",
    borderRadius: 12,
    padding: 16,
  },
  stepRow: {
    flexDirection: "row",
    marginBottom: 4,
  },
  stepIndicatorCol: {
    alignItems: "center",
    width: 28,
  },
  stepDot: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: "#fff",
    borderWidth: 2,
    borderColor: "#C5C8CE",
    justifyContent: "center",
    alignItems: "center",
  },
  stepDotDone: {
    backgroundColor: "#57810d",
    borderColor: "#57810d",
  },
  stepDotActive: {
    backgroundColor: "#57810d",
    borderColor: "#57810d",
  },
  stepLine: {
    width: 2,
    flex: 1,
    backgroundColor: "#C5C8CE",
    marginVertical: 2,
    minHeight: 18,
  },
  stepLineDone: {
    backgroundColor: "#57810d",
  },
  stepTextCol: {
    flex: 1,
    paddingLeft: 12,
    paddingBottom: 18,
  },
  stepLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#60646C",
  },
  stepLabelActive: {
    color: "#000",
  },
  stepHint: {
    fontSize: 11,
    color: "#57810d",
    marginTop: 2,
    fontWeight: "600",
  },
  deliveryCard: {
    backgroundColor: "#F0F0F3",
    borderRadius: 12,
    padding: 14,
    gap: 12,
  },
  deliveryCardHeader: {
    borderBottomWidth: 1,
    borderBottomColor: "#E0E1E6",
    paddingBottom: 8,
  },
  deliveryCardTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: "#60646C",
    letterSpacing: 0.5,
  },
  deliveryRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  deliveryAvatarWrap: {
    width: 52,
    height: 52,
    borderRadius: 26,
    overflow: "hidden",
  },
  deliveryAvatar: {
    width: "100%",
    height: "100%",
  },
  deliveryAvatarFallback: {
    width: "100%",
    height: "100%",
    backgroundColor: "#e9f3d8",
    justifyContent: "center",
    alignItems: "center",
  },
  deliveryName: {
    fontSize: 15,
    fontWeight: "700",
    color: "#000",
  },
  deliveryPhone: {
    fontSize: 13,
    color: "#60646C",
    marginTop: 2,
  },
  callBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "#57810d",
    justifyContent: "center",
    alignItems: "center",
  },
  deliveryEmpty: {
    backgroundColor: "#F0F0F3",
    borderRadius: 12,
    padding: 14,
    gap: 12,
  },
  deliveryEmptyIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#e9f3d8",
    justifyContent: "center",
    alignItems: "center",
  },
  deliveryEmptyTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#000",
  },
  deliveryEmptySub: {
    fontSize: 12,
    color: "#60646C",
    marginTop: 2,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
    gap: 10,
  },
  errorTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#000",
    marginTop: 6,
  },
  errorSub: {
    fontSize: 13,
    color: "#60646C",
    textAlign: "center",
  },
  retryBtn: {
    marginTop: 8,
    backgroundColor: "#57810d",
    paddingHorizontal: 22,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "700",
  },
  itemsCard: {
    backgroundColor: "#F0F0F3",
    borderRadius: 12,
    padding: 8,
  },
  itemRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    gap: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E1E6",
  },
  itemThumb: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: "#e9f3d8",
    justifyContent: "center",
    alignItems: "center",
  },
  itemName: {
    fontSize: 14,
    fontWeight: "700",
    color: "#000",
  },
  itemMeta: {
    fontSize: 12,
    color: "#60646C",
    marginTop: 2,
  },
  itemTotal: {
    fontSize: 14,
    fontWeight: "700",
    color: "#57810d",
  },
  priceCard: {
    backgroundColor: "#F0F0F3",
    borderRadius: 12,
    padding: 14,
  },
  priceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 4,
  },
  priceLabel: {
    fontSize: 13,
    color: "#60646C",
    fontWeight: "500",
  },
  priceValue: {
    fontSize: 13,
    color: "#000",
    fontWeight: "600",
  },
  priceDivider: {
    height: 1,
    backgroundColor: "#E0E1E6",
    marginVertical: 6,
  },
  priceTotalLabel: {
    fontSize: 15,
    fontWeight: "700",
    color: "#000",
  },
  priceTotalValue: {
    fontSize: 18,
    fontWeight: "800",
    color: "#57810d",
  },
});
