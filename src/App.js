import { useEffect, useState } from "react";
import Header from "./components/Header";
import LogIn from "./components/Log/LogIn";
import Main from "./components/Main";

function App() {
  //CHECK IF THE MANAGER LOGGED IN
  const [managerIsLoggedIn, setManagerIsLoggedIn] = useState(false);

  function logInManagerHandler() {
    setManagerIsLoggedIn(true);
  };

  function logOutManagerHandler() {
    setManagerIsLoggedIn(false);
  };

  //CHECK ID THERE'S ALREADY A LOGGED MANAGER IN THE LOCAL STORAGE
  const loggedManager = localStorage.getItem("teamManager");

  useEffect(() => {
    if(loggedManager) {
      setManagerIsLoggedIn(true);
    }
  }, [loggedManager]);

  return (
    <>
      {!managerIsLoggedIn ? (
        <LogIn logInManager={logInManagerHandler} />
      ) : (
        <>
          <Header logOutManager={logOutManagerHandler} />
          <Main />
        </>
      )}
    </>
  );
}

export default App;