import { View, Text, Pressable, Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useColors } from "@/hooks/use-colors";
import { cn } from "@/lib/utils";

interface AppHeaderProps {
  onMenuPress?: () => void;
  onSearchPress?: () => void;
  onFavoritesPress?: () => void;
  onNotificationsPress?: () => void;
  title?: string;
  showMenu?: boolean;
}

export function AppHeader({
  onMenuPress,
  onSearchPress,
  onFavoritesPress,
  onNotificationsPress,
  title = "دليل السيارات",
  showMenu = true,
}: AppHeaderProps) {
  const colors = useColors();
  const insets = useSafeAreaInsets();

  return (
    <View
      className="bg-background border-b border-border"
      style={{
        paddingTop: insets.top,
      }}
    >
      <View className="flex-row items-center justify-between px-4 py-3 h-16">
        {/* الجانب الأيمن - القائمة والعنوان */}
        <View className="flex-row items-center flex-1 gap-3">
          {showMenu && (
            <Pressable
              onPress={onMenuPress}
              style={({ pressed }) => [
                { opacity: pressed ? 0.6 : 1 },
              ]}
            >
              <MaterialIcons
                name="menu"
                size={28}
                color={colors.primary}
              />
            </Pressable>
          )}
          <Text
            className="text-xl font-bold text-primary"
            style={{ fontFamily: "Cairo" }}
          >
            {title}
          </Text>
        </View>

        {/* الجانب الأيسر - الأيقونات */}
        {showMenu && (
          <View className="flex-row items-center gap-2">
            <Pressable
              onPress={onFavoritesPress}
              style={({ pressed }) => [
                { opacity: pressed ? 0.6 : 1 },
              ]}
            >
              <MaterialIcons
                name="favorite-border"
                size={24}
                color={colors.primary}
              />
            </Pressable>

            <Pressable
              onPress={onNotificationsPress}
              style={({ pressed }) => [
                { opacity: pressed ? 0.6 : 1 },
              ]}
            >
              <MaterialIcons
                name="notifications-none"
                size={24}
                color={colors.primary}
              />
            </Pressable>

            <Pressable
              onPress={onSearchPress}
              style={({ pressed }) => [
                { opacity: pressed ? 0.6 : 1 },
              ]}
            >
              <MaterialIcons
                name="search"
                size={24}
                color={colors.primary}
              />
            </Pressable>
          </View>
        )}
      </View>
    </View>
  );
}
