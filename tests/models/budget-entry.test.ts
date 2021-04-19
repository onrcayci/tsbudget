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

afterAll(() => {
    if (existsSync("save_file.json")) rmSync("save_file.json");
});

test("Successfully create an instance of BudgetEntry class", () => {
    expect(testEntry).toBeInstanceOf(BudgetEntry);
    expect(testEntry.title).toEqual("Test Entry");
    expect(testEntry.description).toBeUndefined();
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
    expect(savedEntries[0].description).toBeUndefined();
    expect(savedEntries[0].amount).toEqual(100);
    expect(savedEntries[0].currency).toEqual("CAD");
    expect(savedEntries[0].date).toBeUndefined();
    expect(savedEntries[0].recurring).toBeFalsy();
});

test("Sucessfully update a saved BudgetEntry instance", () => {
    BudgetEntry.update(testEntry.title, {
        title: "Updated Title"
    });
    const savedEntries: BudgetEntry[] = JSON.parse(readFileSync("save_file.json", { encoding: "utf8" }));
    expect(savedEntries.length).toEqual(1);
    expect(savedEntries[0].title).toEqual("Updated Title");
});