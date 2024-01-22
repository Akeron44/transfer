import classes from "./OffersReceived.module.css";
import { useState, useCallback, useEffect, useContext } from "react";
import useHttp from "../../hooks/useHttp";
import PlayerContext from "../../context/context";
import { IonIcon } from "@ionic/react";
import { returnUpBackOutline } from "ionicons/icons";

const OffersReceived = (props) => {
  const [playersData, setPlayersData] = useState([]);
  const [submittedData, setSubmittedData] = useState(null);

  // CONTEXT HELPING FUNCTIONS AND BOOLEANS
  const {
    offersReceived,
    toggleReceivedListHandler,
    loggedTeamManager,
    offerResponseSubmittedHandler,
  } = useContext(PlayerContext);

  // CHECK IF THE OFFER WAS ACCEPTED OR DECLINED
  useEffect(() => {
    offerResponseSubmittedHandler(submittedData);
  }, [offerResponseSubmittedHandler, submittedData]);

  // FILTER OUT THE RECEIVED OFFERS OF THE LOGGED IN TEAM
  const negotionationsData = playersData
    .filter((players) => players.to === loggedTeamManager)
    .sort((a, b) => {
      const statusOrder = { "Pending...": 1, Accepted: 2, Declined: 3 };
      return statusOrder[a.status] - statusOrder[b.status];
    });

  useEffect(() => {
    //GET THE NUMBER OF THE RECEIVED PENDING OFFERS AND SEND IT TO HEADER COMPONENT TO SHOW IT
    const pendingReceivedOffer = negotionationsData.filter(
      (n) => n.status === "Pending..."
    );
    props.getOffersNumber(pendingReceivedOffer.length);
  }, [negotionationsData]);

  // GET ALL THE RECEIVED NEGOTIATION DATA FROM FIREBASE
  const { managePlayerDataHandler: getHttpSentOffersHandler, isLoading } =
    useHttp();
  const transformData = useCallback((data) => {
    const loadedArray = [];
    for (const key in data) {
      loadedArray.push({ ...data[key], key: key });
    }
    setPlayersData(loadedArray);
  }, []);

  useEffect(() => {
    getHttpSentOffersHandler(
      {
        url: "https://players-c7f1b-default-rtdb.firebaseio.com/deadline/negotiation.json",
      },
      transformData
    );
    setSubmittedData(false);
  }, [
    getHttpSentOffersHandler,
    transformData,
    submittedData,
    setSubmittedData,
  ]);

  // DECLINE OFFER ACTION HTTP HANDLER
  async function declineOfferHandler(player) {
    await getHttpSentOffersHandler({
      url: `https://players-c7f1b-default-rtdb.firebaseio.com/deadline/negotiation/${player.key}.json`,
      method: "PATCH",
      body: JSON.stringify({
        status: "Declined",
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    setSubmittedData(true);
  }

  // ACCEPT OFFER ACTION HTTLP HANDLER
  async function acceptOfferHandler(player) {
    // UPDATE THE STATUS OF THE RECEIVED NEGOTIATION
    await getHttpSentOffersHandler({
      url: `https://players-c7f1b-default-rtdb.firebaseio.com/deadline/negotiation/${player.key}.json`,
      method: "PATCH",
      body: JSON.stringify({
        status: "Accepted",
      }),
    });
    //  UPDATE THE TEAM OF THE PLAYER, ONCE THE OFFER IS ACCEPTED
    await getHttpSentOffersHandler({
      url: `https://players-c7f1b-default-rtdb.firebaseio.com/deadline/players/${player.id}.json`,
      method: "PATCH",
      body: JSON.stringify({
        team: player.from,
      }),
    });

    // FILTER OUT THE OFFER THAT YOU ACCEPTED
    const newArray = playersData.filter((players) => players !== player);
    // FIND THE OTHER OFFERS FOR THE SAME PLAYER
    const finalArray = newArray.filter((players) => players.id === player.id);

    // AUTOMATICALLY DECLINE THE OTHER OFFERS FOR THE SAME PLAYER WITH STATUS === "Pending..."
    if (finalArray.length !== 0) {
      for (const key of finalArray) {
        if (key.status === "Pending...") {
          await getHttpSentOffersHandler({
            url: `https://players-c7f1b-default-rtdb.firebaseio.com/deadline/negotiation/${key.key}.json`,
            method: "PATCH",
            body: JSON.stringify({
              status: "Declined",
            }),
          });
        };
      };
    };
    setSubmittedData(true);
  };

  return (
    <section
      className={`${classes.negotiations__section} ${
        offersReceived ? classes.swipe__left : ""
      }`}
    >
      <IonIcon
        onClick={toggleReceivedListHandler}
        className={classes.ion_icon}
        icon={returnUpBackOutline}
      />
      <div className={classes.ng__header}>
        <h3 className={classes.offers__sent}>Offers received</h3>
      </div>
      <div className={classes.scroll}>
        {negotionationsData.length !== 0 &&
          negotionationsData.map((player) => (
            <div key={player.key} className={classes.ng__list}>
              <div className={classes.offer__details}>
                {/****OFFER-DETAILS****/}
                <div className={classes.offer__details__container}>
                  <div className={classes.name__price}>
                    <img
                      src={player.src}
                      alt="player profile picture from Rafael Leao"
                    />
                    <h4>
                      {player.name} ({player.age})
                    </h4>
                  </div>
                  <div className={classes.offer__status__container}>
                    {!isLoading && player.status === "Pending..." && (
                      <>
                        <button
                          onClick={declineOfferHandler.bind(null, player)}
                          className={classes.decline__button}
                        >
                          Decline
                        </button>
                        <button
                          onClick={acceptOfferHandler.bind(null, player)}
                          className={classes.accept__button}
                        >
                          Accept
                        </button>
                      </>
                    )}
                    {isLoading && <div className="lds-dual-ring"></div>}
                    {!isLoading && player.status === "Declined" && (
                      <h4 className={classes.declined}>DECLINED</h4>
                    )}
                    {!isLoading && player.status === "Accepted" && (
                      <h4 className={classes.accepted}>ACCEPTED</h4>
                    )}
                  </div>
                </div>
                {/****OFFER-STATUS****/}
                <div className={classes.name__price}>
                  <p className={classes.label}>Offer received: </p>
                  <h4>{player.sentOffer}M€</h4>
                  <p className={classes.label}>From: </p>
                  <h4>
                    {(player.from === "mancity" && "Manchester City") ||
                      (player.from === "acmilan" && "Ac Milan") ||
                      (player.from === "psg" && "Paris Saint-Germain") ||
                      (player.from === "bayer" && "Bayer München")}
                  </h4>
                </div>
                {/* *** */}
              </div>
            </div>
          ))}
        {negotionationsData.length === 0 && (
          <h4 className={classes.noOffer}>No offers received yet</h4>
        )}
      </div>
    </section>
  );
};
export default OffersReceived;
