import { existsSync, readFileSync, writeFileSync } from "fs";

// TODO: Implement method to display each month's balance
// TODO: Implement method to list each month's entries
export class BudgetEntry {

    title: string;
    amount: number;
    currency: string;
    date?: string;
    recurring: boolean;

    /**
     * @constructor
     * @param {BudgetEntryInterface} entry
     */
    constructor(entry: BudgetEntryInterface) {
        this.title = entry.title;
        this.amount = entry.amount;
        this.currency = entry.currency;
        this.date = entry.date;
        this.recurring = entry.recurring;
    };

    /**
     * Save a BudgetEntry instance into a JSON save file.
     */
    save(): void {
        try {
            let savedEntries: BudgetEntry[];
            if (existsSync("save_file.json")) {
                savedEntries = BudgetEntry.parseEntries();
            } else {
                savedEntries = [];
            }
            savedEntries.push(this);
            writeFileSync("save_file.json", JSON.stringify(savedEntries, null, "\t"));
        } catch (error) {
            throw error;
        }
    }

    /**
     * @static
     * Update the details of a saved BudgetEntry instance
     * @param {string} entryTitle 
     * @param update - A JSON object which includes updates for:
     * @param {string | undefined} update.title
     * @param {number | undefined} update.amount
     * @param {string | undefined} update.currency
     * @param {string | undefined} update.date
     * @param {boolean | undefined} update.recurring
     */
    static update(
        entryTitle: string,
        update: {
            title?: string,
            amount?: number,
            currency?: string,
            date?: string,
            recurring?: boolean
    }): void {
        try {
            if (existsSync("save_file.json")) {
                let savedEntries: BudgetEntry[] = this.parseEntries();
                let oldSavedEntry: BudgetEntry | undefined = savedEntries.find((entry) => entry.title === entryTitle);
                if (oldSavedEntry) this.updateEntry(oldSavedEntry, update);
                writeFileSync("save_file.json", JSON.stringify(savedEntries, null, "\t"));
            } else {
                throw new Error("Entry is not saved!");
            }
        } catch (error) {
            throw error;
        }
    }

    /**
     * @static
     * Delete a BudgetEntry instance by its title.
     * @param {string} entryTitle
     */
    static delete(entryTitle: string): void {
        try {
            if (existsSync("save_file.json")) {
                let savedEntries: BudgetEntry[] = this.parseEntries();
                savedEntries = savedEntries.filter((entry) => entry.title !== entryTitle);
                writeFileSync("save_file.json", JSON.stringify(savedEntries, null, "\t"));
            } else {
                throw new Error("Entry is not saved!");
            }
        } catch (error) {
            throw error;
        }
    }

    /**
     * @static
     * Return a list of all of the saved BudgetEntry instances.
     * @returns {BudgetEntry[]} - Array of BudgetEntry instances.
     */
    static list(): BudgetEntry[] {
        try {
            if (existsSync("save_file.json")) return this.parseEntries();
            else throw new Error("There are no saved entries!");
        } catch (error) {
            throw error;
        }
    }

    /**
     * @static
     * Return the total amount of all of the saved BudgetEntry instances.
     * @returns {number} - the total amount of all of the entries.
     */
    static balance(): number {
        try {
            if (existsSync("save_file.json")) {
                const savedEntries: BudgetEntry[] = this.parseEntries();
                let totalExpense: number = 0;
                savedEntries.forEach((entry) => totalExpense += entry.amount);
                return totalExpense;
            } else {
                throw new Error("There are no saved entries!");
            }
        } catch (error) {
            throw error;
        }
    }

    /**
     * @private
     * @static
     * Convert the saved JSON entries into BudgetEntry instances.
     * @returns {BudgetEntry[]} - A list of saved BudgetEntry instances.
     */
    private static parseEntries(): BudgetEntry[] {
        let entries: BudgetEntry[] = [];
        const parsedEntries: BudgetEntryInterface[] = JSON.parse(readFileSync("save_file.json", { encoding: "utf8" }));
        parsedEntries.forEach((entry: BudgetEntryInterface) => {
            let budgetEntry: BudgetEntry = new BudgetEntry(entry);
            entries.push(budgetEntry);
        });
        return entries;
    }

    /**
     * @private
     * @static
     * Update the attributes of a given BudgetEntry instance.
     * @param {BudgetEntry | BudgetEntryInterface} entry 
     * @param update
     * @param {string | undefined} update.title
     * @param {number | undefined} update.amount
     * @param {string | undefined} update.currency
     * @param {string | undefined} update.date
     * @param {boolean | undefined} update.recurring
     */
    private static updateEntry(
        entry: BudgetEntry | BudgetEntryInterface, 
        update: {
            title?: string,
            amount?: number,
            currency?: string,
            date?: string,
            recurring?: boolean
    }): void {
        entry.title = update.title ? update.title : entry.title;
        entry.amount = update.amount ? update.amount : entry.amount;
        entry.currency = update.currency ? update.currency : entry.currency;
        entry.date = update.date ? update.date : entry.date;
        entry.recurring = update.recurring ? update.recurring : entry.recurring;
    }
}

interface BudgetEntryInterface {
    title: string;
    amount: number;
    currency: string;
    date?: string;
    recurring: boolean;
}