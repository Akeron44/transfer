import { createContext } from "react";

const PlayerContext = createContext({
    loggedTeamManager: undefined,
    getPlayers: () => {},
    players: [],
    getNegotiations: () => {},
    negotiations: [],
    formSubmitted: false,
    formSubmittedHandler: () => {},
    offerResponseSubmitted: false,
    offerResponseSubmittedHandler: () => {},
    selectedTeam: undefined,
    selectTeamHandler: () => {},
    offersReceived: false,
    toggleReceivedListHandler: () => {},
    offersSent: false,
    toggleSentListHandler: () => {},
    optionsOpened: false,
    toggleOptionsOpenedHandler: () => {},
    budgetLeft: 300,
    getBudgetHandler: () => {}
});

export default PlayerContext;