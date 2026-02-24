import { ScrollView, Text, View, Pressable, FlatList } from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

import { ScreenContainer } from "@/components/screen-container";
import { AppHeader } from "@/components/app-header";
import { FloatingActionButton } from "@/components/floating-action-button";
import { useColors } from "@/hooks/use-colors";

interface Car {
  id: string;
  brand: string;
  model: string;
  year: number;
  price: number;
  status: "available" | "sold" | "reserved";
  supplier?: string;
  location: "showroom" | "supplier" | "external";
}

// بيانات تجريبية
const SAMPLE_CARS: Car[] = [
  {
    id: "1",
    brand: "BMW",
    model: "X5",
    year: 2023,
    price: 250000,
    status: "available",
    location: "showroom",
  },
  {
    id: "2",
    brand: "Mercedes",
    model: "E-Class",
    year: 2022,
    price: 280000,
    status: "available",
    supplier: "الموردين الرئيسيين",
    location: "supplier",
  },
  {
    id: "3",
    brand: "Audi",
    model: "A6",
    year: 2023,
    price: 240000,
    status: "reserved",
    location: "external",
  },
  {
    id: "4",
    brand: "Toyota",
    model: "Land Cruiser",
    year: 2023,
    price: 220000,
    status: "available",
    location: "showroom",
  },
];

export default function OurInventoryScreen() {
  const colors = useColors();
  const router = useRouter();
  const [selectedLocation, setSelectedLocation] = useState<"all" | "showroom" | "supplier" | "external">("all");

  const handleMenuPress = () => {
    router.push("/settings");
  };

  const handleFABPress = () => {
    // TODO: فتح شاشة إضافة سيارة جديدة
    console.log("إضافة سيارة جديدة");
  };

  const handleCarPress = (carId: string) => {
    router.push(`/car-details?id=${carId}`);
  };

  const filteredCars = selectedLocation === "all" 
    ? SAMPLE_CARS 
    : SAMPLE_CARS.filter(car => car.location === selectedLocation);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "available":
        return colors.success;
      case "sold":
        return colors.error;
      case "reserved":
        return colors.warning;
      default:
        return colors.muted;
    }
  };

  const getLocationLabel = (location: string) => {
    switch (location) {
      case "showroom":
        return "المعرض";
      case "supplier":
        return "الموردين";
      case "external":
        return "خارجي";
      default:
        return location;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "available":
        return "متاح";
      case "sold":
        return "مباع";
      case "reserved":
        return "محجوز";
      default:
        return status;
    }
  };

  return (
    <View className="flex-1 bg-background">
      <AppHeader title="دليل السيارات" onMenuPress={handleMenuPress} />

      <ScreenContainer className="flex-1 p-0">
        <ScrollView className="flex-1">
          {/* فلاتر الموقع */}
          <View className="px-4 py-4 gap-3">
            <Text className="text-lg font-bold text-foreground" style={{ fontFamily: "Cairo" }}>
              تصفية حسب الموقع
            </Text>
            <View className="flex-row gap-2 flex-wrap">
              {[
                { key: "all", label: "الكل" },
                { key: "showroom", label: "المعرض" },
                { key: "supplier", label: "الموردين" },
                { key: "external", label: "خارجي" },
              ].map((filter) => (
                <Pressable
                  key={filter.key}
                  onPress={() => setSelectedLocation(filter.key as any)}
                  style={({ pressed }) => [
                    {
                      paddingHorizontal: 12,
                      paddingVertical: 8,
                      borderRadius: 20,
                      backgroundColor:
                        selectedLocation === filter.key
                          ? colors.primary
                          : colors.surface,
                      opacity: pressed ? 0.8 : 1,
                    },
                  ]}
                >
                  <Text
                    className="font-semibold"
                    style={{
                      color:
                        selectedLocation === filter.key
                          ? "#FFFFFF"
                          : colors.foreground,
                      fontFamily: "Cairo",
                    }}
                  >
                    {filter.label}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>

          {/* قائمة السيارات */}
          <View className="px-4 pb-4">
            <Text className="text-lg font-bold text-foreground mb-3" style={{ fontFamily: "Cairo" }}>
              السيارات المتوفرة ({filteredCars.length})
            </Text>

            {filteredCars.length === 0 ? (
              <View className="items-center justify-center py-8">
                <MaterialIcons name="directions-car" size={48} color={colors.muted} />
                <Text className="text-muted mt-2" style={{ fontFamily: "Cairo" }}>
                  لا توجد سيارات في هذه الفئة
                </Text>
              </View>
            ) : (
              filteredCars.map((car) => (
                <Pressable
                  key={car.id}
                  onPress={() => handleCarPress(car.id)}
                  style={({ pressed }) => [
                    {
                      marginBottom: 12,
                      opacity: pressed ? 0.8 : 1,
                    },
                  ]}
                >
                  <View
                    className="bg-surface rounded-lg p-4 border border-border"
                    style={{
                      borderLeftColor: colors.primary,
                      borderLeftWidth: 4,
                    }}
                  >
                    {/* رأس البطاقة - الماركة والموديل والسعر */}
                    <View className="flex-row justify-between items-start mb-3">
                      <View className="flex-1">
                        <Text
                          className="text-lg font-bold text-foreground"
                          style={{ fontFamily: "Cairo" }}
                        >
                          {car.brand} {car.model}
                        </Text>
                        <Text className="text-sm text-muted mt-1" style={{ fontFamily: "Cairo" }}>
                          {car.year}
                        </Text>
                      </View>
                      <View className="items-end">
                        <Text
                          className="text-lg font-bold text-primary"
                          style={{ fontFamily: "Cairo" }}
                        >
                          {car.price.toLocaleString()} ر.س
                        </Text>
                      </View>
                    </View>

                    {/* معلومات إضافية */}
                    <View className="flex-row justify-between items-center">
                      {/* الحالة */}
                      <View
                        className="flex-row items-center gap-2 px-3 py-2 rounded-full"
                        style={{ backgroundColor: getStatusColor(car.status) + "20" }}
                      >
                        <MaterialIcons
                          name={
                            car.status === "available"
                              ? "check-circle"
                              : car.status === "sold"
                              ? "cancel"
                              : "schedule"
                          }
                          size={16}
                          color={getStatusColor(car.status)}
                        />
                        <Text
                          className="text-sm font-semibold"
                          style={{
                            color: getStatusColor(car.status),
                            fontFamily: "Cairo",
                          }}
                        >
                          {getStatusLabel(car.status)}
                        </Text>
                      </View>

                      {/* الموقع */}
                      <View className="flex-row items-center gap-1">
                        <MaterialIcons
                          name="location-on"
                          size={16}
                          color={colors.muted}
                        />
                        <Text className="text-xs text-muted" style={{ fontFamily: "Cairo" }}>
                          {getLocationLabel(car.location)}
                        </Text>
                      </View>
                    </View>
                  </View>
                </Pressable>
              ))
            )}
          </View>
        </ScrollView>
        <FloatingActionButton onPress={handleFABPress} />
      </ScreenContainer>
    </View>
  );
}
