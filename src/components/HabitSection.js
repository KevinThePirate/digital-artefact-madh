import React from "react";
import { useState } from "react";
import AddItem from "./AddItem";
import LineItem from "./LineItem";

export default function HabitSection(props) {
  const handleSignOut = () => {
    console.log(props.userInfo.displayName);
    props.signUserOut();
    console.log(props.userInfo.displayName);
  };

  const [modalOpen, setModalOpen] = useState(false);
  const close = () => setModalOpen(false);
  const open = () => setModalOpen(true);

  return (
    <div>
      <h2>Write Essay On French Revolution</h2>
      {props.userItems.map((item) => (
        <LineItem
          key={item.id}
          item={item}
          handleDelete={props.handleDelete}
          handleCheckIn={props.handleCheckIn}
          getUserData={props.getUserData}
          xpUp={props.xpUp}
        />
      ))}
      <button onClick={open} id="add-button">
        Add Task To This Project
      </button>
      {modalOpen && (
        <div>
          <AddItem
            user={props.userInfo}
            getUserData={props.getUserData}
            userItems={props.userItems}
            modalOpen={modalOpen}
            handleClose={close}
            standHabits={props.standHabits}
          />
        </div>
      )}
    </div>
  );
}
