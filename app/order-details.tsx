import { ScrollView, Text, View, Pressable, Platform, Linking } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useState } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";

interface OrderDetails {
  id: string;
  status: "new" | "processing" | "completed";
  orderDate: string;
  customerName: string;
  customerPhone: string;
  brands: string[];
  models: string[];
  categories: string[];
  yearRange: { from: number; to: number };
  mileageRange: { from: number; to: number; unit: "km" | "mile" };
  exteriorColors?: string[];
  interiorColors?: string[];
  regionalSpecs?: string[];
  priceRange: { min: number; max: number; currency: "SAR" | "USD" };
  fuelTypes: string[];
  transmissions: string[];
  driveTypes: string[];
  engineTypes: string[];
  engineSizes: string[];
  additionalFeatures: string[];
  customsStatus: string[];
}

// بيانات تجريبية للطلب
const mockOrder: OrderDetails = {
  id: "ORD-123",
  status: "new",
  orderDate: "2024-02-28",
  customerName: "أحمد منصور",
  customerPhone: "+966501234567",
  brands: ["تويوتا"],
  models: ["لاندكروزر", "برادو"],
  categories: ["GX.R", "VX.R"],
  yearRange: { from: 2020, to: 2024 },
  mileageRange: { from: 10000, to: 50000, unit: "km" },
  exteriorColors: ["أبيض", "أسود"],
  interiorColors: ["بيج"],
  regionalSpecs: ["خليجي"],
  priceRange: { min: 200000, max: 350000, currency: "SAR" },
  fuelTypes: ["بنزين"],
  transmissions: ["أوتوماتيك"],
  driveTypes: ["4WD"],
  engineTypes: ["V6", "V8"],
  engineSizes: ["3.5L", "4.0L"],
  additionalFeatures: ["فتحة سقف", "ثلاجة", "دفلوك"],
  customsStatus: ["مجمرك", "شحن"],
};

const StatusBadge = ({ status }: { status: OrderDetails["status"] }) => {
  const colors = useColors();
  const statusConfig: Record<OrderDetails["status"], { label: string; bgColor: string; textColor: string }> = {
    new: { label: "جديد", bgColor: colors.error, textColor: "#FFFFFF" },
    processing: { label: "قيد المعالجة", bgColor: colors.warning, textColor: "#FFFFFF" },
    completed: { label: "مكتمل", bgColor: colors.success, textColor: "#FFFFFF" },
  };

  const config = statusConfig[status];

  return (
    <View
      className="rounded-full px-3 py-1"
      style={{ backgroundColor: config.bgColor }}
    >
      <Text
        className="text-xs font-bold"
        style={{ color: config.textColor, fontFamily: "Cairo" }}
      >
        {config.label}
      </Text>
    </View>
  );
};

const SectionCard = ({
  title,
  icon,
  children,
}: {
  title: string;
  icon: string;
  children: React.ReactNode;
}) => {
  const colors = useColors();
  return (
    <View className="bg-surface rounded-lg border border-border overflow-hidden mb-4">
      <View className="flex-row items-center gap-3 px-4 py-3 border-b border-border">
        <View
          className="w-10 h-10 rounded-lg items-center justify-center"
          style={{ backgroundColor: colors.primary + "20" }}
        >
          <MaterialIcons name={icon as any} size={20} color={colors.primary} />
        </View>
        <Text
          className="text-base font-bold text-foreground flex-1"
          style={{ fontFamily: "Cairo" }}
        >
          {title}
        </Text>
      </View>
      <View className="px-4 py-3">{children}</View>
    </View>
  );
};

