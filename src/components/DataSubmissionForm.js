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
  arrayRemove,
  arrayUnion,
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

export default function DataSubmissionForm(props) {
  const [title, setTitle] = React.useState("");
  const [timeOfCompletion, setTimeOfCompletion] = React.useState();
  const [moodOnCompletion, setMoodOnCompletion] = React.useState("");

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
    console.log(props.user);

    await updateDoc(doc(db, `users/${props.user.uid}/todos/${props.task.id}`), {
      subtasks: arrayRemove(props.item),
    });
    let objecto = {
      ...props.item,
      completed: true,
      timeOfCompletion,
      moodOnCompletion,
    };

    await updateDoc(doc(db, `users/${props.user.uid}/todos/${props.task.id}`), {
      subtasks: arrayUnion(objecto),
    });
    setTitle("");
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
          <div className="input_container">
            <div className="time-input">
              <label for="appt-time">
                <h4>Time Of Completion:</h4>
              </label>
              <input
                id="appt-time"
                type="time"
                name="appt-time"
                onChange={(e) => setTimeOfCompletion(e.target.value)}
                required
              />
            </div>
            <br />
            <div className="mood-input">
              <h4>How Did You Feel When You Finished This Task?</h4>
              <div>
                <input
                  type="radio"
                  className="radio-1"
                  name="radio"
                  value="Good"
                  onChange={(e) => setMoodOnCompletion(e.target.value)}
                  required
                />
                <label for="Good">Good</label>

                <input
                  type="radio"
                  className="radio-1"
                  name="radio"
                  value="Meh"
                  onChange={(e) => setMoodOnCompletion(e.target.value)}
                  required
                />
                <label for="Meh">Meh</label>

                <input
                  type="radio"
                  className="radio-1"
                  name="radio"
                  value="Bad"
                  onChange={(e) => setMoodOnCompletion(e.target.value)}
                  required
                />
                <label for="Bad">Bad</label>
                <br />
                <input
                  type="radio"
                  className="radio-1"
                  name="radio"
                  value="Energized"
                  onChange={(e) => setMoodOnCompletion(e.target.value)}
                  required
                />
                <label for="Energized">Energized</label>

                <input
                  type="radio"
                  className="radio-1"
                  name="radio"
                  value="Neutral"
                  onChange={(e) => setMoodOnCompletion(e.target.value)}
                  required
                />
                <label for="Neutral">Neutral</label>

                <input
                  type="radio"
                  className="radio-1"
                  name="radio"
                  value="Tired"
                  onChange={(e) => setMoodOnCompletion(e.target.value)}
                  required
                />
                <label for="Tired">Tired</label>
                <br />
                <input
                  type="radio"
                  className="radio-1"
                  name="radio"
                  value="Accomplished"
                  onChange={(e) => setMoodOnCompletion(e.target.value)}
                  required
                />
                <label for="Accomplished">Accomplished</label>

                <input
                  type="radio"
                  className="radio-1"
                  name="radio"
                  value="Frustrated"
                  onChange={(e) => setMoodOnCompletion(e.target.value)}
                  required
                />
                <label for="Frustrated">Frustrated</label>
              </div>
            </div>
          </div>
          <div className="btn_container">
            <button>Confirm</button>
          </div>
        </form>
        <button onClick={props.handleClose}>Cancel</button>
      </motion.div>
    </Backdrop>
  );
}
