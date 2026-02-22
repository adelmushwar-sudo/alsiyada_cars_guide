import { Pressable, View } from "react-native";
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
        bottom: 80 + insets.bottom,
        right: 16,
      }}
    >
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [
          {
            opacity: pressed ? 0.8 : 1,
            transform: [{ scale: pressed ? 0.95 : 1 }],
          },
        ]}
      >
        <View
          className="w-14 h-14 rounded-full items-center justify-center shadow-lg"
          style={{
            backgroundColor: colors.primary,
            elevation: 8,
            shadowColor: colors.primary,
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 8,
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
