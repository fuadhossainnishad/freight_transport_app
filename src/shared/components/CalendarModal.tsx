import React from "react"
import { Modal, View, Text, TouchableOpacity } from "react-native"
import { X } from "lucide-react-native"
import { Calendar } from "react-native-calendars"

const BLUE = "#036BB4"

type Props = {
  visible: boolean
  /** Currently selected date as "YYYY-MM-DD", or null. */
  selected?: string | null
  /** Disable dates before today. Defaults to true. */
  minToday?: boolean
  onClose: () => void
  onSelect: (isoDate: string) => void
}

const todayISO = () => {
  const d = new Date()
  d.setHours(0, 0, 0, 0)
  const tz = d.getTimezoneOffset() * 60000
  return new Date(d.getTime() - tz).toISOString().slice(0, 10)
}

export default function CalendarModal({
  visible,
  selected,
  minToday = true,
  onClose,
  onSelect,
}: Props) {
  const today = todayISO()

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <TouchableOpacity activeOpacity={1} onPress={onClose} className="flex-1 bg-black/40 justify-center px-6">
        <TouchableOpacity activeOpacity={1} className="bg-white rounded-3xl p-3 overflow-hidden">
          {/* Header */}
          <View className="flex-row items-center justify-between px-2 pt-1 pb-2">
            <Text className="text-base font-bold text-gray-900">Select date</Text>
            <TouchableOpacity onPress={onClose} className="w-8 h-8 rounded-full items-center justify-center">
              <X size={18} color="#9ca3af" />
            </TouchableOpacity>
          </View>

          <Calendar
            current={selected || today}
            minDate={minToday ? today : undefined}
            onDayPress={(day: { dateString: string }) => onSelect(day.dateString)}
            markedDates={
              selected
                ? { [selected]: { selected: true, selectedColor: BLUE } }
                : undefined
            }
            enableSwipeMonths
            theme={{
              todayTextColor: BLUE,
              arrowColor: BLUE,
              monthTextColor: "#0F172A",
              textMonthFontWeight: "700",
              textDayFontWeight: "500",
              textDayHeaderFontWeight: "600",
              textSectionTitleColor: "#94a3b8",
              dayTextColor: "#1f2937",
              textDisabledColor: "#d1d5db",
              selectedDayBackgroundColor: BLUE,
              selectedDayTextColor: "#ffffff",
            }}
          />

          {/* Footer */}
          <View className="flex-row justify-end items-center px-2 py-2">
            <TouchableOpacity onPress={() => onSelect(today)} className="px-3 py-1.5">
              <Text className="text-sm font-semibold" style={{ color: BLUE }}>Today</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  )
}
