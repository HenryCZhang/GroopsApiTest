import { FunctionComponent } from 'react'
import Image from 'next/image';
import Link from 'next/link'

import shoppingCart from '../assets/shopping-cart.svg' 

interface Props {
  productsCount: number
}

export const CartWidget: FunctionComponent<Props> = ({ productsCount }) => {

  return (
    <Link className='flex flex-row items-center justify-between ' href="/cart">
    <Image
      priority
      src={shoppingCart}
      alt="Follow us on Twitter"
    />
      <span className="text-black no-underline">{productsCount}</span>
    </Link>
  )
}
