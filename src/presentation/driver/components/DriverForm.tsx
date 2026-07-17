// components/driver/DriverForm.tsx

import React from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { Control, Controller, UseFormSetValue, UseFormWatch } from "react-hook-form";
import { useTranslation } from "react-i18next";
import FormInput from "../../../shared/components/FormInput";
import UploadField from "../../../shared/components/UploadField";
import PhoneNumberInput from "../../../shared/components/PhoneNumberInput";
import CountryPicker from "../../../shared/components/CountryPicker";
import { Country } from "../../../domain/constants/countries";

const PRIMARY = "#036BB4";

export interface DriverFormValues {
    transporter_id: string;
    name: string;
    phone: string;
    email: string;
    country: string;
    profilePicture: string[];
    driverLicense: string[];
}

interface Props {
    control: Control<DriverFormValues>;
    watch: UseFormWatch<DriverFormValues>;
    setValue: UseFormSetValue<DriverFormValues>;

    /** Selected country — drives both the phone prefix/flag and the Country field. */
    country: Country;
    onCountryChange: (country: Country) => void;
    phoneError?: boolean;

    onSubmit: () => void;
    onCancel?: () => void;
    onRemove?: () => void;
    isEdit?: boolean;
    loading?: boolean;
}

const Label = ({ children, required }: { children: React.ReactNode; required?: boolean }) => (
    <Text className="text-sm font-medium text-gray-700 mb-2">
        {children}
        {required ? <Text className="text-red-500"> *</Text> : null}
    </Text>
);

const SectionCard: React.FC<{ title: string; subtitle?: string; children: React.ReactNode }> = ({
    title,
    subtitle,
    children,
}) => (
    <View className="bg-white rounded-2xl px-4 pt-4 pb-1 mb-4 border border-gray-100">
        <Text className="text-base font-semibold text-gray-900">{title}</Text>
        {subtitle ? (
            <Text className="text-xs text-gray-500 mt-0.5 mb-4">{subtitle}</Text>
        ) : (
            <View className="mb-4" />
        )}
        {children}
    </View>
);

export default function DriverForm({
    control,
    watch,
    setValue,
    country,
    onCountryChange,
    phoneError = false,
    onSubmit,
    onCancel,
    onRemove,
    isEdit = false,
    loading = false,
}: Props) {
    const { t } = useTranslation();
    const profilePicture = watch("profilePicture") || [];
    const driverLicense = watch("driverLicense") || [];

    return (
        <ScrollView
            className="flex-1 bg-gray-50"
            keyboardDismissMode="on-drag"
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={{ padding: 16, paddingBottom: 32 }}
        >
            {/* ================= DRIVER DETAILS ================= */}
            <SectionCard
                title={t("driver.form.detailsTitle")}
                subtitle={t("driver.form.detailsSubtitle")}
            >
                <FormInput
                    control={control}
                    name="name"
                    label={t("driver.form.nameLabel")}
                    placeholder={t("driver.form.namePlaceholder")}
                    required
                    rules={{
                        required: t("validation.nameRequired"),
                        minLength: { value: 2, message: t("validation.nameInvalid") },
                    }}
                />

                {/* Phone — prefix/flag driven by the selected country */}
                <View className="mb-5">
                    <Label required>{t("driver.form.phoneLabel")}</Label>
                    <Controller
                        control={control}
                        name="phone"
                        render={({ field: { onChange, value } }) => (
                            <PhoneNumberInput
                                country={country}
                                value={value ?? ""}
                                onChangeText={onChange}
                                onCountryChange={onCountryChange}
                                error={phoneError}
                            />
                        )}
                    />
                    {/* Two complete sentences rather than gluing fragments —
                        French word order will not survive concatenation. */}
                    {phoneError ? (
                        <Text className="text-red-500 text-xs mt-1">
                            {country.phoneLengths.length
                                ? t("driver.form.phoneInvalidWithDigits", {
                                    country: country.name,
                                    lengths: country.phoneLengths.join(t("common.or")),
                                })
                                : t("driver.form.phoneInvalid", { country: country.name })}
                        </Text>
                    ) : null}
                </View>

                <FormInput
                    control={control}
                    name="email"
                    label={t("driver.form.emailLabel")}
                    placeholder={t("driver.form.emailPlaceholder")}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    rules={{
                        pattern: {
                            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                            message: t("validation.emailInvalid"),
                        },
                    }}
                />

                {/* Country — selecting updates the phone prefix automatically */}
                <View className="mb-1">
                    <Label required>{t("driver.form.countryLabel")}</Label>
                    <CountryPicker value={country} onChange={onCountryChange} />
                </View>
            </SectionCard>

            {/* ================= DOCUMENTS ================= */}
            <SectionCard
                title={t("driver.form.documentsTitle")}
                subtitle={t("driver.form.documentsSubtitle")}
            >
                <View className="flex-row gap-3">
                    <View className="flex-1">
                        <UploadField
                            label={t("driver.form.profilePicture")}
                            files={profilePicture}
                            onPress={(files) => setValue("profilePicture", files)}
                        />
                    </View>
                    <View className="flex-1">
                        <UploadField
                            label={t("driver.form.driverLicense")}
                            files={driverLicense}
                            onPress={(files) => setValue("driverLicense", files)}
                        />
                    </View>
                </View>
            </SectionCard>

            {/* ================= REMOVE (edit only) ================= */}
            {isEdit && onRemove && (
                <TouchableOpacity
                    onPress={onRemove}
                    disabled={loading}
                    className="items-center py-3 mb-2"
                >
                    <Text className="text-red-500 font-semibold">{t("driver.form.removeDriver")}</Text>
                </TouchableOpacity>
            )}

            {/* ================= ACTIONS ================= */}
            <View className="flex-row gap-3 mt-1">
                {onCancel && (
                    <TouchableOpacity
                        onPress={onCancel}
                        disabled={loading}
                        className="flex-1 border border-gray-300 py-4 rounded-full"
                    >
                        <Text className="text-center font-semibold text-gray-700">{t("common.cancel")}</Text>
                    </TouchableOpacity>
                )}

                <TouchableOpacity
                    onPress={onSubmit}
                    disabled={loading}
                    style={{ backgroundColor: PRIMARY, opacity: loading ? 0.7 : 1 }}
                    className="flex-1 py-4 rounded-full"
                >
                    <Text className="text-center font-semibold text-white">
                        {loading
                            ? isEdit
                                ? t("driver.form.saving")
                                : t("driver.form.adding")
                            : isEdit
                                ? t("driver.form.saveChanges")
                                : t("driver.form.addDriver")}
                    </Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}
