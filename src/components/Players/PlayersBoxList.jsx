import classes from "./PlayersBoxList.module.css";
import OfferForm from "./OfferForm";

const PlayersBoxList = (props) => {
  return (
    <div className={classes.player__box}>
      <div className={classes.player__box__view}>
        <OfferForm
          id={props.id}
          key={props.id}
          number={props.number}
          price={props.price}
          name={props.name}
          age={props.age}
          nationality={props.nationality}
          position={props.position}
          status={props.status}
          src={props.src}
        />
        {/* --PLAYER IMAGE, NAME, AGE-- */}
        <div className={classes.player__info}>
          <div className={classes.p__img__container}>
            <img
              style={{ backgroundColor: "#fff" }}
              src={props.src}
              alt="Rafael Leao picture"
            />
          </div>

          <div className={classes.player__number}>
            <p>{props.number}</p>
          </div>
          <div className={classes.player__name}>
            <p>{props.name}</p>
            <span>({props.age})</span>
          </div>
        </div>
        {/* ---- */}
        {/* --PLAYER PRICE AND NATIONALITY-- */}
        <div className={classes.player__price}>
          <p>{props.price}M€</p>
          <div className={classes.player__nationality}>
            <img src={"/" + `${props.nationality}` + ".webp"} alt="Portugal Flag" />
            <p>{props.nationality}</p>
          </div>
        </div>
        {/* ---- */}
      </div>
    </div>
  );
};

export default PlayersBoxList;
