import classes from "./HoverInfo.module.css";

const HoverInfo = ({top, right, direction, children, onMouseEnter, onMouseLeave}) => {
  return (
    <div
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className={classes.hover}
      style={{ top: `${top}`, right: `${right}` }}
    >
      {children}
      <div className={`${classes.arrow} ${direction && classes[direction]}`}></div>
    </div>
  );
};

export default HoverInfo;
