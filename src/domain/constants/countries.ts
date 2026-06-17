// West-African (ECOWAS region) countries served by the app.
// Order mirrors the product's country list. `dialCode` drives the phone
// prefix, and `phoneLengths` lists the accepted national-number digit counts
// used for phone validation. `code` is the ISO-3166 alpha-2 (lowercase) used
// to build a flag image URL — Android does not render flag emoji, so we use
// flag images instead.

export interface Country {
  name: string;
  code: string;        // ISO-3166 alpha-2, lowercase (e.g. "ng")
  dialCode: string;    // e.g. "+234"
  phoneLengths: number[]; // accepted national-number lengths (digits, no dial code)
}

export const COUNTRIES: Country[] = [
  { name: "Burkina Faso", code: "bf", dialCode: "+226", phoneLengths: [8] },
  { name: "Niger", code: "ne", dialCode: "+227", phoneLengths: [8] },
  { name: "Mali", code: "ml", dialCode: "+223", phoneLengths: [8] },
  { name: "Côte d'Ivoire", code: "ci", dialCode: "+225", phoneLengths: [10] },
  { name: "Togo", code: "tg", dialCode: "+228", phoneLengths: [8] },
  { name: "Benin", code: "bj", dialCode: "+229", phoneLengths: [8, 10] },
  { name: "Ghana", code: "gh", dialCode: "+233", phoneLengths: [9] },
  { name: "Senegal", code: "sn", dialCode: "+221", phoneLengths: [9] },
  { name: "Mauritania", code: "mr", dialCode: "+222", phoneLengths: [8] },
  { name: "Guinea-Bissau", code: "gw", dialCode: "+245", phoneLengths: [7, 9] },
  { name: "Guinea", code: "gn", dialCode: "+224", phoneLengths: [8, 9] },
  { name: "Sierra Leone", code: "sl", dialCode: "+232", phoneLengths: [8] },
  { name: "Liberia", code: "lr", dialCode: "+231", phoneLengths: [7, 8, 9] },
  { name: "Gambia", code: "gm", dialCode: "+220", phoneLengths: [7] },
  { name: "Nigeria", code: "ng", dialCode: "+234", phoneLengths: [10] },
];

// Default selection (matches the design).
export const DEFAULT_COUNTRY =
  COUNTRIES.find((c) => c.code === "bj") ?? COUNTRIES[0];

// Flag image URL for a given ISO-2 country code.
export const flagUrl = (code: string) => `https://flagcdn.com/w40/${code}.png`;

// True when `nationalNumber` (digits only, no dial code) is a valid length
// for the given country.
export const isValidPhoneForCountry = (
  country: Country | null | undefined,
  nationalNumber: string,
): boolean => {
  if (!country) return false;
  const digits = nationalNumber.replace(/\D/g, "").replace(/^0+/, "");
  return country.phoneLengths.includes(digits.length);
};
