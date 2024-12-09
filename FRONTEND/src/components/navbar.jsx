import { Navbar, NavbarBrand, NavbarContent, Button } from "@nextui-org/react";
import { Link, useLocation } from "react-router-dom";
import {useAuth} from "../hooks/useAuth.hook.js";

const Navigation = () => {
  const location = useLocation();
  const {
    isAuthenticated,
    loading,
    logout
  } = useAuth();

  const handleOnClick = async (e) =>{
    e.preventDefault();
    try {
      await logout();
      
    } catch (error) {
      throw error
    }
  }

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
            variant="shadow"
            onClick={handleOnClick}
            isLoading={loading}
          >
            Logout
          </Button>
        )}
      </NavbarContent>
    </Navbar>
  );
};

export default Navigation;
