import React, { useState } from "react"
import { Text, TouchableOpacity } from "react-native"
import { useTranslation } from "react-i18next"
import { Calendar as CalendarIcon } from "lucide-react-native"
import CalendarModal from "./CalendarModal"
// English on purpose — this value is submitted to the API, not just displayed.
// See the module for why.
import { formatDateForWire } from "../utils/dateWireFormat"

type Props = {
  value?: string
  onChange: (display: string) => void
  placeholder?: string
}

export default function DatePickerField({ value, onChange, placeholder }: Props) {
  const { t } = useTranslation()
  const [open, setOpen] = useState(false)
  const [iso, setIso] = useState<string | null>(null)
  const resolvedPlaceholder = placeholder ?? t("components.datePicker.placeholder")

  return (
    <>
      <TouchableOpacity
        onPress={() => setOpen(true)}
        activeOpacity={0.8}
        className="flex-row items-center justify-between border border-gray-300 rounded-xl px-4 py-3.5 mb-4"
      >
        <Text className={`text-[15px] ${value ? "text-gray-900" : "text-gray-400"}`}>
          {value || resolvedPlaceholder}
        </Text>
        <CalendarIcon size={20} color="#036BB4" />
      </TouchableOpacity>

      <CalendarModal
        visible={open}
        selected={iso}
        onClose={() => setOpen(false)}
        onSelect={(isoDate) => {
          setIso(isoDate)
          onChange(formatDateForWire(isoDate))
          setOpen(false)
        }}
      />
    </>
  )
}
