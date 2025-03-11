import {test, expect, allureMeta} from "@base/base.test"
import * as usersData from "@data/users.data" ;
import {step, description, epic, Severity, story, tags} from "allure-js-commons";


test.describe('Should Search Users By Search Criteria', async () => {

    test.beforeEach('Create API Request Context, Create Preconditions', async () => {
        await allureMeta(
            epic('FUN: Search User'),
            story('FUN-SEARCH: Search for User/Users using one or multiple criteria.'),
            tags('FUN', 'SEARCH'),
            Severity.NORMAL,
        );
    });

    test('Search User With Unique First Name using fixtures - POM', async ({creatDB, homePage, searchPage}) => {
        await allureMeta(
            description('This test verifies that the "Search" tab is accessible, allows user input, ' +
                'enables the search button upon valid input, and correctly displays the searched user’s details ' +
                'in the results table.')
        )

        const userWithUniqueFirstName = usersData.uniqueFirstNameUser;
        const expectedFirstName = userWithUniqueFirstName.firstName;
        const expectedLastName = userWithUniqueFirstName.lastName;
        const expectedAge = userWithUniqueFirstName.age.toString();
        let actualUserInfo: string[] = [];

        await step('1. Click "Search tab on the Home page."', async () => {
            await homePage.tab.clickSearchTab();
        });

        await step(`2. Input '${userWithUniqueFirstName.firstName}' into "First Name field"`, async () => {
            await searchPage.form.inputFirstName(userWithUniqueFirstName.firstName);
        });

        await step('3. Click "Search" button when enabled.', async () => {
            await searchPage.form.clickSearchButton();
        });

        await step('Expect: The number of users displayed in search results is 1.', async () => {
            await expect(searchPage.table.tableRow).toHaveCount(1);
        });

        await step('Collect Actual user Info: Collect user info the singles search result.', async () => {
            actualUserInfo = await searchPage.table.getFirstRowResultInfo();
        });

        await step(`Expect: Actual first name '${actualUserInfo[1]}' in the search result matches the expected first name '${expectedFirstName}'.`, async () => {
            expect(actualUserInfo[1]).toStrictEqual(expectedFirstName);
        });

        await step(`Expect: Actual first name '${actualUserInfo[2]}' in the search result matches the expected first name '${expectedLastName}'.`, async () => {
            expect(actualUserInfo[2]).toStrictEqual(expectedLastName);

        });

        await step(`Expect: Actual first name '${actualUserInfo[3]}' in the search result matches the expected first name '${expectedAge}'.`, async () => {
            expect(actualUserInfo[3]).toStrictEqual(expectedAge);
        });
    })
});