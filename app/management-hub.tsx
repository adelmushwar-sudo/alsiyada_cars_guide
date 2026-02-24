import { useState } from "react";
import { View, Text, FlatList, Pressable, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";

interface ManagementSection {
  id: string;
  title: string;
  icon: string;
  description: string;
  count: number;
  color: string;
}

export default function ManagementHub() {
  const router = useRouter();
  const colors = useColors();

  const [sections, setSections] = useState<ManagementSection[]>([
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
      icon: "home-fill",
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
      style={({ pressed }) => [{ opacity: pressed ? 0.8 : 1 }]}
    >
      <View
        className="rounded-xl p-4 mb-3 border-2 flex-row items-center gap-3"
        style={{
          backgroundColor: item.color + "15",
          borderColor: item.color,
        }}
      >
        {/* Icon */}
        <View
          className="w-14 h-14 rounded-lg items-center justify-center"
          style={{ backgroundColor: item.color + "30" }}
        >
          <MaterialIcons name={item.icon as any} size={28} color={item.color} />
        </View>

        {/* Content */}
        <View className="flex-1">
          <Text
            className="font-bold text-foreground"
            style={{ fontFamily: "Cairo", fontSize: 15 }}
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

        {/* Count Badge */}
        <View
          className="px-3 py-1 rounded-full items-center justify-center"
          style={{ backgroundColor: item.color }}
        >
          <Text
            className="text-white font-bold text-xs"
            style={{ fontFamily: "Cairo" }}
          >
            {item.count}
          </Text>
        </View>

        {/* Arrow */}
        <MaterialIcons
          name="chevron-right"
          size={24}
          color={colors.foreground}
        />
      </View>
    </Pressable>
  );

  return (
    <ScreenContainer className="p-4">
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="mb-6">
          <Pressable onPress={() => router.back()}>
            <MaterialIcons
              name="arrow-back"
              size={24}
              color={colors.foreground}
            />
          </Pressable>
          <Text
            className="text-2xl font-bold text-foreground mt-3"
            style={{ fontFamily: "Cairo" }}
          >
            إدارة البيانات الأساسية
          </Text>
          <Text
            className="text-sm text-muted mt-1"
            style={{ fontFamily: "Cairo" }}
          >
            قم بإدارة جميع البيانات الأساسية للتطبيق
          </Text>
        </View>

        {/* Sections List */}
        <FlatList
          data={sections}
          renderItem={renderSection}
          keyExtractor={(item) => item.id}
          scrollEnabled={false}
        />

        {/* Info Card */}
        <View
          className="rounded-xl p-4 mt-6 border border-primary"
          style={{ backgroundColor: colors.primary + "10" }}
        >
          <View className="flex-row gap-3">
            <MaterialIcons
              name="info"
              size={20}
              color={colors.primary}
            />
            <Text
              className="flex-1 text-xs text-foreground"
              style={{ fontFamily: "Cairo" }}
            >
              يمكنك إضافة وتعديل وحذف العناصر من كل قسم. استخدم السحب والإفلات لترتيب العناصر حسب الأولوية.
            </Text>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
