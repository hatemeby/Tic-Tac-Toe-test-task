import { randomString } from "../../../helpers/generators";
import { clearAllUsers, createUser } from "../../../helpers/users";
import { MainPage } from "../../mainPage";
import { WelcomePage } from "../welcomePage";

describe('User Management workflow tests', () => {
    let playerName: string

    before(() => {
        playerName = `Test user ${randomString(6)}`;
        clearAllUsers();
        cy.visit('index.html')
    });

    it('User can Sign Up (workflow)', () => {
        WelcomePage.createNewPlayer(playerName);
        MainPage.verifyCurrentUserSession(playerName);
    });

    it('User cannot Sign Up with player name already in user (workflow)', () => {
        createUser().then(val => {
            playerName = val.name;
            cy.visit('index.html')
            WelcomePage.verifySignUpWithNameAlreadyInUse(playerName);
        });
    });
});