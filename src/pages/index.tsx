import Head from "next/head";
import Link from "next/link";
import { api } from "~/utils/api";
import DeliveryAddress from "./address";
import Cart from "./cart";
import Product from "./product";


export default function Home() {

  return (
    <>
    <Product />
    </>
  );
}
