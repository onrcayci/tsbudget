import { existsSync, readFileSync, rmSync } from "fs";

import { BudgetEntry } from "../../src/models/budget-entry";

let  testEntry: BudgetEntry;

beforeAll(() => {
    testEntry = new BudgetEntry({
        title: "Test Entry",
        amount: 100,
        currency: "CAD",
        recurring: false
    });
});

afterEach(() => {
    if (existsSync("save_file.json")) rmSync("save_file.json");
});

test("Successfully create an instance of BudgetEntry class", () => {
    expect(testEntry).toBeInstanceOf(BudgetEntry);
    expect(testEntry.title).toEqual("Test Entry");
    expect(testEntry.amount).toEqual(100);
    expect(testEntry.currency).toEqual("CAD");
    expect(testEntry.date).toBeUndefined();
    expect(testEntry.recurring).toBeFalsy();
});

test("Successfully save a created BudgetEntry instance", () => {
    testEntry.save();
    const savedEntries: BudgetEntry[] = JSON.parse(readFileSync("save_file.json", { encoding: "utf8" }));
    expect(savedEntries.length).toEqual(1);
    expect(savedEntries[0].title).toEqual("Test Entry");
    expect(savedEntries[0].amount).toEqual(100);
    expect(savedEntries[0].currency).toEqual("CAD");
    expect(savedEntries[0].date).toBeUndefined();
    expect(savedEntries[0].recurring).toBeFalsy();
});

test("Sucessfully update a saved BudgetEntry instance", () => {
    testEntry.save();
    BudgetEntry.update(testEntry.title, {
        title: "Updated Title"
    });
    const savedEntries: BudgetEntry[] = JSON.parse(readFileSync("save_file.json", { encoding: "utf8" }));
    expect(savedEntries.length).toEqual(1);
    expect(savedEntries[0].title).toEqual("Updated Title");
});

test("Fail to update a BudgetEntry which is not saved", () => {
    expect(() => BudgetEntry.update(testEntry.title, { title: "Updated Title" })).toThrow("Entry is not saved!");
})

test("Successfully delete a saved BudgetEntry instance", () => {
    testEntry.save();
    BudgetEntry.delete(testEntry.title);
    const savedEntries: BudgetEntry[] = JSON.parse(readFileSync("save_file.json", { encoding: "utf8" }));
    expect(savedEntries.length).toEqual(0);
});

test("Fail to delete a BudgetEntry which is not saved", () => {
    expect(() => BudgetEntry.delete(testEntry.title)).toThrow("Entry is not saved!");
});

test("Successfully list all saved BudgetEntry instances", () => {
    testEntry.save();
    const savedEntries: BudgetEntry[] = BudgetEntry.list();
    expect(savedEntries.length).toEqual(1);
    expect(savedEntries[0]).toEqual(testEntry);
});

test("Fail to list BudgetEntry instances since they are not saved", () => {
    expect(() => { BudgetEntry.list() }).toThrow("There are no saved entries!");
});

test("Successfully return the current total expense", () => {
    testEntry.save();
    const balance: number = BudgetEntry.balance();
    expect(balance).toEqual(testEntry.amount);
});

test("Fail to return the current total expense due to not having a save file", () => {
    expect(() => { BudgetEntry.balance() }).toThrow("There are no saved entries!");
});