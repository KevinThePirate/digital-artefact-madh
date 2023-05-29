import React from "react";
import { useState, useEffect } from "react";
import AddItem from "./AddItem";
import LineItem from "./LineItem";
import AddSubLevelTask from "./AddSubLevelTask";
import { db } from "../firebase";
import {
  collection,
  getDocs,
  orderBy,
  query,
  updateDoc,
  doc,
} from "firebase/firestore";

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

  return (
    <div>
      {props.userItems.map((task) => (
        <div
          className="task-block"
          key={task.id}
          item={task}
          handleDelete={props.handleDelete}
          getUserData={props.getUserData}>
          <button onClick={() => props.handleDelete(task.id)}>
            Delete Task
          </button>
          <button
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
          <h2>{task.title}</h2>
          <p>Item ID: {task.id} </p>
          <button
            onClick={() => {
              open();
              setStoredItem(task);
            }}
            id="add-button">
            Add Sub-Task To This Project
          </button>
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
        </div>
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
