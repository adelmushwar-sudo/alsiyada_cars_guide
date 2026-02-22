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
        // انتقال سلس عند تغيير الألوان
        transitionProperty: Platform.OS === "web" ? "background-color, border-color" : "none",
        transitionDuration: Platform.OS === "web" ? "300ms" : "0ms",
        transitionTimingFunction: "ease-in-out",
      }}
    >
      <View className="flex-row items-center justify-between px-3 py-2 h-12">
        {/* الجانب الأيمن - القائمة والعنوان */}
        <View className="flex-row items-center flex-1 gap-2">
          {showMenu && (
            <Pressable
              onPress={onMenuPress}
              style={({ pressed }) => [
                {
                  opacity: pressed ? 0.6 : 1,
                  transitionProperty: Platform.OS === "web" ? "opacity" : "none",
                  transitionDuration: "150ms",
                },
              ]}
            >
              <MaterialIcons
                name="menu"
                size={24}
                color={colors.primary}
              />
            </Pressable>
          )}
          <Text
            className="text-lg font-bold text-primary"
            style={{
              fontFamily: "Cairo",
              transitionProperty: Platform.OS === "web" ? "color" : "none",
              transitionDuration: "300ms",
            }}
            numberOfLines={1}
          >
            {title}
          </Text>
        </View>

        {/* الجانب الأيسر - الأيقونات */}
        {showMenu && (
          <View className="flex-row items-center gap-1">
            <Pressable
              onPress={onFavoritesPress}
              style={({ pressed }) => [
                {
                  opacity: pressed ? 0.6 : 1,
                  transitionProperty: Platform.OS === "web" ? "opacity" : "none",
                  transitionDuration: "150ms",
                },
              ]}
            >
              <MaterialIcons
                name="favorite-border"
                size={20}
                color={colors.primary}
              />
            </Pressable>

            <Pressable
              onPress={onNotificationsPress}
              style={({ pressed }) => [
                {
                  opacity: pressed ? 0.6 : 1,
                  transitionProperty: Platform.OS === "web" ? "opacity" : "none",
                  transitionDuration: "150ms",
                },
              ]}
            >
              <MaterialIcons
                name="notifications-none"
                size={20}
                color={colors.primary}
              />
            </Pressable>

            <Pressable
              onPress={onSearchPress}
              style={({ pressed }) => [
                {
                  opacity: pressed ? 0.6 : 1,
                  transitionProperty: Platform.OS === "web" ? "opacity" : "none",
                  transitionDuration: "150ms",
                },
              ]}
            >
              <MaterialIcons
                name="search"
                size={20}
                color={colors.primary}
              />
            </Pressable>
          </View>
        )}
      </View>
    </View>
  );
}
