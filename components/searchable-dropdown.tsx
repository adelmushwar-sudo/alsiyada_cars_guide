import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  Pressable,
  Modal,
  TextInput,
  FlatList,
  Platform,
} from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useColors } from "@/hooks/use-colors";

export interface SearchableDropdownItem {
  id: string;
  name: string;
}

interface SearchableDropdownProps {
  items: SearchableDropdownItem[];
  selectedId: string;
  onSelect: (id: string) => void;
  label: string;
  placeholder?: string;
  disabled?: boolean;
  searchPlaceholder?: string;
  error?: string;
  horizontal?: boolean;
}

export function SearchableDropdown({
  items,
  selectedId,
  onSelect,
  label,
  placeholder = "اختر...",
  disabled = false,
  searchPlaceholder = "ابحث...",
  error,
  horizontal = false,
}: SearchableDropdownProps) {
  const colors = useColors();
  const [isOpen, setIsOpen] = useState(false);
  const [searchText, setSearchText] = useState("");

  const filteredItems = useMemo(() => {
    if (!searchText.trim()) return items;
    return items.filter((item) =>
      item.name.toLowerCase().includes(searchText.toLowerCase())
    );
  }, [items, searchText]);

  const selectedItem = items.find((item) => item.id === selectedId);

  const containerStyle = horizontal
    ? { flex: 1, marginLeft: 8 }
    : {};

  return (
    <View style={containerStyle} className="gap-2">
      {!horizontal && (
        <Text
          className="text-sm font-semibold"
          style={{ fontFamily: "Cairo", color: colors.foreground }}
        >
          {label}
        </Text>
      )}

      <Pressable
        onPress={() => !disabled && setIsOpen(true)}
        disabled={disabled}
        className="border rounded-lg p-3 flex-row items-center justify-between"
        style={{
          borderColor: error ? colors.error : colors.border,
          backgroundColor: disabled ? colors.muted + "15" : colors.background,
          opacity: disabled ? 0.5 : 1,
        }}
      >
        <View className="flex-1">
          {horizontal && (
            <Text
              className="text-xs font-semibold mb-1"
              style={{ fontFamily: "Cairo", color: colors.muted }}
            >
              {label}
            </Text>
          )}
          <Text
            className="text-sm"
            style={{
              fontFamily: "Cairo",
              color: selectedItem ? colors.foreground : colors.muted,
            }}
          >
            {selectedItem?.name || placeholder}
          </Text>
        </View>
        <MaterialIcons
          name={isOpen ? "expand-less" : "expand-more"}
          size={20}
          color={colors.primary}
        />
      </Pressable>

      {error && (
        <Text
          className="text-xs"
          style={{ fontFamily: "Cairo", color: colors.error }}
        >
          {error}
        </Text>
      )}

      {/* Modal for dropdown */}
      <Modal
        visible={isOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setIsOpen(false)}
      >
        <Pressable
          style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.5)",
            justifyContent: "flex-end",
          }}
          onPress={() => setIsOpen(false)}
        >
          <Pressable
            style={{
              backgroundColor: colors.surface,
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
              maxHeight: "80%",
              paddingTop: 16,
            }}
            onPress={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <View className="px-4 pb-3 flex-row items-center justify-between border-b"
              style={{ borderColor: colors.border }}
            >
              <Text
                className="text-lg font-bold flex-1"
                style={{ fontFamily: "Cairo", color: colors.foreground }}
              >
                {label}
              </Text>
              <Pressable
                onPress={() => setIsOpen(false)}
                className="p-2"
              >
                <MaterialIcons name="close" size={24} color={colors.foreground} />
              </Pressable>
            </View>

            {/* Search Input */}
            <View className="px-4 py-3">
              <View
                className="flex-row items-center border rounded-lg px-3"
                style={{ borderColor: colors.border }}
              >
                <MaterialIcons
                  name="search"
                  size={20}
                  color={colors.muted}
                />
                <TextInput
                  value={searchText}
                  onChangeText={setSearchText}
                  placeholder={searchPlaceholder}
                  className="flex-1 py-2 ml-2 text-foreground"
                  style={{
                    fontFamily: "Cairo",
                    color: colors.foreground,
                  }}
                  placeholderTextColor={colors.muted}
                />
                {searchText && (
                  <Pressable
                    onPress={() => setSearchText("")}
                    className="p-1"
                  >
                    <MaterialIcons
                      name="close"
                      size={18}
                      color={colors.muted}
                    />
                  </Pressable>
                )}
              </View>
            </View>

            {/* Items List */}
            <FlatList
              data={filteredItems}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <Pressable
                  onPress={() => {
                    onSelect(item.id);
                    setIsOpen(false);
                    setSearchText("");
                  }}
                  className="px-4 py-3 border-b flex-row items-center justify-between"
                  style={{ borderColor: colors.border }}
                >
                  <Text
                    className="text-base"
                    style={{
                      fontFamily: "Cairo",
                      color: colors.foreground,
                      fontWeight: selectedId === item.id ? "700" : "400",
                    }}
                  >
                    {item.name}
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
                <View className="py-8 items-center">
                  <MaterialIcons
                    name="search-off"
                    size={32}
                    color={colors.muted}
                  />
                  <Text
                    className="text-sm mt-2"
                    style={{ fontFamily: "Cairo", color: colors.muted }}
                  >
                    لم يتم العثور على نتائج
                  </Text>
                </View>
              }
              scrollEnabled
            />
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}
