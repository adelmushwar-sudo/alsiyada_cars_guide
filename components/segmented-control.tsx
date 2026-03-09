import React from "react";
import { View, Pressable, Text } from "react-native";
import { useColors } from "@/hooks/use-colors";

export interface SegmentedControlOption {
  id: string;
  label: string;
}

interface SegmentedControlProps {
  options: SegmentedControlOption[];
  selectedId: string;
  onSelect: (id: string) => void;
  label?: string;
  disabled?: boolean;
}

export function SegmentedControl({
  options,
  selectedId,
  onSelect,
  label,
  disabled = false,
}: SegmentedControlProps) {
  const colors = useColors();

  if (options.length === 0) {
    return null;
  }

  return (
    <View className="gap-2">
      {label && (
        <Text
          className="text-sm font-semibold"
          style={{ fontFamily: "Cairo", color: colors.foreground }}
        >
          {label}
        </Text>
      )}
      <View
        className="flex-row rounded-lg p-1 gap-1"
        style={{
          backgroundColor: colors.surface,
          borderWidth: 1,
          borderColor: colors.border,
        }}
      >
        {options.map((option) => (
          <Pressable
            key={option.id}
            onPress={() => onSelect(option.id)}
            disabled={disabled}
            className="flex-1 rounded-md py-2 px-3 items-center justify-center"
            style={{
              backgroundColor:
                selectedId === option.id ? colors.primary : "transparent",
              opacity: disabled ? 0.5 : 1,
            }}
          >
            <Text
              className="text-sm font-semibold"
              style={{
                fontFamily: "Cairo",
                color:
                  selectedId === option.id ? "#FFFFFF" : colors.foreground,
              }}
            >
              {option.label}
            </Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}
