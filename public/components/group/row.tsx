import { LeftButton, RightButton, Filter, PlusButton } from "../buttons";
import Link from "next/link";
import Arrow from "../../assets/icons/arrow.svg";
import GroupCard from "./card";

const GroupRow = () => {
  return (
    <>
      <div className="z-0 p-10">
        <div className="flex flex-row items-center justify-between">
          <div className="flex flex-col">
            <h1 className=" text-2xl">Groups that help you save</h1>
            <div className="flex flex-row gap-x-2 pt-2">
              <Filter category='snack'/>
              <Filter category='Instant Food'/>
              <Filter category='Personal Care'/>
              <Filter category='Beauty'/>
            </div>
          </div>

          <div className="flex flex-row items-center">
            <Link href="" className="mr-5 flex items-center text-rose-600">
              <p className="mr-2">see all</p>
              <Arrow />
            </Link>

            <LeftButton />
            <RightButton />
          </div>
        </div>
        {/* Group Cards */}
        <div className="flex flex-row items-center justify-between">
        <GroupCard _group_joined={false} _end_soon={false} _join_waitlist={false} _join_waitlist_joined={false}/>
        <GroupCard _group_joined={false} _end_soon={true} _join_waitlist={false} _join_waitlist_joined={false}/>
        <GroupCard _group_joined={true} _end_soon={false} _join_waitlist={false} _join_waitlist_joined={false}/>
        <GroupCard _group_joined={false} _end_soon={false} _join_waitlist={true} _join_waitlist_joined={false}/>
        <GroupCard _group_joined={false} _end_soon={false} _join_waitlist={true} _join_waitlist_joined={true}/>
        </div>

      </div>
    </>
  );
};

export default GroupRow;
