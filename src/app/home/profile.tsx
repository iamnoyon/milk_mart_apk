import { useAuth } from "@/components/Auth/AuthProvider";
import { usePullToRefresh } from "@/hooks/use-pull-to-refresh";
import { useGetProfileQuery, useUpdateProfilePhotoMutation } from "@/store/auth";
import { setProfileImageUrl } from "@/store/user";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { Image } from "expo-image";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import { useDispatch, useSelector } from "react-redux";

interface UserData {
  area?: string;
  avenue?: string;
  flat?: string;
  house?: string;
  id?: number | string;
  name?: string;
  phone?: string;
  road?: string;
  role?: string;
  verified?: boolean;
}

interface UserState {
  email?: string;
  id?: number | string;
  name?: string;
  profile_image?: string;
  role?: string;
  data?: UserData;
  token?: string;
}

const InfoRow = ({
  icon,
  label,
  value,
  compact = false,
}: {
  icon: string;
  label: string;
  value?: string | number | null;
  compact?: boolean;
}) => {
  const display =
    value === null || value === undefined || value === "" ? "—" : String(value);

  return (
    <View style={compact ? infoRowStyles.rowCompact : infoRowStyles.row}>
      <View
        style={
          compact ? infoRowStyles.iconWrapCompact : infoRowStyles.iconWrap
        }
      >
        <MaterialCommunityIcons
          name={icon}
          size={compact ? 16 : 18}
          color="#57810d"
        />
      </View>
      <View style={{ flex: 1, minWidth: 0 }}>
        <Text
          numberOfLines={1}
          style={
            compact ? infoRowStyles.labelCompact : infoRowStyles.label
          }
        >
          {label}
        </Text>
        <Text
          numberOfLines={1}
          style={
            compact ? infoRowStyles.valueCompact : infoRowStyles.value
          }
        >
          {display}
        </Text>
      </View>
    </View>
  );
};

const infoRowStyles = {
  row: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  rowCompact: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    paddingVertical: 8,
  },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "#f3f7ed",
    justifyContent: "center" as const,
    alignItems: "center" as const,
    marginRight: 12,
  },
  iconWrapCompact: {
    width: 30,
    height: 30,
    borderRadius: 8,
    backgroundColor: "#f3f7ed",
    justifyContent: "center" as const,
    alignItems: "center" as const,
    marginRight: 10,
  },
  label: {
    fontSize: 12,
    color: "#888",
    marginBottom: 2,
  },
  labelCompact: {
    fontSize: 11,
    color: "#888",
    marginBottom: 2,
  },
  value: {
    fontSize: 15,
    color: "#222",
    fontWeight: "500" as const,
    flexShrink: 1,
  },
  valueCompact: {
    fontSize: 14,
    color: "#222",
    fontWeight: "500" as const,
    flexShrink: 1,
  },
};

