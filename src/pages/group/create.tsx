import { useState } from "react";
import { useForm } from "react-hook-form";
import ProgressBar from "public/components/group/progressBar";
import { PhotoIcon, UserCircleIcon } from "@heroicons/react/24/solid";
import { useUser } from "@clerk/nextjs";
import Swal from "sweetalert2";
import Image from "next/image";
import { CircularProgress } from "@mui/material";

import { api } from "~/utils/api";
import { ImageUploader } from "../../utils/imageUpload";

const CreateGroupPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const { user } = useUser();
  const [ownerImageFile, setOwnerImageFile] = useState<any>(user?.imageUrl);
  const [groupImageFile, setGroupImageFile] = useState<any>('');
  const [groupData, setGroupData] = useState({
    owner_image_url: "",
    group_image_url: "",
  });
  const [loading, setLoading] = useState(false);
  const endPointURl = "https://api.gr-oops.com";
  const bucketName = "test"; //change this in production!
  const ctx = api.useContext();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const { mutate: createGroupMutation, isLoading: isCreating } =
    api.group.createGroup.useMutation({
      onSuccess: (data) => {
        void ctx.group.getAllGroups.invalidate();
        setLoading(false);
        setGroupData({
        //set the group data to empty
          owner_image_url: "",
          group_image_url: "",
        });
        Swal.fire({
          // title: "Profile",
          text: "Your Group Is Created Successfully",
          icon: "success",
          confirmButtonText: "OK",
        });
        reset();
      },
      onError: (e) => {
        console.log(e);
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: `${e.message}`,
        });
      },
    });

  const handleProfilePictureChange = (e: any) => {
    const file = e.target.files[0];
    setOwnerImageFile(file);
    ImageUploader(file);
    setGroupData({
      ...groupData,
      owner_image_url: URL.createObjectURL(file),
    });
  };

  const handleGroupPictureChange = (e: any) => {
    const file = e.target.files[0];
    setGroupImageFile(file);
    ImageUploader(file);
    setGroupData({
      ...groupData,
      group_image_url: URL.createObjectURL(file),
    });
  };

  async function handleRegistration(data: any) {
    setLoading(true);
    if (
      data.group_name != "" &&
      data.description != "" &&
      data.owner_image_url != "" &&
      data.group_image_url != "",
      data.duration!= ""
    ) {
      data.owner_Clerk_id = user?.id;
      data.owner_image_url =
        ownerImageFile?.name !== undefined ? bucketName + "/" + ownerImageFile?.name : "";
      data.group_image_url =
        groupImageFile?.name !== undefined ? bucketName + "/" + groupImageFile?.name : "";
      data.duration = !Number.isNaN(parseInt(data.duration)) ? parseInt(data.duration) : undefined;
      try {
        await createGroupMutation({ ...data });
      } catch (e) {
        console.log(e);
      }
    } else {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Please fill all the required fields",
      });
    }
  }

  return (
    <div className="m-5">
      {/* <ProgressBar current={3} /> */}
      <form onSubmit={handleSubmit(handleRegistration)}>
        <div className="space-y-12 sm:space-y-16">
          <div>
            <div className="mt-10 space-y-8 border-b border-gray-900/10 pb-12 sm:space-y-0 sm:divide-y sm:divide-gray-900/10 sm:border-t sm:pb-0">
              
              <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:py-6">
                <label
                  htmlFor="group_name"
                  className="block text-sm font-medium leading-6 text-gray-900 sm:pt-1.5"
                >
                  Group Name
                </label>
                <div className="mt-2 sm:col-span-2 sm:mt-0">
                  <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-rose-600 sm:max-w-md">
                    <input
                      {...register("group_name", {
                        required: true,
                      })}
                      type="text"
                      name="group_name"
                      id="group_name"
                      autoComplete="group_name"
                      className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                      placeholder="group_name"
                    />
                  </div>
                </div>
              </div>

              <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:py-6">
                <label
                  htmlFor="description"
                  className="block text-sm font-medium leading-6 text-gray-900 sm:pt-1.5"
                >
                  About
                </label>
                <div className="mt-2 sm:col-span-2 sm:mt-0">
                  <textarea
                    {...register("description", {
                      required: true,
                    })}
                    id="description"
                    name="description"
                    rows={3}
                    className="block w-full max-w-2xl rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-rose-600 sm:text-sm sm:leading-6"
                    defaultValue={""}
                  />
                  <p className="mt-3 text-sm leading-6 text-gray-600">
                    Write a few sentences about your group.
                  </p>
                </div>
              </div>

              <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:py-6">
                <label
                  htmlFor="group_name"
                  className="block text-sm font-medium leading-6 text-gray-900 sm:pt-1.5"
                >
                  Duration
                </label>
                <div className="mt-2 sm:col-span-2 sm:mt-0">
                  <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-rose-600 sm:max-w-md">
                    <input
                      {...register("duration", {
                        required: true,
                      })}
                      type="text"
                      name="duration"
                      id="duration"
                      autoComplete="duration"
                      className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                      placeholder="hrs"
                    />
                  </div>
                </div>
              </div>

              <div className="sm:grid sm:grid-cols-3 sm:items-center sm:gap-4 sm:py-6">
                <label
                  htmlFor="photo"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Photo
                </label>
                <div className="mt-2 sm:col-span-2 sm:mt-0">
                  <div className="flex items-center gap-x-3">
                    <div>
                      {user?.imageUrl ? (
                        <Image
                          src={
                            groupData.owner_image_url
                              ? groupData.owner_image_url
                              : user?.imageUrl
                          }
                          width={100}
                          height={100}
                          className="h-20 w-20"
                          alt={groupData.owner_image_url}
                        />
                      ) : (
                        <UserCircleIcon
                          className="h-12 w-12 text-gray-300"
                          aria-hidden="true"
                        />
                      )}
                    </div>
                    <label
                      htmlFor="file-upload"
                      className="relative cursor-pointer rounded-md bg-white font-semibold text-rose-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-rose-600 focus-within:ring-offset-2 hover:text-rose-500"
                    >
                      <span>Change</span>
                      <input
                        onChange={handleProfilePictureChange}
                        id="file-upload"
                        name="file-upload"
                        type="file"
                        accept="image/*"
                        className="sr-only"
                      />
                    </label>
                  </div>
                </div>
              </div>

              <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:py-6">
                <label
                  htmlFor="cover-photo"
                  className="block text-sm font-medium leading-6 text-gray-900 sm:pt-1.5"
                >
                  Cover photo
                </label>
                <div className="mt-2 sm:col-span-2 sm:mt-0">
                  <div className="flex max-w-2xl justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
                    <div className="text-center">
                    {groupData.group_image_url ? (
                        <Image
                          src={groupData.group_image_url}
                          width={100}
                          height={100}
                          className="h-auto w-32"
                          alt={groupData.group_image_url}
                        />
                      ) : (
                        <PhotoIcon
                        className="mx-auto h-12 w-12 text-gray-300"
                        aria-hidden="true"
                      />
                      )}
                      <div className="mt-4 flex text-sm leading-6 text-gray-600">
                        <label
                          htmlFor="group-img-file-upload"
                          className="relative cursor-pointer rounded-md bg-white font-semibold text-rose-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-rose-600 focus-within:ring-offset-2 hover:text-rose-500"
                        >
                          <span>Upload a file</span>
                          <input
                            onChange={handleGroupPictureChange}
                            id="group-img-file-upload"
                            name="group-img-file-upload"
                            type="file"
                            accept="image/*"
                            className="sr-only"
                          />
                        </label>
                        <p className="pl-1">or drag and drop</p>
                      </div>
                      <p className="text-xs leading-5 text-gray-600">
                        PNG, JPG, GIF up to 10MB
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-2 text-center">
          <button
            type="submit"
            className="rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            {loading ? <CircularProgress style={{ color: "white" }} /> : "Save"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateGroupPage;
