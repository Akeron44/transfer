// LogIn.js
import { useState } from "react";
import classes from "./Login.module.css"; // Import the CSS file

const LogIn = ({ logInManager }) => {
  const [loggedInTeam, setLoggInTeam] = useState(null);

  // SET THE LOGGEDINTEAM TO THE LOCALSTORAGE 
  function logInHandler() {
    localStorage.setItem("teamManager", loggedInTeam);
    logInManager(); // UPDATE STATE ON APP.JS
  }

  return (
    <div className={classes.container}>
      <h1>Ready to improve your team?</h1>
      <h4>Log in as manager of:</h4>
      <select
        onChange={(e) => {
          setLoggInTeam(e.target.value);
        }}
      >
        <option value={null}>--</option>
        <option value="acmilan">Ac Milan</option>
        <option value="mancity">Manchester City</option>
        <option value="bayer">Bayer Muenchen</option>
        <option value="rma">Real Madrid</option>
      </select>
      <button disabled={!loggedInTeam} onClick={logInHandler}>
        Log in
      </button>
    </div>
  );
};

export default LogIn;
