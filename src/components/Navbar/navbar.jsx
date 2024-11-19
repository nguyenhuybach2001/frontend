import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import s from "./navbar.module.scss";
import { Modal } from "antd";

function Navbar() {
  const [isVisible, setIsVisible] = useState(false);
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };
  return (
    <>
      <div className={s.wrapper + " " + (isVisible && s.scroll)}>
        <div className={s.body}>
          <div className={s.links}>
            <Link to="/">Home</Link>
            <Link to="/login">Login</Link>
            <Link to="/login">Login</Link>
          </div>
          <div>
            <button onClick={showModal}>Login</button>
          </div>
        </div>
      </div>
      <Modal
        title="Basic Modal"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <p>Some contents...</p>
        <p>Some contents...</p>
        <p>Some contents...</p>
      </Modal>
    </>
  );
}

export default Navbar;
