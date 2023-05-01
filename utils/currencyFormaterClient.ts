interface CurrencyFormaterClientProps {
    amount: number,
    currency?: string
}
export const currencyFormaterClient =  ({
    amount,
    currency = "USD"
}: CurrencyFormaterClientProps) => {
   let toreturn=`$${amount}`
    return `${toreturn}`;
}