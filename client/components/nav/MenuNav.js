import React from "react";
import { Link } from "react-router-dom";

function MenuNav(props) {
  return (
    <ul
      className="nav_list"
      style={{
        display: props.open ? "initial" : "none",
        transform: props.open ? `translateX(0)` : `translateX(100)`,
        transition: `transform 0.4s ease-in-out`,
      }}
    >
      {/* <li>Profile</li> */}
      <li>
        <Link to={`/dashboard/${props.userId}`} className="nav_links">
          Dashboard
        </Link>
      </li>
      <li>
        <Link
          to="/"
          className="nav_links"
          onClick={() => window.localStorage.clear()}
        >
          Logout
        </Link>
      </li>
    </ul>
  );
}

export default MenuNav;
