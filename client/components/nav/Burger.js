import React, { useState } from "react";
import RightNav from "./MenuNav";

function Burger(props) {
  // toggle open and close the hamburger menu (RightNav component)
  const [open, setOpen] = useState(false);
  return (
    // Couldnt figure out how to add these attributes without react style so did it inline
    <>
      <div className="burger_nav" onClick={() => setOpen(!open)}>
        <div
          className="burger_dash burger_dash_open"
          style={{
            backgroundColor: open ? `#ccc` : `#333`,
            transform: open ? `rotate(45deg)` : `rotate(0)`,
          }}
        ></div>
        <div
          className="burger_dash burger_dash_open"
          style={{
            backgroundColor: open ? `#ccc` : `#333`,
            transform: open ? `translateX(-180%)` : `translateX(0)`,
          }}
        ></div>
        <div
          className="burger_dash burger_dash_open"
          style={{
            backgroundColor: open ? `#ccc` : `#333`,
            transform: open ? `rotate(-45deg)` : `rotate(0)`,
          }}
        ></div>
      </div>
      {/* open the hamburger menu when the hamburger is clicked */}
      {open ? <RightNav open={open} userId={props.userId} /> : null}
    </>
  );
}

export default Burger;
