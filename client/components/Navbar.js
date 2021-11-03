import React from "react";
import { Link } from "react-router-dom";

export default function Navbar(props) {
  return (
    <nav>
      <Link to="/" className="nav_links">
        Home
      </Link>
      <Link to={`/dashboard/${props.userId}`} className="nav_links">
        Dashboard
      </Link>
    </nav>
  );
}
