import { View, Text, StyleSheet, ScrollView, Pressable } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useTheme } from "@/hooks/use-theme";
import { useGetProductbyIdQuery } from "@/store/admin/products";

export default function ProductDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const theme = useTheme();

  const { data: productData } = useGetProductbyIdQuery({ id }, { skip: !id });

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={[styles.imageWrap, { backgroundColor: theme.backgroundElement }]}>
          <Image
             source={{ uri: productData?.data?.image }}
            style={styles.image}
            contentFit="cover"
          />
        </View>

        <View style={styles.content}>
          <View style={styles.header}>
            <View style={{ flex: 1 }}>
              <Text style={[styles.name, { color: theme.text }]}>{productData?.data?.name}</Text>
              <Text style={[styles.weight, { color: theme.textSecondary }]}>{productData?.data?.weight+" "+productData?.data?.weight_type}</Text>
            </View>
            <Text style={styles.price}>৳{productData?.data?.price?.toFixed(2)}</Text>
          </View>

          <View style={[styles.divider, { backgroundColor: theme.backgroundElement }]} />

          <Text style={[styles.descTitle, { color: theme.text }]}>Description</Text>
          <Text style={[styles.desc, { color: theme.textSecondary }]}>{productData?.data?.description || '-'}</Text>
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
