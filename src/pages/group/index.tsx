import useLocalStorageState from "use-local-storage-state";
import { api } from "~/utils/api";
import Link from "next/link";
import { useState } from "react";
import { check } from "prettier";
import { useAuth } from "@clerk/nextjs";
import Swal from "sweetalert2";
import { useRouter } from "next/router";
import Image from 'next/image';

// import GroupRow from "public/components/group/row";
import { LoadingSpinner } from "public/components/loading";

//Group type for local storage
export type GroupProps = {
  group_code: string | undefined;
};

const Index = () => {
  const [joinedGroupID, setJoinedGroupID] = useLocalStorageState<GroupProps>(
    "joinedGroupID",
    {}
  );
  const [loading, setLoading] = useState(false);
  const { userId } = useAuth();
  const ctx = api.useContext();
  const router = useRouter();

  //fretch all groups from api
  const {
    data: groups,
    isLoading: loadingGroups,
    refetch: refetchGroups,
  } = api.group.getAllGroups.useQuery();

  //check if the user already owns a group or not
  const {
    data: userActiveGroups,
    isLoading: loadinguserActiveGroups,
    refetch: refetchuserActiveGroups,
  } = api.group.getActiveGroupByOwnerId.useQuery({
    owner_Clerk_id: userId ?? "",
  });

  const checkUserOwnsGroup = () => {
    console.log(`userActiveGroups: ${userActiveGroups}`);
    if (userActiveGroups !== null) {
      Swal.fire({
        title: "Oops!",
        text:
          userActiveGroups &&
          `It seems like you already own a group (group code: ${userActiveGroups[0]?.group_code})`,
        icon: "error",
        confirmButtonText: "OK",
      });
    } else {
      // e.preventDefault();
      router.push("/group/create");
    }
  };

  const { mutate: deleteGroupMutation, isLoading: isDeletingGroup } =
  api.group.deleteGroup.useMutation({
    onSuccess: () => {
      void ctx.order.getUserOrders.invalidate();
      refetchGroups();
      setLoading(false);
    },
    onError: (e:any) => {
      console.log(e);
    },
  });

const handleDeleteGroup = async (group_code: string) => {
  setLoading(true);
  await deleteGroupMutation({ group_code });
};

  const handleJoinGroup = (group_code: string) => {
    setJoinedGroupID({ group_code: group_code });
  };

  const handleLeaveGroup = () => {
    //remove group from local storage
    setJoinedGroupID({ group_code: undefined });
  };

  if (loading || loadingGroups || loadinguserActiveGroups) {
    return <LoadingSpinner />;
  }

  return (
    <div>
      <div className="flex justify-center gap-x-20 bg-gray-200 p-20">
        <div className="w-[40%] text-center">
          <h1 className="text-5xl font-bold">Groops E-commerce</h1>

          <p className="mt-10 text-2xl text-gray-700">
            Revolutionize the tranditional way of doing E-commerce, our
            group-buy model makes everyday items more affordable for you
          </p>

          <p className="mt-10 text-gray-400">
            Our group-buy buisness model can help group leader to monetize their
            influence and values through initializing a group and congregating
            consumers. All participating members can purchase items at a lower
            price.
          </p>

          <div className="mt-5 flex justify-center gap-x-5">
            <button
              onClick={checkUserOwnsGroup}
              className="rounded-lg bg-rose-600 px-4 py-3 text-white"
            >
              create a group
            </button>
            <button className="rounded-lg bg-rose-600 px-4 py-3 text-white">
              Join a group
            </button>
          </div>
        </div>

        {/* <img className="w-[30%]" src="/assets/group/logo.png" /> */}
      </div>
      {groups?.map((group) => (
        <div className="flex justify-center">
          {group.is_active_ && <div className="bg-rose-200 m-3 p-4">
          <Image
                src={`https://api.gr-oops.com/${group?.group_image_url}`}
                width={100}
                height={100}
                alt={`${group?.group_image_url}`}
              />
          <div>{group.group_name}</div>
          <div>group code: {group.group_code}</div>
          <div>group owner: {group.owner_Clerk_id}</div>
          <Image
                src={`https://api.gr-oops.com/${group?.owner_image_url}`}
                width={100}
                height={100}
                alt={`${group?.owner_image_url}`}
                className="rounded-full w-20 h-20"
              />
          {/* show 'owened' if the user owns the group */}
          {userActiveGroups &&
            group.group_code === userActiveGroups[0]?.group_code && (
              <div className="flex justify-begin">
                <div className="bg-white text-rose-600 border-rose-600 border-2 rounded-md">Owned</div>
                <Link href="/group/ownedGroup" className="ml-2 text-rose-600"> View Group </Link>
              </div>
            )}
          {/* display join button on all groups if user joined no group*/}
          {joinedGroupID?.group_code === undefined ||
          (joinedGroupID?.group_code === "" &&
            (!userActiveGroups ||
              (userActiveGroups &&
                group.group_code !== userActiveGroups[0]?.group_code))) ? (
            <button
              onClick={() => handleJoinGroup(group.group_code)}
              className="mr-5 bg-rose-600 text-white"
            >
              Join
            </button>
          ) : (
            ""
          )}
          {/* show leave button under the group that the user joined  */}
          {joinedGroupID?.group_code === group.group_code && (
            <div>
              <button
                onClick={handleLeaveGroup}
                className="bg-rose-600 text-white"
              >
                Leave
              </button>
              <Link href="/product"> Shop </Link>
            </div>
          )}
           <button
                  className="bg-gray-600 text-white mt-2"
                  onClick={() => {
                    handleDeleteGroup(group.group_code);
                  }}
                >
                  Delete Group (admin)
                </button>
                  </div>}
         
                 
        </div>
      ))}



      {/* <div className="flex justify-between gap-x-10 p-36">
        <div className="flex flex-col items-center w-1/4">
          <img src="/assets/group/hands.png" className="" />
          <p className="mt-3 text-xl font-bold">You can create a group</p>
          <p className="mt-5">
            As a group leader, you can start a group and get paid through
            commission according to the size of your group.
          </p>
        </div>
        <div className="flex flex-col items-center w-1/4">
          <img src="/assets/group/logo_small.png" className="" />
          <p className="mt-3 text-xl font-bold">You can join a group</p>
          <p className="mt-5">
            As a group member you can participate in a group and enjoy the
            discount off your selected items
          </p>
        </div>
        <div className="flex flex-col items-center w-1/4">
          <img src="/assets/group/logo_small.png" className="" />
          <p className="mt-3 text-xl font-bold">Groups</p>
          <p className="mt-5">
            A group will be finialized when it reaches the member limit or when
            the time runs out whichever comes first. The final discount rate
            will be calculated automatically.
          </p>
        </div>
      </div> */}

      {/* There is a issue with GroupRow */}
      {/* <GroupRow /> */}
    </div>
  );
};

export default Index;
