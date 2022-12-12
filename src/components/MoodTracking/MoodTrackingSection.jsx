import {
  addDoc,
  collection,
  query,
  orderBy,
  getDocs,
  startAt,
  where,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { db } from "../../firebase";
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Label } from "recharts";

export default function MoodTrackingSection(props) {
  const moodCol = collection(db, `users/${props.userInfo.uid}/moods`);
  let totalIndex = 0;
  let moodVal = "";
  let todaysDate = new Date().toDateString();
  const [todaysCheckin, checkInToday] = useState(false);

  let [moodLog, setMoodLog] = useState([]);

  const sortedItemsQuery = query(
    moodCol,
    orderBy("index"),
    startAt(totalIndex - 30)
  );

  const updateLog = () => {
    let localArr = [];
    getDocs(sortedItemsQuery).then((snapshot) => {
      snapshot.docs.forEach((doc) => {
        console.log(typeof doc.data().createdAt);
        localArr.push(doc.data());
      });
    });
    setMoodLog(localArr);
  };

  const logMood = (e) => {
    getDocs(sortedItemsQuery)
      .then((snapshot) => {
        totalIndex = snapshot.docs.length;
        console.log(totalIndex);
      })
      .then(() => {
        console.log({ totalIndex });
        const mood = e.target.textContent;
        switch (mood) {
          case "Great":
            moodVal = 5;
            break;
          case "Good":
            moodVal = 4;
            break;
          case "Eh":
            moodVal = 3;
            break;
          case "Not Great":
            moodVal = 2;
            break;
          case "Terrible":
            moodVal = 1;
            break;
          default:
            moodVal = 3;
        }
        addDoc(moodCol, {
          name: mood,
          mood: mood,
          moodValue: moodVal,
          createdAt: todaysDate,
          index: totalIndex + 1,
        });
        updateLog();
        checkInToday(true);
      });
  };

  useEffect(() => {
    updateLog();
    const q = query(moodCol, where("createdAt", "==", todaysDate));
    getDocs(q).then((snapshot) => {
      console.log(snapshot.docs);
      if (snapshot.docs.length > 0) {
        console.log("Found");
        checkInToday(true);
      } else {
        console.log("Not Found");
        checkInToday(false);
      }
    });
    console.log(q);
  }, []);
  return (
    <div>
      {moodLog.length > 0 ? (
        <div>
          {todaysCheckin == true ? (
            <div>
              <LineChart
                width={600}
                height={300}
                data={moodLog}
                margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <Line type="monotone" dataKey="moodValue" stroke="#8884d8" />
                <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
                <XAxis dataKey="Mood">
                  <Label
                    value="Your Mood Over The Last 30 Days"
                    offset={0}
                    position="insideBottom"
                  />
                </XAxis>
                <YAxis domain={[0, "dataMax"]} hide={true}></YAxis>
              </LineChart>
            </div>
          ) : (
            <div>
              <h3> How Do You Feel Today?</h3>
              <button onClick={logMood}>Great</button>
              <button onClick={logMood}>Good</button>
              <button onClick={logMood}>Eh</button>
              <button onClick={logMood}>Not Great</button>
              <button onClick={logMood}>Terrible</button>
            </div>
          )}
        </div>
      ) : (
        <div>
          <h3> How Do You Feel Today?</h3>
          <button onClick={logMood}>Great</button>
          <button onClick={logMood}>Good</button>
          <button onClick={logMood}>Eh</button>
          <button onClick={logMood}>Not Great</button>
          <button onClick={logMood}>Terrible</button>
        </div>
      )}
    </div>
  );
}
