import { useState, useEffect } from "react";
import { TripleFade as Hamburger } from "@adamjanicki/ui";
import { useNavigate } from "react-router-dom";
import "src/components/nav.css";
import { UnstyledLink } from "src/components/Link";


type NavlinkProps = {
  to: string;
  children: React.ReactNode;
};

const Nav = () => {
  const [open, setOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);  // Track login state
  const navigate = useNavigate();

  const closeMenu = () => setOpen(false);

  // Check if token exists in localStorage on mount
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    setIsLoggedIn(!!token);  // Set login state based on token presence
  }, []);

  useEffect(() => {
    const handleStorage = () => {
      const token = localStorage.getItem("authToken");
      setIsLoggedIn(!!token);  
    };

    window.addEventListener("storage", handleStorage);  
    return () => window.removeEventListener("storage", handleStorage);  
  }, []);
  
  
  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("username");
    setIsLoggedIn(false);
    navigate("/login");  // Redirect to login page after logout
  };

  const Navlink = (props: NavlinkProps) => (
    <li className="navlink-li">
      <UnstyledLink className="navlink" onClick={closeMenu} {...props} />
    </li>
  );

  return (
    <nav className="flex items-center justify-between w-100 nav pv2 ph4">
      <div className="flex items-center justify-between bar-container">
        <UnstyledLink className="nav-title" to="/">
          Skeleton
        </UnstyledLink>
        <div className="mobile">
          <Hamburger open={open} onClick={() => setOpen(!open)} />
        </div>
      </div>
      <ul
        className="flex items-center desktop link-container ma0"
        style={{ display: open ? "flex" : undefined }}
      >
        <Navlink to="/">Home</Navlink>
        <Navlink to="/">About</Navlink>
        <Navlink to="/rank/">Rank</Navlink>
        {isLoggedIn && <Navlink to={`/user/${localStorage.getItem("username")}`}>Profile</Navlink>}
        {isLoggedIn ? (
          <li className="navlink-li">
            <button className="navlink" onClick={handleLogout}>
              Logout
            </button>
          </li>
        ) : (
          <Navlink to="/login/">Login / Create Account</Navlink>
        )}
      </ul>
    </nav>
  );
};

export default Nav;
