import { IonIcon } from "@ionic/react";
import {
  createOutline,
  closeOutline,
  arrowForwardCircleOutline,
  checkmarkDoneOutline,
} from "ionicons/icons";
import classes from "./NegDetails.module.css";
import { useEffect, useState } from "react";
import useHttp from "../../hooks/useHttp";
import HoverInfo from "../../UI/HoverInfo";
import Feedback from "../../UI/Feedback";

const NegDetails = (props) => {
  const [editingOffer, setEditingOffer] = useState(false);
  const [newOffer, setNewOffer] = useState(props.sentOffer);
  const [offerStatus, setOfferStatus] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [hoveringCheck, setHoveringCheck] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  // const [offerUpdated, setOfferUpdated] = useState(false);

  const { managePlayerDataHandler: patchPlayerDetailsHandler, isLoading } =
    useHttp();

    // useEffect(() => {
    //   if(offerUpdated) {
    //     setShowFeedback(true)
    //   }
    // }, [offerUpdated]);

  // CHECK IF THE NEW OFFER SHOULD BE SENT
  useEffect(() => {
    if (
      newOffer === props.sentOffer ||
      newOffer < props.price - 15 ||
      newOffer > props.budgetLeft + props.sentOffer ||
      !newOffer
    ) {
      setOfferStatus(false);
    } else {
      setOfferStatus(true);
    }
  }, [newOffer, props.sentOffer, props.price, props.budgetLeft]);

  // CHECK IF THE OFFER WAS EDITED AND TRIGGER A RERUN ON THE NegotiationsSection.jsx
  useEffect(() => {
    props.didUpdate(isLoading);
  }, [isLoading]);

  //CHECK IF THE EDIT BUTTON WAS CLICKED AND UPDATE STATE
  function activateEditButtonHandler() {
    setEditingOffer(true);
    setHovering(false);
  }
  function deactivateEditButtonHandler() {
    setEditingOffer(false);
  }

  // SEND THE NEW OFFER TO THE BACKEND
  async function editPlayerOfferHandler(key) {
    if (!offerStatus) {
      return;
    }

    await patchPlayerDetailsHandler({
      url: `https://players-c7f1b-default-rtdb.firebaseio.com/deadline/negotiation/${key}.json`,
      method: "PATCH",
      body: JSON.stringify({
        sentOffer: newOffer,
        offerUpdated: true,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    setEditingOffer(false);
    // setOfferUpdated(true);
  }

  function mouseEnterHandler() {
    setHovering(true);
  }
  function mouseLeaveHandler() {
    setHovering(false);
  }

  function mouseEnterHandlerCheck() {
    setHoveringCheck(true);
  }
  function mouseLeaveHandlerCheck() {
    setHoveringCheck(false);
  }

  function showFeedbackHandler() {
    setShowFeedback(true);
  }
  function hideFeedbackHandler() {
    setShowFeedback(false);
  }

  return (
    <div key={props.id} className={classes.ng__list}>
      <div className={classes.offer__details}>
        {/*****OFFER-DETAILS*******/}
        <div className={classes.offer__details__container}>
          <div className={classes.name__price}>
            <img
              src={props.src}
              alt="player profile picture from Rafael Leao"
              className={classes.player__img}
            />
            <h4>
              {props.name} ({props.age})
            </h4>
          </div>
          <div className={classes.name__price}>
            <p className={classes.label}>
              {props.status === "Pending..." && editingOffer
                ? "New Offer: "
                : "Offer sent: "}
            </p>
            {props.status === "Pending..." && editingOffer ? (
              <input
                value={newOffer}
                className={classes.input}
                type="number"
                min={props.price - 15}
                max={props.budgetLeft + props.sentOffer}
                onChange={(e) => setNewOffer(parseFloat(e.target.value))}
              />
            ) : (
              <h4>{props.sentOffer}M€</h4>
            )}
            {/* ------ */}
          </div>
          {!props.offerUpdated &&
            props.status === "Pending..." &&
            !editingOffer &&
            !isLoading && (
              <IonIcon
                onClick={activateEditButtonHandler}
                icon={createOutline}
                className={classes.edit__icon}
                onMouseEnter={mouseEnterHandler}
                onMouseLeave={mouseLeaveHandler}
              />
            )}
          {hovering && !editingOffer && (
            <HoverInfo top=".5rem" right="4rem" direction="right">
              Edit Offer
            </HoverInfo>
          )}
          {isLoading && (
            <div style={{ margin: "2rem" }} className="lds-dual-ring"></div>
          )}
          {props.offerUpdated && props.status === "Pending..." && (
            <IonIcon
              icon={checkmarkDoneOutline}
              className={classes.updated__icon}
              onMouseEnter={mouseEnterHandlerCheck}
              onMouseLeave={mouseLeaveHandlerCheck}
              onClick={showFeedbackHandler}
            />
          )}
          {hoveringCheck && (
            <HoverInfo top=".3rem" right="3.5rem" direction="right">
              Offer updated!
            </HoverInfo>
          )}
          {editingOffer && props.status === "Pending..." && (
            <>
              <IonIcon
                onClick={deactivateEditButtonHandler}
                icon={closeOutline}
                className={classes.cancel__icon}
              />
              <IonIcon
                onClick={editPlayerOfferHandler.bind(null, props.id)}
                icon={arrowForwardCircleOutline}
                className={`${classes.send__icon} ${
                  !offerStatus ? classes.send__disabled : ""
                }`}
              />
            </>
          )}
        </div>
        {/*****OFFER-STATUS****/}
        <div className={classes.offer__status__container}>
          <div className={classes.status}>
            <p className={classes.pending}>Status: </p>
            <p
              className={`${
                (props.status === "Pending..." && classes.pending) ||
                (props.status === "Accepted" && classes.accepted) ||
                (props.status === "Declined" && classes.declined)
              }`}
            >
              {props.status}
            </p>
          </div>
          <div>
            <img
              className={classes.team__img}
              src={"/" + `${props.to}` + ".png"}
              alt="milan logo"
            />
          </div>
        </div>
        {/* *** */}
      </div>
      {showFeedback && (
        <Feedback
          title="This offer was updated!"
          message="The club has 2 weeks time to respond, before you can update your offer again."
          onHide={hideFeedbackHandler}
        />
      )}
    </div>
  );
};

export default NegDetails;
