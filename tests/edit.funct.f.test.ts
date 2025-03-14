import {test, expect, allureMeta} from "@base/base.test"
import * as usersData from "@data/users.data" ;
import {step, description, epic, Severity, story, tags} from "allure-js-commons";

test.describe('Validate edit button work correctly', async () => {

    test.beforeEach('Create API Request Context, Create Preconditions', async () => {
        await allureMeta(
            epic('FUN: Search User'),
            story('FUN-SEARCH: Search for User/Users using one or multiple criteria.'),
            tags('FUN', 'SEARCH'),
            Severity.NORMAL,
        );
    });

    test('Edit functionality: Edit user first name', async ({creatDB, editPage}) => {

        let userInfo: string[] = [];
        let userNewInfo: string[] = [];

        let idPlaceholderValue: string | null = "";
        let firstNamePlaceholderValue: string | null = "";
        let lastNamePlaceholderValue: string | null = "";
        let agePlaceholderValue: string | null = "";

        await step('Collect Actual user Info: Collect user info of the first row.', async () => {
            userInfo = await editPage.table.getFirstRowResultInfo();
        });

        await step('Collecting placeholder values on the form for editing.', async () => {
            idPlaceholderValue = await editPage.form.getPlaceholderValue("userId");
            firstNamePlaceholderValue = await editPage.form.getPlaceholderValue("firstName");
            lastNamePlaceholderValue = await editPage.form.getPlaceholderValue("lastName");
            agePlaceholderValue = await editPage.form.getPlaceholderValue("age");
        });

        await step('Expect: The id placeholder contains id of the first table row.', async () => {
            expect(idPlaceholderValue).toEqual(userInfo[4]);
        });

        await step('Expect: The first name placeholder contains first name of the first table row.', async () => {
            expect(firstNamePlaceholderValue).toEqual(userInfo[1]);
        });

        await step('Expect: The last name placeholder contains last name of the first table row.', async () => {
            expect(lastNamePlaceholderValue).toEqual(userInfo[2]);
        });

        await step('Expect: The age placeholder contains age of the first table row.', async () => {
            expect(agePlaceholderValue).toEqual(userInfo[3]);
        });

        await step('Edit: Enter new first name in the form.', async () => {
            await editPage.form.fillPlaceholder("firstName", usersData.newName.firstName);
        });

        await step('Click "Edit Button".', async () => {
            await editPage.form.clickEditButton();
        });

        await step('Collect Actual user Info: Collect user info of the first row after editing.', async () => {
            userNewInfo = await editPage.table.getFirstRowResultInfo();
        });

        await step('Expect: The id has not been changed.', async () => {
            expect(userNewInfo[4]).toEqual(userInfo[4]);
        });

        await step(`Expect: The first name changed to '${usersData.newName.firstName}'.`, async () => {
            expect(userNewInfo[1]).toEqual(usersData.newName.firstName);
        });

        await step('Expect: The last name has not been changed.', async () => {
            expect(userNewInfo[2]).toEqual(userInfo[2]);
        });

        await step('Expect: The age has not been changed.', async () => {
            expect(userNewInfo[3]).toEqual(userInfo[3]);
        });
    })

    test('Validate that "Edit Button" disabled with fields empty', async ({creatDB, editPage}) => {

        let editButton = editPage.form.editButton;

        await step('Expect: "Edit Button" is visible and not available.', async () => {
            await expect(editButton).toBeVisible();
            await expect(editButton).toBeDisabled();
        });

        await step('Edit: Enter new first name in the form.', async () => {
            await editPage.form.fillPlaceholder("firstName", usersData.newName.firstName);
        });

        await step('Expect: "Edit Button" is available.', async () => {
            await expect(editButton).toBeEnabled();
        });


        await step('Edit: Remove first name in the form.', async () => {
            await editPage.form.fillPlaceholder("firstName", "");
        });

        await step('Expect: "Edit Button" is not available.', async () => {
            await expect(editButton).toBeDisabled();
        });
    })
})