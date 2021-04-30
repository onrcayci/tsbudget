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

// export class BudgetEntry {

//     title: string;
//     amount: number;
//     currency: string;
//     date?: string;
//     recurring: boolean;

//     /**
//      * @static
//      * Update the details of a saved BudgetEntry instance
//      * @param {string} entryTitle 
//      * @param update - A JSON object which includes updates for:
//      * @param {string | undefined} update.title
//      * @param {number | undefined} update.amount
//      * @param {string | undefined} update.currency
//      * @param {string | undefined} update.date
//      * @param {boolean | undefined} update.recurring
//      */

//     /**
//      * @static
//      * Delete a BudgetEntry instance by its title.
//      * @param {string} entryTitle
//      */
//     static delete(entryTitle: string) {
//         try {
//             let savedEntries: BudgetEntry[] = this.parseEntries();
//             savedEntries = savedEntries.filter((entry) => entry.title !== entryTitle);
//             writeFileSync("save_file.json", JSON.stringify(savedEntries, null, "\t"));
//         } catch (error) {
//             throw error;
//         }
//     }

//     /**
//      * @static
//      * Return a list of all of the saved BudgetEntry instances.
//      * @returns {BudgetEntry[]} - Array of BudgetEntry instances.
//      */
//     static list(): BudgetEntry[] {
//         try {
//             return this.parseEntries();
//         } catch (error) {
//             throw error;
//         }
//     }

//     /**
//      * @static
//      * Return the total amount of all of the saved BudgetEntry instances.
//      * @returns {number} - the total amount of all of the entries.
//      */
//     static balance(): number {
//         try {
//             const savedEntries: BudgetEntry[] = this.parseEntries();
//             let totalExpense: number = 0;
//             savedEntries.forEach((entry) => totalExpense += entry.amount);
//             return totalExpense;
//         } catch (error) {
//             throw error;
//         }
//     }

//     /**
//      * @static
//      * Return a list of entries that are in the specified time period.
//      * @param {string} yearMonth - The year and the month of the time period. 
//      * @returns {BudgetEntry[]} - The list of entries in the specified time period.
//      */
//     static listByMonth(yearMonth: string): BudgetEntry[] {
//         try {
//             const queryPeriod = new Date(yearMonth + "-01");
//             let entries: BudgetEntry[] = this.parseEntries().filter((entry) => {
//                 if (entry.date) {
//                     const entryDate = new Date(entry.date);
//                     return (
//                         entryDate.getFullYear() === queryPeriod.getFullYear() && entryDate.getMonth() === queryPeriod.getMonth()
//                     );
//                 } else {
//                     return entry.recurring == true;
//                 }
//             });
//             return entries;
//         } catch (error) {
//             throw error;
//         }
//     }

//     /**
//      * @static
//      * Return the up-to-date balance of the specified time period.
//      * @param {string} yearMonth - The year and the month of the time period.
//      * @returns {number} - The total amount of the entries in the specified time period.
//      */
//     static balanceByMonth(yearMonth: string): number {
//         try {
//             const entries: BudgetEntry[] = this.listByMonth(yearMonth);
//             let monthlyExpense: number = 0;
//             entries.forEach((entry) => monthlyExpense += entry.amount);
//             return monthlyExpense;
//         } catch (error) {
//             throw error;
//         }

//     }

//     /**
//      * @private
//      * @static
//      * Convert the saved JSON entries into BudgetEntry instances.
//      * @returns {BudgetEntry[]} - A list of saved BudgetEntry instances.
//      */
//     private static parseEntries(): BudgetEntry[] {
//         if (existsSync("save_file.json")) {
//         let entries: BudgetEntry[] = [];
//             const parsedEntries: BudgetEntryInterface[] = JSON.parse(readFileSync("save_file.json", { encoding: "utf8" }));
//             parsedEntries.forEach((entry: BudgetEntryInterface) => {
//                 let budgetEntry: BudgetEntry = new BudgetEntry(entry);
//                 entries.push(budgetEntry);
//             });
//             return entries;
//         } else {
//             throw new Error("There are no saved entries!");
//         }
//     }

//     /**
//      * @private
//      * @static
//      * Update the attributes of a given BudgetEntry instance.
//      * @param {BudgetEntry | BudgetEntryInterface} entry 
//      * @param update
//      * @param {string | undefined} update.title
//      * @param {number | undefined} update.amount
//      * @param {string | undefined} update.currency
//      * @param {string | undefined} update.date
//      * @param {boolean | undefined} update.recurring
//      */
//     private static updateEntry(
//         entry: BudgetEntry | BudgetEntryInterface, 
//         update: {
//             title?: string,
//             amount?: number,
//             currency?: string,
//             date?: string,
//             recurring?: boolean
//     }) {
//         entry.title = update.title ? update.title : entry.title;
//         entry.amount = update.amount ? update.amount : entry.amount;
//         entry.currency = update.currency ? update.currency : entry.currency;
//         entry.date = update.date ? update.date : entry.date;
//         entry.recurring = update.recurring ? update.recurring : entry.recurring;
//     }
// }