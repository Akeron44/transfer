import classes from "./Header.module.css";
import { IonIcon } from "@ionic/react";
import { trailSignOutline, menuOutline, logOutOutline, optionsOutline } from "ionicons/icons";
import OffersReceived from "./Negotiations/OffersReceived";
import { useContext, useState } from "react";
import PlayerContext from "../context/context";
import Options from "./Header/Options";

const Header = (props) => {
  const [receivedOffersNumber, setReceivedOffersNumber] = useState(0);
  const {negotiations} = useContext(PlayerContext);
  const pendingNegotiations = negotiations.filter(n => n.status === "Pending...")

  function getReveivedOffersNumberHandler(num) {
    setReceivedOffersNumber(num);
  }
  // CONTEXT HELPING FUNCTIONS AND BOOLEANS
  const {
    toggleReceivedListHandler,
    toggleSentListHandler,
    loggedTeamManager,
  } = useContext(PlayerContext);

  // LOG OUT FUNCTION AND REMOVE IT FROM LOCAL STORAGE AS WELL
  function logOutHandler() {
    localStorage.removeItem("teamManager");
    props.logOutManager();
  }

  return (
    <header className={classes.header}>
      <div className={classes.logo_container}>
        <img
          style={{ height: "6.4rem" }}
          //CHECK WHICH TEAM IS LOGGED IN AND SHOW THE CORRECT LOGO
          src='/milanLogo.png'
          alt="Athletic Club Milan's Logo"
        />
        <h1>Transfer Window</h1>
        <IonIcon className={classes.ion_icon} icon={trailSignOutline} />
      </div>

      <div className={classes.action_container}>
        {/* LOG OUT BUTTON */}
        <div className={`${classes.action_buttons} ${classes.logout}`}>
          <button onClick={logOutHandler}>Log out</button>
          <IonIcon className={classes.ion_icon} icon={logOutOutline} />
        </div>
        {/* OPTIONS MENU FOR SMARTPHONES AND TABLETS */}
        <div onClick={showOptionsHandler} className={`${classes.action_buttons} ${classes.primary__secondary}`}>
          <IonIcon className={classes.ion_icon} icon={optionsOutline} />
        </div>
        {/* OFFERS RECEIVED BUTTON */}
        <div onClick={toggleReceivedListHandler} className={`${classes.action_buttons} ${classes.priority}`}>
          <button>Offers received</button>
          <h3 className={classes.offers__received}>({receivedOffersNumber})</h3>
          <IonIcon className={classes.ion_icon} icon={menuOutline} />
        </div>
        {/* OFFERS SENT BUTTON */}
        <div onClick={toggleSentListHandler} className={`${classes.action_buttons} ${classes.secondary}`}>
          <button>Offers sent</button>
          <h3 className={classes.offers__received}>({pendingNegotiations.length})</h3>
          <IonIcon className={classes.ion_icon} icon={menuOutline} />
        </div>
      </div>
      <OffersReceived getOffersNumber={getReveivedOffersNumberHandler} />
    </header>
  );
};

export default Header;