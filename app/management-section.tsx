import { useState, useEffect } from "react";
import { View, Text, ScrollView } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { ScreenContainer } from "@/components/screen-container";
import { CRUDList, type CRUDItem } from "@/components/crud-list";
import { useColors } from "@/hooks/use-colors";

const SECTION_CONFIG = {
  brands: {
    title: "ماركات السيارات",
    icon: "directions-car",
    showColorPicker: false,
  },
  models: {
    title: "موديلات السيارات",
    icon: "model-training",
    showColorPicker: false,
  },
  trims: {
    title: "فئات السيارات",
    icon: "category",
    showColorPicker: false,
  },
  "exterior-colors": {
    title: "الألوان الخارجية",
    icon: "palette",
    showColorPicker: true,
  },
  "interior-colors": {
    title: "الألوان الداخلية",
    icon: "home-fill",
    showColorPicker: true,
  },
  "regional-specs": {
    title: "المواصفات الإقليمية",
    icon: "public",
    showColorPicker: false,
  },
};

export default function ManagementSection() {
  const router = useRouter();
  const colors = useColors();
  const { sectionId } = useLocalSearchParams<{ sectionId: string }>();

  const [items, setItems] = useState<CRUDItem[]>([
    {
      id: "1",
      name: "تويوتا",
      order: 1,
      hexCode: undefined,
    },
    {
      id: "2",
      name: "مرسيدس",
      order: 2,
      hexCode: undefined,
    },
  ]);

  const config =
    SECTION_CONFIG[sectionId as keyof typeof SECTION_CONFIG] || {};

  const handleAdd = (name: string, hexCode?: string) => {
    const newItem: CRUDItem = {
      id: Date.now().toString(),
      name,
      order: items.length + 1,
      hexCode,
    };
    setItems([...items, newItem]);
  };

  const handleUpdate = (id: string, name: string, hexCode?: string) => {
    setItems(
      items.map((item) =>
        item.id === id ? { ...item, name, hexCode: hexCode || item.hexCode } : item
      )
    );
  };

  const handleDelete = (id: string) => {
    setItems(items.filter((item) => item.id !== id));
  };

  const handleReorder = (reorderedItems: CRUDItem[]) => {
    setItems(
      reorderedItems.map((item, index) => ({
        ...item,
        order: index + 1,
      }))
    );
  };

  return (
    <ScreenContainer className="p-0">
      {/* Header */}
      <View
        className="px-4 py-4 border-b flex-row items-center gap-3"
        style={{ borderColor: colors.border }}
      >
        <Pressable onPress={() => router.back()}>
          <MaterialIcons
            name="arrow-back"
            size={24}
            color={colors.foreground}
          />
        </Pressable>
        <View className="flex-1">
          <Text
            className="text-lg font-bold text-foreground"
            style={{ fontFamily: "Cairo" }}
          >
            {config.title}
          </Text>
        </View>
      </View>

      {/* Content */}
      <CRUDList
        title={config.title || ""}
        icon={config.icon || "list"}
        items={items}
        onAdd={handleAdd}
        onUpdate={handleUpdate}
        onDelete={handleDelete}
        onReorder={handleReorder}
        showColorPicker={config.showColorPicker || false}
      />
    </ScreenContainer>
  );
}

import { Pressable } from "react-native";
