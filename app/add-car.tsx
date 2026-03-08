import { ScrollView, Text, View, Pressable, TextInput, Platform, Image, Modal, FlatList } from "react-native";
import { useRouter } from "expo-router";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useState, useEffect } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as ImagePicker from "expo-image-picker";
import * as DocumentPicker from "expo-document-picker";
import * as Contacts from "expo-contacts";

import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";

// المكونات الفرعية
const FormSection = ({ title, icon, children }: { title: string; icon: keyof typeof MaterialIcons.glyphMap; children: React.ReactNode }) => {
  const colors = useColors();
  return (
    <View className="bg-surface rounded-2xl border border-border overflow-hidden mb-6 shadow-sm">
      <View className="flex-row items-center gap-3 px-5 py-4 border-b border-border bg-surface">
        <View className="w-10 h-10 rounded-xl items-center justify-center" style={{ backgroundColor: colors.primary + "10" }}>
          <MaterialIcons name={icon} size={22} color={colors.primary} />
        </View>
        <Text className="text-base font-bold text-foreground flex-1" style={{ fontFamily: "Cairo" }}>{title}</Text>
      </View>
      <View className="px-5 py-5">{children}</View>
    </View>
  );
};

const FormField = ({ label, children, horizontal = false }: { label: string; children: React.ReactNode; horizontal?: boolean }) => {
  return (
    <View className={`mb-4 ${horizontal ? "flex-row items-center justify-between" : ""}`}>
      <Text className={`text-sm font-semibold text-muted mb-2 ${horizontal ? "mb-0 mr-4" : ""}`} style={{ fontFamily: "Cairo" }}>{label}</Text>
      <View className={horizontal ? "flex-1" : ""}>{children}</View>
    </View>
  );
};

const CustomTextInput = ({ value, onChangeText, placeholder, keyboardType = "default", autoCapitalize = "none", icon, rightIcon, onRightIconPress, maxLength }: { value: string; onChangeText: (text: string) => void; placeholder: string; keyboardType?: any; autoCapitalize?: any; icon?: keyof typeof MaterialIcons.glyphMap; rightIcon?: keyof typeof MaterialIcons.glyphMap; onRightIconPress?: () => void; maxLength?: number }) => {
  const colors = useColors();
  return (
    <View className="flex-row items-center bg-background border border-border rounded-xl px-4 py-3">
      {icon && <MaterialIcons name={icon} size={20} color={colors.muted} style={{ marginRight: 10 }} />}
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.muted}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
        maxLength={maxLength}
        className="flex-1 text-foreground text-sm text-right"
        style={{ fontFamily: "Cairo" }}
      />
      {rightIcon && (
        <Pressable onPress={onRightIconPress} className="ml-2">
          <MaterialIcons name={rightIcon} size={20} color={colors.primary} />
        </Pressable>
      )}
    </View>
  );
};

const DropdownField = ({ label, value, placeholder, options, onSelect, disabled = false, horizontal = false }: { label: string; value: string; placeholder: string; options: { id: string; name: string }[]; onSelect: (id: string, name: string) => void; disabled?: boolean; horizontal?: boolean }) => {
  const colors = useColors();
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <FormField label={label} horizontal={horizontal}>
      <Pressable
        onPress={() => !disabled && setModalVisible(true)}
        className={`flex-row items-center justify-between bg-background border border-border rounded-xl px-4 py-3 ${disabled ? "opacity-50" : ""}`}
      >
        <Text className={`text-sm ${value ? "text-foreground" : "text-muted"}`} style={{ fontFamily: "Cairo" }}>
          {value || placeholder}
        </Text>
        <MaterialIcons name="keyboard-arrow-down" size={20} color={colors.muted} />
      </Pressable>

      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <View className="flex-1 justify-end bg-black/50">
          <View className="bg-surface rounded-t-3xl p-6 max-h-[70%]">
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-lg font-bold text-foreground" style={{ fontFamily: "Cairo" }}>{label}</Text>
              <Pressable onPress={() => setModalVisible(false)}>
                <MaterialIcons name="close" size={24} color={colors.muted} />
              </Pressable>
            </View>
            <FlatList
              data={options}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <Pressable
                  onPress={() => {
                    onSelect(item.id, item.name);
                    setModalVisible(false);
                  }}
                  className="py-4 border-b border-border"
                >
                  <Text className="text-base text-foreground text-right" style={{ fontFamily: "Cairo" }}>{item.name}</Text>
                </Pressable>
              )}
            />
          </View>
        </View>
      </Modal>
    </FormField>
  );
};

