import { randomString } from "../../../helpers/generators";
import { calcUserStats, createUserWithSession } from "../../../helpers/users";
import { ProfilePage } from "../profilePage";
import { UserStats } from "../User";

describe('User Management workflow tests', () => {
    let playerName: string
    let gameStatistics: UserStats;
    let dateCreation: string;

    beforeEach(() => {
        createUserWithSession().then(val => {
            playerName = val.name;
            gameStatistics = calcUserStats(val.history);
            dateCreation = new Date(val.createdAt).toLocaleString('en-US')
            cy.visit('index.html');
        });
    });

    it('Authorized user can verify user profile data (UI)', () => {
        ProfilePage.verifyUserProfileData(dateCreation, gameStatistics);
    });

    it('Authorized user can update profile name (workflow)', () => {
        const editProfileName = `Test edited name ${randomString(5)}`;
        ProfilePage.changeProfileName(playerName, editProfileName);
        ProfilePage.verifyChangedProfileName(editProfileName);
    });

    it('Authorized user can remove profile (workflow)', () => {
        ProfilePage.removeAccount();
        ProfilePage.verifyRemovedAccount(playerName);
    });

    it('Authorized user can Sign Out from the app (workflow)', () => {
        ProfilePage.verifyLogout(playerName);
    });

    it('Authorized user can verify theme switch (UI)', () => {
        ProfilePage.verifyThemeSwitch();
    });

    it('Authorized user can verify language switch (UI)', () => {
        ProfilePage.verifyLocalisationChange();
    }); 
});