import React from "react";
import { View, Text, Pressable } from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useColors } from "@/hooks/use-colors";

export interface CheckboxItem {
  id: string;
  label: string;
  icon?: string;
}

interface CheckboxesGroupProps {
  items: CheckboxItem[];
  selectedIds: string[];
  onToggle: (id: string) => void;
  label?: string;
  disabled?: boolean;
  columns?: number;
}

export function CheckboxesGroup({
  items,
  selectedIds,
  onToggle,
  label,
  disabled = false,
  columns = 2,
}: CheckboxesGroupProps) {
  const colors = useColors();

  if (items.length === 0) {
    return null;
  }

  // Organize items into rows
  const rows: CheckboxItem[][] = [];
  for (let i = 0; i < items.length; i += columns) {
    rows.push(items.slice(i, i + columns));
  }

  return (
    <View className="gap-3">
      {label && (
        <Text
          className="text-sm font-semibold"
          style={{ fontFamily: "Cairo", color: colors.foreground }}
        >
          {label}
        </Text>
      )}

      {rows.map((row, rowIndex) => (
        <View key={rowIndex} className="flex-row gap-3">
          {row.map((item) => (
            <Pressable
              key={item.id}
              onPress={() => onToggle(item.id)}
              disabled={disabled}
              className="flex-1 flex-row items-center gap-2 p-3 rounded-lg border"
              style={{
                borderColor: selectedIds.includes(item.id)
                  ? colors.primary
                  : colors.border,
                backgroundColor: selectedIds.includes(item.id)
                  ? colors.primary + "15"
                  : colors.background,
                opacity: disabled ? 0.5 : 1,
              }}
            >
              <View
                className="w-5 h-5 rounded border-2 items-center justify-center"
                style={{
                  borderColor: selectedIds.includes(item.id)
                    ? colors.primary
                    : colors.border,
                  backgroundColor: selectedIds.includes(item.id)
                    ? colors.primary
                    : "transparent",
                }}
              >
                {selectedIds.includes(item.id) && (
                  <MaterialIcons name="check" size={14} color="#FFFFFF" />
                )}
              </View>

              {item.icon && (
                <MaterialIcons
                  name={item.icon as any}
                  size={18}
                  color={colors.primary}
                />
              )}

              <Text
                className="text-sm font-medium flex-1"
                style={{
                  fontFamily: "Cairo",
                  color: colors.foreground,
                }}
              >
                {item.label}
              </Text>
            </Pressable>
          ))}

          {/* Fill empty space in the last row */}
          {row.length < columns &&
            Array.from({ length: columns - row.length }).map((_, index) => (
              <View key={`empty-${index}`} className="flex-1" />
            ))}
        </View>
      ))}
    </View>
  );
}
