import { ScrollView, Text, View, Pressable, Platform } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useState } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { ScreenContainer } from "@/components/screen-container";
import { ImageGallery } from "@/components/image-gallery";
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

const InfoItem = ({ label, value }: { label: string; value: string | number }) => {
  const colors = useColors();
  return (
    <View className="flex-row justify-between items-center py-2 border-b border-border last:border-b-0">
      <Text
        className="text-sm text-muted flex-1"
        style={{ fontFamily: "Cairo" }}
      >
        {label}
      </Text>
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
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams();
  const [isFavorite, setIsFavorite] = useState(false);

  const car = mockCar;

  return (
    <View
      className="flex-1 bg-background"
      style={{
        transitionProperty: Platform.OS === "web" ? "background-color" : "none",
        transitionDuration: "300ms",
      }}
    >
      {/* App Bar */}
      <View
        className="bg-background border-b border-border px-3 py-2 flex-row items-center justify-between"
        style={{
          paddingTop: insets.top + 8,
          paddingBottom: 8,
          transitionProperty: Platform.OS === "web" ? "background-color, border-color" : "none",
          transitionDuration: "300ms",
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
          numberOfLines={1}
        >
          {car.brand} {car.model}
        </Text>
        <StatusBadge status={car.status} />
      </View>

      <ScreenContainer className="flex-1 p-0">
        <ScrollView
          className="flex-1"
          contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 12, paddingVertical: 12 }}
        >
          {/* معرض الصور */}
          <ImageGallery images={car.images} />

          {/* السعر البارز */}
          <View
            className="bg-primary rounded-lg p-4 mb-4 flex-row items-center justify-between"
            style={{
              transitionProperty: Platform.OS === "web" ? "background-color" : "none",
              transitionDuration: "300ms",
            }}
          >
            <View>
              <Text
                className="text-xs text-white opacity-80"
                style={{ fontFamily: "Cairo" }}
              >
                سعر البيع المطلوب
              </Text>
              <Text
                className="text-2xl font-bold text-white mt-1"
                style={{ fontFamily: "Cairo" }}
              >
                ${car.salePrice.toLocaleString()}
              </Text>
            </View>
            <MaterialIcons name="attach-money" size={40} color="#FFFFFF" />
          </View>

          {/* البيانات الأساسية */}
          <SectionCard title="البيانات الأساسية" icon="info">
            <InfoItem label="الفئة" value={car.category} />
            <InfoItem label="سنة الصنع" value={car.year.toString()} />
            <InfoItem label="اللون الخارجي" value={car.exteriorColor} />
            <InfoItem label="اللون الداخلي" value={car.interiorColor} />
            <InfoItem label="العداد" value={`${car.mileage.toLocaleString()} كم`} />
            <InfoItem label="المواصفات الإقليمية" value={car.regional} />
          </SectionCard>

          {/* التفاصيل التقنية */}
          <SectionCard title="التفاصيل التقنية" icon="settings">
            <InfoItem label="نوع الوقود" value={car.fuelType} />
            <InfoItem label="ناقل الحركة" value={car.transmission} />
            <InfoItem label="نظام الدفع" value={car.driveType} />
            <InfoItem label="نوع المحرك" value={car.engineType} />
            <InfoItem label="حجم المحرك" value={car.engineSize} />
            <View className="py-3 border-b border-border">
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
          </SectionCard>

          {/* الحالة القانونية */}
          <SectionCard title="الحالة القانونية والجمركية" icon="verified">
            <InfoItem label="حالة الجمارك" value={car.customsStatus} />
            <InfoItem label="رقم اللوحة" value={car.plateNumber} />
            <InfoItem label="رقم الشاصيه (VIN)" value={car.vin} />
          </SectionCard>

          {/* الموقع والمصدر */}
          <SectionCard title="الموقع والمصدر" icon="location-on">
            <InfoItem label="التصنيف" value={car.classification} />
            <InfoItem label="اسم المالك" value={car.ownerName} />
            <InfoItem label="رقم الهاتف" value={car.ownerPhone} />
            <InfoItem label="العنوان" value={car.ownerAddress} />
          </SectionCard>

          {/* التسعير */}
          <SectionCard title="التسعير" icon="attach-money">
            <InfoItem label="سعر الشراء" value={`$${car.purchasePrice.toLocaleString()}`} />
            <InfoItem label="سعر البيع المطلوب" value={`$${car.salePrice.toLocaleString()}`} />
            <InfoItem label="الحد الأدنى للبيع" value={`$${car.minPrice.toLocaleString()}`} />
          </SectionCard>

          {/* الوسائط */}
          <SectionCard title="الوسائط والملفات" icon="image">
            <View className="flex-row gap-2 flex-wrap">
              {[1, 2, 3, 4].map((i) => (
                <Pressable key={i} style={({ pressed }) => [{ opacity: pressed ? 0.8 : 1 }]}>
                  <View
                    className="w-20 h-20 rounded-lg items-center justify-center border-2 border-dashed border-border"
                    style={{
                      backgroundColor: colors.primary + "10",
                    }}
                  >
                    <MaterialIcons name="image" size={24} color={colors.primary} />
                  </View>
                </Pressable>
              ))}
            </View>
          </SectionCard>

          {/* مسافة للأسفل */}
          <View style={{ height: 100 }} />
        </ScrollView>
      </ScreenContainer>

      {/* شريط الإجراءات السفلي */}
      <View
        className="bg-surface border-t border-border px-3 py-3 flex-row gap-2"
        style={{
          paddingBottom: insets.bottom + 8,
          transitionProperty: Platform.OS === "web" ? "background-color, border-color" : "none",
          transitionDuration: "300ms",
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
        <Pressable style={({ pressed }) => [{ opacity: pressed ? 0.8 : 1, flex: 1 }]}>
          <View className="border border-border rounded-lg p-3 items-center justify-center bg-surface">
            <MaterialIcons name="notifications" size={20} color={colors.muted} />
          </View>
        </Pressable>

        {/* زر التعديل الرئيسي */}
        <Pressable
          style={({ pressed }) => [{ opacity: pressed ? 0.8 : 1, flex: 2 }]}
          onPress={() => console.log("تعديل البيانات")}
        >
          <View
            className="bg-primary rounded-lg p-3 items-center justify-center flex-row gap-2"
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
              تعديل
            </Text>
          </View>
        </Pressable>
      </View>
    </View>
  );
}
