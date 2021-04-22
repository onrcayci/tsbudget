import yargs from "yargs";

import { BudgetEntry } from "./models/budget-entry";

yargs.version("0.0.b1");

// add command
yargs.command(
    "add <title> <amount> <currency> <recurring>",
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

// update command
yargs.command("update <entry>", "Update an existing entry", (yargs) => {
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

// list command
yargs.command("list", "List all of the entries", (yargs) => {
    return yargs.positional("list", {
        type: "string",
        demandOption: true
    });
}, () => {
    try {
        BudgetEntry.list();
    } catch (error) {
        throw error;
    }
});

// delete command
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

yargs.parse();