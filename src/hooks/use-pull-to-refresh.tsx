import { useCallback, useState } from "react";
import { RefreshControl } from "react-native";
import { useTheme } from "@/hooks/use-theme";

type Refetcher = () => unknown | Promise<unknown>;

export function usePullToRefresh(refetchers: Refetcher[] = []) {
  const theme = useTheme();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(async () => {
    if (refetchers.length === 0) {
      setRefreshing(true);
      setRefreshing(false);
      return;
    }
    setRefreshing(true);
    await Promise.all(refetchers.map((fn) => fn()));
    setRefreshing(false);
  }, [refetchers]);

  const refreshControl = (
    <RefreshControl
      refreshing={refreshing}
      onRefresh={onRefresh}
      tintColor={theme.tint}
      colors={[theme.tint]}
    />
  );

  return { refreshing, onRefresh, refreshControl };
}