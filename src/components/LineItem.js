import React, { useEffect, useState } from "react";
import "./componentStyling/LineItem.css";

export default function LineItem(props) {
  const dateObj = new Date();
  const todaysDate = dateObj.toDateString();
  let classes = "";
  const [classList, setClassList] = useState("");
  const styling = () => {
    if (props.item.lastCheckInDate == todaysDate) {
      setClassList("checked-in");
    }
  };
  const deleteSelf = () => {
    console.log("Run Delete Self");
    console.log(props.item.id);
    props.handleDelete(props.item.id);
    props.getUserData();
  };
  const checkInSelf = () => {
    if (props.item.lastCheckInDate == todaysDate) {
      console.log("Already Checked This In, Buddy!");
    } else {
      deleteSelf();
    }
    styling();
  };
  useEffect(() => styling());
  return (
    <div className={classList}>
      {props.item.title}
      <button onClick={deleteSelf}>X</button>
      <button onClick={checkInSelf}>✓</button>
    </div>
  );
}
