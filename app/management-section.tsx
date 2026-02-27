import { useState } from "react";
import { View, Text, ScrollView, Pressable } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { ScreenContainer } from "@/components/screen-container";
import { CRUDListMultiSelect, type CRUDItem } from "@/components/crud-list-multi-select";
import { useColors } from "@/hooks/use-colors";

const SECTION_CONFIG = {
  brands: {
    title: "ماركات السيارات",
    icon: "directions-car",
    showColorPicker: false,
    requiresParent: false,
    parentLabel: "",
  },
  models: {
    title: "موديلات السيارات",
    icon: "model-training",
    showColorPicker: false,
    requiresParent: true,
    parentLabel: "اختر الماركة",
  },
  trims: {
    title: "فئات السيارات",
    icon: "category",
    showColorPicker: false,
    multiSelect: true,
    selectLabel: "اختر الموديلات",
  },
  "exterior-colors": {
    title: "الألوان الخارجية",
    icon: "palette",
    showColorPicker: true,
    multiSelect: true,
    selectLabel: "اختر الموديلات",
  },
  "interior-colors": {
    title: "الألوان الداخلية",
    icon: "home-fill",
    showColorPicker: true,
    multiSelect: true,
    selectLabel: "اختر الموديلات",
  },
  "regional-specs": {
    title: "المواصفات الإقليمية",
    icon: "public",
    showColorPicker: false,
    multiSelect: true,
    selectLabel: "اختر الموديلات",
  },
};

export default function ManagementSection() {
  const router = useRouter();
  const colors = useColors();
  const { sectionId } = useLocalSearchParams<{ sectionId: string }>();

  // Mock data - في التطبيق الحقيقي ستأتي من قاعدة البيانات
  const [brands, setBrands] = useState<CRUDItem[]>([
    {
      id: "1",
      name: "تويوتا",
      order: 1,
    },
    {
      id: "2",
      name: "مرسيدس",
      order: 2,
    },
    {
      id: "3",
      name: "بي إم دبليو",
      order: 3,
    },
  ]);

  const [models, setModels] = useState<CRUDItem[]>([
    {
      id: "m1",
      name: "لاند كروزر",
      order: 1,
      selectedIds: ["1"],
    },
    {
      id: "m2",
      name: "كامري",
      order: 2,
      selectedIds: ["1"],
    },
  ]);

  const [trims, setTrims] = useState<CRUDItem[]>([
    {
      id: "t1",
      name: "GXR",
      order: 1,
      selectedIds: ["m1"],
    },
    {
      id: "t2",
      name: "VXR",
      order: 2,
      selectedIds: ["m1"],
    },
  ]);

  const [exteriorColors, setExteriorColors] = useState<CRUDItem[]>([
    {
      id: "ec1",
      name: "أبيض لؤلؤي",
      order: 1,
      hexCode: "#FFFFFF",
      selectedIds: ["m1"],
    },
    {
      id: "ec2",
      name: "أسود معدني",
      order: 2,
      hexCode: "#000000",
      selectedIds: ["m1"],
    },
  ]);

  const [interiorColors, setInteriorColors] = useState<CRUDItem[]>([
    {
      id: "ic1",
      name: "بني فاتح",
      order: 1,
      hexCode: "#8B4513",
      selectedIds: ["m1"],
    },
  ]);

  const [regionalSpecs, setRegionalSpecs] = useState<CRUDItem[]>([
    {
      id: "rs1",
      name: "خليجي",
      order: 1,
      selectedIds: ["m1"],
    },
  ]);

  const config =
    SECTION_CONFIG[sectionId as keyof typeof SECTION_CONFIG] || {};

  // Get the appropriate data and setter based on section
  const getDataAndSetter = () => {
    switch (sectionId) {
      case "brands":
        return { items: brands, setItems: setBrands, parentItems: [] };
      case "models":
        return { items: models, setItems: setModels, parentItems: brands };
      case "trims":
        return { items: trims, setItems: setTrims, parentItems: models };
      case "exterior-colors":
        return {
          items: exteriorColors,
          setItems: setExteriorColors,
          parentItems: models,
        };
      case "interior-colors":
        return {
          items: interiorColors,
          setItems: setInteriorColors,
          parentItems: models,
        };
      case "regional-specs":
        return {
          items: regionalSpecs,
          setItems: setRegionalSpecs,
          parentItems: models,
        };
      default:
        return { items: [], setItems: () => {}, parentItems: [] };
    }
  };

  const { items, setItems, parentItems } = getDataAndSetter();

  const handleAdd = (name: string, hexCode?: string, selectedIds?: string[]) => {
    const newItem: CRUDItem = {
      id: Date.now().toString(),
      name,
      order: items.length + 1,
      hexCode: hexCode || undefined,
      selectedIds: selectedIds || undefined,
    };
    setItems([...items, newItem]);
  };

  const handleUpdate = (id: string, name: string, hexCode?: string, selectedIds?: string[]) => {
    setItems(
      items.map((item) =>
        item.id === id ? { ...item, name, hexCode: hexCode || item.hexCode, selectedIds: selectedIds || item.selectedIds } : item
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
      <CRUDListMultiSelect
        title={config.title || ""}
        icon={config.icon || "list"}
        items={items}
        onAdd={handleAdd}
        onUpdate={handleUpdate}
        onDelete={handleDelete}
        onReorder={handleReorder}
        showColorPicker={config.showColorPicker || false}
        multiSelect={(config as any).multiSelect || false}
        selectableItems={sectionId === "models" ? brands : models}
        selectLabel={(config as any).selectLabel || "اختر العناصر"}
      />
    </ScreenContainer>
  );
}
