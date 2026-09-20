import { View, Text, StyleSheet, FlatList, Pressable } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { router } from "expo-router";
import { useTheme } from "@/hooks/use-theme";
import { usePullToRefresh } from "@/hooks/use-pull-to-refresh";
import Skeleton from "@/components/Skeleton";
import { useGetCategoryListQuery } from "@/store/admin/category";

const SKELETON_COUNT = 8;

export default function CategoriesIndex() {
  const theme = useTheme();
  const { data: categorylist, isLoading, refetch } = useGetCategoryListQuery({});
  console.log(categorylist)

  const { refreshControl } = usePullToRefresh([refetch]);

  const skeletonData = Array.from({ length: SKELETON_COUNT });

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <FlatList
        data={isLoading ? skeletonData : categorylist?.data}
        keyExtractor={(item, index) => (isLoading ? `skeleton-${index}` : item.id.toString())}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={refreshControl}
        ListHeaderComponent={
          <Text style={[styles.headerTitle, { color: theme.text }]}>
            All Categories
          </Text>
        }
        renderItem={({ item, index }) =>
          isLoading ? (
            <View
              style={[
                styles.card,
                {
                  backgroundColor: theme.background,
                  borderColor: theme.backgroundElement,
                },
              ]}
            >
              <Skeleton width={56} height={56} borderRadius={12} />
              <View style={styles.info}>
                <Skeleton width="70%" height={15} borderRadius={4} />
                <Skeleton width="40%" height={12} borderRadius={4} style={{ marginTop: 6 }} />
              </View>
            </View>
          ) : (
            <Pressable
              onPress={() =>
                router.push({
                  pathname: `/home/categories/${item.id}`,
                  params: { name: item.name },
                })
              }
              style={({ pressed }) => [
                styles.card,
                {
                  backgroundColor: theme.background,
                  borderColor: theme.backgroundElement,
                  opacity: pressed ? 0.7 : 1,
                },
              ]}
            >
              <View
                style={[
                  styles.imageWrap,
                  { backgroundColor: theme.backgroundElement },
                ]}
              >
                <Image
                  source={{ uri: item?.image }}
                  style={styles.image}
                  contentFit="contain"
                />
              </View>

              <View style={styles.info}>
                <Text style={[styles.title, { color: theme.text }]}>
                  {item?.name}
                </Text>
                <Text style={[styles.total, { color: theme.textSecondary }]}>
                  {item?.quantity} Products
                </Text>
              </View>

              <MaterialCommunityIcons
                name="chevron-right"
                size={24}
                color={theme.textSecondary}
              />
            </Pressable>
          )
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 24,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 12,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 14,
    padding: 10,
    marginBottom: 12,
    gap: 12,
  },
  imageWrap: {
    width: 56,
    height: 56,
    borderRadius: 12,
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  info: {
    flex: 1,
    gap: 4,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
  },
  total: {
    fontSize: 13,
  },
});
