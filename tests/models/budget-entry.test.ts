import { FileHandle, open } from "fs/promises";

import { BudgetEntry } from "../../src/models/budget-entry";

test("Successfully create an instance of BudgetEntry class", () => {
    const testEntry: BudgetEntry = new BudgetEntry("Test Entry", 100, "CAD", false);
    expect(testEntry).toBeInstanceOf(BudgetEntry);
    expect(testEntry.title).toEqual("Test Entry");
    expect(testEntry.description).toBeUndefined();
    expect(testEntry.amount).toEqual(100);
    expect(testEntry.currency).toEqual("CAD");
    expect(testEntry.date).toBeUndefined();
    expect(testEntry.recurring).toBeFalsy();
});

test("Successfully save a created BudgetEntry instance", async () => {
    const testEntry: BudgetEntry = new BudgetEntry("Test Entry", 100, "CAD", false);
    await testEntry.save();
    const saveFile: FileHandle = await open("save_file.json", "r");
    const savedEntry: BudgetEntry[] = JSON.parse(await saveFile.readFile({ encoding: "utf8" }));
    await saveFile.close();
    expect(savedEntry.length).toEqual(1);
    expect(savedEntry[0].title).toEqual("Test Entry");
    expect(savedEntry[0].description).toBeUndefined();
    expect(savedEntry[0].amount).toEqual(100);
    expect(savedEntry[0].currency).toEqual("CAD");
    expect(savedEntry[0].date).toBeUndefined();
    expect(savedEntry[0].recurring).toBeFalsy();
});