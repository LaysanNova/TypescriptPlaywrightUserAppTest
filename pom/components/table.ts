import {Page, Locator, expect} from "@playwright/test";

export class Table {

    private readonly page:  Page;
    private readonly _tableRow: Locator;

    constructor(page: Page) {
        this.page = page;

        this._tableRow = this.page.locator("tbody>tr");
    }

    get tableRow(): Locator {
        return this._tableRow;
    }

    async getFirstRowResultInfo() {
        await Promise.all([
            this.tableRow.first().hover(),
            this.tableRow.first().isVisible(),
        ])

        return await this.tableRow.first().innerText().then(text => text.split("\t"));
    }


}