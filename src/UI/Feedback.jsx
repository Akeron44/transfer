import { IonIcon } from "@ionic/react";
import { closeCircleOutline, checkmarkOutline } from "ionicons/icons";
import classes from "./Feedback.module.css";

const Feedback = ({ title, message, onHide }) => {
  return (
    <>
      <div onClick={onHide} className={classes.backdrop}></div>
      <div className={classes.modal}>
        <div className={classes.title__container}>
          <div className={classes.title}>{title}</div>
          <IonIcon
            onClick={onHide}
            className={classes.ion_icon}
            icon={closeCircleOutline}
          />
        </div>
        <div className={classes.message__container}>
          <p className={classes.message}>{message}</p>
          <button onClick={onHide}>OK</button>
        </div>
      </div>
    </>
  );
};

export default Feedback;