const CheckboxField = ({ label, options, selectedIds, onToggle, disabled = false }: { label: string; options: { id: string; name: string }[]; selectedIds: string[]; onToggle: (id: string) => void; disabled?: boolean }) => {
  const colors = useColors();
  return (
    <FormField label={label}>
      <View className={`flex-row flex-wrap gap-2 ${disabled ? "opacity-50" : ""}`}>
        {options.map((option) => {
          const isSelected = selectedIds.includes(option.id);
          return (
            <Pressable
              key={option.id}
              onPress={() => !disabled && onToggle(option.id)}
              className={`flex-row items-center gap-2 px-3 py-2 rounded-lg border ${isSelected ? "bg-primary/10 border-primary" : "bg-background border-border"}`}
            >
              <MaterialIcons name={isSelected ? "check-box" : "check-box-outline-blank"} size={18} color={isSelected ? colors.primary : colors.muted} />
              <Text className={`text-xs ${isSelected ? "text-primary font-bold" : "text-foreground"}`} style={{ fontFamily: "Cairo" }}>{option.name}</Text>
            </Pressable>
          );
        })}
      </View>
    </FormField>
  );
};

const PricingField = ({ label, value, onChangeText, currency, onCurrencyChange }: { label: string; value: string; onChangeText: (text: string) => void; currency: "SAR" | "USD"; onCurrencyChange: (curr: "SAR" | "USD") => void }) => {
  const colors = useColors();
  return (
    <FormField label={label}>
      <View className="flex-row gap-2">
        <View className="flex-1">
          <CustomTextInput value={value} onChangeText={onChangeText} placeholder="0.00" keyboardType="numeric" icon="attach-money" />
        </View>
        <View className="flex-row bg-background border border-border rounded-xl overflow-hidden">
          <Pressable onPress={() => onCurrencyChange("SAR")} className={`px-3 items-center justify-center ${currency === "SAR" ? "bg-primary" : ""}`}>
            <Text className={`text-xs font-bold ${currency === "SAR" ? "text-white" : "text-muted"}`} style={{ fontFamily: "Cairo" }}>ر.س</Text>
          </Pressable>
          <View className="w-px bg-border" />
          <Pressable onPress={() => onCurrencyChange("USD")} className={`px-3 items-center justify-center ${currency === "USD" ? "bg-primary" : ""}`}>
            <Text className={`text-xs font-bold ${currency === "USD" ? "text-white" : "text-muted"}`} style={{ fontFamily: "Cairo" }}>$</Text>
          </Pressable>
        </View>
      </View>
    </FormField>
  );
};

