import React, { useState } from "react";
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

export interface DropdownItem {
  id: string;
  name: string;
}

interface SmartDropdownProps {
  items: DropdownItem[];
  selectedId?: string;
  onSelect: (id: string) => void;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  showSearchThreshold?: number; // Show search input if items count exceeds this
}

export function SmartDropdown({
  items,
  selectedId,
  onSelect,
  label,
  placeholder = "اختر...",
  disabled = false,
  showSearchThreshold = 5,
}: SmartDropdownProps) {
  const colors = useColors();
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const selectedItem = items.find((item) => item.id === selectedId);
  const filteredItems = items.filter((item) =>
    item.name.includes(searchQuery)
  );

  const showSearch = items.length > showSearchThreshold;

  const handleSelect = (id: string) => {
    onSelect(id);
    setDropdownVisible(false);
    setSearchQuery("");
  };

  return (
    <View className="gap-2">
      {label && (
        <Text
          className="text-sm font-semibold text-foreground"
          style={{ fontFamily: "Cairo" }}
        >
          {label}
        </Text>
      )}

      {/* Dropdown Button */}
      <Pressable
        onPress={() => !disabled && setDropdownVisible(true)}
        disabled={disabled}
        style={({ pressed }) => [
          {
            borderWidth: 1,
            borderRadius: 8,
            padding: 12,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            borderColor: colors.border,
            backgroundColor: disabled ? colors.surface : colors.background,
            opacity: pressed && !disabled ? 0.7 : 1,
          },
        ]}
      >
        <Text
          style={{
            fontFamily: "Cairo",
            color: selectedItem ? colors.foreground : colors.muted,
            flex: 1,
          }}
        >
          {selectedItem?.name || placeholder}
        </Text>
        <MaterialIcons
          name={dropdownVisible ? "expand-less" : "expand-more"}
          size={20}
          color={disabled ? colors.muted : colors.foreground}
        />
      </Pressable>

      {/* Dropdown Modal */}
      <Modal
        visible={dropdownVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setDropdownVisible(false)}
      >
        <Pressable
          style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.3)",
          }}
          onPress={() => setDropdownVisible(false)}
        >
          {/* Dropdown Menu */}
          <View
            style={{
              backgroundColor: colors.background,
              borderRadius: 8,
              marginHorizontal: 16,
              marginTop: 100,
              maxHeight: 300,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.25,
              shadowRadius: 4,
              elevation: 5,
              borderWidth: 1,
              borderColor: colors.border,
            }}
          >
            {/* Search Input */}
            {showSearch && (
              <View className="p-3 border-b" style={{ borderColor: colors.border }}>
                <TextInput
                  placeholder="ابحث..."
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                  className="border rounded-lg p-2 text-foreground"
                  style={{
                    borderColor: colors.border,
                    color: colors.foreground,
                    fontFamily: "Cairo",
                  }}
                  placeholderTextColor={colors.muted}
                  autoFocus
                />
              </View>
            )}

            {/* Items List */}
            {filteredItems.length > 0 ? (
              <FlatList
                data={filteredItems}
                keyExtractor={(item) => item.id}
                scrollEnabled
                nestedScrollEnabled
                renderItem={({ item }) => (
                  <Pressable
                    onPress={() => handleSelect(item.id)}
                    style={({ pressed }) => [
                      {
                        paddingHorizontal: 16,
                        paddingVertical: 12,
                        backgroundColor:
                          selectedId === item.id
                            ? colors.primary + "15"
                            : pressed
                              ? colors.surface
                              : colors.background,
                        borderBottomWidth: 1,
                        borderBottomColor: colors.border,
                      },
                    ]}
                  >
                    <View className="flex-row items-center justify-between">
                      <Text
                        style={{
                          fontFamily: "Cairo",
                          color: colors.foreground,
                          flex: 1,
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
                    </View>
                  </Pressable>
                )}
              />
            ) : (
              <View className="p-4 items-center">
                <Text
                  className="text-muted text-sm"
                  style={{ fontFamily: "Cairo" }}
                >
                  لا توجد عناصر متطابقة
                </Text>
              </View>
            )}
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}
