import React from "react";
import { useState } from "react";
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

export default function Warning(props, { handleClose, text }) {
  const [modalOpen, setModalOpen] = useState(false);
  const close = () => {
    setModalOpen(false);
    console.log("test");
  };
  const open = () => setModalOpen(true);
  return (
    <Backdrop onClick={close}>
      <motion.div
        onClick={(e) => e.stopPropagation()}
        className="modal"
        variants={dropIn}
        initial="hidden"
        animate="visible"
        exit="exit">
        <div>
          <h2>Lecturer's Note:</h2>
          <p>
            Please note this is intended as a basic prototype of the final
            digital artefact for my MA Thesis. I have set up a sample task where
            users can log in, add, delete and check off sub-tasks.
          </p>
          <motion.button
            className="save-button"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={close}>
            {" "}
            Okay{" "}
          </motion.button>
        </div>
      </motion.div>
    </Backdrop>
  );
}
