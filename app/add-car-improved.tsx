import React, { useState, useCallback, useMemo } from "react";
import {
  View,
  Text,
  ScrollView,
  Pressable,
  TextInput,
  Platform,
  KeyboardAvoidingView,
} from "react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useColors } from "@/hooks/use-colors";
import { useToast } from "@/lib/toast-provider";
import { SearchableDropdown, type SearchableDropdownItem } from "@/components/searchable-dropdown";
import { SegmentedControl } from "@/components/segmented-control";
import { CheckboxesGroup, type CheckboxItem } from "@/components/checkboxes-group";
import { MediaGallery, MediaUploadCard } from "@/components/media-gallery";
import { useMediaManager } from "@/hooks/use-media-manager";
import {
  formatNumberWithSeparators,
  parseFormattedNumber,
  handleNumberInput,
  removeArabicCharacters,
  isValidVIN,
  generateYearArray,
} from "@/lib/number-formatter";
import {
  validateCarForm,
  getFieldError,
  type CarFormData,
  type ValidationError,
} from "@/lib/form-validation";

// Mock Data
const mockBrands: SearchableDropdownItem[] = [
  { id: "1", name: "BMW" },
  { id: "2", name: "Mercedes" },
  { id: "3", name: "Audi" },
  { id: "4", name: "Toyota" },
  { id: "5", name: "Honda" },
];

const mockModels: Record<string, SearchableDropdownItem[]> = {
  "1": [
    { id: "m1", name: "X5" },
    { id: "m2", name: "X7" },
    { id: "m3", name: "3 Series" },
  ],
  "2": [
    { id: "m4", name: "E-Class" },
    { id: "m5", name: "C-Class" },
    { id: "m6", name: "S-Class" },
  ],
  "3": [
    { id: "m7", name: "A6" },
    { id: "m8", name: "A8" },
    { id: "m9", name: "Q7" },
  ],
  "4": [
    { id: "m10", name: "Camry" },
    { id: "m11", name: "Corolla" },
    { id: "m12", name: "Land Cruiser" },
  ],
  "5": [
    { id: "m13", name: "Accord" },
    { id: "m14", name: "Civic" },
    { id: "m15", name: "CR-V" },
  ],
};

const mockCategories: Record<string, SearchableDropdownItem[]> = {
  m1: [
    { id: "c1", name: "Standard" },
    { id: "c2", name: "Premium" },
    { id: "c3", name: "Luxury" },
  ],
  m2: [
    { id: "c4", name: "Base" },
    { id: "c5", name: "Executive" },
  ],
};

const mockColors: SearchableDropdownItem[] = [
  { id: "col1", name: "أسود" },
  { id: "col2", name: "أبيض" },
  { id: "col3", name: "فضي" },
  { id: "col4", name: "رمادي" },
  { id: "col5", name: "أحمر" },
  { id: "col6", name: "أزرق" },
];

const mockFuelTypes: SearchableDropdownItem[] = [
  { id: "f1", name: "بنزين" },
  { id: "f2", name: "ديزل" },
  { id: "f3", name: "هجين" },
  { id: "f4", name: "كهربائي" },
];

const mockTransmissions: SearchableDropdownItem[] = [
  { id: "t1", name: "أوتوماتيك" },
  { id: "t2", name: "يدوي" },
  { id: "t3", name: "CVT" },
];

const mockDriveTypes: SearchableDropdownItem[] = [
  { id: "d1", name: "FWD" },
  { id: "d2", name: "RWD" },
  { id: "d3", name: "AWD" },
  { id: "d4", name: "4WD" },
];

const mockEngineTypes: SearchableDropdownItem[] = [
  { id: "e1", name: "V4" },
  { id: "e2", name: "V6" },
  { id: "e3", name: "V8" },
  { id: "e4", name: "Inline 4" },
];

const mockEngineSizes: SearchableDropdownItem[] = [
  { id: "es1", name: "1.6L" },
  { id: "es2", name: "2.0L" },
  { id: "es3", name: "2.5L" },
  { id: "es4", name: "3.0L" },
  { id: "es5", name: "5.0L" },
];

