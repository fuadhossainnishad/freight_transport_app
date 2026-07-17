import React from "react"
import { Text, TextInput, TouchableOpacity, View } from "react-native"
import { Controller, Control } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { Check, ShieldCheck, Send } from "lucide-react-native"
import LocationPickerInput, { LatLng } from "../../../shared/components/LocationPickerInput"
import DatePickerField from "../../../shared/components/DatePickerField"

type Props = {
  control: Control<any>
  pickupCoord: LatLng | null
  deliveryCoord: LatLng | null
  setPickupCoord: (c: LatLng | null) => void
  setDeliveryCoord: (c: LatLng | null) => void
}

const Label = ({ children, required }: { children: string; required?: boolean }) => (
  <Text className="text-sm font-semibold text-gray-700 mb-1.5">
    {children}
    {required && <Text className="text-red-500"> *</Text>}
  </Text>
)

const inputClass = "border border-gray-300 rounded-xl px-4 py-3.5 text-[15px] text-gray-900 mb-4"

const BLUE = "#036BB4"

// Bordered toggle card used for the optional add-on services.
const ServiceToggle = ({
  control,
  name,
  label,
  icon,
}: {
  control: Control<any>
  name: string
  label: string
  icon: React.ReactNode
}) => (
  <Controller
    control={control}
    name={name}
    render={({ field: { onChange, value } }) => (
      <TouchableOpacity
        onPress={() => onChange(!value)}
        activeOpacity={0.8}
        style={{
          flex: 1,
          flexDirection: "row",
          alignItems: "center",
          paddingHorizontal: 14,
          paddingVertical: 14,
          borderRadius: 14,
          borderWidth: 1.5,
          borderColor: value ? BLUE : "#D1D5DB",
          backgroundColor: value ? "rgba(3,107,180,0.06)" : "#fff",
        }}
      >
        {/* Checkbox */}
        <View
          style={{
            width: 22,
            height: 22,
            borderRadius: 6,
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: value ? BLUE : "transparent",
            borderWidth: value ? 0 : 1.5,
            borderColor: "#D1D5DB",
          }}
        >
          {value ? <Check size={15} color="#fff" strokeWidth={3} /> : null}
        </View>

        {/* Icon */}
        <View style={{ marginLeft: 10 }}>{icon}</View>

        {/* Label takes the remaining space so it never reaches the border */}
        <Text
          numberOfLines={1}
          style={{
            flex: 1,
            marginLeft: 8,
            fontSize: 14,
            fontWeight: "600",
            color: value ? BLUE : "#374151",
          }}
        >
          {label}
        </Text>
      </TouchableOpacity>
    )}
  />
)

export default function DeliveryDetails({
  control,
  pickupCoord,
  deliveryCoord,
  setPickupCoord,
  setDeliveryCoord,
}: Props) {
  const { t } = useTranslation()

  return (
    <View className="px-5">
      <Text className="text-sm text-gray-500 mb-5">{t("shipper.delivery.intro")}</Text>

      <Controller
        control={control}
        name="pickup_address"
        render={({ field: { onChange, value } }) => (
          <LocationPickerInput
            label={t("shipper.delivery.pickupLabel")}
            placeholder={t("shipper.delivery.pickupPlaceholder")}
            address={value || ""}
            coord={pickupCoord}
            onChange={(addr, c) => {
              onChange(addr)
              setPickupCoord(c)
            }}
          />
        )}
      />

      <Label required>{t("shipper.delivery.timeWindowLabel")}</Label>
      <Controller
        control={control}
        name="time_window"
        render={({ field: { onChange, value } }) => (
          <TextInput
            className={inputClass}
            placeholder={t("shipper.delivery.timeWindowPlaceholder")}
            placeholderTextColor="#9ca3af"
            value={value}
            onChangeText={onChange}
          />
        )}
      />

      <Controller
        control={control}
        name="delivery_address"
        render={({ field: { onChange, value } }) => (
          <LocationPickerInput
            label={t("shipper.delivery.deliveryLabel")}
            placeholder={t("shipper.delivery.deliveryPlaceholder")}
            address={value || ""}
            coord={deliveryCoord}
            onChange={(addr, c) => {
              onChange(addr)
              setDeliveryCoord(c)
            }}
          />
        )}
      />

      <Label required>{t("shipper.delivery.contactLabel")}</Label>
      <Controller
        control={control}
        name="contact_person"
        render={({ field: { onChange, value } }) => (
          <TextInput
            className={inputClass}
            placeholder={t("shipper.delivery.contactPlaceholder")}
            placeholderTextColor="#9ca3af"
            value={value}
            onChangeText={onChange}
            keyboardType="phone-pad"
          />
        )}
      />

      <Label required>{t("shipper.delivery.dateLabel")}</Label>
      <Controller
        control={control}
        name="date_preference"
        render={({ field: { onChange, value } }) => (
          // No placeholder prop: DatePickerField supplies its own translated
          // default. Its formatted output stays English on purpose — it is
          // submitted as `date_preference`. See shared/utils/dateWireFormat.
          <DatePickerField value={value} onChange={onChange} />
        )}
      />

      {/* Additional services */}
      <Label>{t("shipper.delivery.additionalServices")}</Label>
      <View style={{ flexDirection: "row", gap: 12 }}>
        <ServiceToggle
          control={control}
          name="insurance"
          label={t("shipper.delivery.insurance")}
          icon={<ShieldCheck size={16} color="#036BB4" />}
        />
        <ServiceToggle
          control={control}
          name="forwarding"
          label={t("shipper.delivery.forwarding")}
          icon={<Send size={15} color="#036BB4" />}
        />
      </View>
    </View>
  )
}
