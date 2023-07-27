import React from 'react'
import { use, useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { api } from "~/utils/api";
import { LoadingSpinner } from "public/components/loading";
import Image from "next/image";
import Cart from '../cart';

const Product = () => {  
    const { userId } = useAuth();
    const ctx = api.useContext();
    
    const {
    data: products,
    isLoading: loadingproducts,
    refetch,
  } = api.product.getAllProducts.useQuery();
 

  const { mutate: addToCartMutation, isLoading: isAdding } = api.cart.addCartItem.useMutation({
    onSuccess: () => {
      void ctx.cart.getUserCartItems.invalidate();
    },
    onError: (e) => {
        console.log(e);
    },
  });

  const { mutate: reduceFromCartMutation, isLoading: isReducing } = api.cart.reduceCartItem.useMutation({
    onSuccess: () => {
      void ctx.cart.getUserCartItems.invalidate();
    },
    onError: (e) => {
        console.log(e);
    },
  });


  const handleAddItem = async (skuid:string) => {
    if(!userId) return console.log('no user id')

    await addToCartMutation({
        user_Clerk_id: userId,
        product_id: skuid,
        quantity: 1,
        });
    refetch();
    };

    const handleReduceItem = async (skuid:string) => {
        if(!userId) return console.log('no user id')

        await reduceFromCartMutation({
            user_Clerk_id: userId,
            product_id: skuid,
            });
        refetch();
    };

  return (
    <div>
       {loadingproducts || isAdding || isReducing ? (
        <LoadingSpinner />
      ) : (
        products?.map((product,index) => (
            <div key={index}>
            <div key={product.skuid}>
                <Image src={`https://api.gr-oops.com/${product.primary_image_url}`} alt={product.primary_image_url} width="100" height="100"/>
                <p>{product.english_product_name}</p>
                <p>retail_price: ${product.retail_price}</p>
                </div>
                <button onClick={()=>handleAddItem(product.skuid)} className='p-3 bg-rose-600 text-white'>+</button>
                <button onClick={()=>handleReduceItem(product.skuid)} className='ml-5 p-3 border-solid border-black border-2'>-</button>
            </div>
        ))
        )}
        <Cart />
    </div>
  )
}


export default Product