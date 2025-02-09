import { Page, Locator } from '@playwright/test'

export class SearchPage {
    private readonly page: Page;
    private readonly firstNamePlaceholder: Locator;
    private readonly searchButton: Locator;
    private readonly tableRow: Locator;

    constructor(page: Page) {
        this.page = page;
        this.firstNamePlaceholder = page.getByPlaceholder("Enter first name...");
        this.searchButton = page.getByRole("button", {name: "Search", exact: true})
        this.tableRow = page.locator('table > tbody > tr');
    }

    async inputFirstName(firstName: string) {
        await this.firstNamePlaceholder.fill(firstName);


        //return this.page;
    }

    async clickSearchButton() {

        await this.searchButton.click();
        //await this.page.waitForSelector(await this.page.locator("tbody > tr"));

//         const tbody = await this.page.$('tbody');
// // Waiting for the 'span' selector relative to the div.
//         // @ts-ignore
//         const span = await tbody.waitForSelector('tr', { state: 'attached' });


        // await Promise.all([
        //     this.page.waitForResponse(resp =>
        //         resp.url().includes('/api/users') && resp.status() === 200
        //     ).catch(() => console.log('No API response detected')), // Prevents hanging
        //     this.searchButton.click(),
        // ]);

        //return this.page;
    }

    async getTbodyRowCounts() {
        await this.page.waitForTimeout(2000);
        // await this.page.w
        const count = await this.tableRow.count();
        return count;
    }
}