import { FunctionComponent } from 'react'

interface Props {
  amount: number
}

export const CurrencyFormatter: FunctionComponent<Props> = ({ amount }) => {
  const formattedAmount = amount.toLocaleString('en-GB', {
    style: 'currency',
    currency: 'CAD'
  })

  return <span className="">{formattedAmount}</span>
}
