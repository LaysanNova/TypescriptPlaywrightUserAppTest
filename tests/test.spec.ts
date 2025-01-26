import {test} from "@playwright/test";


test("test 1", async({page}) => {
    await page.goto('/');
})