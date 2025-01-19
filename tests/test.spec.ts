import {expect, test} from "@playwright/test";

test("first", async ({ page }) => {
    await page.goto('https://nodeexpressapi-n9sc.onrender.com/');
    expect(page.url()).toEqual('https://nodeexpressapi-n9sc.onrender.com/');
})

test("has title", async ({ page }) => {
    await expect(page).toHaveTitle('Users app');
})