import { Page, Locator } from "@playwright/test";

export class Table {

    private readonly page:  Page;
    private readonly _tableRow: Locator;
    private readonly editIcon: Locator;

    constructor(page: Page) {
        this.page = page;

        this._tableRow = this.page.locator("tbody>tr");
        this.editIcon = this.page.locator("#editIcon").first();
    }

    get tableRow(): Locator {
        return this._tableRow;
    }

    async getFirstRowResultInfo() {
        await Promise.all([
            this.tableRow.first().hover(),
            this.tableRow.first().isVisible(),

        ]);

        return await this.tableRow.first().innerText().then(text => text.split("\t"));
    }

    async clickEditIcon() {
        await Promise.all([
            this.editIcon.hover(),
            this.editIcon.click(),
        ]);
    }
}
