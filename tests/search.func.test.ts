import {test, expect, allureMeta} from "@base/base.test"
import * as usersData from "@data/users.data" ;
import {HomePage} from "@pages/home.page";
import {SearchPage} from "@pages/search.page";
import {description, epic, Severity, story, tags} from "allure-js-commons";


test.describe('Should Search Users By Search Criteria', async () => {

    test.beforeEach('Create API Request Context, Create Preconditions', async () => {
        await allureMeta(
            epic('FUN: Search User'),
            story('FUN-SEARCH: Search for User/Users using one or multiple criteria.'),
            tags('FUN', 'SEARCH'),
            Severity.NORMAL
        );
    })

    test('Search User With Unique First Name - no POM', async ({creatDB, page}) => {
        const userWithUniqueFirstName = usersData.users[0];

        const searchTab = page.getByRole('link', {name: 'Search', exact: true});
        const tableRow = page.locator("tbody>tr");
        const firstNamePlaceholder = page.getByPlaceholder('Enter first name...');
        const searchButton = page.getByRole('button', {name: 'Search', exact: true});

        await expect(searchTab).toBeEnabled();
        await searchTab.hover();
        await searchTab.click();

        await expect(tableRow.first()).toBeAttached();
        await expect(searchButton).toBeDisabled();
        await expect(firstNamePlaceholder).toBeVisible();

        await firstNamePlaceholder.fill(userWithUniqueFirstName.firstName);

        await expect(searchButton).toBeEnabled();
        await searchButton.click();

        await expect(tableRow).toHaveCount(1);

        await tableRow.first().hover();
        await expect(tableRow.first()).toBeVisible();

        const actualUserInfo = await tableRow.first().innerText().then(text => text.split("\t"));

        expect(actualUserInfo[1]).toStrictEqual(userWithUniqueFirstName.firstName);
        expect(actualUserInfo[2]).toStrictEqual(userWithUniqueFirstName.lastName);
        expect(actualUserInfo[3]).toStrictEqual(userWithUniqueFirstName.age.toString());
    })


    test('Search User With Unique First Name - POM v2', async ({creatDB, page}) => {
        await allureMeta(
            description('This test verifies that the "Search" tab is accessible, allows user input, ' +
                'enables the search button upon valid input, and correctly displays the searched user’s details ' +
                'in the results table.')
        )

        const userWithUniqueFirstName = usersData.uniqueFirstNameUser;
        const expectedFirstName = userWithUniqueFirstName.firstName;
        const expectedLastName = userWithUniqueFirstName.lastName;
        const expectedAge = userWithUniqueFirstName.age.toString();
        let actualUserInfo: string[];

        await new HomePage(page).tab.clickSearchTab();

        const searchPage = new SearchPage(page);
        await searchPage.form.inputFirstName(userWithUniqueFirstName.firstName);
        await searchPage.form.clickSearchButton();

        await expect(searchPage.table.tableRow).toHaveCount(1);

        actualUserInfo = await searchPage.table.getFirstRowResultInfo();

        expect(actualUserInfo[1]).toStrictEqual(expectedFirstName);
        expect(actualUserInfo[2]).toStrictEqual(expectedLastName);
        expect(actualUserInfo[3]).toStrictEqual(expectedAge);
    })

    test('Search User With Non-Unique First Name', async ({page}) => {

    })

    // test.beforeEach('Create API Request Context, Create Preconditions', async({ page }) => {
    //     apiRequest = await request.newContext();
    //     await preconditions.deleteUsers(apiRequest);
    //     await preconditions.createUsers(apiRequest);
    //
    //     await page.goto('/');
    // })
    //
    // test('Search User With Unique First Name', async({ page }) => {
    //     test.slow()
    //     const userJohn = users[0];
    //     await new HomePage(page).clickSearchTab();
    //
    //     const searchPage = new SearchPage(page);
    //     await searchPage.inputFirstName(userJohn.firstName);
    //     await searchPage.clickSearchButton();
    //
    //     const expected = await searchPage.getTbodyRowCounts()
    //
    //     expect(expected).toBe(1);
    // })
})