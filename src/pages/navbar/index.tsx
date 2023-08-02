import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useState } from 'react';

import useLocalStorageState from "use-local-storage-state";
import { CartProps } from '../product';
import { CartWidget } from 'public/components/CartWidget';


function NavbarBootStrap() {
  const [showCart,setShowCart] = useState(false);
  const [cart] = useLocalStorageState<CartProps>('cart', {})

  const productsCount: number = Object.keys(cart || {}).length
  
  return (
    <div>
    <Navbar expand="lg" className="bg-body-tertiary">
      <Container>
        <Navbar.Brand href="/">Home</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link href="/address">Address</Nav.Link>
            {/* <Nav.Link href="/admin/createProduct">Admin</Nav.Link> */}
            <NavDropdown title="Admin" id="basic-nav-dropdown">
              <NavDropdown.Item href="/admin/createProduct">Create Product</NavDropdown.Item>
              <NavDropdown.Item href="/admin/viewProduct">
                View Product
              </NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item href="#action/3.4">
                Separated link
              </NavDropdown.Item>
            </NavDropdown>
            {/* <Nav.Link href="/cart"><CartWidget productsCount={productsCount} /></Nav.Link> */}
            <CartWidget productsCount={productsCount} />
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
    {/* <Cart /> */}
    </div>
  );
}

export default NavbarBootStrap;