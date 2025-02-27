import {test, expect, request, APIRequestContext, Locator} from "@playwright/test";
import * as preconditions from "@preconditions/preconditions"
import * as usersData from "@data/users.data";
import {HomePage} from "@pages/home.page";
import {SearchPage} from "@pages/search.page";

test.describe('Validate edit button work correctly', async () => {
    let apiRequest: APIRequestContext;

    test.beforeEach('Create API Request Context, Create Preconditions', async ({page}) => {
        apiRequest = await request.newContext();
        await preconditions.deleteUsers(apiRequest);
        await preconditions.createUsers(apiRequest, usersData.users);

        await page.goto('/');
    })

    test('Edit user first name - no POM', async ({page}) => {
        await new HomePage(page).tab.clickSearchTab();
        const searchPage = new SearchPage(page);
        const editIcon = page.locator("#editIcon").first();
        const editButton = page.getByRole('button', {name: 'Edit', exact: true});

        const userIdPlaceholder = page.getByTestId('userId');
        const firstNamePlaceholder = page.getByTestId('firstName');
        const lastNamePlaceholder = page.getByTestId('lastName');
        const agePlaceholder = page.getByTestId('age');

        const userInfo = await searchPage.table.getFirstRowResultInfo();

        await editIcon.first().click();

        const actualUserId = await userIdPlaceholder.getAttribute('placeholder');
        const actualFirstName = await firstNamePlaceholder.getAttribute('placeholder');
        const actualLastName = await lastNamePlaceholder.getAttribute('placeholder');
        const actualAge = await agePlaceholder.getAttribute('placeholder');

        expect(actualUserId).toEqual(userInfo[4]);
        expect(actualFirstName).toEqual(userInfo[1]);
        expect(actualLastName).toEqual(userInfo[2]);
        expect(actualAge).toEqual(userInfo[3]);

        await firstNamePlaceholder.fill(usersData.newName.firstName);

        await expect(editButton).toBeEnabled();
        await editButton.click();
        await page.waitForLoadState('load')

        const userNewInfo = await searchPage.table.getFirstRowResultInfo();

        expect(userNewInfo[4]).toEqual(userInfo[4]);
        expect(userNewInfo[1]).toEqual(usersData.newName.firstName);
        expect(userNewInfo[2]).toEqual(userInfo[2]);
        expect(userNewInfo[3]).toEqual(userInfo[3]);

    })

    test('Validate that edit button disabled with fields empty  - no POM', async ({page}) => {
        await new HomePage(page).tab.clickSearchTab();
        const editIcon = page.locator("#editIcon").first();
        const editButton = page.getByRole('button', {name: 'Edit', exact: true});

        const firstNamePlaceholder = page.getByTestId('firstName');
        await editIcon.first().click();

        await expect(editButton).toBeVisible();
        await expect(editButton).toBeDisabled();

        await firstNamePlaceholder.fill("Something");
        await expect(editButton).toBeEnabled();

        await firstNamePlaceholder.fill("");
        await expect(editButton).toBeDisabled();
    })

    test.afterEach('Close API request context', async () => {
        await apiRequest.dispose();
    })
})