import classes from "./FilterSection.module.css";
import { useContext, useEffect, useState, useCallback } from "react";
import PlayerContext from "../context/context";
import useHttp from "../hooks/useHttp";

const teamArray = [
  { filter: "acmilan", team: "AC Milan" },
  { filter: "mancity", team: "Manchester City" },
  { filter: "rma", team: "Real Madrid" },
  { filter: "bayer", team: "Bayer München" },
];
const FilterSection = () => {
  // ADD COMMENT
  const [playersData, setPlayersData] = useState([]);
  const [teamFilterArray, setTeamFilterArray] = useState(teamArray);

  //FILTERS AND THEIR STATE
  const [selectedTeam, setSelectedTeam] = useState("");
  const [selectedAge, setSelectedAge] = useState("Any");
  const [selectedPosition, setSelectedPosition] = useState("Any");

  //CONTEXT AND HTTP REQUEST FUNCTION
  const {
    getPlayers,
    selectTeamHandler,
    loggedTeamManager,
    offerResponseSubmitted,
  } = useContext(PlayerContext);

  //LOGGED IN TEAM
  useEffect(() => {
    const newArray = teamArray.filter(
      (team) => team.filter !== loggedTeamManager
    );
    setTeamFilterArray(newArray);
    setSelectedTeam(newArray[0].filter);
  }, [loggedTeamManager]);

  // HTTP FUNCTION
  const { managePlayerDataHandler } = useHttp();
  const transformData = useCallback((data) => {
    const loadedArray = [];
    for (const key in data) {
      loadedArray.push({ ...data[key], id: key });
      setPlayersData(loadedArray);
    }
  }, []);

  useEffect(() => {
    managePlayerDataHandler(
      {
        url: `https://players-c7f1b-default-rtdb.firebaseio.com/deadline/players.json`,
      },
      transformData
    );
  }, [
    managePlayerDataHandler,
    transformData,
    offerResponseSubmitted,
    loggedTeamManager,
  ]); // when a offer request is accepted or declined

  // FLITER FUNCTION
  const filteredPlayersData = playersData.filter((player) => {
    if (selectedPosition !== "Any" && player.position !== selectedPosition) {
      return false;
    }
    if (selectedAge !== "Any" && player.age < +selectedAge) {
      // + => parseInt()
      return false;
    }
    return true;
  });

  useEffect(() => {
    getPlayers(playersData);
  }, [getPlayers, playersData]);

  useEffect(() => {
    selectTeamHandler(selectedTeam);
    getPlayers(filteredPlayersData);
  }, [
    getPlayers,
    selectTeamHandler,
    selectedPosition,
    selectedAge,
    selectedTeam
  ]);

  return (
    <section className={classes.filter__section}>
      <div className={classes.filter__container}>
        <div className={classes.img__container}>
          <img
            style={{ height: "4.2rem" }}
            src={"/" + `${selectedTeam}` + ".png"}
            alt="Manchester City Football Club Logo"
          />
        </div>

        <select
          value={selectedTeam}
          className={classes.select__filter}
          onChange={(event) => setSelectedTeam(event.target.value)}
        >
          {teamFilterArray.map((team) => (
            <option key={team.team} value={team.filter}>
              {team.team}
            </option>
          ))}
        </select>
      </div>

      <div className={classes.filter__container}>
        <label htmlFor="age">Age: </label>
        <select
          defaultValue="Any"
          className={classes.select__filter}
          onChange={(event) => setSelectedAge(event.target.value)}
        >
          <option value="Any">Any</option>
          <option value="18">18+</option>
          <option value="23">23+</option>
          <option value="28">28+</option>
          <option value="34">34+</option>
        </select>
      </div>

      <div className={classes.filter__container}>
        <label htmlFor="position">Position: </label>
        <select
          defaultValue="Any"
          className={classes.select__filter}
          onChange={(event) => setSelectedPosition(event.target.value)}
        >
          <option value="Any">Any</option>
          <option value="forward">Forward</option>
          <option value="midfielder">Midfielder</option>
          <option value="defender">Defender</option>
          <option value="goalkeeper">Goalkeeper</option>
        </select>
      </div>
    </section>
  );
};
export default FilterSection;
