import React from "react";
import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav>
      <Link to="/" className="nav_links">
        Home
      </Link>
      {/* <Link to={`/dashboard/${this.props.singleUser.id}`} className="nav_links">
        Dashboard
      </Link> */}
    </nav>
  );
}
