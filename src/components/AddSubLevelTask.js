import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import {
  collection,
  addDoc,
  FieldValue,
  Timestamp,
  getDocs,
  updateDoc,
  doc,
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

export default function AddSubLevelTask(props) {
  const [title, setTitle] = React.useState("");

  /*const [addingHabits, setAddingHabbits] = useState([]);

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
  }; */
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(e.target);
    console.log({ title });
    /*console.log(addingHabits);
    addingHabits.forEach((habit) => {
      console.log(habit);
      addDoc(collection(db, `users/${props.user.uid}/todos`), {
        title: habit,
        createdAt: new Date(),

        index: props.userItems.length + 1,
      });
    }); */
    if (title !== "") {
      console.log(props.item.id);
      console.log(typeof props.item.subtasks);
      if (props.item.subtasks) {
        await updateDoc(
          doc(db, `users/${props.user.uid}/todos/${props.item.id}`),
          {
            subtasks: [
              ...props.item.subtasks,
              {
                title,
                completed: false,
              },
            ],
          }
        );
      } else {
        await updateDoc(
          doc(db, `users/${props.user.uid}/todos/${props.item.id}`),
          {
            subtasks: [
              {
                title,
                completed: false,
              },
            ],
          }
        );
      }
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
                <input key={`${item}-checkbox`} type="checkbox" name={item} />
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
