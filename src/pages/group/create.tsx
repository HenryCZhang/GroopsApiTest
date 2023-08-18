import { useState } from "react";
import { useForm } from "react-hook-form";
import ProgressBar from "public/components/group/progressBar";
import { PhotoIcon, UserCircleIcon } from "@heroicons/react/24/solid";
import { useUser } from "@clerk/nextjs";
import Swal from "sweetalert2";
import Image from "next/image";

import { api } from "~/utils/api";
import { ImageUploader } from "../../utils/imageUpload";

const CreateGroupPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const { user } = useUser();
  const [imageURL, setImageURL] = useState<any>(user?.imageUrl);
  const [groupData, setGroupData] = useState({ primary_image_url: "" });
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
        // setGroupData({
        //   //testing
        //   ...groupData,
        //   ...data,
        // });
        Swal.fire({
          title: "Profile",
          text: "Your Product Create Successfully",
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
    setImageURL(file);
    ImageUploader(file);
    setGroupData({
      ...groupData,
      primary_image_url: URL.createObjectURL(file),
    });
  };

  async function handleRegistration(data: any) {
    setLoading(true);
    if (
      data.skuid != "" &&
      data.english_product_name != "" &&
      data.retail_price != "" &&
      data.stock != "" &&
      data.primary_image_url != ""
    ) {
      data.cost_price = !Number.isNaN(parseFloat(data.cost_price))
        ? parseFloat(data.cost_price)
        : undefined;
      data.retail_price = parseFloat(data.retail_price);
      data.stock = parseInt(data.stock);
      data.category_id = !Number.isNaN(parseInt(data.category_id))
        ? parseInt(data.category_id)
        : undefined;
      data.primary_image_url =
        imageURL?.name !== undefined ? bucketName + "/" + imageURL?.name : "";
      data.alcohol_percentage = !Number.isNaN(
        parseFloat(data.alcohol_percentage)
      )
        ? parseFloat(data.alcohol_percentage)
        : undefined;

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
                  htmlFor="about"
                  className="block text-sm font-medium leading-6 text-gray-900 sm:pt-1.5"
                >
                  About
                </label>
                <div className="mt-2 sm:col-span-2 sm:mt-0">
                  <textarea
                    id="about"
                    name="about"
                    rows={3}
                    className="block w-full max-w-2xl rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-rose-600 sm:text-sm sm:leading-6"
                    defaultValue={""}
                  />
                  <p className="mt-3 text-sm leading-6 text-gray-600">
                    Write a few sentences about your group.
                  </p>
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
                      <p>{groupData.primary_image_url}</p>
                      {user?.imageUrl ? (
                        <Image
                          src={groupData.primary_image_url? (groupData.primary_image_url):(user?.imageUrl)}
                          width={100}
                          height={100}
                          className="w-20 h-20"
                          alt={groupData.primary_image_url}
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
                            className="sr-only"
                          />
                        </label>
                    {/* <button
                      type="button"
                      className="rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                    >
                      <label htmlFor="imageInput">Change</label>
                    </button> */}
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
                      <PhotoIcon
                        className="mx-auto h-12 w-12 text-gray-300"
                        aria-hidden="true"
                      />
                      <div className="mt-4 flex text-sm leading-6 text-gray-600">
                        <label
                          htmlFor="file-upload"
                          className="relative cursor-pointer rounded-md bg-white font-semibold text-rose-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-rose-600 focus-within:ring-offset-2 hover:text-rose-500"
                        >
                          <span>Upload a file</span>
                          <input
                            id="file-upload"
                            name="file-upload"
                            type="file"
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
      </form>
    </div>
  );
};

export default CreateGroupPage;
