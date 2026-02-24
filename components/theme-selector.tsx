import { View, Pressable, Text, Platform } from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useColors } from "@/hooks/use-colors";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useThemeContext } from "@/lib/theme-provider";

type ThemeMode = "light" | "dark" | "system";

interface ThemeSelectorProps {
  onThemeChange?: (theme: ThemeMode) => void;
}

export function ThemeSelector({ onThemeChange }: ThemeSelectorProps) {
  const colors = useColors();
  const { themeMode, setThemeMode } = useThemeContext();
  const [selectedTheme, setSelectedTheme] = useState<ThemeMode>(themeMode);

  useEffect(() => {
    setSelectedTheme(themeMode);
  }, [themeMode]);

  const handleThemeSelect = async (theme: ThemeMode) => {
    setSelectedTheme(theme);
    await setThemeMode(theme);
    onThemeChange?.(theme);
  };

  const themes: Array<{
    id: ThemeMode;
    label: string;
    icon: string;
    description: string;
  }> = [
    { id: "light", label: "فاتح", icon: "light-mode", description: "وضع نهاري" },
    { id: "dark", label: "داكن", icon: "dark-mode", description: "وضع ليلي" },
    {
      id: "system",
      label: "النظام",
      icon: "brightness-auto",
      description: "اتباع إعدادات النظام",
    },
  ];

  return (
    <View className="gap-3">
      <Text
        className="text-sm font-bold text-muted px-1"
        style={{ fontFamily: "Cairo" }}
      >
        اختر المظهر المفضل
      </Text>

      <View className="gap-2">
        {themes.map((theme) => {
          const isSelected = selectedTheme === theme.id;
          const bgColor = isSelected ? colors.primary : colors.surface;
          const textColor = isSelected ? "#FFFFFF" : colors.foreground;
          const borderColor = isSelected ? colors.primary : colors.border;

          return (
            <Pressable
              key={theme.id}
              onPress={() => handleThemeSelect(theme.id)}
              style={({ pressed }) => [
                {
                  opacity: pressed ? 0.8 : 1,
                  transitionProperty:
                    Platform.OS === "web" ? "all" : "none",
                  transitionDuration: "300ms",
                },
              ]}
            >
              <View
                className="flex-row items-center gap-3 px-4 py-3 rounded-lg border-2"
                style={{
                  backgroundColor: bgColor + (isSelected ? "" : "00"),
                  borderColor,
                  transitionProperty:
                    Platform.OS === "web"
                      ? "background-color, border-color"
                      : "none",
                  transitionDuration: "300ms",
                }}
              >
                <View
                  className="w-10 h-10 rounded-lg items-center justify-center"
                  style={{
                    backgroundColor: isSelected
                      ? "#FFFFFF" + "20"
                      : colors.primary + "20",
                  }}
                >
                  <MaterialIcons
                    name={theme.icon as any}
                    size={20}
                    color={isSelected ? "#FFFFFF" : colors.primary}
                  />
                </View>

                <View className="flex-1">
                  <Text
                    className="font-semibold"
                    style={{
                      color: textColor,
                      fontFamily: "Cairo",
                      fontSize: 14,
                    }}
                  >
                    {theme.label}
                  </Text>
                  <Text
                    className="text-xs"
                    style={{
                      color: isSelected
                        ? "#FFFFFF" + "80"
                        : colors.muted,
                      fontFamily: "Cairo",
                    }}
                  >
                    {theme.description}
                  </Text>
                </View>

                {isSelected && (
                  <View
                    className="w-6 h-6 rounded-full items-center justify-center"
                    style={{ backgroundColor: "#FFFFFF" }}
                  >
                    <MaterialIcons
                      name="check"
                      size={16}
                      color={colors.primary}
                    />
                  </View>
                )}
              </View>
            </Pressable>
          );
        })}
      </View>

      {/* معلومات إضافية عن وضع النظام */}
      {selectedTheme === "system" && (
        <View
          className="bg-primary opacity-10 rounded-lg p-3 mt-2 border border-primary"
          style={{
            transitionProperty:
              Platform.OS === "web"
                ? "background-color, border-color"
                : "none",
            transitionDuration: "300ms",
          }}
        >
          <Text
            className="text-xs text-foreground"
            style={{ fontFamily: "Cairo" }}
          >
            ℹ️ التطبيق سيتابع تلقائياً تغييرات إعدادات النظام في الوقت الفعلي
          </Text>
        </View>
      )}
    </View>
  );
}
