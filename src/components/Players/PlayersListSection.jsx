import { useContext, useEffect, useState } from "react";
import PlayersBoxList from "./PlayersBoxList";
import classes from "./PlayersListSection.module.css";
import PlayerContext from "../../context/context";

const PlayersListSection = () => {
  // EVERY PLAYER POSITION ARRAY STATE
  const [playersArray, setPlayersArray] = useState({});

  // CALLING CONTEXT DATA
  const { players, selectedTeam, negotiations } = useContext(PlayerContext);

  // GET THE PLAYERS OF THE FILTER SELECTED TEAM
  const filteredArray = players.filter(
    (player) => player.team === selectedTeam
  );

  // FILTER OUT THE PLAYER ON THE NEGOTIATIONS WITH STATUS PENDING
  const pendingOffersArray = negotiations.filter(
    (n) => n.status === "Pending..."
  );

  // MAP THROUGH THE PLAYERS AND FIND THE ONES THAT ALREADY HAVE A SENT OFFER AND ADD THEM STATUS: TRUE
  const playersWithNegotiations = filteredArray.map((player) => {
    const negotiation = pendingOffersArray.find(
      (negotiation) => negotiation.id === player.id
    );

    if (negotiation) {
      // If a negotiation is found, add a 'status' property to the player
      return { ...player, status: true };
    } else {
      // If no negotiation is found, return the original player object
      return player;
    }
  });

  // CHECK AND PUT THE PLAYERS IN THE CORRESPONDING POSITION OBJECT
  useEffect(() => {
    setPlayersArray({
      forward: playersWithNegotiations.filter((p) => p.position === "forward"),
      midfielder: playersWithNegotiations.filter(
        (p) => p.position === "midfielder"
      ),
      defender: playersWithNegotiations.filter(
        (p) => p.position === "defender"
      ),
      goalkeeper: playersWithNegotiations.filter(
        (p) => p.position === "goalkeeper"
      ),
    });
  }, [players, negotiations]);

  return (
    <section className={classes.players__list__section}>
      {Object.entries(playersArray).map((p) =>
        p[1].length !== 0 ? (
          <div key={p[0]} className={classes.player__position}>
            <h3 className={classes[p[0]]}>{p[0]}</h3>
            <div className={classes.players__container__wrap}>
              {p[1].map((player) => (
                <PlayersBoxList
                  key={player.id}
                  id={player.id}
                  number={player.number}
                  price={player.price}
                  name={player.name}
                  age={player.age}
                  nationality={player.nationality}
                  position={player.position}
                  status={player.status ? player.status : false}
                  src={player.src}
                />
              ))}
            </div>
          </div>
        ) : null
      )}
    </section>
  );
};
export default PlayersListSection;