import { useState } from "react";
import {
  View,
  Text,
  Pressable,
  FlatList,
  Alert,
  Platform,
} from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import * as Haptics from "expo-haptics";
import { useColors } from "@/hooks/use-colors";
import { SmartBottomSheet } from "./smart-bottom-sheet";

export interface CRUDItem {
  id: string;
  name: string;
  order: number;
  hexCode?: string;
  parentId?: string;
}

interface CRUDListEnhancedProps {
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
  parentLabel?: string;
}

export function CRUDListEnhanced({
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
  parentLabel = "اختر العنصر الأب",
}: CRUDListEnhancedProps) {
  const colors = useColors();
  const [bottomSheetVisible, setBottomSheetVisible] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [sortableMode, setSortableMode] = useState(false);
  const [draggedItem, setDraggedItem] = useState<string | null>(null);
  const [longPressedItem, setLongPressedItem] = useState<string | null>(null);

  const editingItem = editingId
    ? items.find((item) => item.id === editingId)
    : null;

  const handleAddPress = () => {
    setEditingId(null);
    setBottomSheetVisible(true);
  };

  const handleEditPress = (item: CRUDItem) => {
    setEditingId(item.id);
    setBottomSheetVisible(true);
  };

  const handleSubmit = (data: {
    name: string;
    hexCode?: string;
    parentId?: string;
  }) => {
    if (editingId) {
      onUpdate(editingId, data.name, data.hexCode);
      setEditingId(null);
    } else {
      onAdd(data.name, data.hexCode, data.parentId);
    }
    setBottomSheetVisible(false);
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

  const handleLongPress = (itemId: string) => {
    setLongPressedItem(itemId);
    setSortableMode(true);
    setDraggedItem(itemId);
    
    // Haptic feedback on long press
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
  };

  const handleDragStart = (itemId: string) => {
    setDraggedItem(itemId);
    
    // Haptic feedback when starting drag
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  const handleDragEnd = () => {
    setDraggedItem(null);
  };

  const handleMoveUp = (index: number) => {
    if (index > 0) {
      const newItems = [...items];
      [newItems[index], newItems[index - 1]] = [newItems[index - 1], newItems[index]];
      onReorder(
        newItems.map((item, i) => ({
          ...item,
          order: i + 1,
        }))
      );
      
      if (Platform.OS !== "web") {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
    }
  };

  const handleMoveDown = (index: number) => {
    if (index < items.length - 1) {
      const newItems = [...items];
      [newItems[index], newItems[index + 1]] = [newItems[index + 1], newItems[index]];
      onReorder(
        newItems.map((item, i) => ({
          ...item,
          order: i + 1,
        }))
      );
      
      if (Platform.OS !== "web") {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
    }
  };

  const renderItem = ({ item, index }: { item: CRUDItem; index: number }) => (
    <Pressable
      onLongPress={() => handleLongPress(item.id)}
      style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}
    >
      <View
        className="flex-row items-center gap-3 px-4 py-3 border-b"
        style={{
          borderColor: colors.border,
          backgroundColor:
            draggedItem === item.id
              ? colors.primary + "20"
              : colors.background,
        }}
      >
        {/* Drag Handle - Only visible in sortable mode */}
        {sortableMode && (
          <View className="flex-row items-center gap-1">
            <Pressable
              onPressIn={() => handleDragStart(item.id)}
              onPressOut={handleDragEnd}
              style={({ pressed }) => [
                {
                  opacity: pressed ? 0.8 : 1,
                  padding: 4,
                },
              ]}
            >
              <MaterialIcons
                name="drag-handle"
                size={20}
                color={draggedItem === item.id ? colors.primary : colors.muted}
              />
            </Pressable>
            
            {/* Move Up Button */}
            <Pressable
              onPress={() => handleMoveUp(index)}
              disabled={index === 0}
              style={({ pressed }) => [
                {
                  opacity: index === 0 ? 0.3 : pressed ? 0.7 : 1,
                  padding: 4,
                },
              ]}
            >
              <MaterialIcons
                name="arrow-upward"
                size={16}
                color={index === 0 ? colors.muted : colors.primary}
              />
            </Pressable>
            
            {/* Move Down Button */}
            <Pressable
              onPress={() => handleMoveDown(index)}
              disabled={index === items.length - 1}
              style={({ pressed }) => [
                {
                  opacity: index === items.length - 1 ? 0.3 : pressed ? 0.7 : 1,
                  padding: 4,
                },
              ]}
            >
              <MaterialIcons
                name="arrow-downward"
                size={16}
                color={index === items.length - 1 ? colors.muted : colors.primary}
              />
            </Pressable>
          </View>
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
        {!sortableMode && (
          <View className="flex-row gap-2">
            <Pressable
              onPress={() => handleEditPress(item)}
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
        )}
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
              {sortableMode && " - اضغط طويلاً للسحب"}
            </Text>
          </View>
        </View>

        <View className="flex-row gap-2">
          {sortableMode && (
            <Pressable
              onPress={() => {
                setSortableMode(false);
                setDraggedItem(null);
                setLongPressedItem(null);
              }}
              style={({ pressed }) => [{ opacity: pressed ? 0.6 : 1 }]}
            >
              <View
                className="w-10 h-10 rounded-lg items-center justify-center"
                style={{ backgroundColor: colors.surface }}
              >
                <MaterialIcons name="close" size={20} color={colors.foreground} />
              </View>
            </Pressable>
          )}

          <Pressable
            onPress={handleAddPress}
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

      {/* Smart Bottom Sheet */}
      <SmartBottomSheet
        visible={bottomSheetVisible}
        title={title}
        onClose={() => {
          setBottomSheetVisible(false);
          setEditingId(null);
        }}
        onSubmit={handleSubmit}
        showColorPicker={showColorPicker}
        requiresParent={requiresParent}
        parentItems={parentItems}
        parentLabel={parentLabel}
        editingItem={editingItem}
        isEditing={!!editingId}
      />
    </View>
  );
}
