import React, { useState } from "react";
import RightNav from "./MenuNav";

function Burger(props) {
  const [open, setOpen] = useState(false);
  return (
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
      {open ? <RightNav open={open} userId={props.userId} /> : null}
    </>
  );
}

export default Burger;
