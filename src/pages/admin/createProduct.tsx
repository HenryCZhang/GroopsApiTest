import { useForm } from "react-hook-form";
// import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { ImageUploader } from "../../utils/imageUpload";
import Swal from "sweetalert2";
import { CircularProgress } from "@mui/material";
import { api } from "~/utils/api";
import { PhotoIcon } from "@heroicons/react/24/solid";

const ProductUploadPage = () => {

  const [alcoholStatus, setAlcoholStatus] = useState(false);
  const [loading, setLoading] = useState(false);
  const [imageURL, setImageURL] = useState<any>();
  const [productData, setProductData] = useState({ primary_image_url: "" });

  const endPointURl = "https://api.gr-oops.com";
  const bucketName = "test"; //change this in production!
  const ctx = api.useContext();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const { mutate: uploadProductMutation, isLoading: isUploading } =
    api.product.createProduct.useMutation({
      onSuccess: (data) => {
        void ctx.product.getAllProducts.invalidate();
        setLoading(false);
        setProductData({
          ...productData,
          ...data,
        });
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

  const handleProductPictureChange = (e: any) => {
    const file = e.target.files[0];
    setImageURL(file);
    ImageUploader(file);
    setProductData({
      ...productData,
      primary_image_url: URL.createObjectURL(file),
    });
  };

  async function handleRegistration(data: any) {
    setLoading(true);
    if (
      data.skuid!="" &&
      data.english_product_name!="" &&
      data.retail_price!="" &&
      data.stock!="" &&
      data.primary_image_url!=""
    ) {
      data.cost_price = !Number.isNaN(parseFloat(data.cost_price)) ? parseFloat(data.cost_price) : undefined;
      data.retail_price = parseFloat(data.retail_price);
      data.stock = parseInt(data.stock);
      data.category_id = !Number.isNaN(parseInt(data.category_id)) ? parseInt(data.category_id) : undefined;
      data.primary_image_url = imageURL?.name !== undefined ? bucketName + "/" + imageURL?.name : "";
      data.alcohol_percentage = !Number.isNaN(parseFloat(data.alcohol_percentage)) ? parseFloat(data.alcohol_percentage) : undefined;
  
      try {
        await uploadProductMutation({ ...data });
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
    <>
      <div className="row">
        <div className="col-md-12">
          <div
            className="mx-auto mb-3 max-w-7xl py-6 sm:px-6 lg:px-8"
            style={{ border: "1px solid #e0e0e0" }}
          >
            <form
              className="grid grid-cols-1 gap-y-6"
              onSubmit={handleSubmit(handleRegistration)}
            >
              <div className="row">
                <div className="col-md-6 mb-3">
                  <div className="mx-6 w-1/2 pr-8">
                    <div
                      className="mr-4 h-32 w-32 overflow-hidden shadow-sm"
                      style={{ width: "200%" }}
                    >
                      {imageURL ? (
                        <img
                          src={
                            productData.primary_image_url == ""
                              ? endPointURl + "/" + imageURL
                              : productData.primary_image_url
                          }
                          alt=""
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <img
                          src={productData.primary_image_url}
                          alt=""
                          className="h-full w-full object-cover"
                        />
                      )}
                    </div>
                  </div>
                </div>
                <div className="col-span-full">
                  <label
                    htmlFor="cover-photo"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    (Product photo)
                  </label>
                  <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
                    <div className="text-center">
                      <PhotoIcon
                        className="mx-auto h-12 w-12 text-gray-300"
                        aria-hidden="true"
                      />
                      <div className="mt-4 flex text-sm leading-6 text-gray-600">
                        <label
                          htmlFor="file-upload"
                          className="relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500"
                        >
                          <span>Upload a file</span>
                          <input
                            onChange={handleProductPictureChange}
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

                  <div className="col-md-6">
                    <label
                      htmlFor="skuid"
                      className="mt-3 block text-sm font-medium text-gray-700"
                    >
                      skuid
                    </label>
                    <div className="mt-1">
                      <input
                        {...register("skuid", {
                          required: true,
                        })}
                        type="text"
                        name="skuid"
                        id="skuid"
                        autoComplete="skuid"
                        className="block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                      />
                      {errors.skuid && (
                        <span className="text-rose-600">
                          This field is required
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="col-md-6">
                    <label
                      htmlFor="skuid"
                      className="mt-3 block text-sm font-medium text-gray-700"
                    >
                      description
                    </label>
                    <div className="mt-1">
                      <input
                        {...register("description", {
                          required: false,
                        })}
                        type="text"
                        name="description"
                        id="description"
                        autoComplete="description"
                        className="block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                      />
                    </div>
                  </div>

                  <div className="col-md-6">
                    <label
                      htmlFor="english_product_name"
                      className="mt-3 block text-sm font-medium text-gray-700"
                    >
                      Product Name (English)
                    </label>
                    <div className="mt-1">
                      <input
                        {...register("english_product_name", {
                          required: true,
                        })}
                        type="text"
                        name="english_product_name"
                        id="english_product_name"
                        autoComplete="english_product_name"
                        className="block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                      />
                      {errors.english_product_name && (
                        <span className="text-rose-600">
                          This field is required
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="col-md-6">
                    <label
                      htmlFor="chinese_product_name"
                      className="mt-3 block text-sm font-medium text-gray-700"
                    >
                      Product Name (Chinese)
                    </label>
                    <div className="mt-1">
                      <input
                        {...register("chinese_product_name", {
                          required: false,
                        })}
                        type="text"
                        name="chinese_product_name"
                        id="chinese_product_name"
                        autoComplete="chinese_product_name"
                        className="block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                      />
                    </div>
                  </div>

                  <div className="col-md-6 mt-3">
                    <label
                      htmlFor="frenchProductNName"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Product Name (French)
                    </label>
                    <div className="mt-1">
                      <input
                        {...register("frenchProductNName", {
                          required: false,
                        })}
                        type="text"
                        name="frenchProductNName"
                        id="frenchProductNName"
                        autoComplete="given-name"
                        className="block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                      />
                    </div>
                  </div>

                  <div className="col-md-6 mt-3">
                    <label
                      htmlFor="cost_price"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Cost Price
                    </label>
                    <div className="mt-1">
                      <input
                        {...register("cost_price", {
                          required: false,
                          pattern: /^[0-9]+$/,
                        })}
                        type="text"
                        name="cost_price"
                        id="cost_price"
                        autoComplete="cost_price"
                        className="block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                      />
                        {errors.cost_price && (
                        <span className="text-rose-600">numeric value only</span>
                      )}
                    </div>
                  </div>

                  <div className="col-md-6 mt-3">
                    <label
                      htmlFor="retail_price"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Retail Price
                    </label>
                    <div className="mt-1">
                      <input
                        {...register("retail_price", {
                          required: true,
                          pattern: /^[0-9]+$/,
                        })}
                        type="text"
                        name="retail_price"
                        id="retail_price"
                        autoComplete="retail_price"
                        className="block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                      />
                      {errors.retail_price && (
                        <span className="text-rose-600">This field is required (numeric value only)</span>
                      )}
                    </div>
                  </div>

                  <div className="col-md-6 mt-3">
                    <label
                      htmlFor="stock"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Stock
                    </label>
                    <div className="mt-1">
                      <input
                        {...register("stock", {
                          required: true,
                          pattern: /^[0-9]+$/,
                        })}
                        type="text"
                        name="stock"
                        id="stock"
                        autoComplete="stock"
                        className="block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                      />
                      {errors.stock && (
                        <span className="text-rose-600">
                          This field is required (numeric value only)
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="col-md-6 mt-3">
                    <label
                      htmlFor="alcohol"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Alcohol
                    </label>
                    <div className="mt-1">
                      <select
                        className="block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                        onChange={(e) =>
                          setAlcoholStatus(e.target.value === "true")
                        }
                      >
                        <option value="true" label="YES"></option>
                        <option value="false" label="NO" defaultValue={"false"}></option>
                      </select>
                    </div>
                  </div>

                  {alcoholStatus && (
                    <div className="col-md-6 mt-3">
                      <label
                        htmlFor="alcohol_percentage"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Alcohol Percentage
                      </label>
                      <div className="mt-1">
                        <input
                          {...register("alcohol_percentage", {
                            required: false,
                            pattern: /^[0-9]+$/,
                          })}
                          type="number"
                          defaultValue="0"
                          min="0"
                          max="100"
                          name="alcohol_percentage"
                          id="alcohol_percentage"
                          autoComplete="alcohol_percentage"
                          className="block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                        />
                      </div>
                    </div>
                  )}

                  <div className="col-md-6 mt-3">
                    <label
                      htmlFor="nutrition_fact"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Nutrition Fact
                    </label>
                    <div className="mt-1">
                      <input
                        {...register("nutrition_fact", {
                          required: false,
                          pattern: /^[A-Za-z]+$/,
                        })}
                        type="text"
                        name="nutrition_fact"
                        id="nutrition_fact"
                        autoComplete="nutrition_fact"
                        className="block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                      />
                    </div>
                  </div>

                  <div className="col-md-6 mt-3">
                    <label
                      htmlFor="place_of_origin"
                      className="block text-sm font-medium text-gray-700"
                    >
                      {" "}
                      Place Of Origin
                    </label>
                    <div className="mt-1">
                      <input
                        {...register("place_of_origin", {
                          required: false,
                          pattern: /^[A-Za-z]+$/,
                        })}
                        type="text"
                        name="place_of_origin"
                        id="place_of_origin"
                        autoComplete="place_of_origin"
                        className="block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                      />
                    </div>
                  </div>

                  <div className="col-md-6 mt-3">
                    <label
                      htmlFor="product_weight"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Product Weight
                    </label>
                    <div className="mt-1">
                      <input
                        {...register("product_weight", {
                          required: false,
                          pattern: /^[0-9]+$/,
                        })}
                        type="text"
                        name="product_weight"
                        id="product_weight"
                        autoComplete="product_weight"
                        className="block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                      />
                    </div>
                  </div>

                  <div className="col-md-6 mt-3">
                    <label
                      htmlFor="specification"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Specification
                    </label>
                    <div className="mt-1">
                      <input
                        {...register("specification", {})}
                        type="text"
                        name="specification"
                        id="specification"
                        autoComplete="specification"
                        className="block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                      />
                    </div>
                  </div>
                  <div className="col-md-12 pt-4 text-right">
                    <button
                      type="submit"
                      className="rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    >
                      {loading ? (
                        <CircularProgress style={{ color: "white" }} />
                      ) : (
                        "Save"
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductUploadPage;
