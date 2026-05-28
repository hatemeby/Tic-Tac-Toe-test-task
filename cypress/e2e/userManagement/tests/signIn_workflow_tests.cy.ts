import { randomString } from "../../../helpers/generators";
import { clearAllUsers, createUser } from "../../../helpers/users";
import { MainPage } from "../../mainPage";
import { WelcomePage } from "../welcomePage";

describe('User Management workflow tests', () => {
    let playerName: string

    before(() => {
        playerName = `Test user ${randomString(6)}`;
        clearAllUsers();
        createUser().then(val => {
            playerName = val.name;
            cy.visit('index.html')
        });
    });

    it('User can Sign In into the app (workflow)', () => {
        WelcomePage.singIn(playerName)
        MainPage.verifyCurrentUserSession(playerName)
    });

    it('User cannot Sign In with unexisting credentials (workflow)', () => {
        const invalidUser = `Some random name ${randomString(3)}`;
        cy.visit('index.html')
        WelcomePage.verifyUnexistedUserSignIn(invalidUser);
    });
});