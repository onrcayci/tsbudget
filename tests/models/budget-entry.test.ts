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
    const savedEntry: BudgetEntry[] = JSON.parse(readFileSync("save_file.json", { encoding: "utf8" }));
    expect(savedEntry.length).toEqual(1);
    expect(savedEntry[0].title).toEqual("Test Entry");
    expect(savedEntry[0].description).toBeUndefined();
    expect(savedEntry[0].amount).toEqual(100);
    expect(savedEntry[0].currency).toEqual("CAD");
    expect(savedEntry[0].date).toBeUndefined();
    expect(savedEntry[0].recurring).toBeFalsy();
});