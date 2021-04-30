import { existsSync, readFileSync, rmSync } from "fs";

import { saveEntry, updateEntry } from "../../src/models/budget-entry";

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

test("Sucessfully update a saved BudgetEntry instance", () => {
    saveEntry(testEntry);
    updateEntry(testEntry.title, { title: "Updated Title" });
    const savedEntries = JSON.parse(readFileSync("save_file.json", { encoding: "utf8" }));
    expect(savedEntries.length).toEqual(1);
    expect(savedEntries[0].title).toEqual("Updated Title");
});

test("Fail to update a BudgetEntry which is not saved", () => {
    expect(() => updateEntry(testEntry.title, { title: "Updated Title" })).toThrow("There are no saved entries!");
})

// test("Successfully delete a saved BudgetEntry instance", () => {
//     testEntry.save();
//     BudgetEntry.delete(testEntry.title);
//     const savedEntries: BudgetEntry[] = JSON.parse(readFileSync("save_file.json", { encoding: "utf8" }));
//     expect(savedEntries.length).toEqual(0);
// });

// test("Fail to delete a BudgetEntry which is not saved", () => {
//     expect(() => BudgetEntry.delete(testEntry.title)).toThrow("There are no saved entries!");
// });

// test("Successfully list all saved BudgetEntry instances", () => {
//     testEntry.save();
//     const savedEntries: BudgetEntry[] = BudgetEntry.list();
//     expect(savedEntries.length).toEqual(1);
//     expect(savedEntries[0]).toEqual(testEntry);
// });

// test("Fail to list BudgetEntry instances since they are not saved", () => {
//     expect(() => BudgetEntry.list()).toThrow("There are no saved entries!");
// });

// test("Successfully return the current total expense", () => {
//     testEntry.save();
//     const balance: number = BudgetEntry.balance();
//     expect(balance).toEqual(testEntry.amount);
// });

// test("Fail to return the current total expense due to not having a save file", () => {
//     expect(() => BudgetEntry.balance()).toThrow("There are no saved entries!");
// });

// test("Successfully list all of the entries from a given year and month", () => {
//     testEntry.save();
//     const entries: BudgetEntry[] = BudgetEntry.listByMonth("2021-02");
//     expect(entries.length).toEqual(1);
//     expect(entries[0].date).toEqual(testEntry.date);
// });

// test("Fail to return the list of all entries from a given year and month to due not having a save file", () => {
//     expect(() => BudgetEntry.listByMonth("2021-02")).toThrow("There are no saved entries!");
// });

// test("Sucessfully return the total expense of a given time period", () => {
//     testEntry.save();
//     const balanceByMonth = BudgetEntry.balanceByMonth("2021-02");
//     expect(balanceByMonth).toEqual(testEntry.amount);
// });

// test("Fail to return the total expense of a given time period due to not having a save file", () => {
//     expect(() => BudgetEntry.balanceByMonth("2021-02")).toThrow("There are no saved entries!");
// });