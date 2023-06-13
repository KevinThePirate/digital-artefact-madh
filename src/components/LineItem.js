import React, { useEffect, useState } from "react";
import "./componentStyling/LineItem.css";
import { arrayRemove, arrayUnion, doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";

import { motion, AnimatePresence } from "framer-motion";
import Backdrop from "./Backdrop";
import DataSubmissionForm from "./DataSubmissionForm";

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

export default function LineItem(props) {
  const [modalOpen, setModalOpen] = useState(false);
  const close = () => setModalOpen(false);
  const open = (passedItem) => {
    setModalOpen(true);
  };
  const [storedItem, setStoredItem] = useState();
  const dateObj = new Date();
  const todaysDate = dateObj.toDateString();
  let classes = "";
  const [classList, setClassList] = useState("");
  const styling = () => {
    if (props.item.completed == true) {
      setClassList("checked-in");
    }
  };
  const deleteSelf = async () => {
    console.log("Run Delete Self");
    console.log(props.item.title);
    //props.handleDelete(props.item.id);
    await updateDoc(doc(db, `users/${props.user.uid}/todos/${props.task.id}`), {
      subtasks: arrayRemove(props.item),
    });
    console.log(props.user.uid);
    console.log(props.task.id);
    console.log("testo");
    props.getUserData();
  };
  const checkInSelf = async () => {
    /*await updateDoc(doc(db, `users/${props.user.uid}/todos/${props.task.id}`), {
      subtasks: arrayRemove(props.item),
    });
    let objecto = {
      ...props.item,
      completed: true,
    };
    await updateDoc(doc(db, `users/${props.user.uid}/todos/${props.task.id}`), {
      subtasks: arrayUnion(objecto),
    }); */
    styling();
  };
  useEffect(() => styling());
  return (
    <tr className={classList}>
      <td style={{ width: "70%" }}>{props.item.title}</td>
      <td style={{ width: "30%" }}>
        <button
          className="check-button"
          onClick={() => {
            open();
            setStoredItem(props.task);
          }}>
          ✓
        </button>
        <button className="x-button" onClick={deleteSelf}>
          X
        </button>
      </td>
      {modalOpen && (
        <div>
          <DataSubmissionForm
            user={props.user}
            task={props.task}
            getUserData={props.getUserData}
            userItems={props.userItems}
            modalOpen={modalOpen}
            handleClose={close}
            item={props.item}
          />
        </div>
      )}
    </tr>
  );
}
