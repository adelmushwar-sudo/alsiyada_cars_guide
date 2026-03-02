import { ScrollView, Text, View, Pressable } from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

import { ScreenContainer } from "@/components/screen-container";
import { AppHeader } from "@/components/app-header";
import { FloatingActionButton } from "@/components/floating-action-button";
import { CompactCarCard } from "@/components/compact-car-card";
import { useColors } from "@/hooks/use-colors";

interface Car {
  id: string;
  brand: string;
  model: string;
  year: number;
  price: number;
  status: "available" | "sold" | "reserved";
  location: "showroom" | "supplier" | "external";
  category?: string;
  mileage?: number;
  fuelType?: string;
  transmission?: string;
  driveType?: string;
  engineSize?: string;
  customsStatus?: string;
  regionalSpec?: string;
  images?: Array<{ id: string; url?: string }>;
}

const SAMPLE_CARS: Car[] = [
  {
    id: "1",
    brand: "BMW",
    model: "X5",
    year: 2023,
    price: 250000,
    status: "available",
    location: "showroom",
    category: "SUV",
    mileage: 15000,
    fuelType: "بنزين",
    transmission: "أوتوماتيك",
    driveType: "دفع رباعي",
    engineSize: "3.0L",
    customsStatus: "مُخلصة",
    regionalSpec: "خليجي",
    images: [{ id: "1-1" }, { id: "1-2" }],
  },
  {
    id: "2",
    brand: "Mercedes",
    model: "E-Class",
    year: 2022,
    price: 280000,
    status: "available",
    location: "supplier",
    category: "سيدان",
    mileage: 28000,
    fuelType: "بنزين",
    transmission: "أوتوماتيك",
    driveType: "دفع أمامي",
    engineSize: "2.0L",
    customsStatus: "مُخلصة",
    regionalSpec: "أوروبي",
    images: [{ id: "2-1" }],
  },
  {
    id: "3",
    brand: "Toyota",
    model: "Land Cruiser",
    year: 2023,
    price: 220000,
    status: "available",
    location: "showroom",
    category: "SUV",
    mileage: 8000,
    fuelType: "بنزين",
    transmission: "أوتوماتيك",
    driveType: "دفع رباعي",
    engineSize: "5.7L",
    customsStatus: "مُخلصة",
    regionalSpec: "خليجي",
    images: [{ id: "4-1" }],
  }
];

export default function OurInventoryScreen() {
  const colors = useColors();
  const router = useRouter();
  const [selectedLocation, setSelectedLocation] = useState<"all" | "showroom" | "supplier" | "external">("all");

  const handleMenuPress = () => {
    router.push("/settings");
  };

  const handleFABPress = () => {
    console.log("إضافة سيارة جديدة");
  };

  const handleCarPress = (carId: string) => {
    router.push(`/car-details?id=${carId}`);
  };

  const filteredCars = selectedLocation === "all" 
    ? SAMPLE_CARS 
    : SAMPLE_CARS.filter(car => car.location === selectedLocation);

  return (
    <View className="flex-1 bg-background">
      <AppHeader title="دليل السيارات" onMenuPress={handleMenuPress} />

      <ScreenContainer className="flex-1 p-0">
        <ScrollView className="flex-1">
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
                      backgroundColor: selectedLocation === filter.key ? colors.primary : colors.surface,
                      opacity: pressed ? 0.8 : 1,
                    },
                  ]}
                >
                  <Text
                    style={{
                      color: selectedLocation === filter.key ? "#FFFFFF" : colors.foreground,
                      fontFamily: "Cairo",
                      fontWeight: "600"
                    }}
                  >
                    {filter.label}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>

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
                <CompactCarCard
                  key={car.id}
                  {...car}
                  onPress={() => handleCarPress(car.id)}
                />
              ))
            )}
          </View>
        </ScrollView>
        <FloatingActionButton onPress={handleFABPress} />
      </ScreenContainer>
    </View>
  );
}
