import { ScrollView, Text, View, Pressable } from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

import { ScreenContainer } from "@/components/screen-container";
import { AppHeader } from "@/components/app-header";
import { useColors } from "@/hooks/use-colors";

interface StatCard {
  title: string;
  value: string | number;
  icon: keyof typeof MaterialIcons.glyphMap;
  color: string;
}

export default function HomeScreen() {
  const colors = useColors();

  const stats: StatCard[] = [
    {
      title: "السيارات المتاحة",
      value: 24,
      icon: "directions-car",
      color: colors.primary,
    },
    {
      title: "الطلبات الجديدة",
      value: 8,
      icon: "assignment",
      color: colors.error,
    },
    {
      title: "المحجوزة",
      value: 12,
      icon: "schedule",
      color: colors.warning,
    },
    {
      title: "المبيعة اليوم",
      value: 3,
      icon: "trending-up",
      color: colors.success,
    },
  ];

  return (
    <View className="flex-1 bg-background">
      <AppHeader title="دليل السيارات" />

      <ScreenContainer className="flex-1 p-0">
        <ScrollView className="flex-1" contentContainerStyle={{ flexGrow: 1 }}>
          {/* البطاقات الإحصائية */}
          <View className="px-4 py-6 gap-4">
            <Text
              className="text-2xl font-bold text-foreground"
              style={{ fontFamily: "Cairo" }}
            >
              ملخص اليوم
            </Text>

            <View className="gap-3">
              {stats.map((stat, index) => (
                <Pressable
                  key={index}
                  style={({ pressed }) => [{ opacity: pressed ? 0.8 : 1 }]}
                >
                  <View
                    className="bg-surface rounded-lg p-4 flex-row items-center justify-between border border-border"
                    style={{
                      borderLeftColor: stat.color,
                      borderLeftWidth: 4,
                    }}
                  >
                    <View className="flex-1">
                      <Text
                        className="text-sm text-muted mb-1"
                        style={{ fontFamily: "Cairo" }}
                      >
                        {stat.title}
                      </Text>
                      <Text
                        className="text-2xl font-bold text-foreground"
                        style={{ fontFamily: "Cairo" }}
                      >
                        {stat.value}
                      </Text>
                    </View>
                    <View
                      className="w-12 h-12 rounded-lg items-center justify-center"
                      style={{ backgroundColor: stat.color + "20" }}
                    >
                      <MaterialIcons name={stat.icon} size={24} color={stat.color} />
                    </View>
                  </View>
                </Pressable>
              ))}
            </View>
          </View>

          {/* الإجراءات السريعة */}
          <View className="px-4 py-6 gap-4">
            <Text
              className="text-xl font-bold text-foreground"
              style={{ fontFamily: "Cairo" }}
            >
              إجراءات سريعة
            </Text>

            <View className="gap-3">
              <Pressable
                style={({ pressed }) => [{ opacity: pressed ? 0.8 : 1 }]}
              >
                <View className="bg-primary rounded-lg p-4 flex-row items-center gap-3">
                  <View
                    className="w-12 h-12 rounded-lg items-center justify-center"
                    style={{ backgroundColor: "rgba(255,255,255,0.2)" }}
                  >
                    <MaterialIcons name="add" size={24} color="#FFFFFF" />
                  </View>
                  <View className="flex-1">
                    <Text
                      className="text-base font-bold text-white"
                      style={{ fontFamily: "Cairo" }}
                    >
                      إضافة سيارة جديدة
                    </Text>
                    <Text className="text-xs text-white opacity-80">
                      إضافة سيارة للمخزون
                    </Text>
                  </View>
                  <MaterialIcons name="chevron-left" size={24} color="#FFFFFF" />
                </View>
              </Pressable>

              <Pressable
                style={({ pressed }) => [{ opacity: pressed ? 0.8 : 1 }]}
              >
                <View className="bg-surface rounded-lg p-4 flex-row items-center gap-3 border border-border">
                  <View
                    className="w-12 h-12 rounded-lg items-center justify-center"
                    style={{ backgroundColor: colors.error + "20" }}
                  >
                    <MaterialIcons name="assignment" size={24} color={colors.error} />
                  </View>
                  <View className="flex-1">
                    <Text
                      className="text-base font-bold text-foreground"
                      style={{ fontFamily: "Cairo" }}
                    >
                      طلب جديد
                    </Text>
                    <Text className="text-xs text-muted">
                      إضافة طلب عميل
                    </Text>
                  </View>
                  <MaterialIcons name="chevron-left" size={24} color={colors.muted} />
                </View>
              </Pressable>
            </View>
          </View>

          {/* آخر السيارات المضافة */}
          <View className="px-4 py-6 gap-4 pb-8">
            <Text
              className="text-xl font-bold text-foreground"
              style={{ fontFamily: "Cairo" }}
            >
              آخر السيارات المضافة
            </Text>

            <View className="gap-3">
              {[
                { brand: "BMW X5", price: "250,000" },
                { brand: "Mercedes E-Class", price: "280,000" },
                { brand: "Audi A6", price: "240,000" },
              ].map((car, index) => (
                <Pressable
                  key={index}
                  style={({ pressed }) => [{ opacity: pressed ? 0.8 : 1 }]}
                >
                  <View className="bg-surface rounded-lg p-4 flex-row items-center justify-between border border-border">
                    <View>
                      <Text
                        className="text-base font-semibold text-foreground"
                        style={{ fontFamily: "Cairo" }}
                      >
                        {car.brand}
                      </Text>
                      <Text className="text-sm text-primary mt-1">
                        {car.price} ر.س
                      </Text>
                    </View>
                    <MaterialIcons name="chevron-left" size={24} color={colors.muted} />
                  </View>
                </Pressable>
              ))}
            </View>
          </View>
        </ScrollView>
      </ScreenContainer>
    </View>
  );
}
