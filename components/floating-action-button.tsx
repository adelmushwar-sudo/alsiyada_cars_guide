import { Pressable, View, Platform } from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useColors } from "@/hooks/use-colors";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface FloatingActionButtonProps {
  onPress?: () => void;
  icon?: keyof typeof MaterialIcons.glyphMap;
  size?: number;
}

export function FloatingActionButton({
  onPress,
  icon = "add",
  size = 28,
}: FloatingActionButtonProps) {
  const colors = useColors();
  const insets = useSafeAreaInsets();

  return (
    <View
      style={{
        position: "absolute",
        bottom: 72 + insets.bottom,
        right: 20,
        zIndex: 50,
      }}
    >
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [
          {
            opacity: pressed ? 0.85 : 1,
            transform: [{ scale: pressed ? 0.92 : 1 }],
            transitionProperty: Platform.OS === "web" ? "opacity, transform" : "none",
            transitionDuration: "150ms",
          },
        ]}
      >
        <View
          className="w-16 h-16 rounded-full items-center justify-center shadow-lg"
          style={{
            backgroundColor: colors.primary,
            elevation: 12,
            shadowColor: colors.primary,
            shadowOffset: { width: 0, height: 6 },
            shadowOpacity: 0.4,
            shadowRadius: 12,
            transitionProperty: Platform.OS === "web" ? "background-color, box-shadow" : "none",
            transitionDuration: "300ms",
          }}
        >
          <MaterialIcons
            name={icon}
            size={size}
            color="#FFFFFF"
          />
        </View>
      </Pressable>
    </View>
  );
}
