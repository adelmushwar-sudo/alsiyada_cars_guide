import { useState } from "react";
import {
  View,
  Text,
  Pressable,
  Modal,
  TextInput,
  FlatList,
  Alert,
  Platform,
  ScrollView,
} from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useColors } from "@/hooks/use-colors";
import { cn } from "@/lib/utils";

export interface CRUDItem {
  id: string;
  name: string;
  order: number;
  hexCode?: string;
  parentId?: string;
}

interface CRUDListProps {
  title: string;
  icon: string;
  items: CRUDItem[];
  onAdd: (name: string, hexCode?: string, parentId?: string) => void;
  onUpdate: (id: string, name: string, hexCode?: string) => void;
  onDelete: (id: string) => void;
  onReorder: (items: CRUDItem[]) => void;
  showColorPicker?: boolean;
  parentName?: string;
  requiresParent?: boolean;
  parentItems?: CRUDItem[];
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
  requiresParent = false,
  parentItems = [],
}: CRUDListProps) {
  const colors = useColors();
  const [modalVisible, setModalVisible] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState("");
  const [colorValue, setColorValue] = useState("#000000");
  const [selectedParentId, setSelectedParentId] = useState<string>("");
  const [draggedItem, setDraggedItem] = useState<string | null>(null);
  const [sortableMode, setSortableMode] = useState(false);

  const handleAdd = () => {
    if (!inputValue.trim()) {
      Alert.alert("خطأ", "يرجى إدخال اسم");
      return;
    }

    if (requiresParent && !selectedParentId) {
      Alert.alert("خطأ", "يرجى اختيار العنصر الأب");
      return;
    }

    if (editingId) {
      onUpdate(editingId, inputValue, showColorPicker ? colorValue : undefined);
      setEditingId(null);
    } else {
      onAdd(
        inputValue,
        showColorPicker ? colorValue : undefined,
        selectedParentId || undefined
      );
    }

    setInputValue("");
    setColorValue("#000000");
    setSelectedParentId("");
    setModalVisible(false);
  };

  const handleEdit = (item: CRUDItem) => {
    setEditingId(item.id);
    setInputValue(item.name);
    setColorValue(item.hexCode || "#000000");
    setSelectedParentId(item.parentId || "");
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

  const handleLongPress = () => {
    setSortableMode(true);
  };

  const handleReorder = (fromIndex: number, toIndex: number) => {
    const newItems = [...items];
    const [movedItem] = newItems.splice(fromIndex, 1);
    newItems.splice(toIndex, 0, movedItem);
    onReorder(newItems);
  };

  const renderItem = ({ item, index }: { item: CRUDItem; index: number }) => (
    <Pressable
      onLongPress={handleLongPress}
      style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}
    >
      <View
        className="flex-row items-center gap-3 px-4 py-3 border-b"
        style={{
          borderColor: colors.border,
          backgroundColor:
            draggedItem === item.id
              ? colors.primary + "15"
              : colors.background,
        }}
      >
        {/* Drag Handle */}
        {sortableMode && (
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
        )}

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
            setSelectedParentId("");
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
            <ScrollView showsVerticalScrollIndicator={false}>
              {/* Close Button */}
              <Pressable onPress={() => setModalVisible(false)}>
                <MaterialIcons
                  name="close"
                  size={24}
                  color={colors.foreground}
                />
              </Pressable>

              {/* Title */}
              <Text
                className="text-xl font-bold text-foreground mt-2"
                style={{ fontFamily: "Cairo" }}
              >
                {editingId ? "تعديل" : "إضافة جديد"}
              </Text>

              {/* Parent Selection */}
              {requiresParent && (
                <View className="gap-2 mt-4">
                  <Text
                    className="text-sm font-semibold text-foreground"
                    style={{ fontFamily: "Cairo" }}
                  >
                    اختر العنصر الأب
                  </Text>
                  <View
                    className="border rounded-lg p-3"
                    style={{ borderColor: colors.border }}
                  >
                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                      {parentItems.map((parent) => (
                        <Pressable
                          key={parent.id}
                          onPress={() => setSelectedParentId(parent.id)}
                          style={({ pressed }) => [
                            {
                              opacity: pressed ? 0.7 : 1,
                              paddingHorizontal: 12,
                              paddingVertical: 8,
                              marginRight: 8,
                              borderRadius: 8,
                              backgroundColor:
                                selectedParentId === parent.id
                                  ? colors.primary
                                  : colors.surface,
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
                            }}
                          >
                            {parent.name}
                          </Text>
                        </Pressable>
                      ))}
                    </ScrollView>
                  </View>
                </View>
              )}

              {/* Input */}
              <View className="gap-2 mt-4">
                <Text
                  className="text-sm font-semibold text-foreground"
                  style={{ fontFamily: "Cairo" }}
                >
                  {`أدخل اسم ${title}`}
                </Text>
                <TextInput
                  placeholder={`أدخل اسم ${title}`}
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
                <View className="gap-2 mt-4">
                  <Text
                    className="text-sm font-semibold text-foreground"
                    style={{ fontFamily: "Cairo" }}
                  >
                    اختر اللون
                  </Text>
                  <View className="flex-row items-center gap-3">
                    <View
                      className="w-12 h-12 rounded-lg border-2"
                      style={{
                        backgroundColor: colorValue,
                        borderColor: colors.border,
                      }}
                    />
                    <TextInput
                      placeholder="#000000"
                      value={colorValue}
                      onChangeText={setColorValue}
                      className="flex-1 border rounded-lg p-2 text-foreground"
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

              {/* Buttons */}
              <View className="flex-row gap-3 mt-6">
                <Pressable
                  onPress={() => setModalVisible(false)}
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
                  onPress={handleAdd}
                  style={({ pressed }) => [
                    {
                      flex: 1,
                      padding: 12,
                      borderRadius: 8,
                      backgroundColor: colors.primary,
                      opacity:
                        requiresParent && !selectedParentId
                          ? 0.5
                          : pressed
                            ? 0.8
                            : 1,
                    },
                  ]}
                  disabled={requiresParent && !selectedParentId}
                >
                  <Text
                    className="text-center font-semibold text-white"
                    style={{ fontFamily: "Cairo" }}
                  >
                    {editingId ? "تحديث" : "إضافة"}
                  </Text>
                </Pressable>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}
