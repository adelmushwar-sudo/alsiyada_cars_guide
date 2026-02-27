import { ScrollView, Text, View, Pressable, Platform } from "react-native";
import { useRouter } from "expo-router";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";

interface ControlOption {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  route?: string;
}

const controlOptions: ControlOption[] = [
  {
    id: "basic-data",
    title: "إدارة البيانات الأساسية",
    description: "الماركات، الموديلات، الفئات، الألوان",
    icon: "info",
    color: "#1B3A70",
    route: "/control-center/basic-data",
  },
  {
    id: "technical",
    title: "التفاصيل التقنية",
    description: "الوقود، الناقل، الدفع، المحرك",
    icon: "settings",
    color: "#C41E3A",
    route: "/technical-specs",
  },
  {
    id: "legal",
    title: "الحالة القانونية",
    description: "الجمارك، اللوحات، الشاصيه",
    icon: "verified",
    color: "#E8E8E8",
    route: "/legal-status",
  },
  {
    id: "source",
    title: "مصدر السيارة والحالة",
    description: "التصنيف، التتبع، الحالات",
    icon: "location-on",
    color: "#1B3A70",
    route: "/source-status",
  },
  {
    id: "notifications",
    title: "نظام التنبيهات",
    description: "الإشعارات الذكية والتنبيهات",
    icon: "notifications",
    color: "#C41E3A",
    route: "/control-center/notifications",
  },
  {
    id: "permissions",
    title: "إدارة الصلاحيات",
    description: "التحكم في صلاحيات المستخدمين",
    icon: "security",
    color: "#E8E8E8",
    route: "/control-center/permissions",
  },
];

const ControlCard = ({
  option,
  onPress,
}: {
  option: ControlOption;
  onPress: () => void;
}) => {
  const colors = useColors();

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        {
          opacity: pressed ? 0.8 : 1,
          transitionProperty:
            Platform.OS === "web" ? "transform" : "none",
          transitionDuration: "200ms",
        },
      ]}
    >
      <View
        className="bg-surface rounded-lg border border-border overflow-hidden mb-3"
        style={{
          transitionProperty:
            Platform.OS === "web" ? "background-color, border-color" : "none",
          transitionDuration: "300ms",
        }}
      >
        {/* Header with Icon and Color */}
        <View
          className="flex-row items-center gap-3 px-4 py-4"
          style={{
            backgroundColor: option.color + "15",
            borderBottomColor: colors.border,
            borderBottomWidth: 1,
          }}
        >
          <View
            className="w-12 h-12 rounded-lg items-center justify-center"
            style={{ backgroundColor: option.color + "30" }}
          >
            <MaterialIcons
              name={option.icon as any}
              size={24}
              color={option.color}
            />
          </View>
          <View className="flex-1">
            <Text
              className="text-base font-bold text-foreground"
              style={{ fontFamily: "Cairo" }}
            >
              {option.title}
            </Text>
            <Text
              className="text-xs text-muted mt-1"
              style={{ fontFamily: "Cairo" }}
            >
              {option.description}
            </Text>
          </View>
          <MaterialIcons
            name="arrow-forward"
            size={20}
            color={colors.primary}
          />
        </View>

        {/* Quick Stats or Info */}
        <View className="px-4 py-3 flex-row gap-4">
          <View className="flex-1">
            <Text className="text-xs text-muted" style={{ fontFamily: "Cairo" }}>
              الحالة
            </Text>
            <Text
              className="text-sm font-semibold text-foreground mt-1"
              style={{ fontFamily: "Cairo" }}
            >
              نشط
            </Text>
          </View>
          <View className="flex-1">
            <Text className="text-xs text-muted" style={{ fontFamily: "Cairo" }}>
              آخر تحديث
            </Text>
            <Text
              className="text-sm font-semibold text-foreground mt-1"
              style={{ fontFamily: "Cairo" }}
            >
              اليوم
            </Text>
          </View>
        </View>
      </View>
    </Pressable>
  );
};

export default function ControlCenterScreen() {
  const colors = useColors();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const handleOptionPress = (option: ControlOption) => {
    if (option.route) {
      router.push(option.route as any);
    }
  };

  return (
    <View
      className="flex-1 bg-background"
      style={{
        transitionProperty:
          Platform.OS === "web" ? "background-color" : "none",
        transitionDuration: "300ms",
      }}
    >
      {/* App Bar */}
      <View
        className="bg-background border-b border-border px-3 py-2 flex-row items-center justify-between"
        style={{
          paddingTop: insets.top + 8,
          paddingBottom: 8,
          transitionProperty:
            Platform.OS === "web"
              ? "background-color, border-color"
              : "none",
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
        >
          لوحة التحكم
        </Text>
        <View style={{ width: 24 }} />
      </View>

      <ScreenContainer className="flex-1 p-0">
        <ScrollView
          className="flex-1"
          contentContainerStyle={{
            flexGrow: 1,
            paddingHorizontal: 12,
            paddingVertical: 12,
          }}
        >
          {/* Header Section */}
          <View className="mb-6">
            <Text
              className="text-2xl font-bold text-foreground"
              style={{ fontFamily: "Cairo" }}
            >
              مركز القيادة
            </Text>
            <Text
              className="text-sm text-muted mt-2"
              style={{ fontFamily: "Cairo" }}
            >
              إدارة شاملة لمخزون السيارات والمستخدمين
            </Text>
          </View>

          {/* Stats Overview */}
          <View className="flex-row gap-3 mb-6">
            <View
              className="flex-1 bg-surface rounded-lg p-3 border border-border"
              style={{
                transitionProperty:
                  Platform.OS === "web"
                    ? "background-color, border-color"
                    : "none",
                transitionDuration: "300ms",
              }}
            >
              <Text
                className="text-xs text-muted"
                style={{ fontFamily: "Cairo" }}
              >
                إجمالي السيارات
              </Text>
              <Text
                className="text-2xl font-bold text-primary mt-1"
                style={{ fontFamily: "Cairo" }}
              >
                24
              </Text>
            </View>
            <View
              className="flex-1 bg-surface rounded-lg p-3 border border-border"
              style={{
                transitionProperty:
                  Platform.OS === "web"
                    ? "background-color, border-color"
                    : "none",
                transitionDuration: "300ms",
              }}
            >
              <Text
                className="text-xs text-muted"
                style={{ fontFamily: "Cairo" }}
              >
                المستخدمون النشطون
              </Text>
              <Text
                className="text-2xl font-bold text-error mt-1"
                style={{ fontFamily: "Cairo" }}
              >
                8
              </Text>
            </View>
          </View>

          {/* Control Options */}
          <Text
            className="text-sm font-bold text-muted mb-3"
            style={{ fontFamily: "Cairo" }}
          >
            خيارات التحكم
          </Text>

          {controlOptions.map((option) => (
            <ControlCard
              key={option.id}
              option={option}
              onPress={() => handleOptionPress(option)}
            />
          ))}

          {/* Bottom Spacing */}
          <View style={{ height: 40 }} />
        </ScrollView>
      </ScreenContainer>
    </View>
  );
}
