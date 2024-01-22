import PlayerContext from "./context";
import { useCallback, useState } from "react";

const ContextProvider = ({ children }) => {
  const [playersArray, setPlayersArray] = useState([]);
  const [negotiationsArray, setNegotiationsArray] = useState([]);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [offerResponseSubmitted, setofferResponseSubmitted] = useState(false);
  const [offersReceived, setOffersReceived] = useState(false);
  const [offersSent, setOffersSent] = useState(false);
  const [optionsMenu, setOptionsMenu] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState(undefined);
  const [budgetLeft, setBudgetLeft] = useState(300);


  const getPlayers = useCallback((players) => {
    setPlayersArray(players);
  }, []);

  const getNegotiations = useCallback((negotiations) => {
    setNegotiationsArray(negotiations);
  }, []);

  function toggleReceivedListHandler() {
    setOffersReceived(prevState => !prevState);
  }

  function toggleSentListHandler() {
    setOffersSent(prevState => !prevState);
  }
  function toggleOptionsOpenedHandler() {
    setOptionsMenu(prevState => !prevState);
  }

  const formSubmittedHandler = useCallback((submitted) => {
    setFormSubmitted(submitted);
  }, []);

  const offerResponseSubmittedHandler = useCallback((submitted) => {
    setofferResponseSubmitted(submitted);
  }, []);

  const selectTeamHandler = useCallback((scdTeam) => {
    setSelectedTeam(scdTeam);
  }, []);

  const getBudgetHandler = useCallback(budget => {
    setBudgetLeft(budget);
  }, []);

  const contextFunction = {
    loggedTeamManager: localStorage.getItem("teamManager"),
    getPlayers,
    players: playersArray,
    getNegotiations: getNegotiations,
    negotiations: negotiationsArray,
    offerResponseSubmitted,
    offerResponseSubmittedHandler,
    formSubmitted,
    formSubmittedHandler,
    selectedTeam,
    selectTeamHandler,
    offersReceived,
    toggleReceivedListHandler,
    offersSent,
    toggleSentListHandler,
    optionsOpened: optionsMenu,
    toggleOptionsOpenedHandler,
    budgetLeft,
    getBudgetHandler
  };

  return (
    <PlayerContext.Provider value={contextFunction}>
      {children}
    </PlayerContext.Provider>
  );
};

export default ContextProvider;