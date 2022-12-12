import {
  collection,
  getDocs,
  where,
  doc,
  getDoc,
  query,
  updateDoc,
  addDoc,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { db } from "../../firebase";

export default function CreatePet(props) {
  const [petName, setPetName] = useState("");
  //let imageArray = [];
  const [imageArray, setImageArray] = useState([]);
  const [chosenPet, setChosenPet] = useState("");
  const handleChange = (e) => {
    console.log("echo");
    setChosenPet(e.target.value);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (petName !== "") {
      await addDoc(props.petCol, {
        petName,
        imageUrl: chosenPet,
        level: 5,
        exp: 0,
      });
      setPetName("");
      props.setPetExists(true);
    }
    console.log("Submitted");
  };
  const getImages = () => {
    let petImagesCol = collection(db, "petImages");
    let arr = [];
    getDocs(petImagesCol).then((snapshot) => {
      snapshot.docs.forEach((doc) => {
        arr.push(doc.data().url);
      });
      setImageArray(arr);
      console.log({ imageArray });
    });
  };
  useEffect(getImages, []);
  return (
    <main>
      <form onSubmit={handleSubmit}>
        <section>
          <div>
            Name:{" "}
            <input
              type="text"
              placeholder="Fido"
              value={petName}
              onChange={(e) => setPetName(e.target.value)}
            />
          </div>
          <div>
            {imageArray.length > 0 &&
              imageArray.map((image) => (
                <div>
                  <input
                    type="radio"
                    name="petPics"
                    value={image}
                    onChange={handleChange}
                  />
                  <img src={image} />
                </div>
              ))}
          </div>
          <button>Create Pet!</button>
        </section>
      </form>
    </main>
  );
}
