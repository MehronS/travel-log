import React from "react";

import Burger from "./Burger";

function Navbar(props) {
  return (
    <nav>
      <Burger userId={props.userId} />
      <div className="welcome">Welcome, {props.name}!</div>
    </nav>
  );
}

export default Navbar;