export default function ProfileTab() {
  const { logout } = useAuth();
  const dispatch = useDispatch();
  const [uploading, setUploading] = useState(false);
  const [UpdateProfilePhoto] = useUpdateProfilePhotoMutation()

  const { data: profileResponse, refetch } = useGetProfileQuery();
  const { refreshControl } = usePullToRefresh([refetch]);
  const state = useSelector(
    (state: { user?: UserState }) => state.user
  );

  useEffect(() => {
    if (profileResponse && Object.keys(profileResponse).length > 0) {
      dispatch({ type: "user/setUser", payload: profileResponse });
    }
  }, [profileResponse, dispatch]);

  const profile = (profileResponse as any)?.data ?? state?.data ?? {};
  const fullName =
    profile.name ??
    (profileResponse as any)?.name ??
    state?.name ??
    "";
  const phone = profile.phone ?? "";
  const role =
    profile.role ??
    (profileResponse as any)?.role ??
    state?.role ??
    "";
  const verified = !!profile.verified;
  const userId = profile.id ?? (profileResponse as any)?.id ?? state?.id;
  const profileImageUrl =
    profile.profile_image ??
    state?.profile_image ??
    (profileResponse as any)?.profile_image ??
    state?.profileImageUrl ??
    (profileResponse as any)?.profileImageUrl ??
    "";

  const displayImageUri = profileImageUrl;

  const initials = fullName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");

  const handleLogout = async () => {
    await logout();
    router.replace("/");
  };

  const handlePickImage = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      Alert.alert(
        "Permission required",
        "Permission to access the media library is required to change your avatar."
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (result.canceled || !result.assets[0]?.uri) return;

    const asset = result.assets[0];
    setUploading(true);

    try {
      const fileName = asset.fileName ?? `avatar-${Date.now()}.jpg`;
      const fileType = asset.mimeType ?? "image/jpeg";
      const token = state?.token;

      const formData = new FormData();
      formData.append("file", {
        uri: asset.uri,
        name: fileName,
        type: fileType,
      } as any);

      const xhr = new XMLHttpRequest();
      const uploadResult: {
        ok: boolean;
        status: number;
        body: any;
      } = await new Promise((resolve, reject) => {
        xhr.open(
          "POST",
          "https://fmd-6pes.onrender.com/upload/?folder=uploads"
        );
        if (token) {
          xhr.setRequestHeader("Authorization", `Bearer ${token}`);
        }

        xhr.onload = () => {
          let body: any = null;
          try {
            body = JSON.parse(xhr.responseText);
          } catch {
            body = xhr.responseText;
          }
          resolve({ ok: xhr.status >= 200 && xhr.status < 300, status: xhr.status, body });
        };
        xhr.onerror = () => reject(new Error("Network error during upload"));
        xhr.send(formData as any);
      });

      if (!uploadResult.ok) {
        console.error(
          "Avatar upload failed:",
          uploadResult.status,
          uploadResult.body
        );
        Alert.alert(
          "Upload failed",
          `Server returned ${uploadResult.status}.`
        );
        return;
      }

      const uploadData = uploadResult.body;
      const url =
        uploadData?.url ??
        uploadData?.data?.url ??
        uploadData?.fileUrl ??
        uploadData?.data?.fileUrl ??
        uploadData?.profile_image ??
        uploadData?.data?.profile_image ??
        null;

      console.log("Uploaded avatar URL:", url ?? uploadData);

      if (url) {
        dispatch(setProfileImageUrl(url));
        UpdateProfilePhoto({
          "profile_image": url
        })
          .unwrap()
          .then(res => {
            Toast.show({
              type: "success",
              text1: "Profile Phote uploaded",
              position: "top",
              visibilityTime: 1500,
            });
          })
          .catch(err => {
            console.log(err)
            Toast.show({
              type: "error",
              text1: "Failed profile phote uploading.",
              position: "top",
              visibilityTime: 1500,
            });
          })
      }
    } catch (error) {
      console.error("Avatar upload failed:", error);
      Alert.alert("Upload failed", "Unable to upload your avatar. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <SafeAreaView edges={["bottom"]} style={{ flex: 1, backgroundColor: "#FEFEFE", overflow: "hidden" }}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 40 }}
        refreshControl={refreshControl}
        showsHorizontalScrollIndicator={false}
        horizontal={false}
        scrollEnabled={false}
      >
        <View style={styles.header}>

        <Pressable
            onPress={handlePickImage}
            disabled={uploading}
            style={({ pressed }) => [
              styles.avatarWrap,
              { opacity: pressed || uploading ? 0.85 : 1 },
            ]}
          >
            {displayImageUri ? (
              <Image
                source={{ uri: displayImageUri }}
                style={styles.avatar}
                contentFit="cover"
              />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <Text style={styles.avatarInitials}>
                  {initials || "?"}
                </Text>
              </View>
            )}
            <View style={styles.editBadge}>
              <MaterialCommunityIcons
                name={uploading ? "cloud-upload" : "camera"}
                size={14}
                color="#fff"
              />
            </View>
            {verified && (
              <View style={styles.verifiedBadge}>
                <MaterialCommunityIcons
                  name="check-decagram"
                  size={16}
                  color="#fff"
                />
              </View>
            )}
          </Pressable>

          <Text style={styles.name}>{fullName || "Unnamed User"}</Text>

          {role ? (
            <View style={styles.roleChip}>
              <Text style={styles.roleChipText}>{role.toUpperCase()}</Text>
            </View>
          ) : null}
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Contact & Address</Text>
          <InfoRow icon="phone" label="Phone" value={phone} />
          <View style={styles.gridRow}>
            <View style={styles.gridCol}>
              <InfoRow icon="home-city" label="Area" value={profile.area} compact />
            </View>
            <View style={styles.gridCol}>
              <InfoRow icon="road" label="Road" value={profile.road} compact />
            </View>
          </View>
          <View style={styles.gridRow}>
            <View style={styles.gridCol}>
              <InfoRow icon="map-marker" label="Avenue" value={profile.avenue} compact />
            </View>
            <View style={styles.gridCol}>
              <InfoRow icon="home" label="House" value={profile.house} compact />
            </View>
          </View>
          <View style={styles.gridRow}>
            <View style={styles.gridCol}>
              <InfoRow icon="door" label="Flat" value={profile.flat} compact />
            </View>
            <View style={styles.gridCol} />
          </View>
          <View style={styles.loyaltyBanner}>
            <View style={styles.loyaltyBannerHeader}>
              <View style={styles.loyaltyIconWrap}>
                <MaterialCommunityIcons
                  name="star-circle"
                  size={14}
                  color="#fff"
                />
              </View>
              <Text style={styles.loyaltyBannerTitle}>Loyalty Points</Text>
            </View>
            <Text style={styles.loyaltyValue}>—</Text>
          </View>
        </View>

        <Pressable
          onPress={handleLogout}
          style={({ pressed }) => ({
            marginTop: 14,
            marginHorizontal: 24,
            height: 50,
            borderRadius: 12,
            backgroundColor: pressed ? "#cc3333" : "#dd4444",
            justifyContent: "center",
            alignItems: "center",
            opacity: pressed ? 0.9 : 1,
          })}
        >
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <MaterialCommunityIcons
              name="logout"
              size={18}
              color="#FFF"
              style={{ marginRight: 8 }}
            />
            <Text
              style={{
                color: "#FFF",
                fontSize: 16,
                fontWeight: "600",
              }}
            >
              Logout
            </Text>
          </View>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = {
  header: {
    alignItems: "center" as const,
    paddingTop: 8,
    paddingBottom: 16,
    marginTop: 10
  },
  avatarWrap: {
    position: "relative" as const,
    marginBottom: 12,
  },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
  },
  avatarPlaceholder: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: "#57810d",
    justifyContent: "center" as const,
    alignItems: "center" as const,
  },
  avatarInitials: {
    color: "#fff",
    fontSize: 32,
    fontWeight: "700" as const,
  },
  verifiedBadge: {
    position: "absolute" as const,
    top: 0,
    right: 0,
    backgroundColor: "#57810d",
    borderRadius: 12,
    width: 26,
    height: 26,
    justifyContent: "center" as const,
    alignItems: "center" as const,
    borderWidth: 2,
    borderColor: "#fff",
  },
  editBadge: {
    position: "absolute" as const,
    bottom: 0,
    right: 0,
    backgroundColor: "#222",
    borderRadius: 14,
    width: 28,
    height: 28,
    justifyContent: "center" as const,
    alignItems: "center" as const,
    borderWidth: 2,
    borderColor: "#fff",
  },
  name: {
    fontSize: 20,
    fontWeight: "700" as const,
    color: "#222",
    textAlign: "center" as const,
    paddingHorizontal: 16,
  },
  roleChip: {
    marginTop: 8,
    backgroundColor: "#f3f7ed",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    maxWidth: "100%" as const,
  },
  roleChipText: {
    color: "#57810d",
    fontSize: 11,
    fontWeight: "700" as const,
    letterSpacing: 0.5,
  },
  card: {
    backgroundColor: "#fff",
    marginTop: 10,
    marginHorizontal: 16,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#eee",
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: "700" as const,
    color: "#888",
    textTransform: "uppercase" as const,
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  gridRow: {
    flexDirection: "row" as const,
    gap: 12,
  },
  gridCol: {
    flex: 1,
    minWidth: 0,
    maxWidth: "50%" as const,
  },
  loyaltyBanner: {
    marginTop: 14,
    marginHorizontal: -4,
    padding: 12,
    borderRadius: 10,
    backgroundColor: "#57810d",
  },
  loyaltyBannerHeader: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    marginBottom: 4,
  },
  loyaltyBannerTitle: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "700" as const,
    letterSpacing: 0.5,
    textTransform: "uppercase" as const,
  },
  loyaltyIconWrap: {
    width: 26,
    height: 26,
    borderRadius: 7,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center" as const,
    alignItems: "center" as const,
    marginRight: 8,
  },
  loyaltyValue: {
    fontSize: 20,
    fontWeight: "700" as const,
    color: "#fff",
    marginVertical: 2,
  },
  loyaltyHint: {
    fontSize: 11,
    color: "rgba(255,255,255,0.85)",
    marginTop: 2,
  },
};
