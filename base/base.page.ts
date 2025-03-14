import {test as base} from "@playwright/test";
import {HomePage} from "@pages/home.page";
import {SearchPage} from "@pages/search.page";
import {EditPage} from "@pages/edit.page";
import {step} from "allure-js-commons";

export type MyPages = {
    homePage: HomePage,
    searchPage: SearchPage,
    editPage: EditPage,
};

export const test = base.extend<MyPages>({
    homePage: async ({page}, use) => {
        await use(new HomePage(page))
    },

    searchPage:async ({page, homePage}, use) => {
        await step('Click "Search tab on the Home page."', async () => {
            await homePage.tab.clickSearchTab();
        });
        await use(new SearchPage(page));
    },

    editPage:async ({page, searchPage}, use ) => {
        await step('Click "first edit icon" on the table.', async () => {
            await searchPage.table.clickEditIcon();
        });
        await use(new EditPage(page));
    }
});

export {expect} from "@playwright/test";
