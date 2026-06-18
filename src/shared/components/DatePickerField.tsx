import React, { useState } from "react"
import { Text, TouchableOpacity } from "react-native"
import { Calendar as CalendarIcon } from "lucide-react-native"
import CalendarModal from "./CalendarModal"

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
]

// "2026-06-25" -> "25 June 2026"
const formatISO = (iso: string) => {
  const [y, m, d] = iso.split("-").map(Number)
  return `${d} ${MONTHS[m - 1]} ${y}`
}

type Props = {
  value?: string
  onChange: (display: string) => void
  placeholder?: string
}

export default function DatePickerField({ value, onChange, placeholder = "Select a date" }: Props) {
  const [open, setOpen] = useState(false)
  const [iso, setIso] = useState<string | null>(null)

  return (
    <>
      <TouchableOpacity
        onPress={() => setOpen(true)}
        activeOpacity={0.8}
        className="flex-row items-center justify-between border border-gray-300 rounded-xl px-4 py-3.5 mb-4"
      >
        <Text className={`text-[15px] ${value ? "text-gray-900" : "text-gray-400"}`}>
          {value || placeholder}
        </Text>
        <CalendarIcon size={20} color="#036BB4" />
      </TouchableOpacity>

      <CalendarModal
        visible={open}
        selected={iso}
        onClose={() => setOpen(false)}
        onSelect={(isoDate) => {
          setIso(isoDate)
          onChange(formatISO(isoDate))
          setOpen(false)
        }}
      />
    </>
  )
}
