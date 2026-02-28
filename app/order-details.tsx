import { ScrollView, Text, View, Pressable, Platform, Linking } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
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
  notes?: string;
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
  notes: "العميل يفضل اللون الأبيض اللؤلؤي، ويرغب في فحص السيارة في مركز معتمد قبل الشراء. يرجى التأكد من توفر ضمان الوكيل.",
};

const StatusBadge = ({ status }: { status: OrderDetails["status"] }) => {
  const colors = useColors();
  const statusConfig: Record<OrderDetails["status"], { label: string; bgColor: string; textColor: string; icon: keyof typeof MaterialIcons.glyphMap }> = {
    new: { label: "جديد", bgColor: colors.primary + "20", textColor: colors.primary, icon: "fiber-new" },
    processing: { label: "قيد المراجعة", bgColor: colors.warning + "20", textColor: colors.warning, icon: "schedule" },
    completed: { label: "مكتمل", bgColor: colors.success + "20", textColor: colors.success, icon: "check-circle" },
  };

  const config = statusConfig[status];

  return (
    <View
      className="flex-row items-center gap-1.5 rounded-full px-3 py-1.5"
      style={{ backgroundColor: config.bgColor }}
    >
      <MaterialIcons name={config.icon} size={16} color={config.textColor} />
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
  badge,
}: {
  title: string;
  icon: keyof typeof MaterialIcons.glyphMap;
  children: React.ReactNode;
  badge?: React.ReactNode;
}) => {
  const colors = useColors();
  return (
    <View className="bg-surface rounded-2xl border border-border overflow-hidden mb-6 shadow-sm">
      <View className="flex-row items-center gap-3 px-5 py-4 border-b border-border bg-surface">
        <View
          className="w-10 h-10 rounded-xl items-center justify-center"
          style={{ backgroundColor: colors.primary + "10" }}
        >
          <MaterialIcons name={icon} size={22} color={colors.primary} />
        </View>
        <Text
          className="text-base font-bold text-foreground flex-1"
          style={{ fontFamily: "Cairo" }}
        >
          {title}
        </Text>
        {badge}
      </View>
      <View className="px-5 py-4">{children}</View>
    </View>
  );
};

const Chip = ({ label, color }: { label: string; color?: string }) => {
  const colors = useColors();
  return (
    <View
      className="px-3 py-1.5 rounded-lg border border-border"
      style={{ backgroundColor: color || colors.surface }}
    >
      <Text
        className="text-xs font-semibold text-foreground"
        style={{ fontFamily: "Cairo" }}
      >
        {label}
      </Text>
    </View>
  );
};

const HorizontalItem = ({ label, children }: { label: string; children: React.ReactNode }) => {
  return (
    <View className="flex-row items-center justify-between py-2">
      <Text className="text-sm text-muted" style={{ fontFamily: "Cairo", width: 100 }}>{label}</Text>
      <View className="flex-1 flex-row flex-wrap justify-end gap-2">
        {children}
      </View>
    </View>
  );
};

const RangeDisplay = ({ from, to, unit, label }: { from: string | number; to: string | number; unit?: string; label: string }) => {
  const colors = useColors();
  return (
    <View className="py-3">
      <Text className="text-sm text-muted mb-3" style={{ fontFamily: "Cairo" }}>{label}</Text>
      <View className="flex-row items-center gap-4">
        <View className="flex-1 bg-background rounded-xl p-3 border border-border items-center">
          <Text className="text-xs text-muted mb-1" style={{ fontFamily: "Cairo" }}>من</Text>
          <Text className="text-base font-bold text-foreground" style={{ fontFamily: "Cairo" }}>{from.toLocaleString()}</Text>
        </View>
        <View className="w-8 h-0.5 bg-border rounded-full" />
        <View className="flex-1 bg-background rounded-xl p-3 border border-border items-center">
          <Text className="text-xs text-muted mb-1" style={{ fontFamily: "Cairo" }}>إلى</Text>
          <Text className="text-base font-bold text-foreground" style={{ fontFamily: "Cairo" }}>{to.toLocaleString()} {unit}</Text>
        </View>
      </View>
    </View>
  );
};

const ActionButton = ({ icon, label, color, onPress, isFontAwesome = false }: { icon: any; label: string; color: string; onPress: () => void; isFontAwesome?: boolean }) => {
  return (
    <Pressable
      onPress={onPress}
      className="items-center gap-1.5"
      style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}
    >
      <View
        className="w-12 h-12 rounded-2xl items-center justify-center shadow-sm"
        style={{ backgroundColor: color }}
      >
        {isFontAwesome ? (
          <FontAwesome6 name={icon} size={22} color="#FFFFFF" />
        ) : (
          <MaterialIcons name={icon} size={24} color="#FFFFFF" />
        )}
      </View>
      <Text className="text-[10px] text-muted font-bold text-center" style={{ fontFamily: "Cairo", width: 50 }}>{label}</Text>
    </Pressable>
  );
};

