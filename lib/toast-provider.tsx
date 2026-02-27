import React, { createContext, useContext, useState, useCallback } from "react";
import { View, Text, Animated, Pressable } from "react-native";
import { useColors } from "@/hooks/use-colors";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

export type ToastType = "success" | "error" | "warning" | "delete" | "info";

export interface Toast {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
}

interface ToastContextType {
  showToast: (message: string, type: ToastType, duration?: number) => void;
  toasts: Toast[];
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const colors = useColors();

  const showToast = useCallback(
    (message: string, type: ToastType, duration: number = 3000) => {
      const id = Date.now().toString();
      const toast: Toast = { id, message, type, duration };

      setToasts((prev) => [...prev, toast]);

      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, duration);
    },
    []
  );

  const getToastStyles = (type: ToastType) => {
    const baseStyles = {
      paddingHorizontal: 16,
      paddingVertical: 12,
      borderRadius: 12,
      flexDirection: "row" as const,
      alignItems: "center" as const,
      gap: 12,
      marginHorizontal: 16,
      marginVertical: 8,
    };

    switch (type) {
      case "success":
        return {
          ...baseStyles,
          backgroundColor: colors.success + "E6",
        };
      case "error":
        return {
          ...baseStyles,
          backgroundColor: colors.error + "E6",
        };
      case "warning":
        return {
          ...baseStyles,
          backgroundColor: colors.warning + "E6",
        };
      case "delete":
        return {
          ...baseStyles,
          backgroundColor: "#FF6B6B" + "E6",
        };
      case "info":
      default:
        return {
          ...baseStyles,
          backgroundColor: colors.primary + "E6",
        };
    }
  };

  const getIconName = (type: ToastType) => {
    switch (type) {
      case "success":
        return "check-circle";
      case "error":
        return "error";
      case "warning":
        return "warning";
      case "delete":
        return "delete";
      case "info":
      default:
        return "info";
    }
  };

  const getTextColor = (type: ToastType) => {
    return "#FFFFFF";
  };

  return (
    <ToastContext.Provider value={{ showToast, toasts }}>
      {children}
      <View
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          pointerEvents: "none",
        }}
      >
        {toasts.map((toast) => (
          <View
            key={toast.id}
            style={getToastStyles(toast.type)}
            pointerEvents="auto"
          >
            <MaterialIcons
              name={getIconName(toast.type) as any}
              size={20}
              color={getTextColor(toast.type)}
            />
            <Text
              style={{
                color: getTextColor(toast.type),
                fontSize: 14,
                fontFamily: "Cairo",
                flex: 1,
              }}
            >
              {toast.message}
            </Text>
          </View>
        ))}
      </View>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within ToastProvider");
  }
  return context;
}
