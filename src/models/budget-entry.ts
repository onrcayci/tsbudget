import { existsSync, readFileSync, writeFileSync } from "fs";

import { printTable } from "console-table-printer";

// TODO: Implement method to display each month's balance
// TODO: Implement method to list each month's entries
// TODO: Add docstring and comments for documentation
// TODO: Unit tests and test coverage!
export class BudgetEntry {

    title: string;
    amount: number;
    currency: string;
    date?: string;
    recurring: boolean;

    constructor(entry: BudgetEntryInterface) {
        this.title = entry.title;
        this.amount = entry.amount;
        this.currency = entry.currency;
        this.date = entry.date;
        this.recurring = entry.recurring;
    };

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

    static list(): void {
        try {
            const savedEntries: BudgetEntry[] = this.parseEntries();
            printTable(savedEntries);
        } catch (error) {
            throw error;
        }
    }

    static balance(): number {
        try {
            const savedEntries: BudgetEntry[] = this.parseEntries();
            let totalExpense: number = 0;
            savedEntries.forEach((entry) => totalExpense += entry.amount);
            return totalExpense;
        } catch (error) {
            throw error;
        }
    }

    private static parseEntries(): BudgetEntry[] {
        let entries: BudgetEntry[] = [];
        const parsedEntries: BudgetEntryInterface[] = JSON.parse(readFileSync("save_file.json", { encoding: "utf8" }));
        parsedEntries.forEach((entry: BudgetEntryInterface) => {
            let budgetEntry: BudgetEntry = new BudgetEntry(entry);
            entries.push(budgetEntry);
        });
        return entries;
    }

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