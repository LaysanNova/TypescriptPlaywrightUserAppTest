import {test as base} from "@base/base.page";
import * as preconditions from "@preconditions/preconditions";
import * as usersData from "@data/users.data";

import {step, owner, link} from "allure-js-commons"


type MyFixtures = {
    forEachTest: void;
    creatDB: void;
}

export const test = base.extend<MyFixtures>({
    forEachTest: [async ({page}, use) => {
        {
            await owner("LaysanNova");
            await link("https://github.com/LaysanNova/NodeExpressAPI")
            await link("https://github.com/LaysanNova/TypescriptPlaywrightUserAppTest");
            await link("https://nodeexpressapi-n9sc.onrender.com");
        }

        await step('Navigate to home page.', async () => {
            await page.goto('/');
        });
        await use();
    }, {auto: true}],

    creatDB: [async ({request}, use) => {
        await step('Precondition - clear user DB, then create new users DB.', async () => {
            await preconditions.deleteUsers(request);
            await preconditions.createUsers(request, usersData.users);
        })
        await use();
        await step('Post-condition: Dispose request.', async () => {
            await request.dispose();
        });
    }, {auto: false, scope: "test", title: 'Setup Data Base.'}],
});


export {expect} from "@playwright/test";

export async function allureMeta(epic?: any, story?: any, tags?: any, Severity?: any, description?: any) {
    return await Promise.all([
        epic, story, tags, Severity, description
    ])
}
