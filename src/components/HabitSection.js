import React from "react";
import { useState, useEffect } from "react";
import AddItem from "./AddItem";
import LineItem from "./LineItem";
import AddSubLevelTask from "./AddSubLevelTask";
import { db } from "../firebase";
import { Accordion } from "@mui/material";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Typography from "@mui/material/Typography";
import {
  collection,
  getDocs,
  orderBy,
  query,
  updateDoc,
  doc,
} from "firebase/firestore";
import { styled } from "@mui/material/styles";
const MyAccordian = styled(Accordion)(({ theme }) => ({
  backgroundColor: "#404040",
  margin: "auto",
  marginBottom: "10px",
  "&.Mui-expanded": {
    margin: "auto",
    marginBottom: "10px",
  },
}));
export default function HabitSection(props) {
  let userItemRef = collection(db, `users/${props.userInfo.uid}/todos`);
  const [userSubItems, setUserSubItems] = useState([]);
  let localItemArray = [];
  const [storedItem, setStoredItem] = useState();
  let testArr = [];
  const getUserData = () => {
    //console.log("Ran getUserData()");
    //console.log(userInfo);
    userItemRef = collection(db, `users/${props.userInfo.uid}/todos`);
    const sortedItemsQuery = query(userItemRef, orderBy("index"));
    /*onSnapshot(qu, (snapshot) => {
      let books = [];
      snapshot.docs.forEach((doc) => {
        books.push({ ...doc.data(), id: doc.id });
      });
      console.log(books);
    });*/
    getDocs(sortedItemsQuery)
      .then((snapshot) => {
        //const q = query(citiesRef, orderBy("name", "desc"), limit(3));
        //const qu = query(userItemRef, orderBy("id", "desc"), limit(10));
        //console.log(qu);
        localItemArray = [];
        //console.log({ userInfo });
        //console.log(snapshot.docs);
        snapshot.docs.forEach((doc) => {
          localItemArray.push({ ...doc.data(), id: doc.id });
        });
        setUserSubItems(localItemArray);
        //console.log({ bookArr });
      })
      .catch((error) => console.log(error.message));
  };
  useEffect(() => getUserData(), []);
  const [modalOpen, setModalOpen] = useState(false);
  const close = () => setModalOpen(false);
  const open = (passedItem) => {
    setModalOpen(true);
  };

  const [expanded, setExpanded] = React.useState(false);

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  return (
    <div>
      {props.userItems.map((task, index) => (
        <MyAccordian
          expanded={expanded === index}
          onChange={handleChange(index)}
          className="task-block"
          key={task.id}
          item={task}
          handleDelete={props.handleDelete}
          getUserData={props.getUserData}>
          <AccordionSummary
            expandIcon="↓"
            aria-controls="panel2bh-content"
            id="panel2bh-header">
            <Typography sx={{ width: "33%", flexShrink: 0 }}>
              {task.title}
            </Typography>
            {window.innerWidth > 900 && (
              <Typography sx={{ color: "text.secondary" }}>
                {task.category && task.category}
              </Typography>
            )}
          </AccordionSummary>
          <AccordionDetails>
            {window.innerWidth > 900 && <h2 style={{color: "white"}}>{task.title}</h2>}

            {/*<p>Item ID: {task.id} </p>*/}
            <button
              onClick={() => {
                open();
                setStoredItem(task);
              }}
              className="add-button">
              Add Task To This Project
            </button>
            <table className="task-table">
              {task.subtasks &&
                task.subtasks.map((item) => (
                  <LineItem
                    user={props.userInfo}
                    task={task}
                    item={item}
                    handleDelete={props.handleDelete}
                    handleCheckIn={props.handleCheckIn}
                    getUserData={props.getUserData}
                  />
                ))}
            </table>
            <button
              className="complete-button"
              onClick={async () => {
                await updateDoc(
                  doc(db, `users/${props.userInfo.uid}/todos`, task.id),
                  {
                    completed: true,
                  }
                );
              }}>
              Complete Task
            </button>
            <button
              className="delete-button"
              onClick={() => props.handleDelete(task.id)}>
              Delete Task
            </button>
          </AccordionDetails>
        </MyAccordian>
      ))}
      {modalOpen && (
        <div>
          <AddSubLevelTask
            user={props.userInfo}
            getUserData={props.getUserData}
            userItems={props.userItems}
            modalOpen={modalOpen}
            handleClose={close}
            standHabits={props.standHabits}
            item={storedItem}
          />
        </div>
      )}
    </div>
  );
}
