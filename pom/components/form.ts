import {Page, Locator, expect} from "@playwright/test";
import {Table} from "@components/table";


export class Form {

    private readonly page: Page;
    private readonly searchButton: Locator;
    private readonly firstNamePlaceholder: Locator;


    constructor(page: Page) {
        this.page = page;

        this.searchButton = this.page.getByRole('button', {name: 'Search', exact: true});
        this.firstNamePlaceholder = this.page.getByPlaceholder('Enter first name...');
        //this.firstNamePlaceholder = this.page.locator('input[placeholder="Enter first name..."]');
    }

    async inputFirstName(firstName: string) {
        await Promise.all([
            new Table(this.page).tableRow.first().waitFor({state: 'attached'}),
            this.searchButton.isDisabled(),
            this.firstNamePlaceholder.isVisible(),])

        await Promise.all([
            this.firstNamePlaceholder.fill(firstName),
            this.firstNamePlaceholder.dispatchEvent('input'),
            this.firstNamePlaceholder.dispatchEvent('keyup'),
            this.firstNamePlaceholder.dispatchEvent('change'),
            this.searchButton.isEnabled(),
          ])
    }

    async clickSearchButton() {
        await Promise.all([
            this.searchButton.click()
        ])
    }
}
