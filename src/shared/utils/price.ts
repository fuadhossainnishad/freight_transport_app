// Shipment price is nullable on the backend — it stays null until a bid is
// accepted — so it can't be interpolated straight into a template string or it
// renders as "€null". Values also arrive as strings on some endpoints.
export const formatPrice = (price?: number | string | null): string => {
  if (price === null || price === undefined || price === "") return "—";

  const amount = typeof price === "number" ? price : Number(price);
  if (!Number.isFinite(amount)) return "—";

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};
