import Head from "next/head";
import Link from "next/link";
import { api } from "~/utils/api";
import DeliveryAddress from "./api/address";

export default function Home() {

  const { data: addressData, isLoading: loadingData } =
  api.address.getAllAddresses.useQuery();

  return (
    <>

    <DeliveryAddress />
    </>
  );
}