const MultiValueItem = ({ label, values }: { label: string; values?: string[] | number[] }) => {
  const colors = useColors();
  if (!values || values.length === 0) return null;

  return (
    <View className="py-2 border-b border-border last:border-b-0">
      <Text
        className="text-sm text-muted mb-2"
        style={{ fontFamily: "Cairo" }}
      >
        {label}
      </Text>
      <View className="flex-row flex-wrap gap-2">
        {values.map((value, index) => (
          <View
            key={index}
            className="px-2.5 py-1.5 rounded-lg border border-border"
            style={{ backgroundColor: colors.surface }}
          >
            <Text
              className="text-xs font-semibold text-foreground"
              style={{ fontFamily: "Cairo" }}
            >
              {value}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
};

export default function OrderDetailsScreen() {
  const colors = useColors();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [isFavorite, setIsFavorite] = useState(false);
  const [isNotified, setIsNotified] = useState(false);

  const order = mockOrder;

  const handleCall = () => {
    Linking.openURL(`tel:${order.customerPhone}`);
  };

  const handleWhatsApp = () => {
    const message = `مرحباً ${order.customerName}، بخصوص طلبك رقم ${order.id}...`;
    Linking.openURL(`whatsapp://send?phone=${order.customerPhone}&text=${encodeURIComponent(message)}`);
  };

  return (
    <View className="flex-1 bg-background">
      {/* App Bar */}
      <View
        className="bg-background border-b border-border px-3 py-2 flex-row items-center justify-between"
        style={{
          paddingTop: insets.top + 8,
          paddingBottom: 8,
        }}
      >
        <Pressable
          onPress={() => router.back()}
          style={({ pressed }) => [{ opacity: pressed ? 0.6 : 1 }]}
        >
          <MaterialIcons name="arrow-back" size={24} color={colors.primary} />
        </Pressable>
        <Text
          className="text-base font-bold text-foreground flex-1 text-center"
          style={{ fontFamily: "Cairo" }}
        >
          تفاصيل الطلب
        </Text>
        <StatusBadge status={order.status} />
      </View>

      <ScreenContainer className="flex-1 p-0">
        <ScrollView
          className="flex-1"
          contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 12, paddingVertical: 12 }}
        >
          {/* تاريخ الطلب */}
          <View className="items-center mb-4">
            <Text className="text-xs text-muted" style={{ fontFamily: "Cairo" }}>
              تاريخ الطلب: {order.orderDate}
            </Text>
          </View>

          {/* البيانات الشخصية والإجراءات السريعة */}
          <View className="bg-surface rounded-lg border border-border p-4 mb-4">
            <View className="flex-row items-center justify-between mb-4">
              <View className="flex-1">
                <Text className="text-sm text-muted mb-1" style={{ fontFamily: "Cairo" }}>
                  اسم صاحب الطلب
                </Text>
                <Text className="text-lg font-bold text-foreground" style={{ fontFamily: "Cairo" }}>
                  {order.customerName}
                </Text>
              </View>
              <View className="flex-1 items-end">
                <Text className="text-sm text-muted mb-1" style={{ fontFamily: "Cairo" }}>
                  رقم الهاتف
                </Text>
                <Text className="text-base font-semibold text-foreground" style={{ fontFamily: "Cairo" }}>
                  {order.customerPhone}
                </Text>
              </View>
            </View>

            <View className="flex-row gap-3">
              <Pressable
                onPress={handleCall}
                className="flex-1 bg-success rounded-lg py-3 flex-row items-center justify-center gap-2"
                style={({ pressed }) => [{ opacity: pressed ? 0.8 : 1 }]}
              >
                <MaterialIcons name="phone" size={20} color="#FFFFFF" />
                <Text className="text-white font-bold" style={{ fontFamily: "Cairo" }}>
                  اتصال مباشر
                </Text>
              </Pressable>
              <Pressable
                onPress={handleWhatsApp}
                className="flex-1 bg-[#25D366] rounded-lg py-3 flex-row items-center justify-center gap-2"
                style={({ pressed }) => [{ opacity: pressed ? 0.8 : 1 }]}
              >
                <MaterialIcons name="chat" size={20} color="#FFFFFF" />
                <Text className="text-white font-bold" style={{ fontFamily: "Cairo" }}>
                  واتساب
                </Text>
              </Pressable>
            </View>
          </View>

          {/* الهوية (الماركة، الموديل، الفئة) */}
          <SectionCard title="الهوية" icon="directions-car">
            <MultiValueItem label="الماركة" values={order.brands} />
            <MultiValueItem label="الموديل" values={order.models} />
            <MultiValueItem label="الفئة" values={order.categories} />
          </SectionCard>

          {/* النطاق الزمني والعداد */}
          <SectionCard title="النطاق الزمني والعداد" icon="history">
            <View className="py-2 border-b border-border">
              <Text className="text-sm text-muted mb-1" style={{ fontFamily: "Cairo" }}>
                سنة الصنع
              </Text>
              <Text className="text-base font-semibold text-foreground" style={{ fontFamily: "Cairo" }}>
                من {order.yearRange.from} إلى {order.yearRange.to}
              </Text>
            </View>
            <View className="py-2 border-b border-border last:border-b-0">
              <Text className="text-sm text-muted mb-1" style={{ fontFamily: "Cairo" }}>
                المسافة المقطوعة
              </Text>
              <Text className="text-base font-semibold text-foreground" style={{ fontFamily: "Cairo" }}>
                من {order.mileageRange.from.toLocaleString()} إلى {order.mileageRange.to.toLocaleString()} {order.mileageRange.unit === "km" ? "كم" : "ميل"}
              </Text>
            </View>
          </SectionCard>

          {/* المظهر والمواصفات الإقليمية */}
          {(order.exteriorColors?.length || order.interiorColors?.length || order.regionalSpecs?.length) ? (
            <SectionCard title="المظهر والمواصفات" icon="palette">
              <MultiValueItem label="الألوان الخارجية" values={order.exteriorColors} />
              <MultiValueItem label="الألوان الداخلية" values={order.interiorColors} />
              <MultiValueItem label="المواصفات الإقليمية" values={order.regionalSpecs} />
            </SectionCard>
          ) : null}

          {/* التكلفة والتمويل */}
          <View
            className="bg-primary rounded-lg p-4 mb-4 flex-row items-center justify-between"
          >
            <View>
              <Text
                className="text-xs text-white opacity-80"
                style={{ fontFamily: "Cairo" }}
              >
                حدود السعر المطلوبة
              </Text>
              <Text
                className="text-xl font-bold text-white mt-1"
                style={{ fontFamily: "Cairo" }}
              >
                {order.priceRange.min.toLocaleString()} - {order.priceRange.max.toLocaleString()} {order.priceRange.currency === "SAR" ? "ر.س" : "$"}
              </Text>
            </View>
            <MaterialIcons name="attach-money" size={32} color="#FFFFFF" />
          </View>

          {/* المواصفات التقنية */}
          <SectionCard title="المواصفات التقنية" icon="settings">
            <MultiValueItem label="نوع الوقود" values={order.fuelTypes} />
            <MultiValueItem label="ناقل الحركة" values={order.transmissions} />
            <MultiValueItem label="نظام الدفع" values={order.driveTypes} />
            <MultiValueItem label="نوع المحرك" values={order.engineTypes} />
            <MultiValueItem label="حجم المحرك" values={order.engineSizes} />
            <MultiValueItem label="المواصفات الإضافية" values={order.additionalFeatures} />
          </SectionCard>

          {/* الحالة القانونية */}
          <SectionCard title="الحالة القانونية" icon="verified">
            <MultiValueItem label="حالة الجمارك المطلوبة" values={order.customsStatus} />
          </SectionCard>

          <View style={{ height: 100 }} />
        </ScrollView>
      </ScreenContainer>

      {/* شريط الإجراءات السفلي الثابت */}
      <View
        className="bg-surface border-t border-border px-3 py-3 flex-row gap-2"
        style={{
          paddingBottom: insets.bottom + 8,
        }}
      >
        {/* زر المفضلة */}
        <Pressable
          onPress={() => setIsFavorite(!isFavorite)}
          style={({ pressed }) => [{ opacity: pressed ? 0.8 : 1, flex: 1 }]}
        >
          <View
            className="border border-border rounded-lg p-3 items-center justify-center"
            style={{
              backgroundColor: isFavorite ? colors.error + "20" : colors.surface,
              borderColor: isFavorite ? colors.error : colors.border,
            }}
          >
            <MaterialIcons
              name={isFavorite ? "favorite" : "favorite-border"}
              size={20}
              color={isFavorite ? colors.error : colors.muted}
            />
          </View>
        </Pressable>

        {/* زر الأرشفة */}
        <Pressable style={({ pressed }) => [{ opacity: pressed ? 0.8 : 1, flex: 1 }]}>
          <View className="border border-border rounded-lg p-3 items-center justify-center bg-surface">
            <MaterialIcons name="archive" size={20} color={colors.muted} />
          </View>
        </Pressable>

        {/* زر التنبيه */}
        <Pressable
          onPress={() => setIsNotified(!isNotified)}
          style={({ pressed }) => [{ opacity: pressed ? 0.8 : 1, flex: 1 }]}
        >
          <View
            className="border border-border rounded-lg p-3 items-center justify-center"
            style={{
              backgroundColor: isNotified ? colors.primary + "20" : colors.surface,
              borderColor: isNotified ? colors.primary : colors.border,
            }}
          >
            <MaterialIcons
              name={isNotified ? "notifications-active" : "notifications-none"}
              size={20}
              color={isNotified ? colors.primary : colors.muted}
            />
          </View>
        </Pressable>

        {/* زر التعديل الرئيسي */}
        <Pressable
          style={({ pressed }) => [{ opacity: pressed ? 0.8 : 1, flex: 2 }]}
          onPress={() => console.log("تعديل بيانات الطلب")}
        >
          <View
            className="bg-primary rounded-lg p-3 items-center justify-center flex-row gap-2"
          >
            <MaterialIcons name="edit" size={20} color="#FFFFFF" />
            <Text
              className="text-sm font-bold text-white"
              style={{ fontFamily: "Cairo" }}
            >
              تعديل
            </Text>
          </View>
        </Pressable>
      </View>
    </View>
  );
        }
