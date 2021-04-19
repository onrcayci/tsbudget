import { BudgetEntry } from "./models/budget-entry";

let entry: BudgetEntry = new BudgetEntry({
    title: "New Title",
    amount: 100,
    currency: "USD",
    recurring: true
});

console.log("Budget App!")
entry.save();
BudgetEntry.update("New Title", {
    title: "Budget App",
    amount: 200
});