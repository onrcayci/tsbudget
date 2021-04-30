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

// export class BudgetEntry {

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
// }