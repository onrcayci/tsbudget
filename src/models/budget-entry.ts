import { existsSync, readFileSync, writeFileSync } from "fs";

interface BudgetEntry {
    title: string,
    amount: number,
    currency: string,
    date?: string,
    recurring: boolean
}

/**
 * Save a BudgetEntry instance into a JSON save file.
 * @param {BudgetEntry} entry - A new BudgetEntry instance 
 */
export function saveEntry(entry: BudgetEntry) {
    try {
        let savedEntries: BudgetEntry[];
        if (existsSync("save_file.json")) savedEntries = parseEntries();
        else savedEntries = [];
        savedEntries.push(entry);
        writeFileSync("save_file.json", JSON.stringify(savedEntries, null, "\t"));
    } catch (error) {
        throw error;
    }
}

/**
 * Update a saved BudgetEntry instance.
 * @param {string} entryTitle - The title of the saved entry.
 * @param newEntryDetails - Details that will be updated.
 * @param {string | undefined} newEntryDetails.title - New title of the saved entry.
 * @param {number | undefined} newEntryDetails.amount - New amount of the saved entry.
 * @param {string | undefined} newEntryDetails.currency - New currency of the saved entry.
 * @param {string | undefined} newEntryDetails.date - New date of the saved entry.
 * @param {boolean | undefined} newEntryDetails.recurring - New state of the entry showing if the expense is recurring or one time.
 */
export function updateEntry(
    entryTitle: string,
    newEntryDetails: {
    title?: string,
    amount?: number,
    currency?: string,
    date?: string,
    recurring?: boolean
}) {
    try {
        let savedEntries: BudgetEntry[] = parseEntries();
        let entry: BudgetEntry | undefined = savedEntries.find(entry => entry.title === entryTitle);
        if (entry) updateEntryDetails(entry, newEntryDetails);
        writeFileSync("save_file.json", JSON.stringify(savedEntries, null, "\t"));
    } catch (error) {
        throw error;
    }
}

/**
 * Delete a saved entry from the save file.
 * @param {string} entryTitle - Title of the entry to be deleted.
 */
export function deleteEntry(entryTitle: string) {
    try {
        let savedEntries: BudgetEntry[] = parseEntries();
        savedEntries = savedEntries.filter((entry) => entry.title !== entryTitle);
        writeFileSync("save_file.json", JSON.stringify(savedEntries, null, "\t"));
    } catch (error) {
        throw error;
    }
}

/**
 * List all of the saved entries.
 * @returns {BudgetEntry[]} - The list of saved budget entries.
 */
export function listEntries(): BudgetEntry[] {
    if (existsSync("save_file.json")) return parseEntries();
    return [];
}

/**
 * The current total amount of all of the entries.
 * @returns {number} - the current total amount of the entries.
 */
export function totalExpense(): number {
    let total = 0;
    if (existsSync("save_file.json")) {
        const entries: BudgetEntry[] = parseEntries();
        entries.forEach(entry => total += entry.amount);
    }
    return total;
}

/**
 * List all of the entries from a given year and month.
 * @param {string} timePeriod - The queried year and month in UTC format, e.g., January 2000 == "2000-01".
 * @returns {BudgetEntry[]} - The list of all of the entries from the queried year and month.
 */
export function listEntriesByPeriod(timePeriod: string): BudgetEntry[] {
    const entries: BudgetEntry[] = listEntries();
    return entries.filter((entry) => {
        if (entry.date) {
            const entryDate: Date = new Date(entry.date);
            const queryPeriod: Date = new Date(timePeriod);
            return (entryDate.getFullYear() === queryPeriod.getFullYear() && entryDate.getMonth() === queryPeriod.getMonth());
        } else if (entry.recurring) {
            return true;
        } else {
            return false;
        }
    });
}

/**
 * The current total amount of the entries in a given year and month.
 * @param {string} timePeriod - The queried year and month in UTC format, e.g., January 2000 == "2000-01".
 * @returns {number} - The current total amount of the entries from the queried year and month.
 */
export function totalExpenseByPeriod(timePeriod: string): number {
    let total = 0;
    const entries: BudgetEntry[] = listEntriesByPeriod(timePeriod);
    entries.forEach((entry) => total += entry.amount);
    return total;
}

/**
 * Read and parse all of the saved budget entries.
 * @returns {BudgetEntry[]} - A list of saved budget entries.
 * @throws {Error} - if there is no save file, throws "There are no saved Entries!" error.
 */
function parseEntries(): BudgetEntry[] {
    if (existsSync("save_file.json")) {
        const entries: BudgetEntry[] = JSON.parse(readFileSync("save_file.json", { encoding: "utf8" }));
        return entries;
    } else {
        throw new Error("There are no saved entries!");
    }
}

/**
 * Update the entries of a given entry.
 * @param {BudgetEntry} entry - The entry that will be updated. 
 * @param newEntryDetails - New details of the entry.
 * @param {string | undefined} newEntryDetails.title - New title of the saved entry.
 * @param {number | undefined} newEntryDetails.amount - New amount of the saved entry.
 * @param {string | undefined} newEntryDetails.currency - New currency of the saved entry.
 * @param {string | undefined} newEntryDetails.date - New date of the saved entry.
 * @param {boolean | undefined} newEntryDetails.recurring - New state of the entry showing if the expense is recurring or one time.
 */
function updateEntryDetails(
    entry: BudgetEntry,
    newEntryDetails:{
        title?: string,
        amount?: number,
        currency?: string,
        date?: string,
        recurring?: boolean    
    }
) {
    entry.title = newEntryDetails.title ? newEntryDetails.title : entry.title;
    entry.amount = newEntryDetails.amount ? newEntryDetails.amount : entry.amount;
    entry.currency = newEntryDetails.currency ? newEntryDetails.currency : entry.currency;
    entry.date = newEntryDetails.date ? newEntryDetails.date : entry.date;
    entry.recurring = newEntryDetails.recurring ? newEntryDetails.recurring : entry.recurring;
}