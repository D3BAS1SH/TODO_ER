import { Navbar, NavbarBrand, NavbarContent, Button, Avatar, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from "@nextui-org/react";
import { Link, useLocation } from "react-router-dom";
import {useAuth, useAuthIsAuthentic, useAuthUserData} from "../hooks/useAuth.hook.js";
import { persistor } from "../stores/index.js";

const Navigation = () => {
  const location = useLocation();
  const {isAuthenticated} = useAuthIsAuthentic();
  const {user} = useAuthUserData();
  const {
    logout,
  } = useAuth();

  const handleOnClick = async () =>{
    try {
      await logout();
      persistor.purge();
      alert("Logout success");
    } catch (error) {
      throw error
    }
  }

  return (
    <Navbar className="shadow-sm">
      <NavbarBrand>
        <Link to="/dashboard" className="font-bold text-inherit">TODO APP</Link>
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
          <Dropdown>
            <DropdownTrigger>
              <Button isIconOnly variant="light" className="flex items-center">
                <Avatar
                  src={user?.avatar || "/default-avatar.png"}
                  size="sm"
                  alt="Profile"
                />
              </Button>
            </DropdownTrigger>
            <DropdownMenu aria-label="User menu">
              <DropdownItem key="profile" as={Link} to="/profile">
                {user?.fullname || "Profile"}
              </DropdownItem>
              <DropdownItem key="stats" color="danger">
                Stats
              </DropdownItem>
              <DropdownItem key="logout" color="danger" onPress={handleOnClick}>
                Logout
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        )}
      </NavbarContent>
    </Navbar>
  );
};

export default Navigation;
