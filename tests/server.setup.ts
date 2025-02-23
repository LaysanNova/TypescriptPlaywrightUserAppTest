import {Browser, BrowserContext, Page, chromium, test, expect} from "@playwright/test";
import {step, Severity} from "allure-js-commons"
import * as data from "@data/constants.data"
import * as allure from "allure-js-commons"

let browser: Browser;
let context: BrowserContext;
let page: Page;

test.beforeAll(`Setup playwright environment`, async () => {
    await step(`Launch ChromiumBrowser`, async () => {
        browser = await chromium.launch()
    })
})

test.describe(`Verify server is responsive`, async () => {
    // {
    //     await allure.epic(`SRV: Server Availability and Homepage Load.`);
    //     await allure.story(`SRV-LOAD: Verify API responds successfully upon navigation.`);
    //     await allure.tags(`SRV`, `SRV-LOAD`, `/api/`);
    // }

    test.beforeEach(`Create new Context and new Page`, async () => {
        {
            await allure.severity(Severity.BLOCKER);
        }

        await step(`Create new Context`, async () => {
            context = await browser.newContext()
        })

        await step(`Create new Page`, async () => {
            page = await context.newPage()
        })
    })

    test(`@allure.id:SRV-LOAD-TC01 Ensure page "/api/" is responsive`, async () => {
        {
            await allure.description('Ensure that the "/api/" page loads correctly by verifying "/api/" response and App name.');
        }

        await step(`1. Navigate to "/api/", verify successful response`, async () => {
            await Promise.all([
                page.waitForResponse(response =>
                    response.url().endsWith(`/api/`)
                    && response.status() === 200
                ),
                page.goto(`/api/`)
            ])
        });

        await step(`VERIFY app name "${data.APP_NAME}" is visible`, async () => {
            await expect(page.getByText(data.APP_NAME)).toBeVisible()
        })
    })

    test('@allure.id:SRV-LOAD-TC02 Ensure the homepage loads correctly.', async () => {
        {
            await allure.description('Ensure that the homepage loads correctly by verifying URL and "/api/users/" response.');
        }

        await step('1. Navigate to the homepage and wait for a successful "/api/users/" response.', async () => {
            await Promise.all([
                page.waitForResponse(response =>
                    response.url().endsWith('/api/users/') && response.status() === 200
                ),
                page.goto('/'),
            ]);
        });

        await step(`VERIFY that the homepage URL matches "${process.env.URL}".`, async () => {
            expect(page.url()).toEqual(`${process.env.URL}/`);
        });
    });

    test.afterEach(`Close new Context and new Page`, async () => {
        await step(`Close Page`, async () => {
            await page.close()
        })

        await step(`Close Context`, async () => {
            await context.close()
        })
    })
})

test.afterAll(`Teardown playwright environment`, async () => {
    await step(`Close ChromiumBrowser`, async () => {
        await browser.close()
    })
})
