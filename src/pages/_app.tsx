import { type AppType } from "next/app";
import { api } from "~/utils/api";
import "~/styles/globals.css";
import NavbarBootStrap from "./navbar";

import {
  ClerkProvider,
  SignedIn,
  SignedOut,
  RedirectToSignIn,
} from "@clerk/nextjs";

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <ClerkProvider {...pageProps}>
          <NavbarBootStrap />
      <Component {...pageProps} />
    </ClerkProvider>
  );
};

export default api.withTRPC(MyApp);
