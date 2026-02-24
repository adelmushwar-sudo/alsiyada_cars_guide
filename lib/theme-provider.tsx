import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  Appearance,
  View,
  useColorScheme as useSystemColorScheme,
  Platform,
} from "react-native";
import { colorScheme as nativewindColorScheme, vars } from "nativewind";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { SchemeColors, type ColorScheme } from "@/constants/theme";

type ThemeMode = "light" | "dark" | "system";

type ThemeContextValue = {
  colorScheme: ColorScheme;
  setColorScheme: (scheme: ColorScheme) => void;
  themeMode: ThemeMode;
  setThemeMode: (mode: ThemeMode) => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const systemScheme = useSystemColorScheme() ?? "light";
  const [colorScheme, setColorSchemeState] = useState<ColorScheme>(systemScheme);
  const [themeMode, setThemeModeState] = useState<ThemeMode>("system");
  const [isInitialized, setIsInitialized] = useState(false);

  // تحميل تفضيل المظهر المحفوظ
  useEffect(() => {
    const loadThemePreference = async () => {
      try {
        const savedMode = await AsyncStorage.getItem("theme-preference");
        if (
          savedMode &&
          (savedMode === "light" || savedMode === "dark" || savedMode === "system")
        ) {
          setThemeModeState(savedMode as ThemeMode);
        }
      } catch (error) {
        console.error("Failed to load theme preference:", error);
      } finally {
        setIsInitialized(true);
      }
    };

    loadThemePreference();
  }, []);

  // تطبيق المظهر على الواجهة
  const applyScheme = useCallback((scheme: ColorScheme) => {
    nativewindColorScheme.set(scheme);

    // تطبيق على React Native
    if (Appearance.setColorScheme) {
      Appearance.setColorScheme(scheme);
    }

    // تطبيق على الويب
    if (typeof document !== "undefined") {
      const root = document.documentElement;
      root.dataset.theme = scheme;
      root.classList.toggle("dark", scheme === "dark");

      const palette = SchemeColors[scheme];
      Object.entries(palette).forEach(([token, value]) => {
        root.style.setProperty(`--color-${token}`, value);
      });

      // إضافة انتقالات سلسة
      if (Platform.OS === "web") {
        root.style.transition = "background-color 300ms ease-in-out";
      }
    }
  }, []);

  // تحديث المظهر عند تغيير النظام (عندما يكون في وضع "اتباع النظام")
  useEffect(() => {
    if (themeMode === "system") {
      setColorSchemeState(systemScheme);
      applyScheme(systemScheme);
    }
  }, [systemScheme, themeMode, applyScheme]);

  // مراقبة تغييرات إعدادات النظام
  useEffect(() => {
    if (themeMode !== "system") return;

    const subscription = Appearance.addChangeListener(({ colorScheme }) => {
      if (colorScheme) {
        setColorSchemeState(colorScheme as ColorScheme);
        applyScheme(colorScheme as ColorScheme);
      }
    });

    return () => subscription.remove();
  }, [themeMode, applyScheme]);

  // تعيين المظهر بناءً على الوضع المختار
  const setColorScheme = useCallback(
    (scheme: ColorScheme) => {
      setColorSchemeState(scheme);
      applyScheme(scheme);
    },
    [applyScheme]
  );

  // تعيين وضع المظهر (فاتح/داكن/النظام)
  const setThemeMode = useCallback(
    async (mode: ThemeMode) => {
      try {
        // حفظ التفضيل
        await AsyncStorage.setItem("theme-preference", mode);
        setThemeModeState(mode);

        // تطبيق المظهر المناسب
        if (mode === "system") {
          // استخدام مظهر النظام
          setColorSchemeState(systemScheme);
          applyScheme(systemScheme);
        } else if (mode === "light") {
          setColorSchemeState("light");
          applyScheme("light");
        } else if (mode === "dark") {
          setColorSchemeState("dark");
          applyScheme("dark");
        }
      } catch (error) {
        console.error("Failed to set theme mode:", error);
      }
    },
    [systemScheme, applyScheme]
  );

  // تطبيق المظهر الأولي
  useEffect(() => {
    if (isInitialized) {
      if (themeMode === "system") {
        applyScheme(systemScheme);
      } else {
        applyScheme(themeMode as ColorScheme);
      }
    }
  }, [isInitialized, themeMode, systemScheme, applyScheme]);

  const themeVariables = useMemo(
    () =>
      vars({
        "color-primary": SchemeColors[colorScheme].primary,
        "color-background": SchemeColors[colorScheme].background,
        "color-surface": SchemeColors[colorScheme].surface,
        "color-foreground": SchemeColors[colorScheme].foreground,
        "color-muted": SchemeColors[colorScheme].muted,
        "color-border": SchemeColors[colorScheme].border,
        "color-success": SchemeColors[colorScheme].success,
        "color-warning": SchemeColors[colorScheme].warning,
        "color-error": SchemeColors[colorScheme].error,
      }),
    [colorScheme]
  );

  const value = useMemo(
    () => ({
      colorScheme,
      setColorScheme,
      themeMode,
      setThemeMode,
    }),
    [colorScheme, setColorScheme, themeMode, setThemeMode]
  );

  return (
    <ThemeContext.Provider value={value}>
      <View
        style={[
          { flex: 1 },
          themeVariables,
          Platform.OS === "web"
            ? {
                transition: "background-color 300ms ease-in-out",
              }
            : {},
        ]}
      >
        {children}
      </View>
    </ThemeContext.Provider>
  );
}

export function useThemeContext(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error("useThemeContext must be used within ThemeProvider");
  }
  return ctx;
}
