import React from 'react'
import { api } from "~/utils/api";
import { LoadingSpinner } from "public/components/loading";
import Image from "next/image";

const AdminProduct = () => {  
    const ctx = api.useContext();
    
    const {
    data: products,
    isLoading: loadingproducts,
    refetch,
  } = api.product.getAllProducts.useQuery();
 

  const { mutate: deleteProductMutation, isLoading: isDeleting } = api.product.deleteProduct.useMutation({
    onSuccess: () => {
      void ctx.product.getAllProducts.invalidate();
    },
    onError: (e) => {
        console.log(e);
    },
  });


  const handleDeleteItem = async (skuid:string) => {

    await deleteProductMutation({
        skuid: skuid,
        });
    refetch();
    };

    return(
      <LoadingSpinner/>
    )

  return (
    <div>
       {loadingproducts || isDeleting ? (
        <LoadingSpinner />
      ) : (
        products?.map((product,index) => (
            <div key={index}>
            <div key={product.skuid}>
                <Image src={`https://api.gr-oops.com/${product.primary_image_url}`} alt={product.primary_image_url} width="100" height="100"/>
                <p>{product.english_product_name}</p>
                <p>retail_price: ${product.retail_price}</p>
                </div>
                <button className='p-3 bg-rose-600 text-white' onClick={() => handleDeleteItem(product.skuid)}>Delete</button>
            </div>
        ))
        )}
    </div>
  )
}


export default AdminProduct