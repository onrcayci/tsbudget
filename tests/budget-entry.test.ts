import { existsSync, readFileSync, rmSync } from "fs";

import {
    saveEntry,
    updateEntry,
    deleteEntry,
    listEntries,
    totalExpense,
    listEntriesByPeriod,
    totalExpenseByPeriod
} from "../entry/budget-entry";

let  testEntry = {
    title: "Test Entry",
    amount: 100,
    currency: "CAD",
    recurring: false,
    date: "2021-01-01"
};

afterEach(() => {
    if (existsSync("save_file.json")) rmSync("save_file.json");
});

test("Successfully save a created BudgetEntry instance", () => {
    saveEntry(testEntry);
    const savedEntries = JSON.parse(readFileSync("save_file.json", { encoding: "utf8" }));
    expect(savedEntries.length).toEqual(1);
    expect(savedEntries[0].title).toEqual("Test Entry");
    expect(savedEntries[0].amount).toEqual(100);
    expect(savedEntries[0].currency).toEqual("CAD");
    expect(savedEntries[0].date).toEqual("2021-01-01");
    expect(savedEntries[0].recurring).toBeFalsy();
});

test("Successfully update a saved BudgetEntry instance", () => {
    saveEntry(testEntry);
    updateEntry(testEntry.title, { title: "Updated Title" });
    const savedEntries = JSON.parse(readFileSync("save_file.json", { encoding: "utf8" }));
    expect(savedEntries.length).toEqual(1);
    expect(savedEntries[0].title).toEqual("Updated Title");
});

test("Fail to update a BudgetEntry which is not saved", () => {
    expect(() => updateEntry(testEntry.title, { title: "Updated Title" })).toThrow("There are no saved entries!");
})

test("Successfully delete a saved BudgetEntry instance", () => {
    saveEntry(testEntry);
    deleteEntry(testEntry.title);
    const savedEntries = JSON.parse(readFileSync("save_file.json", { encoding: "utf8" }));
    expect(savedEntries.length).toEqual(0);
});

test("Fail to delete a BudgetEntry which is not saved", () => {
    expect(() => deleteEntry(testEntry.title)).toThrow("There are no saved entries!");
});

test("Successfully list all saved BudgetEntry instances", () => {
    saveEntry(testEntry);
    const savedEntries = listEntries();
    expect(savedEntries.length).toEqual(1);
    expect(savedEntries[0]).toEqual(testEntry);
});

test("Successfully return an empty list if there are no saved entries", () => {
    const savedEntries = listEntries();
    expect(savedEntries.length).toEqual(0);
});

test("Successfully return the current total expense", () => {
    saveEntry(testEntry);
    const balance: number = totalExpense();
    expect(balance).toEqual(testEntry.amount);
});

test("Successfully return 0 balance if there are no saved entries", () => {
    const balance: number = totalExpense();
    expect(balance).toEqual(0);
});

test("Successfully list all of the entries from a given year and month", () => {
    saveEntry(testEntry);
    const entries = listEntriesByPeriod("2021-01");
    expect(entries.length).toEqual(1);
    expect(entries[0].date).toEqual(testEntry.date);
});

test("Successfully return an empty list if there are no saved entries", () => {
    const entries = listEntriesByPeriod("2021-01");
    expect(entries.length).toEqual(0);
});

test("Successfully return the total expense of a given time period", () => {
    saveEntry(testEntry);
    const balanceByMonth = totalExpenseByPeriod("2021-01");
    expect(balanceByMonth).toEqual(testEntry.amount);
});

test("Successfully return 0 balance if there are no saved entries", () => {
    const balanceByMonth = totalExpenseByPeriod("2021-01");
    expect(balanceByMonth).toEqual(0);
});