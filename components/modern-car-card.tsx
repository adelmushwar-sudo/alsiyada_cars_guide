import React, { useState, useRef } from "react";
import {
  View,
  Text,
  Pressable,
  ScrollView,
  Dimensions,
  Platform,
} from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useColors } from "@/hooks/use-colors";

interface CarImage {
  id: string;
  url?: string;
}

interface ModernCarCardProps {
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
const CARD_WIDTH = width - 32; // مع الحواشي
const IMAGE_HEIGHT = 240;
const THUMBNAIL_SIZE = 70;

export function ModernCarCard({
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
}: ModernCarCardProps) {
  const colors = useColors();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);

  // استخدام صور وهمية إذا لم تكن هناك صور
  const displayImages = images.length > 0 ? images : Array(4).fill(null);

  // الحصول على لون المصدر
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

  // الحصول على لون الحالة
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

  // الحصول على أيقونة الحالة
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

  // الحصول على نص الحالة
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

  // الحصول على نص المصدر
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
          opacity: pressed ? 0.95 : 1,
          transform: pressed ? [{ scale: 0.98 }] : [{ scale: 1 }],
        },
      ]}
    >
      <View
        className="rounded-3xl overflow-hidden mb-4"
        style={{
          backgroundColor: colors.surface,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.1,
          shadowRadius: 12,
          elevation: 8,
          borderLeftWidth: 6,
          borderLeftColor: sourceColor,
        }}
      >
        {/* ===== قسم الصور ===== */}
        <View style={{ position: "relative" }}>
          {/* الصورة الرئيسية مع Slider */}
          <View
            style={{
              height: IMAGE_HEIGHT,
              backgroundColor: colors.background,
              overflow: "hidden",
            }}
          >
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
                    size={100}
                    color={colors.primary}
                  />
                  <Text
                    className="text-xs text-muted mt-2"
                    style={{ fontFamily: "Cairo" }}
                  >
                    الصورة {index + 1}
                  </Text>
                </View>
              ))}
            </ScrollView>

            {/* شارة الحالة في الزاوية العلوية */}
            <View
              className="absolute top-4 right-4 flex-row items-center gap-2 px-3 py-2 rounded-full"
              style={{ backgroundColor: statusColor + "DD" }}
            >
              <MaterialIcons
                name={getStatusIcon(status)}
                size={16}
                color="#FFFFFF"
              />
              <Text
                className="text-xs font-bold text-white"
                style={{ fontFamily: "Cairo" }}
              >
                {getStatusLabel(status)}
              </Text>
            </View>

            {/* عداد الصور */}
            {displayImages.length > 1 && (
              <View
                className="absolute bottom-4 left-4 px-2.5 py-1.5 rounded-full"
                style={{ backgroundColor: colors.primary + "DD" }}
              >
                <Text
                  className="text-xs font-bold text-white"
                  style={{ fontFamily: "Cairo" }}
                >
                  {currentImageIndex + 1} / {displayImages.length}
                </Text>
              </View>
            )}

            {/* أزرار التنقل */}
            {displayImages.length > 1 && (
              <>
                {currentImageIndex > 0 && (
                  <Pressable
                    onPress={() => handleThumbnailPress(currentImageIndex - 1)}
                    style={({ pressed }) => [
                      {
                        position: "absolute",
                        left: 12,
                        top: "50%",
                        marginTop: -20,
                        opacity: pressed ? 0.8 : 1,
                      },
                    ]}
                  >
                    <View
                      className="w-10 h-10 rounded-full items-center justify-center"
                      style={{ backgroundColor: colors.primary + "DD" }}
                    >
                      <MaterialIcons
                        name="chevron-left"
                        size={24}
                        color="#FFFFFF"
                      />
                    </View>
                  </Pressable>
                )}

                {currentImageIndex < displayImages.length - 1 && (
                  <Pressable
                    onPress={() => handleThumbnailPress(currentImageIndex + 1)}
                    style={({ pressed }) => [
                      {
                        position: "absolute",
                        right: 12,
                        top: "50%",
                        marginTop: -20,
                        opacity: pressed ? 0.8 : 1,
                      },
                    ]}
                  >
                    <View
                      className="w-10 h-10 rounded-full items-center justify-center"
                      style={{ backgroundColor: colors.primary + "DD" }}
                    >
                      <MaterialIcons
                        name="chevron-right"
                        size={24}
                        color="#FFFFFF"
                      />
                    </View>
                  </Pressable>
                )}
              </>
            )}
          </View>

          {/* شريط المصغرات */}
          {displayImages.length > 1 && (
            <View
              className="px-4 py-3 border-t"
              style={{
                backgroundColor: colors.background,
                borderTopColor: colors.border,
              }}
            >
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                scrollEventThrottle={16}
              >
                <View className="flex-row gap-2">
                  {displayImages.map((_, index) => (
                    <Pressable
                      key={index}
                      onPress={() => handleThumbnailPress(index)}
                      style={({ pressed }) => [
                        {
                          opacity: pressed ? 0.8 : 1,
                        },
                      ]}
                    >
                      <View
                        className="rounded-xl overflow-hidden border-2"
                        style={{
                          width: THUMBNAIL_SIZE,
                          height: THUMBNAIL_SIZE,
                          borderColor:
                            currentImageIndex === index
                              ? colors.primary
                              : colors.border,
                          backgroundColor: colors.surface,
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <MaterialIcons
                          name="image"
                          size={24}
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

        {/* ===== قسم المعلومات الأساسية ===== */}
        <View className="px-4 pt-4 pb-3">
          {/* العنوان - الماركة والموديل */}
          <View className="mb-3">
            <Text
              className="text-2xl font-bold text-foreground"
              style={{ fontFamily: "Cairo" }}
            >
              {brand} {model}
            </Text>
          </View>

          {/* الصف الأول - السنة والفئة والعداد */}
          <View className="flex-row flex-wrap gap-2 mb-3">
            {/* سنة الصنع */}
            <View
              className="flex-row items-center gap-1.5 px-3 py-2 rounded-full"
              style={{ backgroundColor: colors.primary + "15" }}
            >
              <MaterialIcons name="calendar-today" size={14} color={colors.primary} />
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
                className="flex-row items-center gap-1.5 px-3 py-2 rounded-full"
                style={{ backgroundColor: colors.primary + "15" }}
              >
                <MaterialIcons
                  name="category"
                  size={14}
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
                className="flex-row items-center gap-1.5 px-3 py-2 rounded-full"
                style={{ backgroundColor: colors.warning + "15" }}
              >
                <MaterialIcons
                  name="speed"
                  size={14}
                  color={colors.warning}
                />
                <Text
                  className="text-xs font-semibold text-foreground"
                  style={{ fontFamily: "Cairo" }}
                >
                  {mileage.toLocaleString()} كم
                </Text>
              </View>
            )}
          </View>

          {/* الصف الثاني - المواصفات التقنية */}
          <View className="flex-row flex-wrap gap-2 mb-4">
            {/* نوع الوقود */}
            {fuelType && (
              <View
                className="flex-row items-center gap-1.5 px-3 py-2 rounded-full"
                style={{ backgroundColor: colors.primary + "20" }}
              >
                <MaterialIcons
                  name="local-gas-station"
                  size={14}
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
                className="flex-row items-center gap-1.5 px-3 py-2 rounded-full"
                style={{ backgroundColor: colors.success + "15" }}
              >
                <MaterialIcons
                  name="settings"
                  size={14}
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
                className="flex-row items-center gap-1.5 px-3 py-2 rounded-full"
                style={{ backgroundColor: colors.error + "15" }}
              >
                <MaterialIcons
                  name="directions"
                  size={14}
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
                className="flex-row items-center gap-1.5 px-3 py-2 rounded-full"
                style={{ backgroundColor: colors.warning + "20" }}
              >
                <MaterialIcons
                  name="engineering"
                  size={14}
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

            {/* المواصفات الإقليمية */}
            {regionalSpec && (
              <View
                className="flex-row items-center gap-1.5 px-3 py-2 rounded-full"
                style={{ backgroundColor: colors.primary + "15" }}
              >
                <MaterialIcons
                  name="public"
                  size={14}
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
                className="flex-row items-center gap-1.5 px-3 py-2 rounded-full"
                style={{ backgroundColor: colors.primary + "15" }}
              >
                <MaterialIcons
                  name="verified"
                  size={14}
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
        </View>

        {/* ===== قسم السعر (Banner) ===== */}
        <View
          className="flex-row items-center justify-between px-4 py-4 rounded-t-2xl"
          style={{
            backgroundColor: colors.primary,
          }}
        >
          <View className="flex-row items-center gap-2">
            <MaterialIcons name="attach-money" size={28} color="#FFFFFF" />
            <Text
              className="text-2xl font-bold text-white"
              style={{ fontFamily: "Cairo" }}
            >
              {price.toLocaleString()}
            </Text>
          </View>
          <Text
            className="text-sm font-semibold text-white"
            style={{ fontFamily: "Cairo" }}
          >
            ر.س
          </Text>
        </View>

        {/* ===== قسم المعلومات الإضافية (الحالة والموقع) ===== */}
        <View className="flex-row items-center justify-between px-4 py-3 bg-background border-t border-border">
          {/* الحالة */}
          <View className="flex-row items-center gap-2">
            <View
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: statusColor }}
            />
            <Text
              className="text-xs font-semibold text-muted"
              style={{ fontFamily: "Cairo" }}
            >
              {getStatusLabel(status)}
            </Text>
          </View>

          {/* الموقع */}
          <View className="flex-row items-center gap-2">
            <MaterialIcons name="location-on" size={14} color={sourceColor} />
            <Text
              className="text-xs font-semibold text-muted"
              style={{ fontFamily: "Cairo" }}
            >
              {getLocationLabel(location)}
            </Text>
          </View>
        </View>
      </View>
    </Pressable>
  );
          }
                        
