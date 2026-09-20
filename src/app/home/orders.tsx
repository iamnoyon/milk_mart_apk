import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { usePullToRefresh } from "@/hooks/use-pull-to-refresh";
import { useGetMyOrdersQuery } from "@/store/admin/order";

const STATUS_COLORS: Record<string, { bg: string; fg: string }> = {
  pending: { bg: "#FFF4E5", fg: "#E07B00" },
  confirmed: { bg: "#E3F2FD", fg: "#1565C0" },
  delivered: { bg: "#E9F3D8", fg: "#57810d" },
  canceled: { bg: "#FDECEA", fg: "#C62828" },
};

function formatDate(iso?: string) {
  if (!iso) return "";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function OrdersTab() {
  const { data, isLoading, isError, refetch } = useGetMyOrdersQuery({});
  const orders: any[] = Array.isArray(data?.data) ? data!.data : [];
  console.log(data)

  const { refreshControl } = usePullToRefresh([refetch]);

  const renderOrder = ({ item }: { item: any }) => {
    const statusKey = (item.status ?? "pending").toLowerCase();
    const colors = STATUS_COLORS[statusKey] ?? STATUS_COLORS.pending;
    return (
      <Pressable
        onPress={() => router.push(`/order/${item.id}`)}
        style={({ pressed }) => [
          styles.card,
          { transform: [{ scale: pressed ? 0.99 : 1 }] },
        ]}
      >
        <View style={styles.cardHeader}>
          <View>
            <Text style={styles.orderLabel}>Order ID</Text>
            <Text style={styles.orderNumber}>#{item.order_number}</Text>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: colors.bg }]}>
            <Text style={[styles.statusText, { color: colors.fg }]}>
              {statusKey.replace("_", " ")}
            </Text>
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.cardFooter}>
          <View style={styles.metaItem}>
            <MaterialCommunityIcons
              name="calendar"
              size={14}
              color="#60646C"
            />
            <Text style={styles.metaText}>{formatDate(item.createdAt)}</Text>
          </View>
          <Text style={styles.totalPrice}>
            ৳{Number(item.total_price ?? 0).toFixed(2)}
          </Text>
        </View>
      </Pressable>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={["bottom"]}>
      <View style={styles.header}>
        <Text style={styles.title}>My Orders</Text>
        <Text style={styles.subtitle}>
          {isLoading ? "Loading..." : `${orders.length} order${orders.length === 1 ? "" : "s"}`}
        </Text>
      </View>

      {isLoading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#57810d" />
        </View>
      ) : isError ? (
        <View style={styles.center}>
          <MaterialCommunityIcons
            name="alert-circle-outline"
            size={56}
            color="#e53935"
          />
          <Text style={styles.errorTitle}>Couldn't load orders</Text>
          <Pressable style={styles.retryBtn} onPress={() => refetch()}>
            <Text style={styles.retryText}>Retry</Text>
          </Pressable>
        </View>
      ) : orders.length === 0 ? (
        <View style={styles.center}>
          <View style={styles.emptyIcon}>
            <MaterialCommunityIcons
              name="clipboard-text-outline"
              size={64}
              color="#60646C"
            />
          </View>
          <Text style={styles.emptyTitle}>No orders yet</Text>
          <Text style={styles.emptySub}>
            Your placed orders will appear here
          </Text>
        </View>
      ) : (
        <FlatList
          data={orders}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderOrder}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          refreshControl={refreshControl}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FEFEFE",
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
  },
  title: {
    fontSize: 22,
    fontWeight: "800",
    color: "#000",
  },
  subtitle: {
    fontSize: 13,
    color: "#60646C",
    marginTop: 2,
  },
  list: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  card: {
    backgroundColor: "#F0F0F3",
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  orderLabel: {
    fontSize: 11,
    color: "#60646C",
    fontWeight: "600",
    letterSpacing: 0.4,
    marginBottom: 2,
  },
  orderNumber: {
    fontSize: 15,
    fontWeight: "700",
    color: "#000",
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 11,
    fontWeight: "700",
    textTransform: "capitalize",
  },
  divider: {
    height: 1,
    backgroundColor: "#E0E1E6",
    marginVertical: 10,
  },
  cardFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  metaText: {
    fontSize: 13,
    color: "#60646C",
  },
  totalPrice: {
    fontSize: 16,
    fontWeight: "800",
    color: "#57810d",
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
  emptyIcon: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: "#F0F0F3",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 6,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#000",
  },
  emptySub: {
    fontSize: 13,
    color: "#60646C",
    textAlign: "center",
  },
});
