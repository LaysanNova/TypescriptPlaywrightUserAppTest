import { Page, Locator } from "@playwright/test";
import { Table } from "@components/table";


export class Form {
    private readonly page: Page;
    private readonly searchButton: Locator;
    private readonly _editButton: Locator;
    private readonly firstNamePlaceholder: Locator;

    constructor(page: Page) {
        this.page = page;

        this.searchButton = this.page.getByRole('button', {name: 'Search', exact: true});
        this._editButton = this.page.getByRole('button', {name: 'Edit', exact: true});

        this.firstNamePlaceholder = this.page.getByPlaceholder('Enter first name...');
    }

    get editButton(): Locator {
        return this._editButton;
    }

    async inputFirstName(firstName: string) {
        await Promise.all([
            new Table(this.page).tableRow.first().waitFor({state: 'attached'}),
            this.searchButton.isDisabled(),
            this.firstNamePlaceholder.isVisible(),
        ])

        await Promise.all([
            this.firstNamePlaceholder.fill(firstName),
            this.searchButton.isEnabled(),
        ])
    }

    async clickSearchButton() {
         await this.searchButton.click();
    }

    async clickEditButton() {
        await Promise.all([
            this._editButton.click(),
            this.page.waitForTimeout(200),
        ]);
    }

    async getPlaceholderValue(id: string) {
        let placeholder = this.page.getByTestId(id);
        return placeholder.getAttribute('placeholder');
    }

    async fillPlaceholder(id: string, value:string) {
        let placeholder = this.page.getByTestId(id);
        await placeholder.fill(value);
    }
}
