import { ScrollView, Text, View, Pressable } from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

import { ScreenContainer } from "@/components/screen-container";
import { AppHeader } from "@/components/app-header";
import { FloatingActionButton } from "@/components/floating-action-button";
import { useColors } from "@/hooks/use-colors";

interface CustomerRequest {
  id: string;
  customerName: string;
  customerPhone: string;
  requestedBrand: string;
  requestedModel: string;
  budget: number;
  status: "new" | "in-progress" | "completed" | "cancelled";
  createdDate: string;
  notes?: string;
}

const SAMPLE_REQUESTS: CustomerRequest[] = [
  {
    id: "1",
    customerName: "أحمد محمد",
    customerPhone: "0501234567",
    requestedBrand: "BMW",
    requestedModel: "X5",
    budget: 250000,
    status: "new",
    createdDate: "2026-02-20",
    notes: "يفضل اللون الأسود",
  },
  {
    id: "2",
    customerName: "فاطمة علي",
    customerPhone: "0559876543",
    requestedBrand: "Mercedes",
    requestedModel: "E-Class",
    budget: 280000,
    status: "in-progress",
    createdDate: "2026-02-19",
    notes: "تفضل الألوان الفاتحة",
  },
  {
    id: "3",
    customerName: "محمد سالم",
    customerPhone: "0555555555",
    requestedBrand: "Audi",
    requestedModel: "A6",
    budget: 240000,
    status: "completed",
    createdDate: "2026-02-18",
  },
  {
    id: "4",
    customerName: "سارة خالد",
    customerPhone: "0544444444",
    requestedBrand: "Toyota",
    requestedModel: "Land Cruiser",
    budget: 220000,
    status: "new",
    createdDate: "2026-02-20",
  },
];

