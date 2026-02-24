import { ScrollView, Text, View, Pressable, Platform, FlatList } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useState } from "react";

import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";

interface CarDetails {
  id: string;
  brand: string;
  model: string;
  category: string;
  year: number;
  exteriorColor: string;
  interiorColor: string;
  mileage: number;
  regional: string;
  fuelType: string;
  transmission: string;
  driveType: string;
  engineType: string;
  engineSize: string;
  features: string[];
  customsStatus: string;
  plateNumber: string;
  vin: string;
  ownerName: string;
  ownerPhone: string;
  ownerAddress: string;
  classification: string;
  purchasePrice: number;
  salePrice: number;
  minPrice: number;
  status: "available" | "reserved" | "sold" | "shipping";
  images: string[];
}

// بيانات تجريبية
const mockCar: CarDetails = {
  id: "1",
  brand: "تويوتا",
  model: "لاند كروزر",
  category: "GX.R",
  year: 2022,
  exteriorColor: "أسود",
  interiorColor: "أسود",
  mileage: 15000,
  regional: "خليجي",
  fuelType: "بنزين",
  transmission: "أوتوماتيك",
  driveType: "4WD",
  engineType: "V8",
  engineSize: "5.7L",
  features: ["فتحة سقف", "شاشة تاتش", "كاميرات 360", "كراسي جلد", "بصمة"],
  customsStatus: "مجمرك مرتين",
  plateNumber: "صنعاء - 1234",
  vin: "JT2BF18K0M0000001",
  ownerName: "محمد علي",
  ownerPhone: "+967771234567",
  ownerAddress: "صنعاء - الشيخ عثمان",
  classification: "مخزون المعرض",
  purchasePrice: 45000,
  salePrice: 55000,
  minPrice: 52000,
  status: "available",
  images: [],
};

