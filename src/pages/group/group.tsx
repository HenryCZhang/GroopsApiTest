import { api } from "~/utils/api";
import { useAuth } from "@clerk/nextjs";
import Link from "next/link";
import { useState } from "react";
import { Button } from "react-bootstrap";


export default function Test() {
  const { isLoaded, userId, sessionId, getToken } = useAuth();
  const { data, isLoading, refetch } = api.group.getAllGroups.useQuery();
  const [isFetching, setIsFetching] = useState(false);
  const [inputValue, setInputValue] = useState("");

  const create_group = api.group.createGroup.useMutation();
  const delete_group = api.group.deleteGroup.useMutation();

  const [groupId, setGroupId] = useState("group id");
  const deleteGroup = async (groupId: string) => {
    setIsFetching(true); // set isFetching to true before refetch
    await delete_group.mutateAsync({ groupId: groupId ? groupId : "1" });
    await refetch(); // Trigger a refetch of the user's love list
    setIsFetching(false); // set isFetching to false after refetch
    setInputValue("");
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setGroupId(e.target.value);
    setInputValue(e.target.value);
  };


  return (
    <>
      <Link href="/" className="bg-black p-1 text-white">
        Back to home page
      </Link>
      <br></br>
      <br></br>
      <Link href="/demo/createGroup" className="bg-black p-1 text-white">
        Go To Create Group Page
      </Link>

      <h1 className="mb-10 mt-10 text-center">My user Id: {userId}</h1>

      <div className="flex flex-col place-items-center">
        {data?.map((group) => (
          <div key={group.group_name}>
            group name: {group.group_name}, || group id: {group.group_code}
          </div>
        ))}
        {data?.map((group) => (
          <div key={group.group_name}>
            group name: {group.group_name}, || group id: {group.group_code}
            <Button onClick={() => deleteGroup(group.group_code)} />
          </div>
        ))}
      </div>
    </>
  );
}