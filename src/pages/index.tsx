import Head from "next/head";
import Link from "next/link";
import { api } from "~/utils/api";

export default function Home() {

  const { data: addressData, isLoading: loadingData } =
  api.address.getAllAddresses.useQuery();

  return (
    <>
    {loadingData ? (
      <div>Loading...</div>
    ):(
      addressData?.map((address) => (
        <div key={address.id}>
          <h1>address id: {address.id}</h1>
          <h1>{address.street}</h1>
         <h1>{address.city}</h1>
         <h1>{address.state}</h1>
        </div>
      ))
    )}
    </>
  );
}
