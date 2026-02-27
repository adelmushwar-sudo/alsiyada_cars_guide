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
  Dimensions,
} from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useColors } from "@/hooks/use-colors";

export interface ModalItem {
  id: string;
  name: string;
}

interface CenteredModalProps {
  visible: boolean;
  title: string;
  onClose: () => void;
  onSubmit: (data: {
    name: string;
    hexCode?: string;
    selectedIds?: string[];
  }) => void;
  showColorPicker?: boolean;
  multiSelect?: boolean;
  selectableItems?: ModalItem[];
  selectLabel?: string;
  editingItem?: {
    name: string;
    hexCode?: string;
    selectedIds?: string[];
  } | null;
  isEditing?: boolean;
}

export function CenteredModal({
  visible,
  title,
  onClose,
  onSubmit,
  showColorPicker = false,
  multiSelect = false,
  selectableItems = [],
  selectLabel = "اختر العناصر",
  editingItem = null,
  isEditing = false,
}: CenteredModalProps) {
  const colors = useColors();
  const screenWidth = Dimensions.get("window").width;
  const modalWidth = Math.min(screenWidth - 40, 500);

  const [inputValue, setInputValue] = useState(editingItem?.name || "");
  const [colorValue, setColorValue] = useState(editingItem?.hexCode || "#000000");
  const [selectedIds, setSelectedIds] = useState<string[]>(
    editingItem?.selectedIds || []
  );
  const [searchQuery, setSearchQuery] = useState("");

  // Reset form when modal opens/closes
  React.useEffect(() => {
    if (visible) {
      setInputValue(editingItem?.name || "");
      setColorValue(editingItem?.hexCode || "#000000");
      setSelectedIds(editingItem?.selectedIds || []);
      setSearchQuery("");
    }
  }, [visible, editingItem]);

  const isSubmitDisabled =
    !inputValue.trim() || (multiSelect && selectedIds.length === 0);

  const handleSubmit = () => {
    if (!inputValue.trim()) {
      Alert.alert("خطأ", "يرجى إدخال اسم");
      return;
    }

    if (multiSelect && selectedIds.length === 0) {
      Alert.alert("خطأ", `يرجى اختيار واحد على الأقل من ${selectLabel}`);
      return;
    }

    onSubmit({
      name: inputValue,
      hexCode: showColorPicker ? colorValue : undefined,
      selectedIds: multiSelect ? selectedIds : undefined,
    });

    // Reset form
    setInputValue("");
    setColorValue("#000000");
    setSelectedIds([]);
    setSearchQuery("");
  };

  const toggleSelection = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Filter items based on search
  const filteredItems = selectableItems.filter((item) =>
    item.name.includes(searchQuery)
  );

  const showSearchInput = selectableItems.length > 5;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      {/* Blur Overlay Background */}
      <Pressable
        style={{
          flex: 1,
          backgroundColor: "rgba(0,0,0,0.6)",
          justifyContent: "center",
          alignItems: "center",
        }}
        onPress={onClose}
      >
        {/* Centered Modal Container */}
        <Pressable
          onPress={(e) => e.stopPropagation()}
          style={{
            width: modalWidth,
            backgroundColor: colors.background,
            borderRadius: 24,
            overflow: "hidden",
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 0.25,
            shadowRadius: 16,
            elevation: 20,
          }}
        >
          {/* Header */}
          <View
            className="flex-row justify-between items-center px-6 py-5 border-b"
            style={{ borderColor: colors.border }}
          >
            <Text
              className="text-lg font-bold text-foreground flex-1"
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
            contentContainerStyle={{ paddingHorizontal: 24, paddingVertical: 20 }}
          >
            {/* Name Input */}
            <View className="gap-2 mb-6">
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
              <View className="gap-3 mb-6">
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

            {/* Multi-Select Chips */}
            {multiSelect && (
              <View className="gap-3">
                <Text
                  className="text-sm font-semibold text-foreground"
                  style={{ fontFamily: "Cairo" }}
                >
                  {selectLabel}
                </Text>

                {/* Search Input for Items */}
                {showSearchInput && (
                  <TextInput
                    placeholder="ابحث..."
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    className="border rounded-lg p-3 text-foreground mb-3"
                    style={{
                      borderColor: colors.border,
                      color: colors.foreground,
                      fontFamily: "Cairo",
                    }}
                    placeholderTextColor={colors.muted}
                  />
                )}

                {/* Chips Grid */}
                <View className="flex-row flex-wrap gap-2">
                  {filteredItems.map((item) => {
                    const isSelected = selectedIds.includes(item.id);
                    return (
                      <Pressable
                        key={item.id}
                        onPress={() => toggleSelection(item.id)}
                        style={({ pressed }) => [
                          {
                            paddingHorizontal: 14,
                            paddingVertical: 10,
                            borderRadius: 12,
                            backgroundColor: isSelected
                              ? colors.primary
                              : colors.surface,
                            opacity: pressed ? 0.8 : 1,
                            borderWidth: 2,
                            borderColor: isSelected
                              ? colors.primary
                              : colors.border,
                          },
                        ]}
                      >
                        <View className="flex-row items-center gap-2">
                          {isSelected && (
                            <MaterialIcons
                              name="check"
                              size={16}
                              color="#FFFFFF"
                            />
                          )}
                          <Text
                            style={{
                              fontFamily: "Cairo",
                              color: isSelected
                                ? "#FFFFFF"
                                : colors.foreground,
                              fontSize: 13,
                              fontWeight: "500",
                            }}
                          >
                            {item.name}
                          </Text>
                        </View>
                      </Pressable>
                    );
                  })}
                </View>

                {filteredItems.length === 0 && (
                  <Text
                    className="text-center text-muted text-sm"
                    style={{ fontFamily: "Cairo" }}
                  >
                    لا توجد عناصر متطابقة
                  </Text>
                )}

                {/* Selected Count */}
                {selectedIds.length > 0 && (
                  <Text
                    className="text-xs text-primary mt-2"
                    style={{ fontFamily: "Cairo" }}
                  >
                    تم اختيار {selectedIds.length} عنصر
                  </Text>
                )}
              </View>
            )}
          </ScrollView>

          {/* Action Buttons */}
          <View
            className="flex-row gap-3 px-6 py-4 border-t"
            style={{ borderColor: colors.border }}
          >
            <Pressable
              onPress={onClose}
              style={({ pressed }) => [
                {
                  flex: 1,
                  padding: 12,
                  borderRadius: 10,
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
                  borderRadius: 10,
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
        </Pressable>
      </Pressable>
    </Modal>
  );
}
