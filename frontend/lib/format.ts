export function formatRupiah(amount: number | string): string {
  const numericAmount = typeof amount === "string" ? Number(amount) : amount;

  if (isNaN(numericAmount)) return "Rp 0";

  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(numericAmount);
}
