type PriceProps = {
  amount: number | string;
  currency: string;
};

export const usePrice = ({amount, currency}: PriceProps) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(Number(amount));
};