const StatusBadge = ({ status }: { status: string }) => {
  const colors = useColors();
  const statusConfig: Record<string, { label: string; bgColor: string; textColor: string }> = {
    available: { label: "متاحة", bgColor: colors.success, textColor: "#FFFFFF" },
    reserved: { label: "محجوزة", bgColor: colors.warning, textColor: "#FFFFFF" },
    sold: { label: "مباعة", bgColor: colors.error, textColor: "#FFFFFF" },
    shipping: { label: "قيد الشحن", bgColor: colors.primary, textColor: "#FFFFFF" },
  };

  const config = statusConfig[status] || statusConfig.available;

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

const SectionHeader = ({ title }: { title: string }) => {
  const colors = useColors();
  return (
    <View className="flex-row items-center gap-2 px-3 py-3 border-b border-border">
      <View
        className="w-1 h-6 rounded-full"
        style={{ backgroundColor: colors.primary }}
      />
      <Text
        className="text-base font-bold text-foreground flex-1"
        style={{ fontFamily: "Cairo" }}
      >
        {title}
      </Text>
    </View>
  );
};

const InfoRow = ({
  label,
  value,
  icon,
}: {
  label: string;
  value: string | number;
  icon?: string;
}) => {
  const colors = useColors();
  return (
    <View className="flex-row items-center justify-between px-3 py-2.5 border-b border-border">
      <View className="flex-row items-center gap-2 flex-1">
        {icon && <MaterialIcons name={icon as any} size={18} color={colors.primary} />}
        <Text
          className="text-sm text-muted flex-1"
          style={{ fontFamily: "Cairo" }}
          numberOfLines={1}
        >
          {label}
        </Text>
      </View>
      <Text
        className="text-sm font-semibold text-foreground text-right ml-2"
        style={{ fontFamily: "Cairo" }}
        numberOfLines={1}
      >
        {value}
      </Text>
    </View>
  );
};

export default function CarDetailsScreen() {
  const colors = useColors();
  const router = useRouter();
  const params = useLocalSearchParams();
  const [activeTab, setActiveTab] = useState<"basic" | "technical" | "legal" | "pricing" | "media">(
    "basic"
  );

  const car = mockCar;

  const renderBasicInfo = () => (
    <View className="bg-surface rounded-lg border border-border overflow-hidden mb-4">
      <SectionHeader title="البيانات الأساسية" />
      <InfoRow label="الماركة والموديل" value={`${car.brand} ${car.model}`} icon="directions-car" />
      <InfoRow label="الفئة" value={car.category} />
      <InfoRow label="سنة الصنع" value={car.year.toString()} icon="calendar-today" />
      <InfoRow label="اللون الخارجي" value={car.exteriorColor} />
      <InfoRow label="اللون الداخلي" value={car.interiorColor} />
      <InfoRow label="العداد" value={`${car.mileage.toLocaleString()} كم`} icon="speed" />
      <View className="px-3 py-2.5">
        <InfoRow label="المواصفات الإقليمية" value={car.regional} />
      </View>
    </View>
  );

  const renderTechnicalSpecs = () => (
    <View className="bg-surface rounded-lg border border-border overflow-hidden mb-4">
      <SectionHeader title="التفاصيل التقنية" />
      <InfoRow label="نوع الوقود" value={car.fuelType} icon="local-gas-station" />
      <InfoRow label="ناقل الحركة" value={car.transmission} />
      <InfoRow label="نظام الدفع" value={car.driveType} />
      <InfoRow label="نوع المحرك" value={car.engineType} />
      <InfoRow label="حجم المحرك" value={car.engineSize} icon="settings" />
      <View className="px-3 py-3 border-b border-border">
        <Text className="text-sm text-muted mb-2" style={{ fontFamily: "Cairo" }}>
          المواصفات الإضافية:
        </Text>
        <View className="flex-row flex-wrap gap-2">
          {car.features.map((feature, index) => (
            <View
              key={index}
              className="px-2.5 py-1.5 rounded-full"
              style={{ backgroundColor: colors.primary + "20" }}
            >
              <Text
                className="text-xs font-semibold text-primary"
                style={{ fontFamily: "Cairo" }}
              >
                {feature}
              </Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );

  const renderLegalStatus = () => (
    <View className="bg-surface rounded-lg border border-border overflow-hidden mb-4">
      <SectionHeader title="الحالة القانونية والجمركية" />
      <InfoRow label="حالة الجمارك" value={car.customsStatus} icon="verified" />
      <InfoRow label="رقم اللوحة" value={car.plateNumber} icon="directions" />
      <View className="px-3 py-2.5">
        <InfoRow label="رقم الشاصيه (VIN)" value={car.vin} />
      </View>
    </View>
  );

  const renderLocationAndSource = () => (
    <View className="bg-surface rounded-lg border border-border overflow-hidden mb-4">
      <SectionHeader title="الموقع والمصدر" />
      <InfoRow label="التصنيف" value={car.classification} icon="location-on" />
      <InfoRow label="اسم المالك" value={car.ownerName} icon="person" />
      <InfoRow label="رقم الهاتف" value={car.ownerPhone} icon="phone" />
      <View className="px-3 py-2.5">
        <InfoRow label="العنوان" value={car.ownerAddress} />
      </View>
    </View>
  );

  const renderPricing = () => (
    <View className="bg-surface rounded-lg border border-border overflow-hidden mb-4">
      <SectionHeader title="التسعير" />
      <InfoRow
        label="سعر الشراء"
        value={`$${car.purchasePrice.toLocaleString()}`}
        icon="attach-money"
      />
      <InfoRow
        label="سعر البيع المطلوب"
        value={`$${car.salePrice.toLocaleString()}`}
        icon="sell"
      />
      <View className="px-3 py-2.5">
        <InfoRow
          label="الحد الأدنى للبيع"
          value={`$${car.minPrice.toLocaleString()}`}
          icon="trending-down"
        />
      </View>
    </View>
  );

  const renderMedia = () => (
    <View className="bg-surface rounded-lg border border-border overflow-hidden mb-4">
      <SectionHeader title="الوسائط والملفات" />
      <View className="px-3 py-4">
        <View className="flex-row gap-2 flex-wrap">
          {[1, 2, 3, 4].map((i) => (
            <Pressable
              key={i}
              style={({ pressed }) => [{ opacity: pressed ? 0.8 : 1 }]}
            >
              <View
                className="w-20 h-20 rounded-lg items-center justify-center border-2 border-dashed border-border"
                style={{
                  backgroundColor: colors.primary + "10",
                  transitionProperty: Platform.OS === "web" ? "background-color" : "none",
                  transitionDuration: "300ms",
                }}
              >
                <MaterialIcons name="image" size={24} color={colors.primary} />
              </View>
            </Pressable>
          ))}
        </View>
      </View>
    </View>
  );

  return (
    <View
      className="flex-1 bg-background"
      style={{
        transitionProperty: Platform.OS === "web" ? "background-color" : "none",
        transitionDuration: "300ms",
      }}
    >
      {/* رأس الصفحة */}
      <View
        className="bg-background border-b border-border px-3 py-2 flex-row items-center gap-2 h-12"
        style={{
          transitionProperty: Platform.OS === "web" ? "background-color, border-color" : "none",
          transitionDuration: "300ms",
        }}
      >
        <Pressable
          onPress={() => router.back()}
          style={({ pressed }) => [{ opacity: pressed ? 0.6 : 1 }]}
        >
          <MaterialIcons name="arrow-back" size={22} color={colors.primary} />
        </Pressable>
        <Text
          className="text-base font-bold text-foreground flex-1"
          style={{ fontFamily: "Cairo" }}
          numberOfLines={1}
        >
          {car.brand} {car.model}
        </Text>
        <StatusBadge status={car.status} />
      </View>

      <ScreenContainer className="flex-1 p-0">
        <ScrollView className="flex-1" contentContainerStyle={{ flexGrow: 1 }}>
          {/* صورة السيارة */}
          <View
            className="w-full h-40 bg-surface border-b border-border items-center justify-center"
            style={{
              transitionProperty: Platform.OS === "web" ? "background-color" : "none",
              transitionDuration: "300ms",
            }}
          >
            <MaterialIcons name="directions-car" size={60} color={colors.primary} />
          </View>

          {/* التبويبات */}
          <View className="flex-row bg-surface border-b border-border overflow-x-auto">
            {[
              { id: "basic", label: "أساسي" },
              { id: "technical", label: "تقني" },
              { id: "legal", label: "قانوني" },
              { id: "pricing", label: "تسعير" },
              { id: "media", label: "وسائط" },
            ].map((tab) => (
              <Pressable
                key={tab.id}
                onPress={() => setActiveTab(tab.id as any)}
                style={({ pressed }) => [{ opacity: pressed ? 0.8 : 1 }]}
              >
                <View
                  className="px-3 py-3 border-b-2"
                  style={{
                    borderBottomColor:
                      activeTab === tab.id ? colors.primary : "transparent",
                    transitionProperty: Platform.OS === "web" ? "border-color" : "none",
                    transitionDuration: "300ms",
                  }}
                >
                  <Text
                    className="text-xs font-semibold"
                    style={{
                      color: activeTab === tab.id ? colors.primary : colors.muted,
                      fontFamily: "Cairo",
                      transitionProperty: Platform.OS === "web" ? "color" : "none",
                      transitionDuration: "300ms",
                    }}
                  >
                    {tab.label}
                  </Text>
                </View>
              </Pressable>
            ))}
          </View>

          {/* محتوى التبويبات */}
          <View className="px-3 py-4">
            {activeTab === "basic" && renderBasicInfo()}
            {activeTab === "technical" && renderTechnicalSpecs()}
            {activeTab === "legal" && renderLegalStatus()}
            {activeTab === "pricing" && renderPricing()}
            {activeTab === "media" && renderMedia()}

            {/* زر الإجراء */}
            <Pressable
              style={({ pressed }) => [{ opacity: pressed ? 0.8 : 1 }]}
              onPress={() => console.log("Action pressed")}
            >
              <View
                className="bg-primary rounded-lg p-3 items-center flex-row justify-center gap-2"
                style={{
                  transitionProperty: Platform.OS === "web" ? "background-color" : "none",
                  transitionDuration: "300ms",
                }}
              >
                <MaterialIcons name="edit" size={20} color="#FFFFFF" />
                <Text
                  className="text-sm font-bold text-white"
                  style={{ fontFamily: "Cairo" }}
                >
                  تعديل البيانات
                </Text>
              </View>
            </Pressable>
          </View>
        </ScrollView>
      </ScreenContainer>
    </View>
  );
}
