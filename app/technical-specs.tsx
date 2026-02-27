import { useState } from "react";
import { ScrollView, View, Text, Pressable } from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { CRUDListMultiSelect } from "@/components/crud-list-multi-select";
import { useToast } from "@/lib/toast-provider";

interface TechSpec {
  id: string;
  name: string;
  order: number;
  selectedIds?: string[];
}

export default function TechnicalSpecsScreen() {
  const colors = useColors();
  const { showToast } = useToast();

  // Mock data for models
  const mockModels: TechSpec[] = [
    { id: "1", name: "كامري", order: 1 },
    { id: "2", name: "لاندكروزر", order: 2 },
    { id: "3", name: "برادو", order: 3 },
    { id: "4", name: "أفانزا", order: 4 },
  ];

  // State for each section
  const [fuelTypes, setFuelTypes] = useState<TechSpec[]>([
    { id: "1", name: "بنزين", order: 1, selectedIds: ["1", "2"] },
    { id: "2", name: "ديزل", order: 2, selectedIds: ["3"] },
  ]);

  const [transmissions, setTransmissions] = useState<TechSpec[]>([
    { id: "1", name: "أوتوماتيك", order: 1, selectedIds: ["1", "2", "3"] },
    { id: "2", name: "يدوي", order: 2, selectedIds: ["4"] },
  ]);

  const [driveTypes, setDriveTypes] = useState<TechSpec[]>([
    { id: "1", name: "دفع أمامي", order: 1, selectedIds: ["1", "4"] },
    { id: "2", name: "دفع خلفي", order: 2, selectedIds: ["2", "3"] },
  ]);

  const [engineTypes, setEngineTypes] = useState<TechSpec[]>([
    { id: "1", name: "محرك V6", order: 1, selectedIds: ["2", "3"] },
    { id: "2", name: "محرك V8", order: 2, selectedIds: ["2"] },
  ]);

  const [engineSizes, setEngineSizes] = useState<TechSpec[]>([
    { id: "1", name: "2.0L", order: 1, selectedIds: ["1", "4"] },
    { id: "2", name: "3.5L", order: 2, selectedIds: ["2", "3"] },
  ]);

  const [additionalSpecs, setAdditionalSpecs] = useState<TechSpec[]>([
    { id: "1", name: "نظام الدفع الرباعي", order: 1, selectedIds: ["2", "3"] },
    { id: "2", name: "نظام التحكم بالثبات", order: 2, selectedIds: ["1", "2", "3", "4"] },
  ]);

  // Handler functions
  const handleAddFuel = (name: string, _?: string, selectedIds?: string[]) => {
    const newItem: TechSpec = {
      id: String(Date.now()),
      name,
      order: fuelTypes.length + 1,
      selectedIds,
    };
    setFuelTypes([...fuelTypes, newItem]);
    showToast("تمت إضافة نوع الوقود بنجاح", "success");
  };

  const handleUpdateFuel = (id: string, name: string, _?: string, selectedIds?: string[]) => {
    setFuelTypes(
      fuelTypes.map((item) =>
        item.id === id ? { ...item, name, selectedIds } : item
      )
    );
    showToast("تم تحديث نوع الوقود بنجاح", "success");
  };

  const handleDeleteFuel = (id: string) => {
    setFuelTypes(fuelTypes.filter((item) => item.id !== id));
  };

  const handleReorderFuel = (items: TechSpec[]) => {
    setFuelTypes(items);
  };

  // Similar handlers for other sections (abbreviated for brevity)
  const handleAddTransmission = (name: string, _?: string, selectedIds?: string[]) => {
    const newItem: TechSpec = {
      id: String(Date.now()),
      name,
      order: transmissions.length + 1,
      selectedIds,
    };
    setTransmissions([...transmissions, newItem]);
    showToast("تمت إضافة ناقل الحركة بنجاح", "success");
  };

  const handleUpdateTransmission = (id: string, name: string, _?: string, selectedIds?: string[]) => {
    setTransmissions(
      transmissions.map((item) =>
        item.id === id ? { ...item, name, selectedIds } : item
      )
    );
    showToast("تم تحديث ناقل الحركة بنجاح", "success");
  };

  const handleDeleteTransmission = (id: string) => {
    setTransmissions(transmissions.filter((item) => item.id !== id));
  };

  const handleReorderTransmission = (items: TechSpec[]) => {
    setTransmissions(items);
  };

  // Drive type handlers
  const handleAddDriveType = (name: string, _?: string, selectedIds?: string[]) => {
    const newItem: TechSpec = {
      id: String(Date.now()),
      name,
      order: driveTypes.length + 1,
      selectedIds,
    };
    setDriveTypes([...driveTypes, newItem]);
    showToast("تمت إضافة نظام الدفع بنجاح", "success");
  };

  const handleUpdateDriveType = (id: string, name: string, _?: string, selectedIds?: string[]) => {
    setDriveTypes(
      driveTypes.map((item) =>
        item.id === id ? { ...item, name, selectedIds } : item
      )
    );
    showToast("تم تحديث نظام الدفع بنجاح", "success");
  };

  const handleDeleteDriveType = (id: string) => {
    setDriveTypes(driveTypes.filter((item) => item.id !== id));
  };

  const handleReorderDriveType = (items: TechSpec[]) => {
    setDriveTypes(items);
  };

  // Engine type handlers
  const handleAddEngineType = (name: string, _?: string, selectedIds?: string[]) => {
    const newItem: TechSpec = {
      id: String(Date.now()),
      name,
      order: engineTypes.length + 1,
      selectedIds,
    };
    setEngineTypes([...engineTypes, newItem]);
    showToast("تمت إضافة نوع المحرك بنجاح", "success");
  };

  const handleUpdateEngineType = (id: string, name: string, _?: string, selectedIds?: string[]) => {
    setEngineTypes(
      engineTypes.map((item) =>
        item.id === id ? { ...item, name, selectedIds } : item
      )
    );
    showToast("تم تحديث نوع المحرك بنجاح", "success");
  };

  const handleDeleteEngineType = (id: string) => {
    setEngineTypes(engineTypes.filter((item) => item.id !== id));
  };

  const handleReorderEngineType = (items: TechSpec[]) => {
    setEngineTypes(items);
  };

  // Engine size handlers
  const handleAddEngineSize = (name: string, _?: string, selectedIds?: string[]) => {
    const newItem: TechSpec = {
      id: String(Date.now()),
      name,
      order: engineSizes.length + 1,
      selectedIds,
    };
    setEngineSizes([...engineSizes, newItem]);
    showToast("تمت إضافة حجم المحرك بنجاح", "success");
  };

  const handleUpdateEngineSize = (id: string, name: string, _?: string, selectedIds?: string[]) => {
    setEngineSizes(
      engineSizes.map((item) =>
        item.id === id ? { ...item, name, selectedIds } : item
      )
    );
    showToast("تم تحديث حجم المحرك بنجاح", "success");
  };

  const handleDeleteEngineSize = (id: string) => {
    setEngineSizes(engineSizes.filter((item) => item.id !== id));
  };

  const handleReorderEngineSize = (items: TechSpec[]) => {
    setEngineSizes(items);
  };

  // Additional specs handlers
  const handleAddAdditionalSpec = (name: string, _?: string, selectedIds?: string[]) => {
    const newItem: TechSpec = {
      id: String(Date.now()),
      name,
      order: additionalSpecs.length + 1,
      selectedIds,
    };
    setAdditionalSpecs([...additionalSpecs, newItem]);
    showToast("تمت إضافة المواصفة الإضافية بنجاح", "success");
  };

  const handleUpdateAdditionalSpec = (id: string, name: string, _?: string, selectedIds?: string[]) => {
    setAdditionalSpecs(
      additionalSpecs.map((item) =>
        item.id === id ? { ...item, name, selectedIds } : item
      )
    );
    showToast("تم تحديث المواصفة الإضافية بنجاح", "success");
  };

  const handleDeleteAdditionalSpec = (id: string) => {
    setAdditionalSpecs(additionalSpecs.filter((item) => item.id !== id));
  };

  const handleReorderAdditionalSpec = (items: TechSpec[]) => {
    setAdditionalSpecs(items);
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
            التفاصيل التقنية
          </Text>
          <Text className="text-sm text-muted mt-2" style={{ fontFamily: "Cairo" }}>
            إدارة مواصفات السيارات التقنية
          </Text>
        </View>

        {/* Fuel Types Section */}
        <View className="px-4 py-4">
          <CRUDListMultiSelect
            title="نوع الوقود"
            icon="local-gas-station"
            items={fuelTypes}
            onAdd={handleAddFuel}
            onUpdate={handleUpdateFuel}
            onDelete={handleDeleteFuel}
            onReorder={handleReorderFuel}
            multiSelect={true}
            selectableItems={mockModels}
            selectLabel="اختر الموديلات"
          />
        </View>

        {/* Transmission Section */}
        <View className="px-4 py-4">
          <CRUDListMultiSelect
            title="ناقل الحركة"
            icon="settings"
            items={transmissions}
            onAdd={handleAddTransmission}
            onUpdate={handleUpdateTransmission}
            onDelete={handleDeleteTransmission}
            onReorder={handleReorderTransmission}
            multiSelect={true}
            selectableItems={mockModels}
            selectLabel="اختر الموديلات"
          />
        </View>

        {/* Drive Type Section */}
        <View className="px-4 py-4">
          <CRUDListMultiSelect
            title="نظام الدفع"
            icon="directions-car"
            items={driveTypes}
            onAdd={handleAddDriveType}
            onUpdate={handleUpdateDriveType}
            onDelete={handleDeleteDriveType}
            onReorder={handleReorderDriveType}
            multiSelect={true}
            selectableItems={mockModels}
            selectLabel="اختر الموديلات"
          />
        </View>

        {/* Engine Type Section */}
        <View className="px-4 py-4">
          <CRUDListMultiSelect
            title="نوع المحرك"
            icon="memory"
            items={engineTypes}
            onAdd={handleAddEngineType}
            onUpdate={handleUpdateEngineType}
            onDelete={handleDeleteEngineType}
            onReorder={handleReorderEngineType}
            multiSelect={true}
            selectableItems={mockModels}
            selectLabel="اختر الموديلات"
          />
        </View>

        {/* Engine Size Section */}
        <View className="px-4 py-4">
          <CRUDListMultiSelect
            title="حجم المحرك"
            icon="speed"
            items={engineSizes}
            onAdd={handleAddEngineSize}
            onUpdate={handleUpdateEngineSize}
            onDelete={handleDeleteEngineSize}
            onReorder={handleReorderEngineSize}
            multiSelect={true}
            selectableItems={mockModels}
            selectLabel="اختر الموديلات"
          />
        </View>

        {/* Additional Specs Section */}
        <View className="px-4 py-4">
          <CRUDListMultiSelect
            title="مواصفات إضافية"
            icon="build"
            items={additionalSpecs}
            onAdd={handleAddAdditionalSpec}
            onUpdate={handleUpdateAdditionalSpec}
            onDelete={handleDeleteAdditionalSpec}
            onReorder={handleReorderAdditionalSpec}
            multiSelect={true}
            selectableItems={mockModels}
            selectLabel="اختر الموديلات"
          />
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
