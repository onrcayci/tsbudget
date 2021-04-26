import yargs from "yargs";
import { printTable } from "console-table-printer";

import { BudgetEntry } from "./models/budget-entry";

// version of the CLI app
yargs.version("0.0.b1");

// CLI command for the add functionality
yargs.command(
    "add <title> <amount> <currency> <recurring> [date]",
    "Add a budget entry to the application",
    (yargs) => {
        return yargs
            .positional("title", {
                type: "string",
                describe: "Title of the entry",
                demandOption: true
            })
            .positional("amount", {
                type: "number",
                describe: "Amount of the entry",
                demandOption: true
            })
            .positional("currency", {
                type: "string",
                describe: "Currency of the entry",
                demandOption: true
            })
            .positional("recurring", {
                type: "boolean",
                describe: "Indicate whether the entry occurs every month",
                demandOption: true
            })
            .option("date", {
                type: "string",
                describe: "Date of the entry"
            });
    }, (argv) => {
        const newEntry = new BudgetEntry({
            title: argv.title,
            amount: argv.amount,
            currency: argv.currency,
            date: argv.date,
            recurring: argv.recurring
        });
        try {
            newEntry.save();
        } catch (error) {
            throw error;
        }
    }
);

// CLI command for the update functionality
yargs.command("update <entry> [title] [amount] [currency] [date] [recurring]", "Update an existing entry", (yargs) => {
    return yargs
        .positional("entry",{
            type: "string",
            describe: "Title of the entry to be updated",
            demandOption: true
        })
        .option("title", {
            type: "string",
            describe: "New title of the entry"
        })
        .option("amount", {
            type: "number",
            describe: "New amount of the entry"
        })
        .option("currency", {
            type: "string",
            describe: "New currency of the entry"
        })
        .option("date", {
            type: "string",
            describe: "New date of the entry"
        })
        .option("recurring", {
            type: "boolean",
            describe: "New recurring option of the entry"
        });
}, (argv) => {
    try {
        BudgetEntry.update(argv.entry, {
            title: argv.title,
            amount: argv.amount,
            currency: argv.currency,
            date: argv.date,
            recurring: argv.recurring
        });
    } catch (error) {
        throw error;
    }
});

// CLI command for list functionality
yargs.command("list [yearMonth]", "List all of the entries or entries belong to a specific time period", (yargs) => {
    return yargs
        .option("yearMonth", {
            type: "string",
            describe: "Year and month of the time period"
        });
}, (argv) => {
    try {
        let entries: BudgetEntry[] = [];
        if (argv.yearMonth) entries = BudgetEntry.listByMonth(argv.yearMonth);
        else entries = BudgetEntry.list();
        printTable(entries);
    } catch (error) {
        throw error;
    }
});

// CLI command for delete functionality
yargs.command("delete <entry>", "Delete the entry with the given title", (yargs) => {
    return yargs
        .positional("entry", {
            type: "string",
            describe: "Title of the entry to be deleted",
            demandOption: true
        });
}, (argv) => {
    try {
        BudgetEntry.delete(argv.entry);
    } catch (error) {
        throw error;
    }
});

// CLI command for balance functionality
yargs.command("balance [currency]", "Show the total expenses", (yargs) => {
    return yargs
        .positional("currency", {
            type: "string",
            default: "CAD"
        });
}, (argv) => {
    try {
        const expense: number = BudgetEntry.balance();
        console.log("Total Outstanding Expenses: " + expense + " " + argv.currency);
    } catch (error) {
        throw error;
    }
});

// parse the incoming CLI arguments in order to determine which CLI command to execute
yargs.parse();