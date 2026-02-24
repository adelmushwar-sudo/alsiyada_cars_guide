import React, { useState } from "react";
import {
  View,
  Text,
  Pressable,
  Modal,
  TextInput,
  FlatList,
  Alert,
  Platform,
} from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useColors } from "@/hooks/use-colors";
import { cn } from "@/lib/utils";

export interface CRUDItem {
  id: string;
  name: string;
  order: number;
  hexCode?: string;
}

interface CRUDListProps {
  title: string;
  icon: string;
  items: CRUDItem[];
  onAdd: (name: string, hexCode?: string) => void;
  onUpdate: (id: string, name: string, hexCode?: string) => void;
  onDelete: (id: string) => void;
  onReorder: (items: CRUDItem[]) => void;
  showColorPicker?: boolean;
  parentName?: string;
}

export function CRUDList({
  title,
  icon,
  items,
  onAdd,
  onUpdate,
  onDelete,
  onReorder,
  showColorPicker = false,
  parentName,
}: CRUDListProps) {
  const colors = useColors();
  const [modalVisible, setModalVisible] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState("");
  const [colorValue, setColorValue] = useState("#000000");
  const [draggedItem, setDraggedItem] = useState<string | null>(null);

  const handleAdd = () => {
    if (!inputValue.trim()) {
      Alert.alert("خطأ", "يرجى إدخال اسم");
      return;
    }

    if (editingId) {
      onUpdate(editingId, inputValue, showColorPicker ? colorValue : undefined);
      setEditingId(null);
    } else {
      onAdd(inputValue, showColorPicker ? colorValue : undefined);
    }

    setInputValue("");
    setColorValue("#000000");
    setModalVisible(false);
  };

  const handleEdit = (item: CRUDItem) => {
    setEditingId(item.id);
    setInputValue(item.name);
    setColorValue(item.hexCode || "#000000");
    setModalVisible(true);
  };

  const handleDelete = (id: string) => {
    Alert.alert("تأكيد الحذف", "هل تريد حذف هذا العنصر؟", [
      { text: "إلغاء", style: "cancel" },
      {
        text: "حذف",
        onPress: () => onDelete(id),
        style: "destructive",
      },
    ]);
  };

  const renderItem = ({ item, index }: { item: CRUDItem; index: number }) => (
    <Pressable
      onPress={() => handleEdit(item)}
      style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}
    >
      <View
        className="flex-row items-center gap-3 px-4 py-3 border-b"
        style={{ borderColor: colors.border }}
      >
        {/* Drag Handle */}
        <Pressable
          onPressIn={() => setDraggedItem(item.id)}
          onPressOut={() => setDraggedItem(null)}
        >
          <MaterialIcons
            name="drag-handle"
            size={20}
            color={draggedItem === item.id ? colors.primary : colors.muted}
          />
        </Pressable>

        {/* Color Preview */}
        {showColorPicker && item.hexCode && (
          <View
            className="w-8 h-8 rounded-lg border-2"
            style={{
              backgroundColor: item.hexCode,
              borderColor: colors.border,
            }}
          />
        )}

        {/* Item Info */}
        <View className="flex-1">
          <Text
            className="font-semibold text-foreground"
            style={{ fontFamily: "Cairo" }}
          >
            {item.name}
          </Text>
          {parentName && (
            <Text className="text-xs text-muted" style={{ fontFamily: "Cairo" }}>
              التابع: {parentName}
            </Text>
          )}
        </View>

        {/* Actions */}
        <View className="flex-row gap-2">
          <Pressable
            onPress={() => handleEdit(item)}
            style={({ pressed }) => [{ opacity: pressed ? 0.6 : 1 }]}
          >
            <MaterialIcons name="edit" size={18} color={colors.primary} />
          </Pressable>
          <Pressable
            onPress={() => handleDelete(item.id)}
            style={({ pressed }) => [{ opacity: pressed ? 0.6 : 1 }]}
          >
            <MaterialIcons name="delete" size={18} color={colors.error} />
          </Pressable>
        </View>
      </View>
    </Pressable>
  );

  return (
    <View className="flex-1">
      {/* Header */}
      <View
        className="flex-row items-center justify-between px-4 py-3 border-b"
        style={{ borderColor: colors.border }}
      >
        <View className="flex-row items-center gap-2">
          <MaterialIcons name={icon as any} size={24} color={colors.primary} />
          <View>
            <Text
              className="font-bold text-foreground"
              style={{ fontFamily: "Cairo", fontSize: 16 }}
            >
              {title}
            </Text>
            <Text
              className="text-xs text-muted"
              style={{ fontFamily: "Cairo" }}
            >
              {items.length} عنصر
            </Text>
          </View>
        </View>

        <Pressable
          onPress={() => {
            setEditingId(null);
            setInputValue("");
            setColorValue("#000000");
            setModalVisible(true);
          }}
          style={({ pressed }) => [{ opacity: pressed ? 0.6 : 1 }]}
        >
          <View
            className="w-10 h-10 rounded-lg items-center justify-center"
            style={{ backgroundColor: colors.primary }}
          >
            <MaterialIcons name="add" size={20} color="#FFFFFF" />
          </View>
        </Pressable>
      </View>

      {/* List */}
      {items.length > 0 ? (
        <FlatList
          data={items}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          scrollEnabled={false}
        />
      ) : (
        <View className="flex-1 items-center justify-center gap-2">
          <MaterialIcons name="inbox" size={40} color={colors.muted} />
          <Text
            className="text-muted text-center"
            style={{ fontFamily: "Cairo" }}
          >
            لا توجد عناصر بعد
          </Text>
        </View>
      )}

      {/* Modal */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View
          className="flex-1 justify-end"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <View
            className="rounded-t-2xl p-6 gap-4"
            style={{ backgroundColor: colors.background }}
          >
            {/* Close Button */}
            <Pressable onPress={() => setModalVisible(false)}>
              <MaterialIcons name="close" size={24} color={colors.foreground} />
            </Pressable>

            {/* Title */}
            <Text
              className="text-xl font-bold text-foreground"
              style={{ fontFamily: "Cairo" }}
            >
              {editingId ? "تعديل" : "إضافة جديد"}
            </Text>

            {/* Input */}
            <TextInput
              placeholder={`أدخل اسم ${title}`}
              value={inputValue}
              onChangeText={setInputValue}
              className="border rounded-lg px-4 py-3"
              style={{
                borderColor: colors.border,
                color: colors.foreground,
                fontFamily: "Cairo",
              }}
              placeholderTextColor={colors.muted}
            />

            {/* Color Picker */}
            {showColorPicker && (
              <View className="gap-2">
                <Text
                  className="font-semibold text-foreground"
                  style={{ fontFamily: "Cairo" }}
                >
                  اختر اللون
                </Text>
                <View className="flex-row gap-2 flex-wrap">
                  {[
                    "#000000",
                    "#FFFFFF",
                    "#C41E3A",
                    "#1B3A70",
                    "#E8E8E8",
                    "#808080",
                    "#D4A574",
                    "#A0826D",
                  ].map((color) => (
                    <Pressable
                      key={color}
                      onPress={() => setColorValue(color)}
                      style={({ pressed }) => [
                        { opacity: pressed ? 0.7 : 1 },
                      ]}
                    >
                      <View
                        className="w-12 h-12 rounded-lg border-4"
                        style={{
                          backgroundColor: color,
                          borderColor:
                            colorValue === color
                              ? colors.primary
                              : colors.border,
                        }}
                      />
                    </Pressable>
                  ))}
                </View>
              </View>
            )}

            {/* Buttons */}
            <View className="flex-row gap-3 mt-4">
              <Pressable
                onPress={() => setModalVisible(false)}
                className="flex-1 py-3 rounded-lg border"
                style={{ borderColor: colors.border }}
              >
                <Text
                  className="text-center font-semibold text-foreground"
                  style={{ fontFamily: "Cairo" }}
                >
                  إلغاء
                </Text>
              </Pressable>

              <Pressable
                onPress={handleAdd}
                className="flex-1 py-3 rounded-lg items-center justify-center"
                style={{ backgroundColor: colors.primary }}
              >
                <Text
                  className="font-semibold text-white"
                  style={{ fontFamily: "Cairo" }}
                >
                  {editingId ? "تحديث" : "إضافة"}
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
