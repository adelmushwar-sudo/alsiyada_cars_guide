import { ScrollView, Text, View, Pressable, Image } from "react-native";
import { useRouter } from "expo-router";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useState } from "react";

import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { useColorScheme } from "@/hooks/use-color-scheme";

type ThemeMode = "light" | "dark" | "system";

export default function SettingsScreen() {
  const colors = useColors();
  const router = useRouter();
  const colorScheme = useColorScheme();
  const [themeMode, setThemeMode] = useState<ThemeMode>("system");

  const handleLogout = () => {
    // TODO: تنفيذ تسجيل الخروج
    console.log("تسجيل الخروج");
    router.back();
  };

  const renderThemeOption = (mode: ThemeMode, label: string) => (
    <Pressable
      onPress={() => setThemeMode(mode)}
      style={({ pressed }) => [{ opacity: pressed ? 0.8 : 1 }]}
    >
      <View
        className="flex-row items-center justify-between px-4 py-3 border-b border-border"
        style={{
          backgroundColor:
            themeMode === mode ? colors.primary + "10" : "transparent",
        }}
      >
        <Text
          className="text-base font-semibold text-foreground"
          style={{ fontFamily: "Cairo" }}
        >
          {label}
        </Text>
        {themeMode === mode && (
          <MaterialIcons name="check-circle" size={24} color={colors.primary} />
        )}
      </View>
    </Pressable>
  );

  return (
    <View className="flex-1 bg-background">
      {/* رأس الصفحة مع زر الرجوع */}
      <View className="bg-background border-b border-border px-4 py-4 flex-row items-center gap-3">
        <Pressable
          onPress={() => router.back()}
          style={({ pressed }) => [{ opacity: pressed ? 0.6 : 1 }]}
        >
          <MaterialIcons name="arrow-back" size={28} color={colors.primary} />
        </Pressable>
        <Text
          className="text-2xl font-bold text-foreground flex-1"
          style={{ fontFamily: "Cairo" }}
        >
          الإعدادات
        </Text>
      </View>

      <ScreenContainer className="flex-1 p-0">
        <ScrollView className="flex-1" contentContainerStyle={{ flexGrow: 1 }}>
          {/* بطاقة بيانات المستخدم */}
          <View className="px-4 py-6">
            <Pressable style={({ pressed }) => [{ opacity: pressed ? 0.8 : 1 }]}>
              <View className="bg-surface rounded-lg p-4 flex-row items-center gap-4 border border-border">
                {/* صورة المستخدم */}
                <View
                  className="w-16 h-16 rounded-full items-center justify-center"
                  style={{ backgroundColor: colors.primary }}
                >
                  <MaterialIcons name="person" size={32} color="#FFFFFF" />
                </View>

                {/* بيانات المستخدم */}
                <View className="flex-1">
                  <Text
                    className="text-lg font-bold text-foreground"
                    style={{ fontFamily: "Cairo" }}
                  >
                    أحمد محمد
                  </Text>
                  <Text className="text-sm text-muted mt-1">
                    موظف مبيعات
                  </Text>
                  <Text className="text-xs text-muted mt-1">
                    ahmed.mohammad@alsiyada.com
                  </Text>
                </View>

                {/* أيقونة التعديل */}
                <MaterialIcons name="edit" size={24} color={colors.primary} />
              </View>
            </Pressable>
          </View>

          {/* بطاقة إعدادات الحساب */}
          <View className="px-4 py-4">
            <Text
              className="text-lg font-bold text-foreground mb-3"
              style={{ fontFamily: "Cairo" }}
            >
              إعدادات الحساب
            </Text>
            <View className="bg-surface rounded-lg border border-border overflow-hidden">
              <Pressable
                style={({ pressed }) => [{ opacity: pressed ? 0.8 : 1 }]}
              >
                <View className="flex-row items-center justify-between px-4 py-4 border-b border-border">
                  <View className="flex-row items-center gap-3 flex-1">
                    <View
                      className="w-10 h-10 rounded-lg items-center justify-center"
                      style={{ backgroundColor: colors.primary + "20" }}
                    >
                      <MaterialIcons
                        name="lock"
                        size={20}
                        color={colors.primary}
                      />
                    </View>
                    <View>
                      <Text
                        className="text-base font-semibold text-foreground"
                        style={{ fontFamily: "Cairo" }}
                      >
                        تغيير كلمة المرور
                      </Text>
                      <Text className="text-xs text-muted mt-1">
                        تحديث كلمة المرور الخاصة بك
                      </Text>
                    </View>
                  </View>
                  <MaterialIcons
                    name="chevron-right"
                    size={24}
                    color={colors.muted}
                  />
                </View>
              </Pressable>

              <Pressable
                style={({ pressed }) => [{ opacity: pressed ? 0.8 : 1 }]}
              >
                <View className="flex-row items-center justify-between px-4 py-4">
                  <View className="flex-row items-center gap-3 flex-1">
                    <View
                      className="w-10 h-10 rounded-lg items-center justify-center"
                      style={{ backgroundColor: colors.primary + "20" }}
                    >
                      <MaterialIcons
                        name="notifications"
                        size={20}
                        color={colors.primary}
                      />
                    </View>
                    <View>
                      <Text
                        className="text-base font-semibold text-foreground"
                        style={{ fontFamily: "Cairo" }}
                      >
                        الإشعارات
                      </Text>
                      <Text className="text-xs text-muted mt-1">
                        إدارة إعدادات الإشعارات
                      </Text>
                    </View>
                  </View>
                  <MaterialIcons
                    name="chevron-right"
                    size={24}
                    color={colors.muted}
                  />
                </View>
              </Pressable>
            </View>
          </View>

          {/* بطاقة التحكم بالمظهر */}
          <View className="px-4 py-4">
            <Text
              className="text-lg font-bold text-foreground mb-3"
              style={{ fontFamily: "Cairo" }}
            >
              المظهر
            </Text>
            <View className="bg-surface rounded-lg border border-border overflow-hidden">
              {renderThemeOption("light", "فاتح")}
              {renderThemeOption("dark", "داكن")}
              {renderThemeOption("system", "اتباع النظام")}
            </View>
          </View>

          {/* بطاقة الأرشيف */}
          <View className="px-4 py-4">
            <Text
              className="text-lg font-bold text-foreground mb-3"
              style={{ fontFamily: "Cairo" }}
            >
              البيانات والخصوصية
            </Text>
            <View className="bg-surface rounded-lg border border-border overflow-hidden">
              <Pressable
                style={({ pressed }) => [{ opacity: pressed ? 0.8 : 1 }]}
              >
                <View className="flex-row items-center justify-between px-4 py-4 border-b border-border">
                  <View className="flex-row items-center gap-3 flex-1">
                    <View
                      className="w-10 h-10 rounded-lg items-center justify-center"
                      style={{ backgroundColor: colors.warning + "20" }}
                    >
                      <MaterialIcons
                        name="archive"
                        size={20}
                        color={colors.warning}
                      />
                    </View>
                    <View>
                      <Text
                        className="text-base font-semibold text-foreground"
                        style={{ fontFamily: "Cairo" }}
                      >
                        الأرشيف
                      </Text>
                      <Text className="text-xs text-muted mt-1">
                        عرض البيانات المؤرشفة
                      </Text>
                    </View>
                  </View>
                  <MaterialIcons
                    name="chevron-right"
                    size={24}
                    color={colors.muted}
                  />
                </View>
              </Pressable>

              <Pressable
                style={({ pressed }) => [{ opacity: pressed ? 0.8 : 1 }]}
              >
                <View className="flex-row items-center justify-between px-4 py-4">
                  <View className="flex-row items-center gap-3 flex-1">
                    <View
                      className="w-10 h-10 rounded-lg items-center justify-center"
                      style={{ backgroundColor: colors.primary + "20" }}
                    >
                      <MaterialIcons
                        name="privacy-tip"
                        size={20}
                        color={colors.primary}
                      />
                    </View>
                    <View>
                      <Text
                        className="text-base font-semibold text-foreground"
                        style={{ fontFamily: "Cairo" }}
                      >
                        سياسة الخصوصية
                      </Text>
                      <Text className="text-xs text-muted mt-1">
                        اقرأ سياسة الخصوصية الخاصة بنا
                      </Text>
                    </View>
                  </View>
                  <MaterialIcons
                    name="chevron-right"
                    size={24}
                    color={colors.muted}
                  />
                </View>
              </Pressable>
            </View>
          </View>

          {/* معلومات التطبيق */}
          <View className="px-4 py-4">
            <View className="bg-surface rounded-lg border border-border p-4">
              <Text
                className="text-sm text-muted text-center"
                style={{ fontFamily: "Cairo" }}
              >
                دليل السيارات
              </Text>
              <Text className="text-xs text-muted text-center mt-2">
                الإصدار 1.0.0
              </Text>
            </View>
          </View>

          {/* زر تسجيل الخروج */}
          <View className="px-4 py-6 pb-8">
            <Pressable
              onPress={handleLogout}
              style={({ pressed }) => [{ opacity: pressed ? 0.8 : 1 }]}
            >
              <View className="bg-error rounded-lg p-4 items-center">
                <View className="flex-row items-center gap-2">
                  <MaterialIcons name="logout" size={24} color="#FFFFFF" />
                  <Text
                    className="text-lg font-bold text-white"
                    style={{ fontFamily: "Cairo" }}
                  >
                    تسجيل الخروج
                  </Text>
                </View>
              </View>
            </Pressable>
          </View>
        </ScrollView>
      </ScreenContainer>
    </View>
  );
}
