import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import {
  collection,
  addDoc,
  FieldValue,
  Timestamp,
  getDocs,
} from "firebase/firestore";
import { motion, AnimatePresence } from "framer-motion";
import Backdrop from "./Backdrop";

const dropIn = {
  hidden: {
    y: "-100vh",
    opacity: 0,
  },
  visible: {
    y: "0",
    opacity: 1,
    transition: {
      duration: 0.1,
      type: "spring",
      damping: 25,
      stiffness: 500,
    },
  },
  exit: {
    y: "100vh",
    opacity: 0,
  },
};

//let standHabits = ["Walk", "Run", "Water", "Meditate"];

export default function AddItem(props, { handleClose, text }) {
  const [title, setTitle] = React.useState("");

  const [addingHabits, setAddingHabbits] = useState([]);

  const checkboxTogglerValue = (id) => {
    console.log(id.target.checked);
    console.log(id.target);
    if (id.target.checked && addingHabits.indexOf(id.target.name) == -1) {
      setAddingHabbits([...addingHabits, id.target.name]);
    }
    if (id.target.checked !== false) {
      if (addingHabits.indexOf(id.target.name) !== -1) {
        let tempArr = addingHabits;
        tempArr.splice(addingHabits.indexOf(id.target.name), 1);
        setAddingHabbits(tempArr);
      }
    }
    console.log(addingHabits);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(e.target);
    console.log({ title });
    console.log(addingHabits);
    addingHabits.forEach((habit) => {
      console.log(habit);
      addDoc(collection(db, `users/${props.user.uid}/todos`), {
        title: habit,
        createdAt: new Date(),

        index: props.userItems.length + 1,
      });
    });
    if (title !== "") {
      await addDoc(collection(db, `users/${props.user.uid}/todos`), {
        title,
        createdAt: new Date(),
        completed: false,
        index: props.userItems.length + 1,
      });
      setTitle("");
    }
    //setAddingHabbits([]);
    props.getUserData();
    props.handleClose();
  };

  return (
    <Backdrop onClick={props.handleClose}>
      <motion.div
        onClick={(e) => e.stopPropagation()}
        className="modal"
        variants={dropIn}
        initial="hidden"
        animate="visible"
        exit="exit">
        <form onSubmit={handleSubmit}>
          <div className="box-space">
            {props.standHabits.map((item) => (
              <div className="checkboxes">
                <input
                  key={`${item}-checkbox`}
                  type="checkbox"
                  name={item}
                  onChange={checkboxTogglerValue}
                />
                <label htmlFor={item} className="checkbox-label">
                  {item}
                </label>
              </div>
            ))}
          </div>
          <div className="input_container">
            <input
              type="text"
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className="btn_container">
            <button>Add Task</button>
          </div>
        </form>
        <button onClick={props.handleClose}>Cancel</button>
      </motion.div>
    </Backdrop>
  );
}
