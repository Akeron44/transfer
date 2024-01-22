import { useContext } from "react";
import PlayerContext from "../../context/context";
import { IonIcon } from "@ionic/react";
import { closeOutline, logOutOutline, menuOutline } from "ionicons/icons";
import classes from "./Options.module.css";

const Options = (props) => {
  // CONTEXT HELPING FUNCTIONS AND BOOLEANS
  const {
    optionsOpened,
    toggleOptionsOpenedHandler,
    toggleReceivedListHandler,
    toggleSentListHandler,
  } = useContext(PlayerContext);

  function logOutAndCloseMenuHandler() {
    props.logOut();
    toggleOptionsOpenedHandler();
  }

  return (
    <section
      className={`${classes.options__section} ${
        optionsOpened ? classes.swipe__left : ""
      }`}
    >
      <IonIcon
        onClick={toggleOptionsOpenedHandler}
        className={classes.ion_icon}
        icon={closeOutline}
      />
      <div className={classes.action__buttons__container}>
        <div className={classes.action_buttons}>
          <button onClick={toggleReceivedListHandler}>
            OFFERS RECEIVED ({props.receivedOffersNumber})
          </button>
        </div>
        <div className={classes.action_buttons}>
          <button onClick={toggleSentListHandler}>
            OFFERS SENT ({props.sentOffersNumber})
          </button>
        </div>
        <div className={`${classes.action_buttons} ${classes.logout}`}>
          <button onClick={logOutAndCloseMenuHandler}>LOG OUT</button>
          <IonIcon className={classes.ion_icon__logout} icon={logOutOutline} />
        </div>
      </div>
    </section>
  );
};

export default Options;