const mockRegionalSpecs: SearchableDropdownItem[] = [
  { id: "r1", name: "خليجي" },
  { id: "r2", name: "أوروبي" },
  { id: "r3", name: "أمريكي" },
  { id: "r4", name: "آسيوي" },
];

const mockClassifications: SearchableDropdownItem[] = [
  { id: "cl1", name: "في المعرض" },
  { id: "cl2", name: "مستورد" },
  { id: "cl3", name: "معروض للبيع" },
];

const mockTrackingStatuses: SearchableDropdownItem[] = [
  { id: "ts1", name: "متاح" },
  { id: "ts2", name: "محجوز" },
  { id: "ts3", name: "مباع" },
  { id: "ts4", name: "قيد الشحن" },
];

const mockCustomsStatuses: SearchableDropdownItem[] = [
  { id: "cs1", name: "مجمرك مرة" },
  { id: "cs2", name: "مجمرك مرتين" },
  { id: "cs3", name: "لم يجمرك" },
];

const mockPlateTypes: SearchableDropdownItem[] = [
  { id: "pt1", name: "عادي" },
  { id: "pt2", name: "دبلوماسي" },
  { id: "pt3", name: "حكومي" },
];

const mockFeatures: Record<string, CheckboxItem[]> = {
  m1: [
    { id: "f1", label: "فتحة سقف", icon: "light-mode" },
    { id: "f2", label: "شاشة تاتش", icon: "touch-app" },
    { id: "f3", label: "كاميرات 360", icon: "videocam" },
    { id: "f4", label: "كراسي جلد", icon: "event-seat" },
  ],
  m2: [
    { id: "f5", label: "نظام صوت عالي", icon: "volume-up" },
    { id: "f6", label: "تحكم مناخي", icon: "ac-unit" },
  ],
};

// Card Component
const Card = ({
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
    <View
      className="rounded-2xl p-4 mb-4"
      style={{ backgroundColor: colors.surface }}
    >
      <View className="flex-row items-center gap-3 mb-4">
        <MaterialIcons name={icon as any} size={24} color={colors.primary} />
        <Text
          className="text-lg font-bold flex-1"
          style={{ fontFamily: "Cairo", color: colors.foreground }}
        >
          {title}
        </Text>
      </View>
      {children}
    </View>
  );
};

// Input Field Component
const InputField = ({
  label,
  value,
  onChangeText,
  placeholder,
  keyboardType = "default",
  multiline = false,
  disabled = false,
  icon,
  onIconPress,
  error,
  maxLength,
}: {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  keyboardType?: "default" | "numeric" | "email-address" | "phone-pad";
  multiline?: boolean;
  disabled?: boolean;
  icon?: string;
  onIconPress?: () => void;
  error?: string;
  maxLength?: number;
}) => {
  const colors = useColors();
  return (
    <View className="gap-2 mb-3">
      <Text
        className="text-sm font-semibold"
        style={{ fontFamily: "Cairo", color: colors.foreground }}
      >
        {label}
      </Text>
      <View className="flex-row items-center gap-2">
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          keyboardType={keyboardType}
          multiline={multiline}
          editable={!disabled}
          maxLength={maxLength}
          className="flex-1 border rounded-lg p-3 text-foreground"
          style={{
            borderColor: error ? colors.error : colors.border,
            color: colors.foreground,
            fontFamily: "Cairo",
            backgroundColor: disabled ? colors.muted + "15" : colors.background,
          }}
          placeholderTextColor={colors.muted}
        />
        {icon && (
          <Pressable
            onPress={onIconPress}
            className="p-2"
            disabled={!onIconPress}
          >
            <MaterialIcons
              name={icon as any}
              size={20}
              color={onIconPress ? colors.primary : colors.muted}
            />
          </Pressable>
        )}
      </View>
      {error && (
        <Text
          className="text-xs"
          style={{ fontFamily: "Cairo", color: colors.error }}
        >
          {error}
        </Text>
      )}
    </View>
  );
};

