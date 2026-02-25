import { View, Text, FlatList, Pressable, ScrollView, Platform } from "react-native";
import { useRouter } from "expo-router";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useState } from "react";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface ManagementSection {
  id: string;
  title: string;
  icon: string;
  description: string;
  count: number;
  color: string;
}

export default function BasicDataManagement() {
  const router = useRouter();
  const colors = useColors();
  const insets = useSafeAreaInsets();

  const [sections] = useState<ManagementSection[]>([
    {
      id: "brands",
      title: "ماركات السيارات",
      icon: "directions-car",
      description: "إدارة ماركات السيارات المتوفرة",
      count: 12,
      color: "#1B3A70",
    },
    {
      id: "models",
      title: "موديلات السيارات",
      icon: "model-training",
      description: "إدارة موديلات السيارات",
      count: 45,
      color: "#C41E3A",
    },
    {
      id: "trims",
      title: "فئات السيارات",
      icon: "category",
      description: "إدارة فئات وتجهيزات السيارات",
      count: 120,
      color: "#E8A000",
    },
    {
      id: "exterior-colors",
      title: "الألوان الخارجية",
      icon: "palette",
      description: "إدارة ألوان الطلاء الخارجية",
      count: 18,
      color: "#00A86B",
    },
    {
      id: "interior-colors",
      title: "الألوان الداخلية",
      icon: "home",
      description: "إدارة ألوان الداخلية",
      count: 12,
      color: "#8B4513",
    },
    {
      id: "regional-specs",
      title: "المواصفات الإقليمية",
      icon: "public",
      description: "إدارة المواصفات الإقليمية",
      count: 8,
      color: "#4169E1",
    },
  ]);

  const handleSectionPress = (sectionId: string) => {
    router.push({
      pathname: "/management-section",
      params: { sectionId },
    });
  };

  const renderSection = ({ item }: { item: ManagementSection }) => (
    <Pressable
      onPress={() => handleSectionPress(item.id)}
      style={({ pressed }) => [
        {
          opacity: pressed ? 0.8 : 1,
          transitionProperty:
            Platform.OS === "web" ? "transform" : "none",
          transitionDuration: "200ms",
        },
      ]}
    >
      <View
        className="bg-surface rounded-lg border border-border overflow-hidden mb-3"
        style={{
          transitionProperty:
            Platform.OS === "web" ? "background-color, border-color" : "none",
          transitionDuration: "300ms",
        }}
      >
        {/* Header with Icon and Color */}
        <View
          className="flex-row items-center gap-3 px-4 py-4"
          style={{
            backgroundColor: item.color + "15",
            borderLeftWidth: 4,
            borderLeftColor: item.color,
          }}
        >
          <View
            className="w-12 h-12 rounded-lg items-center justify-center"
            style={{ backgroundColor: item.color + "25" }}
          >
            <MaterialIcons name={item.icon as any} size={24} color={item.color} />
          </View>
          <View className="flex-1">
            <Text
              className="text-base font-bold text-foreground"
              style={{ fontFamily: "Cairo" }}
            >
              {item.title}
            </Text>
            <Text
              className="text-xs text-muted mt-1"
              style={{ fontFamily: "Cairo" }}
            >
              {item.description}
            </Text>
          </View>
          <View className="items-center gap-1">
            <Text
              className="text-lg font-bold"
              style={{ color: item.color, fontFamily: "Cairo" }}
            >
              {item.count}
            </Text>
            <MaterialIcons name="arrow-forward" size={20} color={colors.muted} />
          </View>
        </View>
      </View>
    </Pressable>
  );

  return (
    <View
      className="flex-1 bg-background"
      style={{
        transitionProperty:
          Platform.OS === "web" ? "background-color" : "none",
        transitionDuration: "300ms",
      }}
    >
      {/* App Bar */}
      <View
        className="bg-background border-b border-border px-3 py-2 flex-row items-center justify-between"
        style={{
          paddingTop: insets.top + 8,
          paddingBottom: 8,
          transitionProperty:
            Platform.OS === "web"
              ? "background-color, border-color"
              : "none",
          transitionDuration: "300ms",
        }}
      >
        <Pressable
          onPress={() => router.back()}
          style={({ pressed }) => [{ opacity: pressed ? 0.6 : 1 }]}
        >
          <MaterialIcons name="arrow-back" size={24} color={colors.primary} />
        </Pressable>
        <Text
          className="text-base font-bold text-foreground flex-1 text-center"
          style={{ fontFamily: "Cairo" }}
        >
          إدارة البيانات الأساسية
        </Text>
        <View style={{ width: 24 }} />
      </View>

      <ScreenContainer className="flex-1 p-0">
        <FlatList
          data={sections}
          renderItem={renderSection}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{
            paddingHorizontal: 12,
            paddingVertical: 12,
          }}
          scrollEnabled
        />
      </ScreenContainer>
    </View>
  );
}
