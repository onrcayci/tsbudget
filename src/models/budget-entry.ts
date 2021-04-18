import { existsSync, readFileSync, writeFileSync } from "fs";

export class BudgetEntry {

    title: string;
    description?: string;
    amount: number;
    currency: string;
    date?: string;
    recurring: boolean;

    constructor(entry: BudgetEntryInterface) {
        this.title = entry.title;
        this.description = entry.description;
        this.amount = entry.amount;
        this.currency = entry.currency;
        this.date = entry.date;
        this.recurring = entry.recurring;
    };

    save() {
        try {
            let savedEntries: BudgetEntry[];
            if (existsSync("save_file.json")) {
                const savedEntriesBuffer: string = readFileSync("save_file.json", { encoding: "utf8" });
                savedEntries = this.parseEntries(JSON.parse(savedEntriesBuffer));
            } else {
                savedEntries = [];
            }
            savedEntries.push(this);
            writeFileSync("save_file.json", JSON.stringify(savedEntries));
        } catch (error) {
            throw error;
        }
    }

    update(update: {
        title?: string,
        description?: string,
        amount?: number,
        currency?: string,
        date?: string,
        recurring?: boolean
    }) {
        try {
            if (existsSync("save_file.json")) {
                const savedEntriesBuffer: string = readFileSync("save_file.json", { encoding: "utf8" });
                let savedEntries: BudgetEntry[] = this.parseEntries(JSON.parse(savedEntriesBuffer));
                savedEntries.forEach((entry) => {
                    if (entry.title === this.title) {
                        entry.title = update.title ? update.title : entry.title;
                        entry.description = update.description ? update.description : entry.description;
                        entry.amount = update.amount ? update.amount : entry.amount;
                        entry.currency = update.currency ? update.currency : entry.currency;
                        entry.date = update.date ? update.date : entry.date;
                        entry.recurring = update.recurring ? update.recurring : entry.recurring;
                    }
                });
                writeFileSync("save_file.json", JSON.stringify(savedEntries));
                this.title = update.title ? update.title : this.title;
                this.description = update.description ? update.description : this.description;
                this.amount = update.amount ? update.amount : this.amount;
                this.currency = update.currency ? update.currency : this.currency;
                this.date = update.date ? update.date : this.date;
                this.recurring = update.recurring ? update.recurring : this.recurring;

            } else {
                throw new Error("Entry is not saved!");
            }
        } catch (error) {
            throw error;
        }
    }

    private parseEntries(parsedEntries: BudgetEntryInterface[]): BudgetEntry[] {
        let entries: BudgetEntry[] = [];
        parsedEntries.forEach((entry: BudgetEntryInterface) => {
            let budgetEntry: BudgetEntry = new BudgetEntry(entry);
            entries.push(budgetEntry);
        });
        return entries;
    }
}

interface BudgetEntryInterface {
    title: string;
    description?: string;
    amount: number;
    currency: string;
    date?: string;
    recurring: boolean;
}