export default function AddCarImprovedScreen() {
  const router = useRouter();
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { showToast } = useToast();
  const mediaManager = useMediaManager();

  const [formData, setFormData] = useState<Partial<CarFormData>>({
    images: [],
    legalDocuments: [],
    ownerName: "",
    ownerPhone: "",
    ownerAddress: "",
    brand: "",
    model: "",
    category: "",
    exteriorColor: "",
    interiorColor: "",
    regionalSpecs: "",
    fuelType: "",
    transmission: "",
    driveType: "",
    engineType: "",
    engineSize: "",
    mileage: 0,
    mileageUnit: "km",
    features: [],
    vin: "",
    classification: "cl1", // Default: "في المعرض"
    trackingStatus: "ts1", // Default: "متاح"
    customsStatus: "",
    plateNumber: "",
    plateSerial: "",
    plateType: "",
    purchasePrice: 0,
    purchaseCurrency: "SAR",
    salePrice: 0,
    saleCurrency: "SAR",
    minPrice: 0,
    minCurrency: "SAR",
  });

  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([]);
  const [mileageDisplay, setMileageDisplay] = useState("");
  const [priceDisplay, setPriceDisplay] = useState("");
  const [minPriceDisplay, setMinPriceDisplay] = useState("");

  const handleFieldChange = useCallback(
    (field: keyof CarFormData, value: any) => {
      setFormData((prev) => ({
        ...prev,
        [field]: value,
      }));
      setValidationErrors((prev) => prev.filter((e) => e.field !== field));
    },
    []
  );

  const handleMileageChange = (text: string) => {
    const { displayValue, numericValue } = handleNumberInput(text);
    setMileageDisplay(displayValue);
    handleFieldChange("mileage", numericValue);
  };

  const handlePriceChange = (text: string) => {
    const { displayValue, numericValue } = handleNumberInput(text);
    setPriceDisplay(displayValue);
    handleFieldChange("salePrice", numericValue);
  };

  const handleMinPriceChange = (text: string) => {
    const { displayValue, numericValue } = handleNumberInput(text);
    setMinPriceDisplay(displayValue);
    handleFieldChange("minPrice", numericValue);
  };

  const handleVINChange = (text: string) => {
    const cleaned = removeArabicCharacters(text).toUpperCase();
    handleFieldChange("vin", cleaned);
  };

  const getAvailableModels = useMemo(() => {
    return formData.brand ? mockModels[formData.brand as string] || [] : [];
  }, [formData.brand]);

  const getAvailableCategories = useMemo(() => {
    return formData.model ? mockCategories[formData.model as string] || [] : [];
  }, [formData.model]);

  const getAvailableFeatures = useMemo(() => {
    return formData.model ? mockFeatures[formData.model as string] || [] : [];
  }, [formData.model]);

  // Check if owner data should be hidden
  const isInShowroom = formData.classification === "cl1";
  const showOwnerData = !isInShowroom;

  const toggleFeature = (featureId: string) => {
    const currentFeatures = (formData.features || []) as string[];
    const newFeatures = currentFeatures.includes(featureId)
      ? currentFeatures.filter((f) => f !== featureId)
      : [...currentFeatures, featureId];
    handleFieldChange("features", newFeatures);
  };

  const handleSave = () => {
    const validation = validateCarForm(formData as CarFormData);

    if (!validation.isValid) {
      setValidationErrors(validation.errors);
      const firstError = validation.errors[0];
      showToast(firstError.message, "error");
      return;
    }

    showToast("تمت إضافة السيارة بنجاح", "success");
    setTimeout(() => {
      router.back();
    }, 1500);
  };

  const yearOptions = generateYearArray().map((year) => ({
    id: year.toString(),
    name: year.toString(),
  }));

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <View style={{ flex: 1, backgroundColor: colors.background }}>
        {/* Header */}
        <View
          className="flex-row items-center justify-between px-4 py-3 border-b"
          style={{
            backgroundColor: colors.surface,
            borderColor: colors.border,
            paddingTop: insets.top + 12,
          }}
        >
          <Pressable onPress={() => router.back()} className="p-2">
            <MaterialIcons name="arrow-back" size={24} color={colors.primary} />
          </Pressable>
          <Text
            className="text-xl font-bold flex-1 text-center"
            style={{ fontFamily: "Cairo", color: colors.foreground }}
          >
            إضافة سيارة
          </Text>
          <View style={{ width: 40 }} />
        </View>

        {/* Content */}
        <ScrollView
          className="flex-1"
          contentContainerStyle={{
            paddingHorizontal: 16,
            paddingVertical: 16,
          }}
          showsVerticalScrollIndicator={false}
        >
          {/* Classification & Tracking Status Card (First) */}
          <Card title="التصنيف وتتبع الحالة" icon="category">
            <SearchableDropdown
              items={mockClassifications}
              selectedId={formData.classification as string}
              onSelect={(id) => handleFieldChange("classification", id)}
              label="التصنيف"
              placeholder="اختر..."
            />

            <View className="mt-3">
              <SearchableDropdown
                items={mockTrackingStatuses}
                selectedId={formData.trackingStatus as string}
                onSelect={(id) => handleFieldChange("trackingStatus", id)}
                label="تتبع الحالة"
                placeholder="اختر..."
              />
            </View>
          </Card>

          {/* Owner Info Card (Conditional) */}
          {showOwnerData && (
            <Card title="بيانات المالك" icon="person">
              <InputField
                label="👤 اسم المالك"
                value={formData.ownerName || ""}
                onChangeText={(text) => handleFieldChange("ownerName", text)}
                placeholder="أدخل اسم المالك"
                error={getFieldError("ownerName", validationErrors) || undefined}
              />
              <InputField
                label="رقم الهاتف"
                value={formData.ownerPhone || ""}
                onChangeText={(text) => handleFieldChange("ownerPhone", text)}
                placeholder="أدخل رقم الهاتف"
                keyboardType="phone-pad"
                error={getFieldError("ownerPhone", validationErrors) || undefined}
              />
              <InputField
                label="📍 عنوان المالك"
                value={formData.ownerAddress || ""}
                onChangeText={(text) => handleFieldChange("ownerAddress", text)}
                placeholder="أدخل العنوان"
                multiline
              />
            </Card>
          )}

          {/* Media Card */}
          <Card title="الوسائط والمرفقات" icon="image">
            <MediaUploadCard
              title="الصور والفيديو"
              icon="add-a-photo"
              onUpload={() =>
                showToast("سيتم إضافة ميزة رفع الصور قريباً", "info")
              }
              onUploadBatch={() =>
                showToast("سيتم إضافة ميزة رفع دفعات قريباً", "info")
              }
            >
              <MediaGallery
                items={mediaManager.media.images}
                onRemove={mediaManager.removeImage}
                onReorder={mediaManager.reorderImages}
                onReplace={() =>
                  showToast("سيتم إضافة ميزة استبدال الصور قريباً", "info")
                }
                type="images"
                title="الصور المرفوعة"
              />
            </MediaUploadCard>

            <View className="mt-4">
              <MediaUploadCard
                title="المستندات القانونية"
                icon="description"
                onUpload={() =>
                  showToast("سيتم إضافة ميزة رفع المستندات قريباً", "info")
                }
                uploadButtonText="رفع مستند"
              >
                <MediaGallery
                  items={mediaManager.media.legalDocuments}
                  onRemove={mediaManager.removeLegalDocument}
                  onReorder={mediaManager.reorderLegalDocuments}
                  onReplace={() =>
                    showToast("سيتم إضافة ميزة استبدال المستندات قريباً", "info")
                  }
                  type="documents"
                  title="المستندات المرفوعة"
                />
              </MediaUploadCard>
            </View>
          </Card>

          {/* Core & Tech Specs Card */}
          <Card title="البيانات الأساسية والتقنية" icon="settings">
            <SearchableDropdown
              items={mockBrands}
              selectedId={formData.brand as string}
              onSelect={(id) => {
                handleFieldChange("brand", id);
                handleFieldChange("model", "");
                handleFieldChange("category", "");
              }}
              label="الماركة"
              placeholder="اختر ماركة..."
            />

            <View className="mt-3">
              <SearchableDropdown
                items={getAvailableModels}
                selectedId={formData.model as string}
                onSelect={(id) => {
                  handleFieldChange("model", id);
                  handleFieldChange("category", "");
                }}
                label="الموديل"
                placeholder="اختر موديل..."
                disabled={!formData.brand}
              />
            </View>

            <View className="mt-3">
              <SearchableDropdown
                items={getAvailableCategories}
                selectedId={formData.category as string}
                onSelect={(id) => handleFieldChange("category", id)}
                label="الفئة"
                placeholder="اختر فئة..."
                disabled={!formData.model}
              />
            </View>

            {/* Year Selection - TODO: Add year field to CarFormData */}
            {/* <View className="mt-3">
              <SearchableDropdown
                items={yearOptions}
                selectedId={formData.category as string}
                onSelect={(id) => handleFieldChange("category", id)}
                label="سنة الصنع"
                placeholder="اختر السنة..."
              />
            </View> */}

            {/* Mileage with Segmented Control */}
            <View className="mt-3 gap-2">
              <Text
                className="text-sm font-semibold"
                style={{ fontFamily: "Cairo", color: colors.foreground }}
              >
                العداد (Mileage)
              </Text>
              <View className="flex-row gap-2">
                <TextInput
                  value={mileageDisplay}
                  onChangeText={handleMileageChange}
                  keyboardType="numeric"
                  className="flex-1 border rounded-lg p-3"
                  style={{
                    borderColor: colors.border,
                    color: colors.foreground,
                    fontFamily: "Cairo",
                  }}
                  placeholder="0"
                  placeholderTextColor={colors.muted}
                />
              </View>
              <SegmentedControl
                options={[
                  { id: "km", label: "كم" },
                  { id: "miles", label: "ميل" },
                ]}
                selectedId={formData.mileageUnit as string}
                onSelect={(id) => handleFieldChange("mileageUnit", id)}
              />
            </View>

            {/* Color Selection */}
            <View className="mt-3">
              <SearchableDropdown
                items={mockColors}
                selectedId={formData.exteriorColor as string}
                onSelect={(id) => handleFieldChange("exteriorColor", id)}
                label="اللون الخارجي"
                placeholder="اختر لون..."
                disabled={!formData.model}
              />
            </View>

            <View className="mt-3">
              <SearchableDropdown
                items={mockColors}
                selectedId={formData.interiorColor as string}
                onSelect={(id) => handleFieldChange("interiorColor", id)}
                label="اللون الداخلي"
                placeholder="اختر لون..."
                disabled={!formData.model}
              />
            </View>

            {/* Engine & Fuel */}
            <View className="mt-3">
              <SearchableDropdown
                items={mockFuelTypes}
                selectedId={formData.fuelType as string}
                onSelect={(id) => handleFieldChange("fuelType", id)}
                label="نوع الوقود"
                placeholder="اختر..."
                disabled={!formData.model}
              />
            </View>

            <View className="mt-3">
              <SearchableDropdown
                items={mockTransmissions}
                selectedId={formData.transmission as string}
                onSelect={(id) => handleFieldChange("transmission", id)}
                label="ناقل الحركة"
                placeholder="اختر..."
                disabled={!formData.model}
              />
            </View>

            <View className="mt-3">
              <SearchableDropdown
                items={mockDriveTypes}
                selectedId={formData.driveType as string}
                onSelect={(id) => handleFieldChange("driveType", id)}
                label="نظام الدفع"
                placeholder="اختر..."
                disabled={!formData.model}
              />
            </View>

            <View className="mt-3">
              <SearchableDropdown
                items={mockEngineTypes}
                selectedId={formData.engineType as string}
                onSelect={(id) => handleFieldChange("engineType", id)}
                label="نوع المحرك"
                placeholder="اختر..."
                disabled={!formData.model}
              />
            </View>

            <View className="mt-3">
              <SearchableDropdown
                items={mockEngineSizes}
                selectedId={formData.engineSize as string}
                onSelect={(id) => handleFieldChange("engineSize", id)}
                label="حجم المحرك"
                placeholder="اختر..."
                disabled={!formData.model}
              />
            </View>
          </Card>

          {/* Additional Features Card */}
          {getAvailableFeatures.length > 0 && (
            <Card title="المواصفات الإضافية" icon="star">
              <CheckboxesGroup
                items={getAvailableFeatures}
                selectedIds={(formData.features || []) as string[]}
                onToggle={toggleFeature}
                columns={2}
              />
            </Card>
          )}

          {/* Legal & Status Card */}
          <Card title="البيانات القانونية والحالة" icon="description">
            <InputField
              label="رقم الشاصيه (VIN) - اختياري"
              value={formData.vin || ""}
              onChangeText={handleVINChange}
              placeholder="أدخل رقم الشاصيه (إنجليزي فقط)"
              maxLength={17}
            />

            <View className="mt-3">
              <SearchableDropdown
                items={mockCustomsStatuses}
                selectedId={formData.customsStatus as string}
                onSelect={(id) => handleFieldChange("customsStatus", id)}
                label="حالة الجمارك"
                placeholder="اختر..."
              />
            </View>

            <View className="mt-3">
              <InputField
                label="رقم اللوحة"
                value={formData.plateNumber || ""}
                onChangeText={(text) => handleFieldChange("plateNumber", text)}
                placeholder="أدخل رقم اللوحة"
              />
            </View>

            <View className="mt-3">
              <InputField
                label="رقم الفاصل"
                value={formData.plateSerial || ""}
                onChangeText={(text) => handleFieldChange("plateSerial", text)}
                placeholder="أدخل رقم الفاصل"
              />
            </View>

            <View className="mt-3">
              <SearchableDropdown
                items={mockPlateTypes}
                selectedId={formData.plateType as string}
                onSelect={(id) => handleFieldChange("plateType", id)}
                label="نوع اللوحة"
                placeholder="اختر..."
              />
            </View>
          </Card>

          {/* Pricing Card */}
          <Card title="التسعيرة" icon="local-offer">
            <View className="gap-2 mb-3">
              <Text
                className="text-sm font-semibold"
                style={{ fontFamily: "Cairo", color: colors.foreground }}
              >
                سعر البيع المطلوب
              </Text>
              <View className="flex-row gap-2">
                <TextInput
                  value={priceDisplay}
                  onChangeText={handlePriceChange}
                  keyboardType="numeric"
                  className="flex-1 border rounded-lg p-3"
                  style={{
                    borderColor: colors.border,
                    color: colors.foreground,
                    fontFamily: "Cairo",
                  }}
                  placeholder="0"
                  placeholderTextColor={colors.muted}
                />
              </View>
              <SegmentedControl
                options={[
                  { id: "SAR", label: "﷼ ريال" },
                  { id: "USD", label: "$ دولار" },
                ]}
                selectedId={formData.saleCurrency as string}
                onSelect={(id) => handleFieldChange("saleCurrency", id as "SAR" | "USD")}
              />
            </View>

            <View className="gap-2">
              <Text
                className="text-sm font-semibold"
                style={{ fontFamily: "Cairo", color: colors.foreground }}
              >
                أدنى سعر للبيع
              </Text>
              <View className="flex-row gap-2">
                <TextInput
                  value={minPriceDisplay}
                  onChangeText={handleMinPriceChange}
                  keyboardType="numeric"
                  className="flex-1 border rounded-lg p-3"
                  style={{
                    borderColor: colors.border,
                    color: colors.foreground,
                    fontFamily: "Cairo",
                  }}
                  placeholder="0"
                  placeholderTextColor={colors.muted}
                />
              </View>
              <SegmentedControl
                options={[
                  { id: "SAR", label: "﷼ ريال" },
                  { id: "USD", label: "$ دولار" },
                ]}
                selectedId={formData.minCurrency as string}
                onSelect={(id) => handleFieldChange("minCurrency", id as "SAR" | "USD")}
              />
            </View>
          </Card>

          {/* Spacing for button */}
          <View style={{ height: 100 }} />
        </ScrollView>

        {/* Sticky Save Button */}
        <View
          className="px-4 py-3 border-t"
          style={{
            backgroundColor: colors.surface,
            borderColor: colors.border,
            paddingBottom: Math.max(insets.bottom, 12),
          }}
        >
          <Pressable
            onPress={handleSave}
            className="rounded-lg p-4 items-center justify-center"
            style={{ backgroundColor: colors.primary }}
          >
            <Text
              className="text-base font-bold"
              style={{ fontFamily: "Cairo", color: "#FFFFFF" }}
            >
              حفظ السيارة
            </Text>
          </Pressable>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
