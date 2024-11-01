import { useState } from "react";
import { TripleFade as Hamburger } from "@adamjanicki/ui";
import "src/components/nav.css";
import { UnstyledLink } from "src/components/Link";

type NavlinkProps = {
  to: string;
  children: React.ReactNode;
};

const Nav = () => {
  const [open, setOpen] = useState(false);
  const closeMenu = () => setOpen(false);

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
        <Navlink to="/about/">About</Navlink>
        <Navlink to="/api-test/">API Test</Navlink>
      </ul>
    </nav>
  );
};

export default Nav;
