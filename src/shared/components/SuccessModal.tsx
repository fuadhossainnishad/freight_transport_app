import React from "react"
import { Modal, View, Text, TouchableOpacity } from "react-native"
import { Check } from "lucide-react-native"

const BLUE = "#036BB4"
const GREEN = "#22C55E"

type Props = {
  visible: boolean
  title?: string
  message?: string
  buttonText?: string
  onClose: () => void
}

export default function SuccessModal({
  visible,
  title = "Success!",
  message,
  buttonText = "Done",
  onClose,
}: Props) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View className="flex-1 bg-black/40 items-center justify-center px-8">
        <View className="bg-white rounded-3xl px-6 pt-7 pb-6 w-full items-center">
          {/* Check badge */}
          <View
            style={{
              width: 76,
              height: 76,
              borderRadius: 38,
              backgroundColor: "rgba(34,197,94,0.12)",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <View
              style={{
                width: 54,
                height: 54,
                borderRadius: 27,
                backgroundColor: GREEN,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Check size={30} color="#fff" strokeWidth={3} />
            </View>
          </View>

          <Text className="text-xl font-bold text-gray-900 mt-5 text-center">{title}</Text>

          {message ? (
            <Text className="text-sm text-gray-500 mt-2 text-center leading-5">{message}</Text>
          ) : null}

          <TouchableOpacity
            onPress={onClose}
            activeOpacity={0.85}
            style={{ backgroundColor: BLUE }}
            className="w-full rounded-full py-3.5 mt-6"
          >
            <Text className="text-white text-center font-semibold text-base">{buttonText}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  )
}
