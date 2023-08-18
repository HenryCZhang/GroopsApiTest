import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import "bootstrap/dist/css/bootstrap.min.css";
import { useState } from "react";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignOutButton,
  UserButton,
  useUser,
} from "@clerk/nextjs";

import useLocalStorageState from "use-local-storage-state";
import { CartWidget } from "public/components/CartWidget";
import { CartProps } from "~/pages/product";

function NavbarBootStrap() {
  const [showCart, setShowCart] = useState(false);
  const [cart] = useLocalStorageState<CartProps>("cart", {});
  const { user } = useUser();

  const productsCount: number = Object.keys(cart || {}).length;

  return (
    <div>
      <Navbar expand="lg" className="bg-body-tertiary">
        <Container>
          <Navbar.Brand href="/">Home</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <NavDropdown title="Admin" id="basic-nav-dropdown">
                <NavDropdown.Item href="/admin/createProduct">
                  Create Product
                </NavDropdown.Item>
                <NavDropdown.Item href="/admin/viewProduct">
                  View Product
                </NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item href="#action/3.4">
                  Separated link
                </NavDropdown.Item>
              </NavDropdown>
              <CartWidget productsCount={productsCount} />
              {user ? (
                <div className="ml-5">
                  <UserButton/>
                  </div>
              ) : (
                <SignInButton mode="modal">
                  <button className="ml-2">Sign in</button>
                </SignInButton>
              )}
                      <Nav.Link href="/address">Address</Nav.Link>
                      <Nav.Link href="/order">Order</Nav.Link>
                      <NavDropdown title="Group" id="basic-nav-dropdown">
                <NavDropdown.Item href="/group">
                  All Groups
                </NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item href="/group/ownedGroup">
                  My Group
                </NavDropdown.Item>
              </NavDropdown>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      {/* <Cart /> */}
    </div>
  );
}

export default NavbarBootStrap;
