/**
 * Format a menu price for display: `from €12/box`, `€4.50`, `28 Kč`.
 * Known currencies render with their symbol (prefixed or suffixed by convention);
 * anything else falls back to `<amount> <CODE>`. Add codes to CURRENCY below to
 * support more (must also be in the `currency` enum in the CMS cake/cafe schema).
 */
const CURRENCY: Record<string, { symbol: string; prefix: boolean }> = {
  EUR: { symbol: "€", prefix: true },
  USD: { symbol: "$", prefix: true },
};

export function formatPrice(p: {
  amount: number;
  currency: string;
  pricePrefix?: string;
  priceUnit?: string;
}): string {
  const n = Number(p.amount);
  const amount = Number.isInteger(n) ? String(n) : n.toFixed(2);
  const c = CURRENCY[p.currency];
  const money = c ? (c.prefix ? `${c.symbol}${amount}` : `${amount} ${c.symbol}`) : `${amount} ${p.currency}`;
  return `${p.pricePrefix ? `${p.pricePrefix} ` : ""}${money}${p.priceUnit ?? ""}`;
}
