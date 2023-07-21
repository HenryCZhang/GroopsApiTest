import { use, useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";

import { LoadingSpinner } from "public/components/loading";
import { api } from "~/utils/api";

import AddDeliveryAddress from "./addAddress";

interface AddressData {
  id: number;
  city: string;
  state: string;
  country: string;
  first_name: string;
  is_primary_: boolean | null;
  last_name: string;
  postal_code: string;
  user_Clerk_id: string;
  createdAt: Date | null;
  email: string;
  phone: string;
  street: string;
}

const DeliveryAddress: React.FC = () => {
  const { userId } = useAuth();
  const [_edit, setEdit] = useState(false);
  const [_addAddress,setAddAddress]=useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [street, setStreet] = useState("");
  const [state, setState] = useState("");
  const [zip, setZip] = useState("");
  const [isFirstNameValid, setIsFirstNameValid] = useState(true);
  const [isLastNameValid, setIsLastNameValid] = useState(true);
  const [isEmailValid, setIsEmailValid] = useState(true);
  const [isCountryValid, setIsCountryValid] = useState(true);
  const [isCityValid, setIsCityValid] = useState(true);
  const [isStateValid, setIsStateValid] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);

  const [userAddressData, setUserAddressData] = useState<AddressData[]>([]);
  const [loadingUserAddress, setLoadingUserAddress] = useState(true);

     const {
      data,
      isLoading,
      refetch,
    } = api.address.getAddressesByUserId.useQuery({
      user_Clerk_id: userId ? userId : "user_2QCeTGBNmUAEuim42OAnU7E3kuZ",
    });

  useEffect(() => {
       // Update the state with the received data
       if(data){
    setUserAddressData(data as AddressData[]);
    setLoadingUserAddress(isLoading); // Set loading to false once data is received
       }
  }, []);

  const createAddressMutation = api.address.createAddress.useMutation();
  const deleteAddressMutation = api.address.deleteAddress.useMutation();

  const handleDelete = async (addressID:number) => {
    //delete address
    try {
      await deleteAddressMutation.mutateAsync({ id: addressID ? addressID : 1 });
      // await refetch();
      window.location.reload();
    } catch (error) {
      console.log(error);
    }
  };

  const handleCancel = async (event: any) => {
    event.preventDefault();
    //reset all fields
    setEdit(false);
  };

  const createAddress = async (event: any) => {
    event.preventDefault();
    if (
      !userId ||
      !isFirstNameValid ||
      !isLastNameValid ||
      !isEmailValid ||
      !isCountryValid ||
      !isCityValid ||
      !isStateValid
    ) {
      return;
    }
    setSubmitLoading(true);
    try {
      await createAddressMutation.mutate({
        is_primary_: false,
        street: street,
        first_name: firstName,
        last_name: lastName,
        email: email,
        phone: phone,
        country: country,
        city: city,
        state: state,
        postal_code: zip,
        user_Clerk_id: userId, // Provide the user ID here
      });
    } catch (error) {
      console.log(error);
    }
    setSubmitLoading(false);
    setEdit(false);
  };

  const handleFirstNameChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = event.target.value;
    setFirstName(value);

    const alphabeticRegex = /^[A-Za-z]+$/;
    const isValid = value === "" || alphabeticRegex.test(value);
    setIsFirstNameValid(isValid);
  };

  const handleLastNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setLastName(value);

    const alphabeticRegex = /^[A-Za-z]+$/;
    const isValid = value === "" || alphabeticRegex.test(value);
    setIsLastNameValid(isValid);
  };

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setEmail(value);

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isValid = value === "" || emailRegex.test(value);
    setIsEmailValid(isValid);
  };

  const handlePhoneChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setPhone(value);
  };

  const handleStreetAddressChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = event.target.value;
    setStreet(value);
  };

  const handleCountryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setCountry(value);

    const alphabeticRegex = /^[A-Za-z]+$/;
    const isValid = value === "" || alphabeticRegex.test(value);
    setIsCountryValid(isValid);
  };

  const handleCityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setCity(value);

    const alphabeticRegex = /^[A-Za-z]+$/;
    const isValid = value === "" || alphabeticRegex.test(value);
    setIsCityValid(isValid);
  };

  const handleStateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setState(value);

    const alphabeticRegex = /^[A-Za-z]+$/;
    const isValid = value === "" || alphabeticRegex.test(value);
    setIsStateValid(isValid);
  };

  const handleZipCodeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setZip(value);
  };

  return (
    <>
      {loadingUserAddress || submitLoading ? (
        <LoadingSpinner />
      ) : (
        <div>
          <div className="items-ceeter flex justify-center">
            <div className="w-[60%] px-36 py-16">
              {/* display DB addresses */}
              {userAddressData?.map((address, index) => (
                <div key={index}>
                  <h1>{`userAddressData length ${userAddressData.length}`}</h1>
                  {/* add new address */}
                  <h1 className="mb-3 mt-10 text-2xl">Delivery Addresses</h1>
                  <div
                    className="mt-10 rounded-lg bg-white p-10 text-gray-800 shadow-2xl"
                  >
                    <div className="flex justify-between">
                    <h2>Address {index + 1}</h2>
                    {!_edit ? (
                      <button
                        onClick={() => {
                          setEdit(true);
                        }}
                        className="text-rose-600"
                      >
                        Edit
                      </button>
                    ) : (
                      ""
                    )}
                    </div>

                    <div className="mt-5 flex gap-x-3">
                      <div className="w-1/2">
                        <p>First Name</p>
                        <input
                          className="mt-1 w-full rounded-lg border border-gray-300 p-2 focus:outline-rose-600 "
                          placeholder={
                            address.first_name
                              ? address.first_name
                              : "First Name"
                          }
                          value={
                            address.first_name && !_edit
                              ? address.first_name
                              : firstName
                          }
                          onChange={handleFirstNameChange}
                          id={"address" + index + "first_name"}
                          disabled={!_edit}
                          required
                          pattern="[A-Za-z]+"
                        />
                        {!isFirstNameValid && (
                          <p className="mt-1 text-sm text-red-600">
                            Please enter alphabetic characters only.
                          </p>
                        )}
                      </div>
                      <div className="w-1/2">
                        <p>Last Name</p>
                        <input
                          className="mt-1 w-full rounded-lg border border-gray-300 p-2 focus:outline-rose-600"
                          placeholder={
                            address.last_name ? address.last_name : "Last Name"
                          }
                          value={
                            address.last_name && !_edit
                              ? address.last_name
                              : lastName
                          }
                          onChange={handleLastNameChange}
                          id={"address" + index + "last_name"}
                          disabled={!_edit}
                          required
                          pattern="[A-Za-z]+"
                        />
                        {!isLastNameValid && (
                          <p className="mt-1 text-sm text-red-600 focus:outline-rose-600">
                            Please enter alphabetic characters only.
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="mt-5 flex gap-x-3">
                      <div className="w-1/2">
                        <p>Email</p>
                        <input
                          className="mt-1 w-full rounded-lg border border-gray-300 p-2 focus:outline-rose-600 "
                          placeholder={address.email ? address.email : "Email"}
                          value={
                            address.email && !_edit ? address.email : email
                          }
                          onChange={handleEmailChange}
                          disabled={!_edit}
                          type="email"
                          id={"address" + index + "email"}
                          required
                        />
                        {!isEmailValid && (
                          <p className="mt-1 text-sm text-red-600 focus:outline-rose-600">
                            Please enter a valid email address.
                          </p>
                        )}
                      </div>

                      <div className="w-1/2">
                        <p>Phone number</p>
                        <input
                          className="mt-1 w-full rounded-lg border border-gray-300 p-2 focus:outline-rose-600"
                          placeholder={address.phone ? address.phone : "Phone"}
                          value={
                            address.phone && !_edit ? address.phone : phone
                          }
                          onChange={handlePhoneChange}
                          disabled={!_edit}
                          id="phone"
                          type="tel"
                          required
                        />
                      </div>
                    </div>

                    <p className="mt-5">Street Address</p>
                    <input
                      className="w-full rounded-lg border border-gray-300 p-2 focus:outline-rose-600"
                      placeholder={address.street ? address.street : "Street"}
                      value={address.street && !_edit ? address.street : street}
                      onChange={handleStreetAddressChange}
                      disabled={!_edit}
                      required
                      id={"address" + index + "street"}
                    />

                    <div className="mt-5 flex gap-x-3">
                      <div className="w-1/4">
                        <p>Country</p>
                        <input
                          className="mt-1 w-full rounded-lg border border-gray-300 p-2 focus:outline-rose-600"
                          placeholder={
                            address.country ? address.country : "Country"
                          }
                          value={
                            address.country && !_edit
                              ? address.country
                              : country
                          }
                          onChange={handleCountryChange}
                          disabled={!_edit}
                          required
                          id={"address" + index + "country"}
                          pattern="[A-Za-z]+"
                        />
                        {!isCountryValid && (
                          <p className="mt-1 text-sm text-red-600 focus:outline-rose-600">
                            Please enter alphabetic characters only.
                          </p>
                        )}
                      </div>
                      <div className="w-1/4">
                        <p>City</p>
                        <input
                          className="mt-1 w-full rounded-lg border border-gray-300 p-2 focus:outline-rose-600 "
                          placeholder={address.city ? address.city : "City"}
                          value={address.city && !_edit ? address.city : city}
                          onChange={handleCityChange}
                          disabled={!_edit}
                          id={"address" + index + "city"}
                          required
                          pattern="[A-Za-z]+"
                        />
                        {!isCityValid && (
                          <p className="mt-1 text-sm text-red-600">
                            Please enter alphabetic characters only.
                          </p>
                        )}
                      </div>
                      <div className="w-1/4">
                        <p>State/Province</p>
                        <input
                          className="mt-1 w-full rounded-lg border border-gray-300 p-2 focus:outline-rose-600"
                          placeholder={address.state ? address.state : "State"}
                          value={
                            address.state && !_edit ? address.state : state
                          }
                          onChange={handleStateChange}
                          disabled={!_edit}
                          required
                          id={"address" + index + "state"}
                          pattern="[A-Za-z]+"
                        />
                        {!isStateValid && (
                          <p className="mt-1 text-sm text-red-600">
                            Please enter alphabetic characters only.
                          </p>
                        )}
                      </div>
                      <div className="w-1/4">
                        <p>ZIP/Postal</p>
                        <input
                          className="mt-1 w-full rounded-lg border border-gray-300 p-2 focus:outline-rose-600"
                          placeholder={
                            address.postal_code
                              ? address.postal_code
                              : "Postal Code"
                          }
                          value={
                            address.postal_code && !_edit
                              ? address.postal_code
                              : zip
                          }
                          onChange={handleZipCodeChange}
                          disabled={!_edit}
                          required
                          id={"address" + index + "psotcode"}
                        />
                      </div>
                    </div>

                    {_edit ? (
                      <div className="mt-5 flex justify-end gap-x-3 text-gray-800">
                         <button
                          className="rounded-xl text-rose-600 border border-gray-300 bg-white p-3"
                          onClick={()=>handleDelete(address.id)}
                        >
                          Delete
                        </button>
                        <button
                          className="rounded-xl border border-gray-300 bg-white p-3"
                          onClick={handleCancel}
                        >
                          Cancel
                        </button>
                        <button
                          className="rounded-xl border bg-rose-600 p-3 text-white"
                          onClick={createAddress}
                        >
                          Save
                        </button>
                      </div>
                    ) : (
                      ""
                    )}
                  </div>
                </div>
              ))}

              {/* display new address input form */}
   

{userAddressData!.length < 3? ( <div>
{_addAddress?(<AddDeliveryAddress setAddAddress={setAddAddress}/>):''}
                <button
                  onClick={() => setAddAddress(true)}
                  className="mt-10 text-rose-600"
                >
                  Add a new address
                </button>
              </div>):''}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DeliveryAddress;
