import { View, Text, Pressable, ScrollView, Dimensions, Platform } from "react-native";
import { useState, useRef } from "react";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useColors } from "@/hooks/use-colors";

interface ImageGalleryProps {
  images?: string[];
  onImageSelect?: (index: number) => void;
}

const { width } = Dimensions.get("window");
const IMAGE_HEIGHT = 280;

export function ImageGallery({ images = [], onImageSelect }: ImageGalleryProps) {
  const colors = useColors();
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);

  // إذا لم تكن هناك صور، استخدم صور وهمية
  const displayImages = images.length > 0 ? images : Array(4).fill(null);

  const handleThumbnailPress = (index: number) => {
    setCurrentIndex(index);
    onImageSelect?.(index);
    scrollViewRef.current?.scrollTo({
      x: index * width,
      animated: true,
    });
  };

  const handleScroll = (event: any) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const currentIndexValue = Math.round(contentOffsetX / width);
    setCurrentIndex(currentIndexValue);
  };

  return (
    <View className="bg-surface rounded-lg overflow-hidden border border-border mb-4">
      {/* الصورة الرئيسية مع Slider */}
      <View
        style={{
          position: "relative",
          height: IMAGE_HEIGHT,
          backgroundColor: colors.background,
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
                size={80}
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

        {/* عداد الصور */}
        <View
          className="absolute top-3 right-3 px-2.5 py-1.5 rounded-full"
          style={{ backgroundColor: colors.primary + "DD" }}
        >
          <Text
            className="text-xs font-bold text-white"
            style={{ fontFamily: "Cairo" }}
          >
            {currentIndex + 1} / {displayImages.length}
          </Text>
        </View>

        {/* أزرار التنقل (إذا كان هناك أكثر من صورة واحدة) */}
        {displayImages.length > 1 && (
          <>
            {currentIndex > 0 && (
              <Pressable
                onPress={() => handleThumbnailPress(currentIndex - 1)}
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
                  <MaterialIcons name="chevron-left" size={24} color="#FFFFFF" />
                </View>
              </Pressable>
            )}

            {currentIndex < displayImages.length - 1 && (
              <Pressable
                onPress={() => handleThumbnailPress(currentIndex + 1)}
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
                  <MaterialIcons name="chevron-right" size={24} color="#FFFFFF" />
                </View>
              </Pressable>
            )}
          </>
        )}
      </View>

      {/* شريط المصغرات */}
      {displayImages.length > 1 && (
        <View className="px-3 py-3 bg-background border-t border-border">
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
                    className="rounded-lg overflow-hidden border-2"
                    style={{
                      width: 60,
                      height: 60,
                      borderColor:
                        currentIndex === index ? colors.primary : colors.border,
                      backgroundColor: colors.surface,
                      justifyContent: "center",
                      alignItems: "center",
                      transitionProperty:
                        Platform.OS === "web" ? "border-color" : "none",
                      transitionDuration: "300ms",
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
  );
}
