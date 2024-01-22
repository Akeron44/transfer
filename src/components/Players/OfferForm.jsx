import classes from "./OfferForm.module.css";
import { IonIcon } from "@ionic/react";
import { chevronForwardOutline, checkmarkOutline } from "ionicons/icons";
import { useState, useRef, useContext, useEffect } from "react";
import useHttp from "../../hooks/useHttp";
import PlayerContext from "../../context/context";
import HoverInfo from "../../UI/HoverInfo";
import Feedback from "../../UI/Feedback";

const OfferForm = (props) => {
  // USING FORM AND INPUT STATE
  const [showForm, setShowForm] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [hovering, setHovering] = useState(false);
  const [formState, setFormState] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);

  // GET INPUT REF TO SUBMIT IT IN THE FORM
  const offerRef = useRef();

  // CALLING CONTEXT DATA AND FUNCTIONS
  const {
    formSubmittedHandler,
    selectedTeam,
    budgetLeft,
    loggedTeamManager,
    formSubmitted,
  } = useContext(PlayerContext);

  // CALLING HTTP CUSTOM HOOK
  const { managePlayerDataHandler: sentHttpOfferToClubHandler, didSubmit } =
    useHttp();

  // CHECK IF THE FORM WAS SUBMITTED AND UPDATE THE FORM ACCORDINGLY
  useEffect(() => {
    formSubmittedHandler(didSubmit); // SEND THE STATE TO THE CONTEXT SO OTHER COMPONENTS UPDATE ACCORDINGLY
    setTimeout(() => {
      if (didSubmit) {
        setShowForm(false);
        setInputValue("");
      }
    }, 200);
  }, [formSubmittedHandler, formSubmitted, didSubmit]);

  //CHECK IF THE FORM IS READY TO BE SENT
  useEffect(() => {
    if (
      inputValue >= props.price - 15 &&
      inputValue <= budgetLeft &&
      inputValue
    ) {
      setFormState(true);
    } else {
      setFormState(false);
    }
  }, [inputValue, budgetLeft]);

  // TOGGLE FORM TO OPEN-CLOSE
  function showPlayerFormHandler() {
    setShowForm((prevState) => !prevState);
  }

  // SEND THE OFFER TO THE BACKEND
  function sendOfferHandler(event) {
    event.preventDefault();
    if (!formState) {
      return;
    }

    const playerOffer = offerRef.current.value;
    sentHttpOfferToClubHandler({
      url: "https://players-c7f1b-default-rtdb.firebaseio.com/deadline/negotiation.json",
      method: "POST",
      body: JSON.stringify({
        id: props.id,
        price: props.price,
        name: props.name,
        age: props.age,
        sentOffer: +playerOffer,
        from: loggedTeamManager,
        to: selectedTeam,
        status: "Pending...",
        src: props.src,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  function mouseEnterHandler() {
    setHovering(true);
  }
  function mouseLeaveHandler() {
    setHovering(false);
  }

  function showFeedbackHandler() {
    setShowFeedback(true);
  }
  function hideFeedbackHandler() {
    setShowFeedback(false);
  }
  return (
    <>
      {/* IF THE PLAYER HAS NO OFFER THEN SHOW ARROW ICON -> FORM */}
      {!props.status ? (
        <IonIcon
          onClick={showPlayerFormHandler}
          className={`${classes.ion_icon} ${
            showForm ? classes.arrow__rotate : ""
          }`}
          icon={chevronForwardOutline}
          onMouseEnter={mouseEnterHandler}
          onMouseLeave={mouseLeaveHandler}
        />
      ) : (
        // IF THE PLAYER HAS A OFFER THEN SHOW CHECK ICON
        <IonIcon className={classes.ion_icon__check} icon={checkmarkOutline} />
      )}
      {hovering && !showForm && (
        <HoverInfo top="40%" right="-70%" direction="left">
          Send an offer
        </HoverInfo>
      )}
      <form
        onSubmit={sendOfferHandler}
        className={`${classes.form} ${showForm ? classes.slide__right : ""}`}
      >
        <input
          value={inputValue}
          ref={offerRef}
          type="number"
          placeholder="--M€"
          min={props.price - 15}
          max={budgetLeft}
          onChange={(e) => {
            setInputValue(e.target.value);
          }}
        />
        {formState && (
          <button className={classes.button__abled} type="submit">
            Send
          </button>
        )}
        {!formState && (
          <button
            onClick={showFeedbackHandler}
            className={classes.button__disabled}
            type="click"
          >
            Send
          </button>
        )}
      </form>

      {showFeedback && (
        <Feedback
          title="This offer can't be sent!"
          message="The player offer can't be empty or less than 15M euros than the
            player price. It can't exceed the left budget either."
          onHide={hideFeedbackHandler}  

        />
      )}
    </>
  );
};

export default OfferForm;
