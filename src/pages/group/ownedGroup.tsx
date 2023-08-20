import React from "react";
import { useAuth } from "@clerk/nextjs";
import { api } from "~/utils/api";
import Image from "next/image";

import { LoadingSpinner } from "public/components/loading";

const OwnedGroup = () => {
  const { userId } = useAuth();
  //check if the user already owns a group or not
  const {
    data: userActiveGroups,
    isLoading: loadingUserActiveGroups,
    refetch: refetchUserActiveGroups,
  } = api.group.getActiveGroupByOwnerId.useQuery({
    owner_Clerk_id: userId ?? "",
  });
  if (loadingUserActiveGroups) {
    return <LoadingSpinner />;
  }
  if(!userActiveGroups){
    return(
        <div className="flex h-screen items-center justify-center">
            <h1>You are not hosting any group</h1>
            </div>
    )
  }

  return (
    <div>
      {userActiveGroups?.map((group) => (
        <div className="flex h-screen items-center justify-center">
          <div className="m-3 bg-rose-200 p-5">
            <Image
              src={`https://api.gr-oops.com/${group?.group_image_url}`}
              width={100}
              height={100}
              alt={`${group?.group_image_url}`}
            />
            <div>{group.group_name}</div>
            <div>{group.group_code}</div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default OwnedGroup;
