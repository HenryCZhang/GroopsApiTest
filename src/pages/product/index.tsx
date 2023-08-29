import React from "react";
import { use, useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import Image from "next/image";
import useLocalStorageState from "use-local-storage-state";

import { LoadingSpinner } from "public/components/loading";
import { api } from "~/utils/api";
import { CurrencyFormatter } from "public/components/CurrencyFormatter";
import Cart from "../cart";

//define Product object type
export type Product = {
  skuid: string;
  category_id: number|null;
  description: string|null;
  english_product_name: string;
  chinese_product_name: string|null;
  french_product_name: string|null;
  cost_price: number|null;
  retail_price: number;
  stock: number;
  alcohol: boolean|null;
  alcohol_percentage: number|null;
  nutrition_fact: string|null;
  place_of_origin: string|null;
  product_weight: string|null;
  specification: string|null;
  primary_image_url: string;
  quantity: number|null;
};

export type Operation = 'decrease' | 'increase'
export interface CartProps {
  [productId: string]: Product;
}

const Product = () => {
  const { userId } = useAuth();
  const ctx = api.useContext();
  const [productsList, setProductsList] = useState<Product[]>([]); //use state to store products list
  const [cart, setCart] = useLocalStorageState<CartProps>("cart", {});
  const getProducts = () => Object.values(cart || {})
  const productsInCart = getProducts()

  //fetch products from api
  const {
    data: products,
    isLoading: loadingproducts,
    refetch,
  } = api.product.getAllProducts.useQuery();

  useEffect(() => {
    //get products list from api
    if (products) {
      setProductsList(products);
    }
  }, []);


  const addToCart = (product: Product):void => {
    if(isInCart(product.skuid)){
      handleUpdateQuantity(product.skuid,'increase')
    }
    else{
    product.quantity = 1
    setCart((prevCart) => ({
      ...prevCart,
      [product.skuid]: product,
    }))
  }
  }

  const reduceFromCart = (product: Product):void => {
    if(isInCart(product.skuid)){
      handleUpdateQuantity(product.skuid,'decrease')
    }
  }

  const handleUpdateQuantity = (productId: string, operation: Operation) => {
    setCart((prevCart) => {
      const updatedCart = { ...prevCart }
      if (updatedCart[productId]) {
        if (operation === 'increase') {
          updatedCart[productId] = { ...updatedCart[productId], quantity: (updatedCart[productId]!.quantity??0) + 1 } as Product;
        } else {
          updatedCart[productId] = { ...updatedCart[productId], quantity: (updatedCart[productId]!.quantity??0) - 1 } as Product;
          if((updatedCart[productId]!.quantity??0) <= 0) delete updatedCart[productId];
        }
      }
      return updatedCart
    })
  }

//use state to store cart
  const isInCart = (productId: string):boolean => Object.keys(cart || {}).includes(productId)


  const { mutate: addToCartMutation, isLoading: isAdding } =
    api.cart.addCartItem.useMutation({
      onSuccess: () => {
        void ctx.cart.getUserCartItems.invalidate();
      },
      onError: (e) => {
        console.log(e);
      },
    });

  const { mutate: reduceFromCartMutation, isLoading: isReducing } =
    api.cart.reduceCartItem.useMutation({
      onSuccess: () => {
        void ctx.cart.getUserCartItems.invalidate();
      },
      onError: (e) => {
        console.log(e);
      },
    });

    //add item to cart api
  const handleAddItem = async (skuid: string) => {
    if (!userId) return console.log("no user id");

    await addToCartMutation({
      user_Clerk_id: userId,
      product_id: skuid,
      quantity: 1,
    });
    refetch();
  };

      //reduce item from cart api
  const handleReduceItem = async (skuid: string) => {
    if (!userId) return console.log("no user id");

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
        products?.map((product, index) => (
          <div key={index} className="mt-3 w-32 border-rose-300 border-2">
            <div key={product.skuid}>
              <Image
                src={`https://api.gr-oops.com/${product.primary_image_url}`}
                alt={product.primary_image_url}
                width="100"
                height="100"
              />
              <p>{product.english_product_name}</p>
              <p>Price: <CurrencyFormatter amount={product.retail_price} /></p>
            </div>
            <div className="flex flex-row ">
            <button
              onClick={() => addToCart(product)}
              className="bg-rose-600 p-3 text-white"
            >
              +
            </button>
     
            <button
              onClick={() => reduceFromCart(product)}
              hidden={!isInCart(product.skuid)}
              className="ml-5 border-2 border-solid border-black p-3"
            >
              -
            </button>
            </div>
            {/* <button
              onClick={() => handleAddItem(product.skuid)}
              className="bg-rose-600 p-3 text-white"
            >
              +
            </button>
            <button
              onClick={() => handleReduceItem(product.skuid)}
              hidden={!isInCart(product.skuid)}
              className="ml-5 border-2 border-solid border-black p-3"
            >
              -
            </button> */}
          </div>
        ))
      )}
<Cart />
    </div>
  );
};

export default Product;
