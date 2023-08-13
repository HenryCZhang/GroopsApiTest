import Link from "next/link";
import { useAuth } from "@clerk/nextjs";
import Image from "next/image";

import { api } from "~/utils/api";
import { LoadingSpinner } from "public/components/loading";
import { CurrencyFormatter } from "public/components/CurrencyFormatter";
import { useState } from "react";

const Orders = () => {
  const { userId } = useAuth();
  const ctx = api.useContext();
  const [loading, setLoading] = useState(false);

  const {
    data: orders,
    isLoading: loadingOrders,
    refetch,
  } = api.order.getUserOrders.useQuery({
    user_Clerk_id: userId ?? "",
  });

  const { mutate: deleteOrderMutation, isLoading: isPlacingOrder } =
    api.order.deleteOrder.useMutation({
      onSuccess: () => {
        void ctx.order.getUserOrders.invalidate();
        refetch();
        setLoading(false);
      },
      onError: (e) => {
        console.log(e);
      },
    });

  const handleCancelOrder = async (id: number) => {
    setLoading(true);
    await deleteOrderMutation({ id });
  };

  const Selector = () => (
    <div className="flex flex-row items-center justify-center gap-x-2 ">
      <select
        id="small"
        className="rounded-lg border border-gray-300 bg-gray-50 p-2 text-gray-900"
      >
        <option defaultValue={3} value={3}>
          Past 3 months
        </option>
      </select>
    </div>
  );

  const Filter = ({ label }: { label: string }) => (
    <button>
      <p
        className="rounded-full border border-gray-200 
                    bg-white px-5 py-1 text-gray-600"
      >
        {label}
      </p>
    </button>
  );

  const Order = () => (
    <>
      {orders?.map((order) => (
        <div className="mt-10 w-full bg-white p-5" key={order.id}>
          <div className="flex justify-between">
            <div className="flex gap-x-5">
              <Image
                src={`https://api.gr-oops.com/${order.group?.primary_image_url}`}
                width={100}
                height={100}
                alt={`${order.group?.primary_image_url}`}
              />
              <div className="flex flex-col justify-center">
                <p className="">group joined</p>
                <p className="text-gray-400">{order.group?.group_name}</p>
              </div>
            </div>

            <div className="flex gap-x-10">
              <div className="flex flex-col">
                <p className="text-gray-400">Order placed</p>
                <div className="">
                  {" "}
                  {order.order_date ? (
                    <p>{order.order_date.toDateString()}</p>
                  ) : (
                    <p>No order date available</p>
                  )}
                </div>
              </div>

              <div className="flex flex-col">
                <p className="text-gray-400">Order #</p>
                <p className="">{order.id}</p>
              </div>
            </div>
          </div>
          <hr className="mt-3" />

          <div className="flex w-full gap-x-10">
            <div className="grid w-1/2 grid-cols-5 gap-3 p-3">
              {order.products?.map((product, index) => (
                <div key={index}>
                  <Image
                    src={`https://api.gr-oops.com/${product.primary_image_url}`}
                    alt="product"
                    width={100}
                    height={100}
                    // layout="responsive"
                    objectFit="cover"
                    className="h-28 w-36" // Apply additional Tailwind CSS classes for styling if needed
                  />
                </div>
              ))}
            </div>

            <div className="flex w-1/2 items-center justify-end gap-x-10">
              <div className="flex flex-col ">
                <span className="text-gray-400">Total</span>
                <span className="">{order.total_items} items</span>
                <span className="">
                  <CurrencyFormatter amount={order.sub_total ?? 0} />
                </span>
              </div>

              <div className="flex flex-col ">
                <span className="text-gray-400">status</span>
                <span className="">in progress</span>
              </div>

              <div className="flex flex-col ">
                <Link href="/order/1" className="text-rose-600 underline">
                  Order details
                </Link>
                <span className="underline">Contact</span>
                <button
                  className="bg-rose-600 text-white"
                  onClick={() => {
                    handleCancelOrder(order.id);
                  }}
                >
                  cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </>
  );

  return (
    <div>
      {loadingOrders || loading ? (
        <LoadingSpinner />
      ) : (
        <div className="bg-gray-200 p-5">
          <h1 className="text-2xl ">Your Orders</h1>
          <span className="text-gray-400">Total {orders?.length} orders</span>

          <div className="mt-10 flex justify-between">
            <div className="flex gap-x-5">
              <Filter label="All" />
              <Filter label="Completed" />
              <Filter label="Cancelled" />
              <Filter label="In progressed" />
            </div>

            <div className="flex gap-x-3">
              <input
                placeholder="search order"
                className="rounded-lg border border-gray-300 px-2"
              />
              <Selector />
            </div>
          </div>

          <div className="mt-10">
            <Order />
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;
