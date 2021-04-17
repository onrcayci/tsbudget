/**
 * Budget Entry Model.
 * 
 * This model is used to persist entries to the budget tracking application.
 * @param title: string Short descriptor of the entry.
 * @param description: string Long description o f the entry.
 * @param amount: number Number to represent the amount spent/earned.
 * @param currency: string Currency of the amount spent/earned.
 * @param date: string Date that the transaction occured.
 * @param recurring: boolean Indicates whether the transaction occurs
 * every month.
 */
export class BudgetEntry {
    title: string;
    description?: string;
    amount: number;
    currency: string;
    date?: string;
    recurring: boolean;

    constructor(
        title: string,
        amount: number,
        currency: string,
        recurring: boolean,
        description?: string,
        date?: string
    ) {
        this.title = title;
        this.description = description;
        this.amount = amount;
        this.currency = currency;
        this.date = date;
        this.recurring = recurring;
    };
}