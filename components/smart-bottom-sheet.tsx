import React, { useState } from "react";
import {
  View,
  Text,
  Pressable,
  Modal,
  ScrollView,
  TextInput,
  Alert,
  Platform,
} from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useColors } from "@/hooks/use-colors";

export interface BottomSheetItem {
  id: string;
  name: string;
}

interface SmartBottomSheetProps {
  visible: boolean;
  title: string;
  onClose: () => void;
  onSubmit: (data: {
    name: string;
    hexCode?: string;
    parentId?: string;
  }) => void;
  showColorPicker?: boolean;
  requiresParent?: boolean;
  parentItems?: BottomSheetItem[];
  parentLabel?: string;
  editingItem?: { name: string; hexCode?: string; parentId?: string } | null;
  isEditing?: boolean;
}

export function SmartBottomSheet({
  visible,
  title,
  onClose,
  onSubmit,
  showColorPicker = false,
  requiresParent = false,
  parentItems = [],
  parentLabel = "اختر العنصر الأب",
  editingItem = null,
  isEditing = false,
}: SmartBottomSheetProps) {
  const colors = useColors();
  const [inputValue, setInputValue] = useState(editingItem?.name || "");
  const [colorValue, setColorValue] = useState(editingItem?.hexCode || "#000000");
  const [selectedParentId, setSelectedParentId] = useState(
    editingItem?.parentId || ""
  );
  const [searchQuery, setSearchQuery] = useState("");

  // Reset form when modal opens/closes
  React.useEffect(() => {
    if (visible) {
      setInputValue(editingItem?.name || "");
      setColorValue(editingItem?.hexCode || "#000000");
      setSelectedParentId(editingItem?.parentId || "");
      setSearchQuery("");
    }
  }, [visible, editingItem]);

  const isSubmitDisabled =
    !inputValue.trim() || (requiresParent && !selectedParentId);

  const handleSubmit = () => {
    if (!inputValue.trim()) {
      Alert.alert("خطأ", "يرجى إدخال اسم");
      return;
    }

    if (requiresParent && !selectedParentId) {
      Alert.alert("خطأ", "يرجى اختيار العنصر الأب");
      return;
    }

    onSubmit({
      name: inputValue,
      hexCode: showColorPicker ? colorValue : undefined,
      parentId: selectedParentId || undefined,
    });

    // Reset form
    setInputValue("");
    setColorValue("#000000");
    setSelectedParentId("");
    setSearchQuery("");
  };

  // Filter parent items based on search
  const filteredParentItems = parentItems.filter((item) =>
    item.name.includes(searchQuery)
  );

  const showSearchInput = parentItems.length > 5;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      {/* Overlay Background */}
      <Pressable
        style={{
          flex: 1,
          backgroundColor: "rgba(0,0,0,0.5)",
        }}
        onPress={onClose}
      />

      {/* Bottom Sheet Container */}
      <View
        className="absolute bottom-0 left-0 right-0 rounded-t-3xl p-6"
        style={{
          backgroundColor: colors.background,
          borderTopLeftRadius: 24,
          borderTopRightRadius: 24,
          maxHeight: "85%",
          shadowColor: "#000",
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
          elevation: 12,
        }}
      >
        {/* Handle Bar */}
        <View className="items-center mb-4">
          <View
            className="w-12 h-1 rounded-full"
            style={{ backgroundColor: colors.border }}
          />
        </View>

        {/* Close Button */}
        <View className="flex-row justify-between items-center mb-4">
          <Text
            className="text-xl font-bold text-foreground flex-1"
            style={{ fontFamily: "Cairo" }}
          >
            {isEditing ? "تعديل" : title}
          </Text>
          <Pressable onPress={onClose}>
            <MaterialIcons name="close" size={24} color={colors.foreground} />
          </Pressable>
        </View>

        {/* Scrollable Content */}
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 20 }}
        >
          {/* Parent Selection */}
          {requiresParent && (
            <View className="gap-3 mb-4">
              <Text
                className="text-sm font-semibold text-foreground"
                style={{ fontFamily: "Cairo" }}
              >
                {parentLabel}
              </Text>

              {/* Search Input for Parent Items */}
              {showSearchInput && (
                <TextInput
                  placeholder="ابحث..."
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                  className="border rounded-lg p-3 text-foreground"
                  style={{
                    borderColor: colors.border,
                    color: colors.foreground,
                    fontFamily: "Cairo",
                  }}
                  placeholderTextColor={colors.muted}
                />
              )}

              {/* Parent Items Grid */}
              <View className="flex-row flex-wrap gap-2">
                {filteredParentItems.map((parent) => (
                  <Pressable
                    key={parent.id}
                    onPress={() => setSelectedParentId(parent.id)}
                    style={({ pressed }) => [
                      {
                        paddingHorizontal: 12,
                        paddingVertical: 8,
                        borderRadius: 8,
                        backgroundColor:
                          selectedParentId === parent.id
                            ? colors.primary
                            : colors.surface,
                        opacity: pressed ? 0.8 : 1,
                        borderWidth: selectedParentId === parent.id ? 2 : 1,
                        borderColor:
                          selectedParentId === parent.id
                            ? colors.primary
                            : colors.border,
                      },
                    ]}
                  >
                    <Text
                      style={{
                        fontFamily: "Cairo",
                        color:
                          selectedParentId === parent.id
                            ? "#FFFFFF"
                            : colors.foreground,
                        fontSize: 14,
                        fontWeight: "500",
                      }}
                    >
                      {parent.name}
                    </Text>
                  </Pressable>
                ))}
              </View>

              {filteredParentItems.length === 0 && (
                <Text
                  className="text-center text-muted text-sm"
                  style={{ fontFamily: "Cairo" }}
                >
                  لا توجد عناصر متطابقة
                </Text>
              )}
            </View>
          )}

          {/* Name Input */}
          <View className="gap-2 mb-4">
            <Text
              className="text-sm font-semibold text-foreground"
              style={{ fontFamily: "Cairo" }}
            >
              الاسم
            </Text>
            <TextInput
              placeholder="أدخل الاسم..."
              value={inputValue}
              onChangeText={setInputValue}
              className="border rounded-lg p-3 text-foreground"
              style={{
                borderColor: colors.border,
                color: colors.foreground,
                fontFamily: "Cairo",
              }}
              placeholderTextColor={colors.muted}
            />
          </View>

          {/* Color Picker */}
          {showColorPicker && (
            <View className="gap-3 mb-4">
              <Text
                className="text-sm font-semibold text-foreground"
                style={{ fontFamily: "Cairo" }}
              >
                اللون
              </Text>
              <View className="flex-row items-center gap-3">
                {/* Color Preview */}
                <View
                  className="w-12 h-12 rounded-lg border-2"
                  style={{
                    backgroundColor: colorValue,
                    borderColor: colors.border,
                  }}
                />

                {/* Color Input */}
                <TextInput
                  placeholder="#000000"
                  value={colorValue}
                  onChangeText={setColorValue}
                  className="flex-1 border rounded-lg p-3 text-foreground"
                  style={{
                    borderColor: colors.border,
                    color: colors.foreground,
                    fontFamily: "Cairo",
                  }}
                  placeholderTextColor={colors.muted}
                />
              </View>
            </View>
          )}
        </ScrollView>

        {/* Action Buttons */}
        <View className="flex-row gap-3 mt-6 pt-4 border-t" style={{ borderColor: colors.border }}>
          <Pressable
            onPress={onClose}
            style={({ pressed }) => [
              {
                flex: 1,
                padding: 12,
                borderRadius: 8,
                backgroundColor: colors.surface,
                opacity: pressed ? 0.7 : 1,
              },
            ]}
          >
            <Text
              className="text-center font-semibold text-foreground"
              style={{ fontFamily: "Cairo" }}
            >
              إلغاء
            </Text>
          </Pressable>

          <Pressable
            onPress={handleSubmit}
            disabled={isSubmitDisabled}
            style={({ pressed }) => [
              {
                flex: 1,
                padding: 12,
                borderRadius: 8,
                backgroundColor: isSubmitDisabled
                  ? colors.muted + "40"
                  : colors.primary,
                opacity: pressed && !isSubmitDisabled ? 0.8 : 1,
              },
            ]}
          >
            <Text
              className="text-center font-semibold"
              style={{
                fontFamily: "Cairo",
                color: isSubmitDisabled ? colors.muted : "#FFFFFF",
              }}
            >
              {isEditing ? "تحديث" : "إضافة"}
            </Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}
