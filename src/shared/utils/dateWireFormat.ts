/**
 * The month names below are deliberately NOT translated.
 *
 * `formatDateForWire`'s output is what DatePickerField emits from onChange, and
 * callers store it as a form value that is POSTed verbatim — see
 * `date_preference` in shipper/screens/CreateShipmentScreen.tsx, which appends
 * every form field straight onto FormData. Translating these would silently
 * start sending French dates to the backend and change stored data.
 *
 * To localise the date shown to the user, emit the ISO string and format it at
 * render time; do not translate this module.
 */
const WIRE_FORMAT_MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
]

/** "2026-06-25" -> "25 June 2026" */
export const formatDateForWire = (iso: string) => {
  const [y, m, d] = iso.split("-").map(Number)
  return `${d} ${WIRE_FORMAT_MONTHS[m - 1]} ${y}`
}
