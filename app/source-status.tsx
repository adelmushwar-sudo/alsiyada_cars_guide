import { useState } from "react";
import { ScrollView, View, Text } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { CRUDListMultiSelect } from "@/components/crud-list-multi-select";
import { useToast } from "@/lib/toast-provider";

interface SourceStatusItem {
  id: string;
  name: string;
  order: number;
  selectedIds?: string[];
}

export default function SourceStatusScreen() {
  const colors = useColors();
  const { showToast } = useToast();

  // Mock data for models
  const mockModels: SourceStatusItem[] = [
    { id: "1", name: "كامري", order: 1 },
    { id: "2", name: "لاندكروزر", order: 2 },
    { id: "3", name: "برادو", order: 3 },
    { id: "4", name: "أفانزا", order: 4 },
  ];

  // State for source classification
  const [sourceClassification, setSourceClassification] = useState<SourceStatusItem[]>([
    { id: "1", name: "معرض", order: 1, selectedIds: ["1", "2"] },
    { id: "2", name: "مورد مباشر", order: 2, selectedIds: ["3", "4"] },
    { id: "3", name: "استيراد خارجي", order: 3, selectedIds: ["2"] },
  ]);

  // State for status tracking
  const [statusTracking, setStatusTracking] = useState<SourceStatusItem[]>([
    { id: "1", name: "متاحة", order: 1, selectedIds: ["1", "3", "4"] },
    { id: "2", name: "محجوزة", order: 2, selectedIds: ["2"] },
    { id: "3", name: "مباعة", order: 3, selectedIds: [] },
    { id: "4", name: "قيد الشحن", order: 4, selectedIds: ["2"] },
  ]);

  // Handler functions for source classification
  const handleAddSourceClassification = (name: string, _?: string, selectedIds?: string[]) => {
    const newItem: SourceStatusItem = {
      id: String(Date.now()),
      name,
      order: sourceClassification.length + 1,
      selectedIds,
    };
    setSourceClassification([...sourceClassification, newItem]);
    showToast("تمت إضافة التصنيف بنجاح", "success");
  };

  const handleUpdateSourceClassification = (id: string, name: string, _?: string, selectedIds?: string[]) => {
    setSourceClassification(
      sourceClassification.map((item) =>
        item.id === id ? { ...item, name, selectedIds } : item
      )
    );
    showToast("تم تحديث التصنيف بنجاح", "success");
  };

  const handleDeleteSourceClassification = (id: string) => {
    setSourceClassification(sourceClassification.filter((item) => item.id !== id));
  };

  const handleReorderSourceClassification = (items: SourceStatusItem[]) => {
    setSourceClassification(items);
  };

  // Handler functions for status tracking
  const handleAddStatusTracking = (name: string, _?: string, selectedIds?: string[]) => {
    const newItem: SourceStatusItem = {
      id: String(Date.now()),
      name,
      order: statusTracking.length + 1,
      selectedIds,
    };
    setStatusTracking([...statusTracking, newItem]);
    showToast("تمت إضافة الحالة بنجاح", "success");
  };

  const handleUpdateStatusTracking = (id: string, name: string, _?: string, selectedIds?: string[]) => {
    setStatusTracking(
      statusTracking.map((item) =>
        item.id === id ? { ...item, name, selectedIds } : item
      )
    );
    showToast("تم تحديث الحالة بنجاح", "success");
  };

  const handleDeleteStatusTracking = (id: string) => {
    setStatusTracking(statusTracking.filter((item) => item.id !== id));
  };

  const handleReorderStatusTracking = (items: SourceStatusItem[]) => {
    setStatusTracking(items);
  };

  return (
    <ScreenContainer className="bg-background">
      <ScrollView contentContainerStyle={{ flexGrow: 1, paddingBottom: 20 }}>
        {/* Header */}
        <View className="px-4 py-6 border-b" style={{ borderColor: colors.border }}>
          <Text
            className="text-3xl font-bold text-foreground"
            style={{ fontFamily: "Cairo" }}
          >
            مصدر السيارة والحالة
          </Text>
          <Text className="text-sm text-muted mt-2" style={{ fontFamily: "Cairo" }}>
            إدارة مصادر السيارات وتتبع حالتها
          </Text>
        </View>

        {/* Source Classification Section */}
        <View className="px-4 py-4">
          <CRUDListMultiSelect
            title="التصنيف"
            icon="category"
            items={sourceClassification}
            onAdd={handleAddSourceClassification}
            onUpdate={handleUpdateSourceClassification}
            onDelete={handleDeleteSourceClassification}
            onReorder={handleReorderSourceClassification}
            multiSelect={true}
            selectableItems={mockModels}
            selectLabel="اختر الموديلات"
          />
        </View>

        {/* Status Tracking Section */}
        <View className="px-4 py-4">
          <CRUDListMultiSelect
            title="تتبع الحالة"
            icon="track-changes"
            items={statusTracking}
            onAdd={handleAddStatusTracking}
            onUpdate={handleUpdateStatusTracking}
            onDelete={handleDeleteStatusTracking}
            onReorder={handleReorderStatusTracking}
            multiSelect={true}
            selectableItems={mockModels}
            selectLabel="اختر الموديلات"
          />
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
