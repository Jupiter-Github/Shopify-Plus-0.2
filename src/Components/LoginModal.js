import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import {
  setLoginStatus,
  setStateProperty,
  addToCart,
} from "../Redux/EcomActions";
import { db, auth } from "../firebase-config";
import { collection, getDoc, doc, setDoc } from "firebase/firestore";
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import loginImg from "./Images/loginImg.jpg";
import { Modal, ModalHeader, ModalBody, Row, Col } from "reactstrap";
import * as firebaseui from "firebaseui";
import "firebaseui/dist/firebaseui.css";

const LoginModal = ({ toggleShowModal }) => {
  const [modal, setModal] = useState(true);
  const dispatch = useDispatch();
  const toggle = () => {
    setModal(!modal);

    if (toggleShowModal) {
      toggleShowModal("showModel");
    }
  };

  const getUserDataFromDb = (user) => {
    const { uid, displayName, email } = user;
    const collectionRef = collection(db, "users");
    const docRef = doc(collectionRef, uid);
    getDoc(docRef).then((docSnap) => {
      if (!docSnap.exists()) {
        setDoc(docRef, {
          uid,
          displayName,
          email,
          cartItems: [],
          address: {},
          paymentDetails: {},
          orderedItems: {},
          finalBillAmount: 0,
        }).then(() => {
          getUserDataFromDb(user);
        });
        console.log("USER DOES NOT EXIST IN DB");
      } else {
        const dbData = docSnap.data();
        dispatch(setStateProperty("activeUserData", dbData));
        dispatch(addToCart(dbData.cartItems));
      }
    });
  };

  const uiConfig = {
    signInFlow: "popup",
    signInOptions: [
      firebase.auth.EmailAuthProvider.PROVIDER_ID,
      {
        provider: firebase.auth.GoogleAuthProvider.PROVIDER_ID,
        clientId:
          "277241443311-oa43kj36pg9cedmodv1sdpqqb3qo7atm.apps.googleusercontent.com",
        customParameters: {
          prompt: "select_account",
        },
      },
    ],
    callbacks: {
      signInSuccessWithAuthResult: (authResult) => {
        getUserDataFromDb(authResult.user);
        dispatch(setLoginStatus(true));
        toggle();
        return false;
      },
    },
  };

  useEffect(() => {
    setTimeout(() => {
      ui.start("#firebaseui-auth-container", uiConfig);
    }, 500);
    const ui =
      firebaseui.auth.AuthUI.getInstance() || new firebaseui.auth.AuthUI(auth);
  }, []);

  return (
    <>
      <Modal isOpen={modal} toggle={toggle}>
        <ModalHeader toggle={toggle}>Please Login First!</ModalHeader>
        <ModalBody>
          <Row className="g-0">
            <Col xs="12" md="6">
              <img src={loginImg} alt="login Img" className=" img-fluid" />
            </Col>
            <Col
              xs="12"
              className="justify-content-center d-flex align-items-center"
              md="6"
            >
              <div id="firebaseui-auth-container"></div>
            </Col>
          </Row>
        </ModalBody>
      </Modal>
    </>
  );
};

export default LoginModal;