export default function OrderDetailsScreen() {
  const colors = useColors();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [isFavorite, setIsFavorite] = useState(false);
  const [isNotified, setIsNotified] = useState(false);

  const order = mockOrder;

  const handleCall = () => Linking.openURL(`tel:${order.customerPhone}`);
  const handleWhatsApp = () => {
    const message = `مرحباً ${order.customerName}، بخصوص طلبك رقم ${order.id}...`;
    Linking.openURL(`whatsapp://send?phone=${order.customerPhone}&text=${encodeURIComponent(message)}`);
  };
  const handleSMS = () => Linking.openURL(`sms:${order.customerPhone}`);

  return (
    <View className="flex-1 bg-background">
      {/* App Bar */}
      <View
        className="bg-background border-b border-border px-4 py-2"
        style={{ paddingTop: insets.top + 8, paddingBottom: 12 }}
      >
        <View className="flex-row items-center justify-between mb-1">
          <Pressable
            onPress={() => router.back()}
            style={({ pressed }) => [{ opacity: pressed ? 0.6 : 1 }]}
          >
            <MaterialIcons name="arrow-back" size={24} color={colors.primary} />
          </Pressable>
          <View className="flex-1 px-2">
            <Text
              className="text-lg font-bold text-foreground text-right"
              style={{ fontFamily: "Cairo" }}
            >
              تفاصيل الطلب
            </Text>
            <Text className="text-[10px] text-muted text-right" style={{ fontFamily: "Cairo" }}>
              تاريخ الطلب: {order.orderDate}
            </Text>
          </View>
          <StatusBadge status={order.status} />
        </View>
      </View>

      <ScreenContainer className="flex-1 p-0">
        <ScrollView
          className="flex-1"
          contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 16, paddingVertical: 20 }}
        >
          {/* قسم معلومات العميل */}
          <View className="bg-surface rounded-2xl border border-border p-5 mb-6 shadow-sm">
            <View className="mb-4">
              <Text className="text-xs text-muted mb-1" style={{ fontFamily: "Cairo" }}>اسم صاحب الطلب</Text>
              <Text className="text-xl font-bold text-foreground" style={{ fontFamily: "Cairo" }}>{order.customerName}</Text>
            </View>

            <View className="flex-row items-center justify-between pt-4 border-t border-border">
              <View>
                <Text className="text-xs text-muted mb-1" style={{ fontFamily: "Cairo" }}>رقم الهاتف</Text>
                <Text className="text-base font-bold text-foreground" style={{ fontFamily: "Cairo" }}>{order.customerPhone}</Text>
              </View>
              <View className="flex-row gap-4">
                <ActionButton icon="whatsapp" label="واتساب" color="#25D366" onPress={handleWhatsApp} isFontAwesome />
                <ActionButton icon="phone" label="اتصال" color={colors.success} onPress={handleCall} />
                <ActionButton icon="message" label="SMS" color={colors.primary} onPress={handleSMS} />
              </View>
            </View>
          </View>

          {/* بطاقة البيانات الأساسية */}
          <SectionCard title="البيانات الأساسية" icon="directions-car">
            <View className="gap-2">
              <HorizontalItem label="الماركة">
                {order.brands.map((b, i) => <Chip key={i} label={b} color={colors.primary + "10"} />)}
              </HorizontalItem>
              <HorizontalItem label="الموديل">
                {order.models.map((m, i) => <Chip key={i} label={m} />)}
              </HorizontalItem>
              <HorizontalItem label="الفئة">
                {order.categories.map((c, i) => <Chip key={i} label={c} />)}
              </HorizontalItem>
            </View>
          </SectionCard>

          {/* بطاقة النطاق الزمني والعداد */}
          <SectionCard title="النطاق الزمني والعداد" icon="history">
            <RangeDisplay label="سنة الصنع" from={order.yearRange.from} to={order.yearRange.to} />
            <View className="h-px bg-border my-1" />
            <RangeDisplay label="المسافة المقطوعة" from={order.mileageRange.from} to={order.mileageRange.to} unit={order.mileageRange.unit === "km" ? "كم" : "ميل"} />
          </SectionCard>

          {/* بطاقة المظهر والمواصفات */}
          {(order.exteriorColors?.length || order.interiorColors?.length || order.regionalSpecs?.length) ? (
            <SectionCard title="المظهر والمواصفات" icon="palette">
              <View className="gap-2">
                {order.exteriorColors && (
                  <HorizontalItem label="الألوان الخارجية">
                    {order.exteriorColors.map((c, i) => <Chip key={i} label={c} />)}
                  </HorizontalItem>
                )}
                {order.interiorColors && (
                  <HorizontalItem label="الألوان الداخلية">
                    {order.interiorColors.map((c, i) => <Chip key={i} label={c} />)}
                  </HorizontalItem>
                )}
                {order.regionalSpecs && (
                  <HorizontalItem label="المواصفات الإقليمية">
                    {order.regionalSpecs.map((s, i) => <Chip key={i} label={s} />)}
                  </HorizontalItem>
                )}
              </View>
            </SectionCard>
          ) : null}

          {/* قسم الميزانية */}
          <View className="bg-primary rounded-2xl p-6 mb-6 shadow-md overflow-hidden relative">
            <View className="absolute -right-4 -bottom-4 opacity-10">
              <MaterialIcons name="attach-money" size={120} color="#FFFFFF" />
            </View>
            <Text className="text-xs text-white opacity-80 mb-4 text-center" style={{ fontFamily: "Cairo" }}>حدود الميزانية المطلوبة</Text>
            <View className="flex-row items-center justify-center gap-4">
              <View className="bg-white/10 rounded-xl px-4 py-3 items-center border border-white/20">
                <Text className="text-xl font-bold text-white" style={{ fontFamily: "Cairo" }}>
                  {order.priceRange.min.toLocaleString()} {order.priceRange.currency === "SAR" ? "ر.س" : "$"}
                </Text>
              </View>
              <View className="w-6 h-0.5 bg-white/30" />
              <View className="bg-white/10 rounded-xl px-4 py-3 items-center border border-white/20">
                <Text className="text-xl font-bold text-white" style={{ fontFamily: "Cairo" }}>
                  {order.priceRange.max.toLocaleString()} {order.priceRange.currency === "SAR" ? "ر.س" : "$"}
                </Text>
              </View>
            </View>
          </View>

          {/* المواصفات التقنية */}
          <SectionCard title="المواصفات التقنية" icon="settings">
            <View className="gap-2">
              <HorizontalItem label="نوع الوقود">
                {order.fuelTypes.map((t, i) => <Chip key={i} label={t} />)}
              </HorizontalItem>
              <HorizontalItem label="ناقل الحركة">
                {order.transmissions.map((t, i) => <Chip key={i} label={t} />)}
              </HorizontalItem>
              <HorizontalItem label="نظام الدفع">
                {order.driveTypes.map((d, i) => <Chip key={i} label={d} />)}
              </HorizontalItem>
              <HorizontalItem label="المواصفات الإضافية">
                {order.additionalFeatures.map((f, i) => <Chip key={i} label={f} color={colors.primary + "05"} />)}
              </HorizontalItem>
            </View>
          </SectionCard>

          {/* الحالة القانونية */}
          <SectionCard title="الحالة القانونية" icon="verified">
            <HorizontalItem label="حالة الجمارك">
              {order.customsStatus.map((s, i) => <Chip key={i} label={s} />)}
            </HorizontalItem>
          </SectionCard>

          {/* بطاقة الملاحظات */}
          {order.notes && (
            <SectionCard title="ملاحظات إضافية" icon="event-note">
              <View className="bg-background rounded-xl p-4 border border-border">
                <Text className="text-sm text-foreground leading-6" style={{ fontFamily: "Cairo" }}>
                  {order.notes}
                </Text>
              </View>
            </SectionCard>
          )}

          <View style={{ height: 100 }} />
        </ScrollView>
      </ScreenContainer>

      {/* شريط الإجراءات السفلي الثابت */}
      <View
        className="bg-surface border-t border-border px-4 py-4 flex-row gap-3 shadow-lg"
        style={{ paddingBottom: insets.bottom + 12 }}
      >
        <Pressable
          onPress={() => setIsFavorite(!isFavorite)}
          style={({ pressed }) => [{ opacity: pressed ? 0.8 : 1, flex: 1 }]}
        >
          <View
            className="border border-border rounded-2xl p-3.5 items-center justify-center"
            style={{
              backgroundColor: isFavorite ? colors.error + "10" : colors.surface,
              borderColor: isFavorite ? colors.error : colors.border,
            }}
          >
            <MaterialIcons
              name={isFavorite ? "favorite" : "favorite-border"}
              size={22}
              color={isFavorite ? colors.error : colors.muted}
            />
          </View>
        </Pressable>

        <Pressable style={({ pressed }) => [{ opacity: pressed ? 0.8 : 1, flex: 1 }]}>
          <View className="border border-border rounded-2xl p-3.5 items-center justify-center bg-surface">
            <MaterialIcons name="archive" size={22} color={colors.muted} />
          </View>
        </Pressable>

        <Pressable
          onPress={() => setIsNotified(!isNotified)}
          style={({ pressed }) => [{ opacity: pressed ? 0.8 : 1, flex: 1 }]}
        >
          <View
            className="border border-border rounded-2xl p-3.5 items-center justify-center"
            style={{
              backgroundColor: isNotified ? colors.primary + "10" : colors.surface,
              borderColor: isNotified ? colors.primary : colors.border,
            }}
          >
            <MaterialIcons
              name={isNotified ? "notifications-active" : "notifications-none"}
              size={22}
              color={isNotified ? colors.primary : colors.muted}
            />
          </View>
        </Pressable>

        <Pressable
          style={({ pressed }) => [{ opacity: pressed ? 0.8 : 1, flex: 2.5 }]}
          onPress={() => console.log("تعديل بيانات الطلب")}
        >
          <View className="bg-primary rounded-2xl p-3.5 items-center justify-center flex-row gap-2 shadow-sm">
            <MaterialIcons name="edit" size={20} color="#FFFFFF" />
            <Text className="text-sm font-bold text-white" style={{ fontFamily: "Cairo" }}>تعديل الطلب</Text>
          </View>
        </Pressable>
      </View>
    </View>
  );
}
