import { test, expect, request, APIRequestContext} from "@playwright/test";
import * as preconditions from "@preconditions/preconditions"
import {users} from "@data/users.data";

test.describe('Test Suite Name', async() => {
    let apiRequest: APIRequestContext;

    test.beforeEach('Create API Request Context, Create Preconditions', async({ page }) => {
        apiRequest = await request.newContext();
        await preconditions.deleteUsers(apiRequest);
        await preconditions.createUsers(apiRequest, users);

        await page.goto('/');
    })

    test('Unique Test Name', async({ page }) => {

    })

    test.afterEach('Close API request context', async () => {
        await apiRequest.dispose();
    })
})