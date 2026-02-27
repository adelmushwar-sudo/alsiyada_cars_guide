import React, { useState } from "react";
import {
  View,
  Text,
  Pressable,
  FlatList,
  Modal,
  TextInput,
} from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useColors } from "@/hooks/use-colors";
import { cn } from "@/lib/utils";

interface SingleSelectDropdownProps {
  label: string;
  placeholder?: string;
  options: Array<{ id: string; label: string }>;
  selectedId?: string;
  onSelect: (id: string) => void;
  disabled?: boolean;
  error?: string;
}

export function SingleSelectDropdown({
  label,
  placeholder = "اختر خياراً",
  options,
  selectedId,
  onSelect,
  disabled = false,
  error,
}: SingleSelectDropdownProps) {
  const colors = useColors();
  const [isOpen, setIsOpen] = useState(false);
  const [searchText, setSearchText] = useState("");

  const selectedOption = options.find((opt) => opt.id === selectedId);
  const filteredOptions = options.filter((opt) =>
    opt.label.toLowerCase().includes(searchText.toLowerCase())
  );

  const handleSelect = (id: string) => {
    onSelect(id);
    setIsOpen(false);
    setSearchText("");
  };

  return (
    <View style={{ gap: 8 }}>
      {label && (
        <Text
          style={{
            fontSize: 14,
            fontWeight: "600",
            color: colors.foreground,
            fontFamily: "Cairo",
          }}
        >
          {label}
        </Text>
      )}

      <Pressable
        disabled={disabled}
        onPress={() => setIsOpen(true)}
        style={{
          paddingHorizontal: 16,
          paddingVertical: 12,
          borderRadius: 12,
          borderWidth: 2,
          borderColor: error ? colors.error : colors.border,
          backgroundColor: disabled ? colors.surface + "80" : colors.surface,
          opacity: disabled ? 0.6 : 1,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Text
          style={{
            fontSize: 14,
            color: selectedOption ? colors.foreground : colors.muted,
            fontFamily: "Cairo",
            flex: 1,
          }}
        >
          {selectedOption?.label || placeholder}
        </Text>
        <MaterialIcons
          name={isOpen ? "expand-less" : "expand-more"}
          size={20}
          color={colors.primary}
        />
      </Pressable>

      {error && (
        <Text
          style={{
            fontSize: 12,
            color: colors.error,
            fontFamily: "Cairo",
          }}
        >
          {error}
        </Text>
      )}

      <Modal
        visible={isOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setIsOpen(false)}
      >
        <Pressable
          style={{
            flex: 1,
            backgroundColor: "#00000040",
            justifyContent: "center",
            alignItems: "center",
          }}
          onPress={() => setIsOpen(false)}
        >
          <Pressable
            style={{
              backgroundColor: colors.surface,
              borderRadius: 16,
              width: "80%",
              maxHeight: "60%",
              paddingHorizontal: 16,
              paddingVertical: 16,
            }}
            onPress={(e) => e.stopPropagation()}
          >
            {/* Search Input */}
            <TextInput
              placeholder="ابحث..."
              value={searchText}
              onChangeText={setSearchText}
              style={{
                paddingHorizontal: 12,
                paddingVertical: 10,
                borderRadius: 8,
                borderWidth: 1,
                borderColor: colors.border,
                marginBottom: 12,
                color: colors.foreground,
                fontFamily: "Cairo",
              }}
              placeholderTextColor={colors.muted}
            />

            {/* Options List */}
            <FlatList
              data={filteredOptions}
              keyExtractor={(item) => item.id}
              scrollEnabled
              renderItem={({ item }) => (
                <Pressable
                  onPress={() => handleSelect(item.id)}
                  style={({ pressed }) => ({
                    paddingHorizontal: 12,
                    paddingVertical: 12,
                    borderRadius: 8,
                    marginBottom: 8,
                    backgroundColor:
                      selectedId === item.id
                        ? colors.primary + "20"
                        : pressed
                          ? colors.surface
                          : "transparent",
                    borderWidth: selectedId === item.id ? 2 : 0,
                    borderColor: selectedId === item.id ? colors.primary : "transparent",
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                  })}
                >
                  <Text
                    style={{
                      fontSize: 14,
                      color:
                        selectedId === item.id
                          ? colors.primary
                          : colors.foreground,
                      fontFamily: "Cairo",
                      fontWeight: selectedId === item.id ? "600" : "400",
                    }}
                  >
                    {item.label}
                  </Text>
                  {selectedId === item.id && (
                    <MaterialIcons
                      name="check"
                      size={20}
                      color={colors.primary}
                    />
                  )}
                </Pressable>
              )}
              ListEmptyComponent={
                <Text
                  style={{
                    textAlign: "center",
                    color: colors.muted,
                    fontFamily: "Cairo",
                    paddingVertical: 20,
                  }}
                >
                  لا توجد نتائج
                </Text>
              }
            />

            {/* Close Button */}
            <Pressable
              onPress={() => setIsOpen(false)}
              style={{
                paddingHorizontal: 16,
                paddingVertical: 10,
                borderRadius: 8,
                backgroundColor: colors.primary + "20",
                marginTop: 12,
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  color: colors.primary,
                  fontWeight: "600",
                  fontFamily: "Cairo",
                }}
              >
                إغلاق
              </Text>
            </Pressable>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}
