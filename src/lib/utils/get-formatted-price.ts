export const getFormattedPrice = (amount: number, currency: string) => {
  const formatted = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency,
  }).format(amount);

  return formatted;
};
