import classes from "./BudgetSection.module.css";
const BudgetSection = ({budgetLeft}) => {
  return (
    <div className={classes.budget__section}>
      <div className={classes.budget__information}>
        <p>Total Budget:</p>
        <h4>300 M€</h4>
      </div>
      <div className={classes.budget__information}>
        <p>Budget left:</p>
        <h4>{budgetLeft} M€</h4>
      </div>
    </div>
  );
};

export default BudgetSection;