export default function RequestsScreen() {
  const colors = useColors();
  const router = useRouter();
  const [selectedStatus, setSelectedStatus] = useState<"all" | "new" | "in-progress" | "completed" | "cancelled">("all");

  const handleMenuPress = () => {
    router.push("/settings");
  };

  const handleFABPress = () => {
    console.log("إضافة طلب جديد");
  };

  const handleRequestPress = (requestId: string) => {
    router.push(`/order-details?id=${requestId}`);
  };

  const filteredRequests = selectedStatus === "all"
    ? SAMPLE_REQUESTS
    : SAMPLE_REQUESTS.filter(req => req.status === selectedStatus);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "new": return colors.primary;
      case "in-progress": return colors.warning;
      case "completed": return colors.success;
      case "cancelled": return colors.error;
      default: return colors.muted;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "new": return "جديد";
      case "in-progress": return "قيد المعالجة";
      case "completed": return "مكتمل";
      case "cancelled": return "ملغى";
      default: return status;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "new": return "fiber-new";
      case "in-progress": return "schedule";
      case "completed": return "check-circle";
      case "cancelled": return "cancel";
      default: return "help";
    }
  };

  return (
    <View className="flex-1 bg-background">
      <AppHeader title="دليل السيارات" onMenuPress={handleMenuPress} />

      <ScreenContainer className="flex-1 p-0">
        <ScrollView className="flex-1">
          <View className="px-4 py-4 gap-3">
            <Text className="text-lg font-bold text-foreground" style={{ fontFamily: "Cairo" }}>
              تصفية حسب الحالة
            </Text>
            <View className="flex-row gap-2 flex-wrap">
              {["all", "new", "in-progress", "completed"].map((status) => (
                <Pressable
                  key={status}
                  onPress={() => setSelectedStatus(status as any)}
                  style={({ pressed }) => [
                    {
                      paddingHorizontal: 12,
                      paddingVertical: 8,
                      borderRadius: 20,
                      backgroundColor: selectedStatus === status ? colors.primary : colors.surface,
                      opacity: pressed ? 0.8 : 1,
                    },
                  ]}
                >
                  <Text
                    className="font-semibold"
                    style={{
                      color: selectedStatus === status ? "#FFFFFF" : colors.foreground,
                      fontFamily: "Cairo",
                    }}
                  >
                    {status === "all" ? "الكل" : getStatusLabel(status)}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>

          <View className="px-4 pb-4">
            <Text className="text-lg font-bold text-foreground mb-3" style={{ fontFamily: "Cairo" }}>
              الطلبات ({filteredRequests.length})
            </Text>

            {filteredRequests.length === 0 ? (
              <View className="items-center justify-center py-8">
                <MaterialIcons name="assignment" size={48} color={colors.muted} />
                <Text className="text-muted mt-2" style={{ fontFamily: "Cairo" }}>
                  لا توجد طلبات في هذه الفئة
                </Text>
              </View>
            ) : (
              filteredRequests.map((request) => (
                <Pressable
                  key={request.id}
                  onPress={() => handleRequestPress(request.id)}
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
                      borderLeftColor: getStatusColor(request.status),
                      borderLeftWidth: 4,
                    }}
                  >
                    <View className="flex-row justify-between items-start mb-3">
                      <View className="flex-1">
                        <Text className="text-lg font-bold text-foreground" style={{ fontFamily: "Cairo" }}>
                          {request.customerName}
                        </Text>
                        <View className="flex-row items-center gap-1 mt-1">
                          <MaterialIcons name="phone" size={14} color={colors.muted} />
                          <Text className="text-sm text-muted" style={{ fontFamily: "Cairo" }}>
                            {request.customerPhone}
                          </Text>
                        </View>
                      </View>
                      <View
                        className="flex-row items-center gap-1 px-3 py-2 rounded-full"
                        style={{ backgroundColor: getStatusColor(request.status) + "20" }}
                      >
                        <MaterialIcons name={getStatusIcon(request.status)} size={16} color={getStatusColor(request.status)} />
                        <Text
                          className="text-xs font-semibold"
                          style={{ color: getStatusColor(request.status), fontFamily: "Cairo" }}
                        >
                          {getStatusLabel(request.status)}
                        </Text>
                      </View>
                    </View>

                    <View className="bg-background rounded p-3 mb-3">
                      <Text className="text-sm text-muted mb-1" style={{ fontFamily: "Cairo" }}>السيارة المطلوبة</Text>
                      <Text className="text-base font-semibold text-foreground" style={{ fontFamily: "Cairo" }}>
                        {request.requestedBrand} {request.requestedModel}
                      </Text>
                      <Text className="text-sm text-primary mt-1" style={{ fontFamily: "Cairo" }}>
                        الميزانية: {request.budget.toLocaleString()} ر.س
                      </Text>
                    </View>

                    <View className="flex-row justify-between items-center">
                      <View className="flex-row items-center gap-1">
                        <MaterialIcons name="calendar-today" size={14} color={colors.muted} />
                        <Text className="text-xs text-muted" style={{ fontFamily: "Cairo" }}>{request.createdDate}</Text>
                      </View>
                      {request.notes && (
                        <View className="flex-row items-center gap-1">
                          <MaterialIcons name="notes" size={14} color={colors.muted} />
                          <Text className="text-xs text-muted" style={{ fontFamily: "Cairo" }}>ملاحظات</Text>
                        </View>
                      )}
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
                  ]}
                >
                  <Text
                    className="font-semibold"
                    style={{
                      color: selectedStatus === status ? "#FFFFFF" : colors.foreground,
                      fontFamily: "Cairo",
                    }}
                  >
                    {status === "all" ? "الكل" : getStatusLabel(status)}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>

          <View className="px-4 pb-4">
            <Text className="text-lg font-bold text-foreground mb-3" style={{ fontFamily: "Cairo" }}>
              الطلبات ({filteredRequests.length})
            </Text>

            {filteredRequests.length === 0 ? (
              <View className="items-center justify-center py-8">
                <MaterialIcons name="assignment" size={48} color={colors.muted} />
                <Text className="text-muted mt-2" style={{ fontFamily: "Cairo" }}>
                  لا توجد طلبات في هذه الفئة
                </Text>
              </View>
            ) : (
              filteredRequests.map((request) => (
                <Pressable
                  key={request.id}
                  onPress={() => handleRequestPress(request.id)}
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
                      borderLeftColor: getStatusColor(request.status),
                      borderLeftWidth: 4,
                    }}
                  >
                    <View className="flex-row justify-between items-start mb-3">
                      <View className="flex-1">
                        <Text className="text-lg font-bold text-foreground" style={{ fontFamily: "Cairo" }}>
                          {request.customerName}
                        </Text>
                        <View className="flex-row items-center gap-1 mt-1">
                          <MaterialIcons name="phone" size={14} color={colors.muted} />
                          <Text className="text-sm text-muted" style={{ fontFamily: "Cairo" }}>
                            {request.customerPhone}
                          </Text>
                        </View>
                      </View>
                      <View
                        className="flex-row items-center gap-1 px-3 py-2 rounded-full"
                        style={{ backgroundColor: getStatusColor(request.status) + "20" }}
                      >
                        <MaterialIcons name={getStatusIcon(request.status)} size={16} color={getStatusColor(request.status)} />
                        <Text
                          className="text-xs font-semibold"
                          style={{ color: getStatusColor(request.status), fontFamily: "Cairo" }}
                        >
                          {getStatusLabel(request.status)}
                        </Text>
                      </View>
                    </View>

                    <View className="bg-background rounded p-3 mb-3">
                      <Text className="text-sm text-muted mb-1" style={{ fontFamily: "Cairo" }}>السيارة المطلوبة</Text>
                      <Text className="text-base font-semibold text-foreground" style={{ fontFamily: "Cairo" }}>
                        {request.requestedBrand} {request.requestedModel}
                      </Text>
                      <Text className="text-sm text-primary mt-1" style={{ fontFamily: "Cairo" }}>
                        الميزانية: {request.budget.toLocaleString()} ر.س
                      </Text>
                    </View>

                    <View className="flex-row justify-between items-center">
                      <View className="flex-row items-center gap-1">
                        <MaterialIcons name="calendar-today" size={14} color={colors.muted} />
                        <Text className="text-xs text-muted" style={{ fontFamily: "Cairo" }}>{request.createdDate}</Text>
                      </View>
                      {request.notes && (
                        <View className="flex-row items-center gap-1">
                          <MaterialIcons name="notes" size={14} color={colors.muted} />
                          <Text className="text-xs text-muted" style={{ fontFamily: "Cairo" }}>ملاحظات</Text>
                        </View>
                      )}
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
