import { useState } from "react";
import { ScrollView, View, Text } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { CRUDListMultiSelect } from "@/components/crud-list-multi-select";
import { useToast } from "@/lib/toast-provider";

interface LegalItem {
  id: string;
  name: string;
  order: number;
  selectedIds?: string[];
}

export default function LegalStatusScreen() {
  const colors = useColors();
  const { showToast } = useToast();

  // Mock data for models
  const mockModels: LegalItem[] = [
    { id: "1", name: "كامري", order: 1 },
    { id: "2", name: "لاندكروزر", order: 2 },
    { id: "3", name: "برادو", order: 3 },
    { id: "4", name: "أفانزا", order: 4 },
  ];

  // State for customs status
  const [customsStatus, setCustomsStatus] = useState<LegalItem[]>([
    { id: "1", name: "مستخلصة من الجمارك", order: 1, selectedIds: ["1", "2", "3"] },
    { id: "2", name: "قيد الإفراج الجمركي", order: 2, selectedIds: ["4"] },
    { id: "3", name: "معفاة من الرسوم", order: 3, selectedIds: ["2"] },
  ]);

  // Handler functions for customs status
  const handleAddCustomsStatus = (name: string, _?: string, selectedIds?: string[]) => {
    const newItem: LegalItem = {
      id: String(Date.now()),
      name,
      order: customsStatus.length + 1,
      selectedIds,
    };
    setCustomsStatus([...customsStatus, newItem]);
    showToast("تمت إضافة حالة الجمارك بنجاح", "success");
  };

  const handleUpdateCustomsStatus = (id: string, name: string, _?: string, selectedIds?: string[]) => {
    setCustomsStatus(
      customsStatus.map((item) =>
        item.id === id ? { ...item, name, selectedIds } : item
      )
    );
    showToast("تم تحديث حالة الجمارك بنجاح", "success");
  };

  const handleDeleteCustomsStatus = (id: string) => {
    setCustomsStatus(customsStatus.filter((item) => item.id !== id));
  };

  const handleReorderCustomsStatus = (items: LegalItem[]) => {
    setCustomsStatus(items);
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
            الحالة القانونية
          </Text>
          <Text className="text-sm text-muted mt-2" style={{ fontFamily: "Cairo" }}>
            إدارة حالات الجمارك والوضع القانوني للسيارات
          </Text>
        </View>

        {/* Customs Status Section */}
        <View className="px-4 py-4">
          <CRUDListMultiSelect
            title="حالة الجمارك"
            icon="gavel"
            items={customsStatus}
            onAdd={handleAddCustomsStatus}
            onUpdate={handleUpdateCustomsStatus}
            onDelete={handleDeleteCustomsStatus}
            onReorder={handleReorderCustomsStatus}
            multiSelect={true}
            selectableItems={mockModels}
            selectLabel="اختر الموديلات"
          />
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