export default function AddCarScreen() {
  const colors = useColors();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  // State للوسائط والمرفقات
  const [images, setImages] = useState<string[]>([]);
  const [video, setVideo] = useState<string | null>(null);
  const [documents, setDocuments] = useState<{ name: string; uri: string }[]>([]);

  // State لبيانات المالك
  const [ownerName, setOwnerName] = useState("");
  const [ownerPhone, setOwnerPhone] = useState("");
  const [ownerAddress, setOwnerAddress] = useState("");

  // State للبيانات الأساسية
  const [selectedBrand, setSelectedBrand] = useState({ id: "", name: "" });
  const [selectedModel, setSelectedModel] = useState({ id: "", name: "" });
  const [selectedTrim, setSelectedTrim] = useState({ id: "", name: "" });
  const [selectedYear, setSelectedYear] = useState("");
  const [mileage, setMileage] = useState("");
  const [mileageUnit, setMileageUnit] = useState<"km" | "mile">("km");

  // State للتفاصيل التقنية والمواصفات
  const [fuelType, setFuelType] = useState({ id: "", name: "" });
  const [transmission, setTransmission] = useState({ id: "", name: "" });
  const [driveType, setDriveType] = useState({ id: "", name: "" });
  const [engineType, setEngineType] = useState({ id: "", name: "" });
  const [engineSize, setEngineSize] = useState({ id: "", name: "" });
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);

  // State للحالة القانونية
  const [customsStatus, setCustomsStatus] = useState({ id: "", name: "" });
  const [plateNumber, setPlateNumber] = useState("");
  const [plateSeparator, setPlateSeparator] = useState("");
  const [plateType, setPlateType] = useState("");
  const [vin, setVin] = useState("");

  // State للتصنيف والموقع
  const [category, setCategory] = useState({ id: "", name: "" });
  const [statusTracking, setStatusTracking] = useState({ id: "", name: "" });

  // State للتسعيرة
  const [purchasePrice, setPurchasePrice] = useState("");
  const [purchaseCurrency, setPurchaseCurrency] = useState<"SAR" | "USD">("SAR");
  const [sellingPrice, setSellingPrice] = useState("");
  const [sellingCurrency, setSellingCurrency] = useState<"SAR" | "USD">("SAR");
  const [minSellingPrice, setMinSellingPrice] = useState("");
  const [minSellingCurrency, setMinSellingCurrency] = useState<"SAR" | "USD">("SAR");

  // Mock Data
  const brands = [{ id: "1", name: "تويوتا" }, { id: "2", name: "مرسيدس" }];
  const models = [{ id: "m1", name: "لاند كروزر", brandId: "1" }, { id: "m2", name: "كامري", brandId: "1" }];
  const trims = [{ id: "t1", name: "GXR", modelId: "m1" }, { id: "t2", name: "VXR", modelId: "m1" }];
  const fuelTypes = [{ id: "f1", name: "بنزين", modelId: "m1" }, { id: "f2", name: "ديزل", modelId: "m1" }];
  const transmissions = [{ id: "tr1", name: "أوتوماتيك", modelId: "m1" }, { id: "tr2", name: "يدوي", modelId: "m1" }];
  const driveTypes = [{ id: "d1", name: "4WD", modelId: "m1" }, { id: "d2", name: "FWD", modelId: "m1" }];
  const engineTypes = [{ id: "e1", name: "V6", modelId: "m1" }, { id: "e2", name: "V8", modelId: "m1" }];
  const engineSizes = [{ id: "s1", name: "3.5L", modelId: "m1" }, { id: "s2", name: "4.0L", modelId: "m1" }];
  const features = [{ id: "ft1", name: "فتحة سقف", modelId: "m1" }, { id: "ft2", name: "كاميرات 360", modelId: "m1" }, { id: "ft3", name: "ثلاجة", modelId: "m1" }];
  const customsOptions = [{ id: "c1", name: "مجمرك" }, { id: "c2", name: "شحن" }];
  const categories = [{ id: "cat1", name: "سيارات مستعملة" }, { id: "cat2", name: "سيارات جديدة" }];
  const statusOptions = [{ id: "st1", name: "في المعرض" }, { id: "st2", name: "في الطريق" }];

  const filteredModels = models.filter(m => m.brandId === selectedBrand.id);
  const filteredTrims = trims.filter(t => t.modelId === selectedModel.id);
  const filteredFuel = fuelTypes.filter(f => f.modelId === selectedModel.id);
  const filteredTrans = transmissions.filter(t => t.modelId === selectedModel.id);
  const filteredDrive = driveTypes.filter(d => d.modelId === selectedModel.id);
  const filteredEngType = engineTypes.filter(e => e.modelId === selectedModel.id);
  const filteredEngSize = engineSizes.filter(s => s.modelId === selectedModel.id);
  const filteredFeatures = features.filter(f => f.modelId === selectedModel.id);

  const pickImages = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, allowsMultipleSelection: true, quality: 1 });
    if (!result.canceled) setImages([...images, ...result.assets.map(asset => asset.uri)]);
  };

  const pickVideo = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Videos, allowsEditing: true, quality: 1 });
    if (!result.canceled) setVideo(result.assets[0].uri);
  };

  const pickDocument = async () => {
    const result = await DocumentPicker.getDocumentAsync({ type: ["application/pdf", "image/*"], multiple: true });
    if (!result.canceled) setDocuments([...documents, ...result.assets.map(asset => ({ name: asset.name, uri: asset.uri }))]);
  };

  const importContact = async () => {
    const { status } = await Contacts.requestPermissionsAsync();
    if (status === "granted") {
      const { data } = await Contacts.getContactsAsync({ fields: [Contacts.Fields.PhoneNumbers] });
      if (data.length > 0) {
        const contact = data[0];
        if (contact.phoneNumbers && contact.phoneNumbers.length > 0) {
          setOwnerPhone(contact.phoneNumbers[0].number || "");
          if (contact.name) setOwnerName(contact.name);
        }
      }
    }
  };

  const handleVinChange = (text: string) => {
    const filteredText = text.replace(/[^a-zA-Z0-9]/g, "").toUpperCase();
    setVin(filteredText);
  };

  const toggleFeature = (id: string) => {
    if (selectedFeatures.includes(id)) {
      setSelectedFeatures(selectedFeatures.filter(f => f !== id));
    } else {
      setSelectedFeatures([...selectedFeatures, id]);
    }
  };

  return (
    <View className="flex-1 bg-background">
      {/* App Bar */}
      <View className="bg-background border-b border-border px-4 py-2" style={{ paddingTop: insets.top + 8, paddingBottom: 12 }}>
        <View className="flex-row items-center justify-between">
          <Pressable onPress={() => router.back()} style={({ pressed }) => [{ opacity: pressed ? 0.6 : 1 }]}>
            <MaterialIcons name="arrow-back" size={24} color={colors.primary} />
          </Pressable>
          <Text className="text-lg font-bold text-foreground" style={{ fontFamily: "Cairo" }}>إضافة سيارة</Text>
          <View style={{ width: 24 }} />
        </View>
      </View>

      <ScreenContainer className="flex-1 p-0">
        <ScrollView className="flex-1" contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 20 }}>
          
          {/* قسم المرفقات والوسائط */}
          <FormSection title="المرفقات والوسائط" icon="collections">
            <View className="flex-row gap-4 mb-6">
              <Pressable onPress={pickImages} className="flex-1 aspect-square bg-background border border-dashed border-border rounded-2xl items-center justify-center">
                <MaterialIcons name="add-a-photo" size={32} color={colors.primary} />
                <Text className="text-[10px] text-muted mt-2" style={{ fontFamily: "Cairo" }}>إضافة صور</Text>
              </Pressable>
              <Pressable onPress={pickVideo} className="flex-1 aspect-square bg-background border border-dashed border-border rounded-2xl items-center justify-center">
                <MaterialIcons name="video-call" size={32} color={colors.primary} />
                <Text className="text-[10px] text-muted mt-2" style={{ fontFamily: "Cairo" }}>إضافة فيديو</Text>
              </Pressable>
              <Pressable onPress={pickDocument} className="flex-1 aspect-square bg-background border border-dashed border-border rounded-2xl items-center justify-center">
                <MaterialIcons name="note-add" size={32} color={colors.primary} />
                <Text className="text-[10px] text-muted mt-2" style={{ fontFamily: "Cairo" }}>إضافة مستندات</Text>
              </Pressable>
            </View>
            {/* معاينة المرفقات */}
            {images.length > 0 && (
              <View className="mb-4">
                <Text className="text-xs text-muted mb-2" style={{ fontFamily: "Cairo" }}>الصور المرفوعة ({images.length})</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row gap-2">
                  {images.map((uri, index) => (
                    <View key={index} className="relative">
                      <Image source={{ uri }} className="w-20 h-20 rounded-xl" />
                      <Pressable onPress={() => setImages(images.filter((_, i) => i !== index))} className="absolute -top-1 -right-1 bg-error rounded-full p-0.5">
                        <MaterialIcons name="close" size={14} color="white" />
                      </Pressable>
                    </View>
                  ))}
                </ScrollView>
              </View>
            )}
          </FormSection>

          {/* بطاقة بيانات المالك */}
          <FormSection title="بيانات المالك" icon="person">
            <FormField label="اسم صاحب الطلب">
              <CustomTextInput value={ownerName} onChangeText={setOwnerName} placeholder="أدخل الاسم الكامل" icon="person-outline" />
            </FormField>
            <FormField label="رقم الهاتف">
              <CustomTextInput value={ownerPhone} onChangeText={setOwnerPhone} placeholder="05xxxxxxxx" keyboardType="phone-pad" icon="phone-iphone" rightIcon="contact-phone" onRightIconPress={importContact} />
            </FormField>
            <FormField label="العنوان">
              <CustomTextInput value={ownerAddress} onChangeText={setOwnerAddress} placeholder="المدينة، الحي" icon="location-on" />
            </FormField>
          </FormSection>

          {/* بطاقة البيانات الأساسية */}
          <FormSection title="البيانات الأساسية" icon="directions-car">
            <DropdownField label="الماركة" value={selectedBrand.name} placeholder="اختر الماركة" options={brands} onSelect={(id, name) => { setSelectedBrand({ id, name }); setSelectedModel({ id: "", name: "" }); setSelectedTrim({ id: "", name: "" }); }} />
            <DropdownField label="الموديل" value={selectedModel.name} placeholder="اختر الموديل" options={filteredModels} disabled={!selectedBrand.id} onSelect={(id, name) => { setSelectedModel({ id, name }); setSelectedTrim({ id: "", name: "" }); }} />
            <DropdownField label="الفئة" value={selectedTrim.name} placeholder="اختر الفئة" options={filteredTrims} disabled={!selectedModel.id} onSelect={(id, name) => setSelectedTrim({ id, name })} />
            
            <View className="flex-row gap-4">
              <View className="flex-1"><FormField label="سنة الصنع"><CustomTextInput value={selectedYear} onChangeText={setSelectedYear} placeholder="2024" keyboardType="numeric" icon="calendar-today" /></FormField></View>
              <View className="flex-1"><FormField label="العداد"><CustomTextInput value={mileage} onChangeText={setMileage} placeholder="0" keyboardType="numeric" icon="speed" /></FormField></View>
            </View>

            <View className="flex-row items-center justify-end gap-6 mt-1">
              <Pressable onPress={() => setMileageUnit("km")} className="flex-row items-center gap-2">
                <View className={`w-5 h-5 rounded-full border-2 items-center justify-center ${mileageUnit === "km" ? "border-primary" : "border-muted"}`}>{mileageUnit === "km" && <View className="w-2.5 h-2.5 rounded-full bg-primary" />}</View>
                <Text className="text-sm text-foreground" style={{ fontFamily: "Cairo" }}>كيلومتر</Text>
              </Pressable>
              <Pressable onPress={() => setMileageUnit("mile")} className="flex-row items-center gap-2">
                <View className={`w-5 h-5 rounded-full border-2 items-center justify-center ${mileageUnit === "mile" ? "border-primary" : "border-muted"}`}>{mileageUnit === "mile" && <View className="w-2.5 h-2.5 rounded-full bg-primary" />}</View>
                <Text className="text-sm text-foreground" style={{ fontFamily: "Cairo" }}>ميل</Text>
              </Pressable>
            </View>
          </FormSection>

          {/* بطاقة التفاصيل التقنية */}
          <FormSection title="التفاصيل التقنية" icon="settings">
            <DropdownField label="نوع الوقود" value={fuelType.name} placeholder="اختر نوع الوقود" options={filteredFuel} disabled={!selectedModel.id} onSelect={(id, name) => setFuelType({ id, name })} />
            <DropdownField label="ناقل الحركة" value={transmission.name} placeholder="اختر ناقل الحركة" options={filteredTrans} disabled={!selectedModel.id} onSelect={(id, name) => setTransmission({ id, name })} />
            <DropdownField label="نظام الدفع" value={driveType.name} placeholder="اختر نظام الدفع" options={filteredDrive} disabled={!selectedModel.id} onSelect={(id, name) => setDriveType({ id, name })} />
            <DropdownField label="نوع المحرك" value={engineType.name} placeholder="اختر نوع المحرك" options={filteredEngType} disabled={!selectedModel.id} onSelect={(id, name) => setEngineType({ id, name })} />
            <DropdownField label="حجم المحرك" value={engineSize.name} placeholder="اختر حجم المحرك" options={filteredEngSize} disabled={!selectedModel.id} onSelect={(id, name) => setEngineSize({ id, name })} />
          </FormSection>

          {/* بطاقة المواصفات الإضافية */}
          <FormSection title="المواصفات الإضافية" icon="add-circle-outline">
            <CheckboxField label="اختر المواصفات" options={filteredFeatures} selectedIds={selectedFeatures} onToggle={toggleFeature} disabled={!selectedModel.id} />
          </FormSection>

          {/* الحالة القانونية ورقم الشاصيه */}
          <FormSection title="الحالة القانونية ورقم الشاصيه" icon="verified">
            <DropdownField label="حالة الجمارك" value={customsStatus.name} placeholder="اختر الحالة" options={customsOptions} onSelect={(id, name) => setCustomsStatus({ id, name })} />
            <View className="flex-row gap-2">
              <View className="flex-1"><FormField label="رقم اللوحة"><CustomTextInput value={plateNumber} onChangeText={setPlateNumber} placeholder="1234" keyboardType="numeric" /></FormField></View>
              <View className="flex-1"><FormField label="رقم الفاصل"><CustomTextInput value={plateSeparator} onChangeText={setPlateSeparator} placeholder="أ ب ج" /></FormField></View>
              <View className="flex-1"><FormField label="نوع اللوحة"><CustomTextInput value={plateType} onChangeText={setPlateType} placeholder="خصوصي" /></FormField></View>
            </View>
            <FormField label="رقم الشاصيه (VIN)">
              <CustomTextInput value={vin} onChangeText={handleVinChange} placeholder="أدخل رقم الشاصيه" autoCapitalize="characters" maxLength={17} icon="qr-code-scanner" />
            </FormField>
          </FormSection>

          {/* التصنيف والموقع */}
          <FormSection title="التصنيف والموقع" icon="location-on">
            <DropdownField label="التصنيف" value={category.name} placeholder="اختر التصنيف" options={categories} onSelect={(id, name) => setCategory({ id, name })} />
            <DropdownField label="تتبع الحالة" value={statusTracking.name} placeholder="اختر الحالة" options={statusOptions} onSelect={(id, name) => setStatusTracking({ id, name })} />
          </FormSection>

          {/* بطاقة التسعيرة */}
          <FormSection title="بطاقة التسعيرة" icon="payments">
            <PricingField label="سعر الشراء" value={purchasePrice} onChangeText={setPurchasePrice} currency={purchaseCurrency} onCurrencyChange={setPurchaseCurrency} />
            <PricingField label="سعر البيع المطلوب" value={sellingPrice} onChangeText={setSellingPrice} currency={sellingCurrency} onCurrencyChange={setSellingCurrency} />
            <PricingField label="أدنى سعر للبيع" value={minSellingPrice} onChangeText={setMinSellingPrice} currency={minSellingCurrency} onCurrencyChange={setMinSellingCurrency} />
          </FormSection>

          {/* زر الحفظ النهائي */}
          <Pressable className="bg-primary rounded-2xl p-4 items-center justify-center shadow-md mb-10">
            <Text className="text-white font-bold text-lg" style={{ fontFamily: "Cairo" }}>حفظ بيانات السيارة</Text>
          </Pressable>

          <View style={{ height: 100 }} />
        </ScrollView>
      </ScreenContainer>
    </View>
  );
}
