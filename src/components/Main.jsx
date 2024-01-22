import FilterSection from "./FilterSection";
import BudgetSection from "./BudgetSection";
import PlayersListSection from "./Players/PlayersListSection";
import NegotiationsSection from "./Negotiations/NegotiationsSection";
import classes from "./Main.module.css";
import { useContext, useEffect, useState } from "react";
import PlayerContext from "../context/context";

const Main = () => {
  // SET BUDGET STATE 
  const [budgetLeft, setBudgetLeft] = useState(300);
  // CALL CONTEXT FUNCTION TO GET THE BUDGET AND USE IT IN OTHER COMPONENTS
  const {getBudgetHandler} = useContext(PlayerContext);
  
  // CHECK TO SEE IF THE BUDGET CHANGES
  useEffect(() => {
    getBudgetHandler(budgetLeft);
  }, [getBudgetHandler, budgetLeft]);

  return (
    <div className={classes.main}>
      <FilterSection />
      <BudgetSection budgetLeft={budgetLeft} />
      <PlayersListSection />
      {/* UPDATING THE BUDGET, DEPENDING ON SENT OFFERS AND ACCEPTED RECEIVED OFFERS */}
      <NegotiationsSection setBudgetLeft={setBudgetLeft} />
    </div>
  );
};

export default Main;