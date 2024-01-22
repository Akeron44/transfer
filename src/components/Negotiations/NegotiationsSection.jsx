import classes from "./NegotiationsSection.module.css";
import { IonIcon, IonSelectOption, IonSelect } from "@ionic/react";
import { returnUpBackOutline, gitCompareOutline } from "ionicons/icons";
import useHttp from "../../hooks/useHttp";
import { useEffect, useCallback, useState, useContext } from "react";
import PlayerContext from "../../context/context";
import NegDetails from "./NegDetails";
// ${classes.swipe__left}
const NegotiationsSection = (props) => {
  const [negotiationsData, setNegotiationsData] = useState([]);
  const [negotiationsArray, setNegotiationsArray] = useState([]);
  const [totalBudget, setTotalBudget] = useState(300);
  const [didUpdate, setDidUpdate] = useState(false);
  const [sortBy, setSortBy] = useState("Pending...");

  // GET CONTEXT DATA AND FUNCTIONS
  const {
    formSubmitted,
    toggleSentListHandler,
    offersSent,
    loggedTeamManager,
    getNegotiations,
    offerResponseSubmitted,
  } = useContext(PlayerContext);

  // GET THE NEGOTIATIONS OF THE LOGGEDIN MANAGER AND ALSO SORT THEM
  useEffect(() => {
    const filteredNegotiations = negotiationsData.filter(
      (players) => players.from === loggedTeamManager
    );
    let sortedNegotiations;
    if (sortBy === "Pending...") {
      sortedNegotiations = filteredNegotiations.sort((a, b) => {
        const statusOrder = { "Pending...": 1, Accepted: 2, Declined: 3 };
        return statusOrder[a.status] - statusOrder[b.status];
      });
    } else if (sortBy === "Accepted") {
      sortedNegotiations = filteredNegotiations.sort((a, b) => {
        const statusOrder = { Accepted: 1, "Pending...": 2, Declined: 3 };
        return statusOrder[a.status] - statusOrder[b.status];
      });
    } else if (sortBy === "Declined") {
      sortedNegotiations = filteredNegotiations.sort((a, b) => {
        const statusOrder = { Declined: 1, Accepted: 2, "Pending...": 3 };
        return statusOrder[a.status] - statusOrder[b.status];
      });
    }

    setNegotiationsArray(sortedNegotiations);
  }, [sortBy, negotiationsData, loggedTeamManager]);

  // UPDATING THE BUDGET
  useEffect(() => {
    const myOffersArray = negotiationsArray.filter(
      (n) => n.status === "Pending..." || n.status === "Accepted"
    );
    const receivedOffersArray = negotiationsData.filter(
      (n) => n.to === loggedTeamManager && n.status === "Accepted"
    );
    let totalSpent = 0;
    let totalReceived = 0;

    if (myOffersArray.length > 0) {
      totalSpent = myOffersArray
        .map((player) => player.sentOffer)
        .reduce((a, b) => a + b);
    }
    if (receivedOffersArray.length > 0) {
      totalReceived = receivedOffersArray
        .map((player) => player.sentOffer)
        .reduce((a, b) => a + b);
    }

    props.setBudgetLeft(300 - totalSpent + totalReceived); // UPDATE BUDGET ON MAIN.JSX
    setTotalBudget(300 - totalSpent + totalReceived);
  }, [negotiationsArray, loggedTeamManager]);

  // CALLING CUSTOM HTTP HOOK
  const { managePlayerDataHandler: getHttpSentOffersHandler, isLoading } =
    useHttp();

  const transformData = useCallback((data) => {
    const loadedArray = [];
    for (const key in data) {
      loadedArray.push({ ...data[key], key: key });
      setNegotiationsData(loadedArray);
    }
  }, []);

  // GET NEGOTIATIONS DATA AND SET DEPENDENCIES FOR WHEN IT SHOULD RERUN
  useEffect(() => {
    getHttpSentOffersHandler(
      {
        url: "https://players-c7f1b-default-rtdb.firebaseio.com/deadline/negotiation.json",
      },
      transformData
    );
  }, [
    getHttpSentOffersHandler,
    transformData,
    formSubmitted,
    didUpdate,
    offerResponseSubmitted,
  ]);

  useEffect(() => {
    getNegotiations(negotiationsArray);
  }, [getNegotiations, negotiationsData]);

  return (
    <section
      className={`${classes.negotiations__section} ${
        offersSent ? classes.swipe__left : ""
      }`}
    >
      <IonIcon
        className={classes.ion_icon}
        icon={returnUpBackOutline}
        onClick={toggleSentListHandler}
      />
      <div className={classes.ng__header}>
        <h3 className={classes.offers__sent}>Offers sent</h3>
        <select
          value={sortBy}
          className={classes.sort}
          onChange={(e) => setSortBy(e.target.value)}
        >
          Sort:
          <option value="Pending...">Sort by: Default</option>
          <option value="Accepted">Accepted first</option>
          <option value="Declined">Declined first</option>
        </select>
      </div>
      {isLoading ? (
        <div style={{ margin: "2rem" }} className="lds-dual-ring"></div>
      ) : (
        <div className={classes.scroll}>
          {negotiationsArray.length !== 0 &&
            negotiationsArray.map((player) => (
              <NegDetails
                id={player.key}
                name={player.name}
                age={player.age}
                src={player.src}
                status={player.status}
                sentOffer={player.sentOffer}
                price={player.price}
                key={player.key}
                budgetLeft={totalBudget}
                to={player.to}
                from={player.from}
                offerUpdated={
                  !player.offerUpdated ? false : player.offerUpdated
                }
                didUpdate={setDidUpdate}
              />
            ))}
          {negotiationsArray.length === 0 && (
            <h1 className={classes.noOffer}>No offers sent yet!</h1>
          )}
        </div>
      )}
    </section>
  );
};

export default NegotiationsSection;
