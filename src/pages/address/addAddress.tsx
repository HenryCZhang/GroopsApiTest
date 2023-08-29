import { useState } from "react";
import { useAuth } from "@clerk/nextjs";

import { LoadingSpinner } from "public/components/loading";
import { api } from "~/utils/api";

interface AddressProps {
  setAddAddress: React.Dispatch<React.SetStateAction<any>>;
}

const AddDeliveryAddress: React.FC<AddressProps> = ({ setAddAddress }) => {
  const { userId } = useAuth();
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

  const {mutate:createAddressMutation, isLoading:addingAddressAPI} = api.address.createAddress.useMutation();

  const handleCancel = async (event: any) => {
    event.preventDefault();
    //reset all field
    setAddAddress(false);
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
      await createAddressMutation({
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

  if (submitLoading||addingAddressAPI) {
    return <LoadingSpinner />;
  }

  return (
    <>
      {/* add new address */}
      <h1 className="mb-3 mt-10 text-2xl">Delivery Addresses</h1>
      {/* {addressList.map((address, index) => ( */}
      <div
        //   key={index}
        className="mt-10 rounded-lg bg-white p-10 text-gray-800 shadow-2xl"
      >
        {/* <h2>Address {index + 1}</h2> */}
        <div className="mt-5 flex gap-x-3">
          <div className="w-1/2">
            <p>First Name</p>
            <input
              className="mt-1 w-full rounded-lg border border-gray-300 p-2 focus:outline-rose-600 "
              placeholder="First Name"
              // id={"address" + index + "first_name"}
              required
              pattern="[A-Za-z]+"
              value={firstName}
              onChange={handleFirstNameChange}
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
              placeholder="Last Name"
              required
              // id={"address" + index + "last_name"}
              pattern="[A-Za-z]+"
              value={lastName}
              onChange={handleLastNameChange}
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
              placeholder="Email"
              type="email"
              // id={"address" + index + "email"}
              required
              value={email}
              onChange={handleEmailChange}
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
              placeholder="Phone number"
              id="phone"
              type="tel"
              required
              onChange={handlePhoneChange}
            />
          </div>
        </div>

        <p className="mt-5">Street Address</p>
        <input
          className="w-full rounded-lg border border-gray-300 p-2 focus:outline-rose-600"
          placeholder="Street Address"
          required
          // id={"address" + index + "street"}
          value={street}
          onChange={handleStreetAddressChange}
        />

        <div className="mt-5 flex gap-x-3">
          <div className="w-1/4">
            <p>Country</p>
            <input
              className="mt-1 w-full rounded-lg border border-gray-300 p-2 focus:outline-rose-600"
              placeholder="Country"
              required
              // id={"address" + index + "country"}
              pattern="[A-Za-z]+"
              value={country}
              onChange={handleCountryChange}
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
              placeholder="City"
              // id={"address" + index + "city"}
              required
              pattern="[A-Za-z]+"
              value={city}
              onChange={handleCityChange}
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
              placeholder="State"
              required
              // id={"address" + index + "state"}
              pattern="[A-Za-z]+"
              value={state}
              onChange={handleStateChange}
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
              placeholder="Postal"
              required
              // id={"address" + index + "psotcode"}
              onChange={handleZipCodeChange}
            />
          </div>
        </div>

        <div className="mt-5 flex justify-end gap-x-3 text-gray-800">
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
      </div>
      {/* ))} */}
    </>
  );
};

export default AddDeliveryAddress;
