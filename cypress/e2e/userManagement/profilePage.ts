import { MainPage } from "../mainPage";
import { UserStats } from "./User";
import { WelcomePage } from "./welcomePage";

export class ProfilePage {
    static get profileNameField() { return cy.get('[data-testid="input-profile-name"]'); }
    static get saveChangesBtn() { return cy.get('[data-testid="btn-save-profile"]'); }
    static get deleteAccountBtn() { return cy.get('[data-testid="btn-delete-account"]'); }
    static get profileStatisticEl() { return cy.get('[data-testid="profile-stats"]'); }
    static get profileCreationEl() { return this.profileStatisticEl.find('[data-testid="profile-created"]'); }
    static get profileWinEl() { return this.profileStatisticEl.find('[data-testid="profile-wins"]'); }
    static get profileLoseEl() { return this.profileStatisticEl.find('[data-testid="profile-losses"]'); }
    static get profileDrawEl() { return this.profileStatisticEl.find('[data-testid="profile-draws"]'); }
    static get profileNotification() { return cy.get('[data-testid="profile-message"]').contains('Saved.'); }

    static verifyUserProfileData(dateCreation: string, statistics: UserStats) {
        MainPage.profileNavBtn.click();
        this.profileCreationEl.contains(dateCreation).should('be.visible');
        this.profileWinEl.contains(statistics.win).should('be.visible');
        this.profileLoseEl.contains(statistics.lose).should('be.visible');
        this.profileDrawEl.contains(statistics.draw).should('be.visible');
    }

    static changeProfileName(currentName: string, newName: string) {
        MainPage.profileNavBtn.click();
        MainPage.currentUserEl.contains(currentName).should('be.visible');
        this.profileNameField.clear().type(newName);
        this.saveChangesBtn.click();
    }

    static verifyChangedProfileName(newName: string) {
        this.profileNotification.should('be.visible');
        MainPage.currentUserEl.contains(newName).should('be.visible');
        this.profileNameField.should('have.value', newName);
    }

    static removeAccount() {
        MainPage.profileNavBtn.click();
        this.deleteAccountBtn.click();
    }

    static verifyRemovedAccount(playerName: string) {
        MainPage.currentUserEl.should('not.exist');
        WelcomePage.createAccountBtn.should('be.visible');
        WelcomePage.alreadyHaveAccountBtn.click();
        WelcomePage.playerNameField.clear().type(playerName);
        WelcomePage.loginBtn.click();
        WelcomePage.noAccountError.should('be.visible');
    }

    static verifyLogout(playerName: string) {
        MainPage.currentUserEl.contains(playerName).should('be.visible');
        MainPage.logOutBtn.click();
        MainPage.currentUserEl.should('not.exist');
        WelcomePage.createAccountBtn.should('be.visible');
        WelcomePage.alreadyHaveAccountBtn.should('be.visible');
        WelcomePage.authSubtitleEl.should('be.visible');
    }

    static verifyThemeSwitch() {
        MainPage.themeBtn.contains('Dark').click();
        MainPage.currentThemeEl('dark').should('be.visible');
        MainPage.themeBtn.contains('Light').click();
        MainPage.currentThemeEl('light').should('be.visible');
    }

    static verifyLocalisationChange() {
        MainPage.langugageSelector.select('fa');
        MainPage.currentLocalisation('fa').should('exist');
        MainPage.langugageSelector.select('en');
        MainPage.currentLocalisation('en').should('exist');
    }
}