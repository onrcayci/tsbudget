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