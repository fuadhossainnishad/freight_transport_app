import React, { useRef } from "react";
import {
    View,
    TextInput,
    NativeSyntheticEvent,
    TextInputKeyPressEventData,
} from "react-native";

interface Props {
    value: string;
    onChange: (code: string) => void;
    length?: number;
    autoFocus?: boolean;
    error?: boolean;
}

/**
 * Segmented OTP input: `length` single-digit boxes that auto-advance as the
 * user types and step back on backspace. The combined code is reported through
 * `onChange`.
 */
export default function OtpInput({
    value,
    onChange,
    length = 4,
    autoFocus = true,
    error = false,
}: Props) {
    const inputs = useRef<Array<TextInput | null>>([]);
    const digits = Array.from({ length }, (_, i) => value[i] ?? "");

    // Shrink the boxes for longer codes so 6 digits still fit on narrow screens.
    const boxSize = length > 5 ? 46 : 56;
    const gap = length > 5 ? 8 : 12;

    const focusBox = (index: number) => {
        if (index >= 0 && index < length) inputs.current[index]?.focus();
    };

    const handleChange = (text: string, index: number) => {
        const clean = text.replace(/\D/g, "");

        // Support pasting / fast typing of multiple digits at once.
        if (clean.length > 1) {
            const next = (value.slice(0, index) + clean)
                .replace(/\D/g, "")
                .slice(0, length);
            onChange(next);
            focusBox(Math.min(next.length, length - 1));
            return;
        }

        const chars = digits.slice();
        chars[index] = clean;
        const next = chars.join("").slice(0, length);
        onChange(next);

        if (clean) focusBox(index + 1);
    };

    const handleKeyPress = (
        e: NativeSyntheticEvent<TextInputKeyPressEventData>,
        index: number,
    ) => {
        if (e.nativeEvent.key === "Backspace" && !digits[index] && index > 0) {
            const chars = digits.slice();
            chars[index - 1] = "";
            onChange(chars.join(""));
            focusBox(index - 1);
        }
    };

    return (
        <View style={{ flexDirection: "row", justifyContent: "center", gap }}>
            {digits.map((digit, index) => {
                const filled = !!digit;
                return (
                    <TextInput
                        key={index}
                        ref={(el) => {
                            inputs.current[index] = el;
                        }}
                        value={digit}
                        onChangeText={(t) => handleChange(t, index)}
                        onKeyPress={(e) => handleKeyPress(e, index)}
                        keyboardType="number-pad"
                        maxLength={length}
                        autoFocus={autoFocus && index === 0}
                        selectTextOnFocus
                        textAlign="center"
                        style={{ width: boxSize, height: 56, borderRadius: 16, fontSize: 20, fontWeight: "700", color: "#111827" }}
                        className={`border ${error
                                ? "border-red-400 bg-red-50"
                                : filled
                                    ? "border-[#036BB4] bg-[#036BB4]/5"
                                    : "border-gray-200 bg-gray-50"
                            }`}
                    />
                );
            })}
        </View>
    );
}
