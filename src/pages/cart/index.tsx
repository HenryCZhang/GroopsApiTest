
import Slide from "@mui/material/Slide";
import Link from "next/link";
import { api } from "~/utils/api";
import React, {  FunctionComponent, useEffect  } from "react";
import { LoadingSpinner } from "public/components/loading";
import { useAuth } from "@clerk/nextjs";
import useLocalStorageState from 'use-local-storage-state'
import Image from "next/image";

import Product, { CartProps } from "../product";
import { CurrencyFormatter } from "public/components/CurrencyFormatter";
import router from "next/router";
import { GroupProps } from "../group";

interface rowProps{
  img_url:string,
  eng_name:string,
  retail_price:number,
  quantity:number
}
const Row = ({img_url,eng_name,retail_price,quantity}:rowProps) => (
  <Link href="/product/1">
    <div className="flex items-center justify-between p-5">
      <div className="flex items-center gap-x-3">
        <img src={`https://api.gr-oops.com/${img_url}`} className="w-1/3" />
        <div className="flex flex-col ">
          <p className="text-sm text-gray-400">company</p>
          <p className="text-lg ">{eng_name}</p>
          <p className="text-sm text-gray-800">$ {retail_price}</p>
        </div>
      </div>

      <p>x{quantity}</p>
    </div>
    <hr />
  </Link>
);

export type Operation = 'decrease' | 'increase'

const Cart = () => {
  const { userId } = useAuth();
  const ctx = api.useContext();
  const [cart, setCart] = useLocalStorageState<CartProps>('cart', {})//use local storage to store cart
  const [joinedGroupID, setJoinedGroupID] = useLocalStorageState<GroupProps>('joinedGroupID',{})

  //fretch cart from api
  const {
    data: cartItems,
    isLoading: loadingCart,
    refetch:refetchCartItems,
  } = api.cart.getUserCartItems.useQuery({user_Clerk_id: userId??''});

    //fretch joined group info from api
    const {
      data: joinedGroup,
      isLoading: loadingJoinedGroup,
      refetch:refetchJoinedGroup,
    } = api.group.getGroupById.useQuery({group_code: joinedGroupID?.group_code??''});
  

  // products info from local storage
  const getProducts = () => Object.values(cart || {})
  const productsInCart = getProducts()
  const total_items = productsInCart.reduce((accumulator, product) => accumulator +  product.quantity!, 0)
  const totalPrice = productsInCart.reduce((accumulator, product) => accumulator + (product.retail_price * product.quantity!), 0)

  const { mutate: placeOrderMutation, isLoading: isPlacingOrder } =
      api.order.createOrder.useMutation({
      onSuccess: () => {
        void ctx.order.getUserOrders.invalidate();
        //navigate to Order page
        router.push("/order");
      },
      onError: (e) => {
        console.log(e);
      },
    });

  const handlePlaceOrder = async () => {
    if (!userId) return console.log("no user id");
    await placeOrderMutation({
      user_Clerk_id: userId,
      products: productsInCart.map(product => ({
        product_skuid: product.skuid,
        quantity: product.quantity??0
      })),
      total_items,
      sub_total: totalPrice,
      group_code: joinedGroupID?.group_code??''
    })

    setCart({});
    setJoinedGroupID({group_code:''});
  }

  if(loadingJoinedGroup || loadingCart){
    return <LoadingSpinner />
  }

  return (
    <>
        <div className="fixed right-0 top-0 z-50 h-screen w-1/3 bg-white text-gray-800 shadow-xl">
          <h2 className="mt-3 text-center">Shopping Cart</h2>

          <hr className="mt-5" />

          <div className="flex gap-x-5 p-5">
            <div className="w-1/2">
              <p className="text-sm">groups you joined</p>
              <div className="mt-3 flex items-center gap-x-2">
               <Image src={`https://api.gr-oops.com/${joinedGroup?.primary_image_url}`} width={100} height={100} alt={`${joinedGroup?.primary_image_url}`}/>
                <div className="flex flex-col">
                  <p className="text-lg text-rose-600">{joinedGroup?.group_name}</p>
                  <div className="mt-2 flex gap-x-2">
                    <p className=" text-sm text-gray-400">21/50</p>
                    <p className="rounded bg-rose-600 px-2 text-sm text-white">
                      50 % off
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="w-1/2">
              <p className="text-sm">Ends in :</p>
              <div className="mt-5 flex gap-x-2">
                <div className="flex flex-col items-center">
                  <p className="text-3xl font-bold text-rose-600">03</p>
                  <p className="text-xs text-gray-400">Days</p>
                </div>
                <p className="text-3xl font-bold text-rose-600"> : </p>
                <div className="flex flex-col items-center">
                  <p className="text-3xl font-bold text-rose-600">07</p>
                  <p className="text-xs text-gray-400">Hour</p>
                </div>
                <p className="text-3xl font-bold text-rose-600"> : </p>
                <div className="flex flex-col items-center">
                  <p className="text-3xl font-bold text-rose-600">20</p>
                  <p className="text-xs text-gray-400">Minute</p>
                </div>
              </div>
            </div>
          </div>

          <hr className="mt-2" />

          <div className="mt-3 h-1/2 overflow-auto">
            { isPlacingOrder ? (
              <LoadingSpinner />
            ) : (
              //cart from api
              // cartItems?.map((item, index) => (
              //   <Row
              //     key={index}
              //     img_url={item.product.primary_image_url}
              //     eng_name={item.product.english_product_name}
              //     retial_price={item.product.retail_price}
              //     quantity={item.quantity}
              //   />
              // ))

              //cart from local storage
              <div>
              {productsInCart.length > 0 ? (
                /* JSX to render when products are in the cart */
                <div>
                  {productsInCart.map((product,index) => (
                 <Row
                  key={index}
                  img_url={product.primary_image_url}
                  eng_name={product.english_product_name}
                  retail_price={product.retail_price}
                  quantity={product.quantity??0}
                />
                  ))}

                 <p>Price: <CurrencyFormatter amount={totalPrice} /></p>

          <div className="mb-5 flex justify-center p-5">
            {joinedGroupID?.group_code ? (  <button className="w-[90%] rounded-lg bg-rose-600 p-3 text-white"
            onClick={handlePlaceOrder}>
              Place Order
            </button>) : (
            <Link href="/group" className="text-sm text-red-500">Please join a group first</Link>)}
          </div>
                </div>
              ) : (
                /* JSX to render when no products are in the cart */
                <div>
                  Cart is empty.
                </div>
              )}
            </div>
            )}

          </div>

        
        </div>
    </>
  );
};

export default Cart;
