import { Navbar, NavbarBrand, NavbarContent, Button } from "@nextui-org/react";
import { Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

const Navigation = () => {
  const location = useLocation();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  return (
    <Navbar className="shadow-sm">
      <NavbarBrand>
        <Link to="/" className="font-bold text-inherit">TODO APP</Link>
      </NavbarBrand>
      <NavbarContent justify="end">
        {!isAuthenticated ? (
          <Button
            as={Link}
            to={location.pathname === "/register" ? "/" : "/register"}
            color="primary"
            variant="solid"
          >
            {location.pathname === "/register" ? "Login" : "Register"}
          </Button>
        ) : (
          <Button
            color="danger"
            variant="flat"
            onClick={() => {
              // Logout logic will go here
            }}
          >
            Logout
          </Button>
        )}
      </NavbarContent>
    </Navbar>
  );
};

export default Navigation;
