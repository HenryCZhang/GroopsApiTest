import Head from "next/head";
import Link from "next/link";
import { api } from "~/utils/api";
import DeliveryAddress from "./api/address";

export default function Home() {

  return (
    <>

    <DeliveryAddress />
    </>
  );
}
