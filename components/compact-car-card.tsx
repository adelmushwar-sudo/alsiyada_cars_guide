import React, { useState, useRef } from "react";
import {
  View,
  Text,
  Pressable,
  ScrollView,
  Dimensions,
} from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useColors } from "@/hooks/use-colors";

interface CarImage {
  id: string;
  url?: string;
}

interface CompactCarCardProps {
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
  images?: CarImage[];
  onPress?: () => void;
}

const { width } = Dimensions.get("window");
const CARD_WIDTH = width - 32;
const IMAGE_HEIGHT = 200;
const THUMBNAIL_SIZE = 50;

export function CompactCarCard({
  id,
  brand,
  model,
  year,
  price,
  status,
  location,
  category,
  mileage,
  fuelType,
  transmission,
  driveType,
  engineSize,
  customsStatus,
  regionalSpec,
  images = [],
  onPress,
}: CompactCarCardProps) {
  const colors = useColors();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);

  const displayImages = images.length > 0 ? images : Array(4).fill(null);

  const getSourceColor = (loc: string) => {
    switch (loc) {
      case "showroom":
        return colors.success;
      case "supplier":
        return colors.primary;
      case "external":
        return colors.warning;
      default:
        return colors.muted;
    }
  };

  const getStatusColor = (stat: string) => {
    switch (stat) {
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

  const getStatusIcon = (stat: string) => {
    switch (stat) {
      case "available":
        return "check-circle";
      case "sold":
        return "cancel";
      case "reserved":
        return "schedule";
      default:
        return "info";
    }
  };

  const getStatusLabel = (stat: string) => {
    switch (stat) {
      case "available":
        return "متاح";
      case "sold":
        return "مباع";
      case "reserved":
        return "محجوز";
      default:
        return stat;
    }
  };

  const getLocationLabel = (loc: string) => {
    switch (loc) {
      case "showroom":
        return "المعرض";
      case "supplier":
        return "مورد";
      case "external":
        return "خارجي";
      default:
        return loc;
    }
  };

  const handleThumbnailPress = (index: number) => {
    setCurrentImageIndex(index);
    scrollViewRef.current?.scrollTo({
      x: index * width,
      animated: true,
    });
  };

  const handleScroll = (event: any) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const currentIndex = Math.round(contentOffsetX / width);
    setCurrentImageIndex(currentIndex);
  };

  const sourceColor = getSourceColor(location);
  const statusColor = getStatusColor(status);

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        {
          opacity: pressed ? 0.8 : 1,
          marginBottom: 12,
        },
      ]}
    >
      <View
        className="rounded-2xl overflow-hidden"
        style={{
          backgroundColor: colors.surface,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.08,
          shadowRadius: 8,
          elevation: 4,
          borderLeftWidth: 3,
          borderLeftColor: sourceColor,
        }}
      >
        {/* ===== قسم الصور المدمج ===== */}
        <View style={{ position: "relative", height: IMAGE_HEIGHT }}>
          {/* الصورة الرئيسية */}
          <ScrollView
            ref={scrollViewRef}
            horizontal
            pagingEnabled
            scrollEventThrottle={16}
            onScroll={handleScroll}
            showsHorizontalScrollIndicator={false}
            scrollEnabled={displayImages.length > 1}
            style={{ width }}
          >
            {displayImages.map((_, index) => (
              <View
                key={index}
                style={{
                  width,
                  height: IMAGE_HEIGHT,
                  justifyContent: "center",
                  alignItems: "center",
                  backgroundColor: colors.background,
                }}
              >
                <MaterialIcons
                  name="directions-car"
                  size={80}
                  color={colors.primary}
                />
              </View>
            ))}
          </ScrollView>

          {/* شارة الحالة في الزاوية العلوية اليمنى */}
          <View
            className="absolute top-3 right-3 flex-row items-center gap-1.5 px-2.5 py-1.5 rounded-lg"
            style={{ backgroundColor: statusColor + "E6" }}
          >
            <MaterialIcons
              name={getStatusIcon(status)}
              size={14}
              color="#FFFFFF"
            />
            <Text
              className="text-xs font-bold text-white"
              style={{ fontFamily: "Cairo" }}
            >
              {getStatusLabel(status)}
            </Text>
          </View>

          {/* شريط المصغرات في الأسفل (Overlay) */}
          {displayImages.length > 1 && (
            <View
              className="absolute bottom-0 left-0 right-0 px-2 py-2"
              style={{
                backgroundColor: "rgba(0, 0, 0, 0.3)",
                backdropFilter: "blur(4px)",
              }}
            >
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                scrollEventThrottle={16}
              >
                <View className="flex-row gap-1.5">
                  {displayImages.map((_, index) => (
                    <Pressable
                      key={index}
                      onPress={() => handleThumbnailPress(index)}
                      style={({ pressed }) => [
                        {
                          opacity: pressed ? 0.7 : 1,
                        },
                      ]}
                    >
                      <View
                        className="rounded-lg overflow-hidden border-2"
                        style={{
                          width: THUMBNAIL_SIZE,
                          height: THUMBNAIL_SIZE,
                          borderColor:
                            currentImageIndex === index
                              ? "#FFFFFF"
                              : "rgba(255, 255, 255, 0.5)",
                          backgroundColor: colors.surface,
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <MaterialIcons
                          name="image"
                          size={18}
                          color={colors.muted}
                        />
                      </View>
                    </Pressable>
                  ))}
                </View>
              </ScrollView>
            </View>
          )}
        </View>

        {/* ===== قسم المعلومات المدمج ===== */}
        <View className="px-3 py-3">
          {/* الصف الأول - العنوان والبيانات الأساسية */}
          <View className="mb-2">
            <Text
              className="text-lg font-bold text-foreground mb-2"
              style={{ fontFamily: "Cairo" }}
            >
              {brand} {model}
            </Text>

            {/* الفئة والسنة والعداد في صف واحد */}
            <View className="flex-row flex-wrap gap-1.5">
              {/* سنة الصنع */}
              <View
                className="flex-row items-center gap-1 px-2.5 py-1.5 rounded-lg"
                style={{ backgroundColor: colors.primary + "12" }}
              >
                <MaterialIcons
                  name="calendar-today"
                  size={12}
                  color={colors.primary}
                />
                <Text
                  className="text-xs font-semibold text-foreground"
                  style={{ fontFamily: "Cairo" }}
                >
                  {year}
                </Text>
              </View>

              {/* الفئة */}
              {category && (
                <View
                  className="flex-row items-center gap-1 px-2.5 py-1.5 rounded-lg"
                  style={{ backgroundColor: colors.primary + "12" }}
                >
                  <MaterialIcons
                    name="category"
                    size={12}
                    color={colors.primary}
                  />
                  <Text
                    className="text-xs font-semibold text-foreground"
                    style={{ fontFamily: "Cairo" }}
                  >
                    {category}
                  </Text>
                </View>
              )}

              {/* العداد */}
              {mileage !== undefined && (
                <View
                  className="flex-row items-center gap-1 px-2.5 py-1.5 rounded-lg"
                  style={{ backgroundColor: colors.warning + "12" }}
                >
                  <MaterialIcons
                    name="speed"
                    size={12}
                    color={colors.warning}
                  />
                  <Text
                    className="text-xs font-semibold text-foreground"
                    style={{ fontFamily: "Cairo" }}
                  >
                    {(mileage / 1000).toFixed(0)}k
                  </Text>
                </View>
              )}
            </View>
          </View>

          {/* الصف الثاني - المواصفات التقنية */}
          <View className="flex-row flex-wrap gap-1.5 mb-2">
            {/* نوع الوقود */}
            {fuelType && (
              <View
                className="flex-row items-center gap-1 px-2.5 py-1.5 rounded-lg"
                style={{ backgroundColor: colors.primary + "12" }}
              >
                <MaterialIcons
                  name="local-gas-station"
                  size={12}
                  color={colors.primary}
                />
                <Text
                  className="text-xs font-semibold text-foreground"
                  style={{ fontFamily: "Cairo" }}
                >
                  {fuelType}
                </Text>
              </View>
            )}

            {/* ناقل الحركة */}
            {transmission && (
              <View
                className="flex-row items-center gap-1 px-2.5 py-1.5 rounded-lg"
                style={{ backgroundColor: colors.success + "12" }}
              >
                <MaterialIcons
                  name="settings"
                  size={12}
                  color={colors.success}
                />
                <Text
                  className="text-xs font-semibold text-foreground"
                  style={{ fontFamily: "Cairo" }}
                >
                  {transmission}
                </Text>
              </View>
            )}

            {/* نظام الدفع */}
            {driveType && (
              <View
                className="flex-row items-center gap-1 px-2.5 py-1.5 rounded-lg"
                style={{ backgroundColor: colors.error + "12" }}
              >
                <MaterialIcons
                  name="directions"
                  size={12}
                  color={colors.error}
                />
                <Text
                  className="text-xs font-semibold text-foreground"
                  style={{ fontFamily: "Cairo" }}
                >
                  {driveType}
                </Text>
              </View>
            )}

            {/* حجم المحرك */}
            {engineSize && (
              <View
                className="flex-row items-center gap-1 px-2.5 py-1.5 rounded-lg"
                style={{ backgroundColor: colors.warning + "12" }}
              >
                <MaterialIcons
                  name="engineering"
                  size={12}
                  color={colors.warning}
                />
                <Text
                  className="text-xs font-semibold text-foreground"
                  style={{ fontFamily: "Cairo" }}
                >
                  {engineSize}
                </Text>
              </View>
            )}
          </View>

          {/* الصف الثالث - المواصفات الإضافية */}
          <View className="flex-row flex-wrap gap-1.5 mb-3">
            {/* المواصفات الإقليمية */}
            {regionalSpec && (
              <View
                className="flex-row items-center gap-1 px-2.5 py-1.5 rounded-lg"
                style={{ backgroundColor: colors.primary + "12" }}
              >
                <MaterialIcons
                  name="public"
                  size={12}
                  color={colors.primary}
                />
                <Text
                  className="text-xs font-semibold text-foreground"
                  style={{ fontFamily: "Cairo" }}
                >
                  {regionalSpec}
                </Text>
              </View>
            )}

            {/* حالة الجمارك */}
            {customsStatus && (
              <View
                className="flex-row items-center gap-1 px-2.5 py-1.5 rounded-lg"
                style={{ backgroundColor: colors.primary + "12" }}
              >
                <MaterialIcons
                  name="verified"
                  size={12}
                  color={colors.primary}
                />
                <Text
                  className="text-xs font-semibold text-foreground"
                  style={{ fontFamily: "Cairo" }}
                >
                  {customsStatus}
                </Text>
              </View>
            )}
          </View>

          {/* قسم السعر والموقع */}
          <View
            className="flex-row items-center justify-between px-3 py-2.5 rounded-lg"
            style={{
              backgroundColor: colors.primary,
            }}
          >
            <View className="flex-row items-center gap-1.5">
              <MaterialIcons name="attach-money" size={18} color="#FFFFFF" />
              <Text
                className="text-lg font-bold text-white"
                style={{ fontFamily: "Cairo" }}
              >
                {(price / 1000).toFixed(0)}k
              </Text>
            </View>
            <View className="flex-row items-center gap-1.5">
              <MaterialIcons
                name="location-on"
                size={14}
                color="#FFFFFF"
              />
              <Text
                className="text-xs font-semibold text-white"
                style={{ fontFamily: "Cairo" }}
              >
                {getLocationLabel(location)}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </Pressable>
  );
          }
                        
