import { MainPage } from "../mainPage";

export class WelcomePage {
    static get playerNameField() { return cy.get('[data-testid="input-name"]'); }
    static get createAccountBtn() { return cy.get('[data-testid="btn-register"]'); }
    static get alreadyHaveAccountBtn() { return cy.get('[data-testid="btn-switch-mode"]'); }
    static get loginBtn() { return cy.get('[data-testid="btn-login"]'); }
    static get noAccountError() { return cy.get('[data-testid="auth-error"]').contains('No account with this name. Please register.'); }
    static get nameAlreadyTakenError() { return cy.get('[data-testid="auth-error"]').contains('This name is already taken. Try logging in.'); }
    static get authSubtitleEl() { return cy.get('[data-testid="auth-subtitle"]').contains('Enter your name to start playing.'); }

    static createNewPlayer(playerName: string) {
        this.playerNameField.clear().type(playerName);
        this.createAccountBtn.click();
    }

    static singIn(playerName: string) {
        this.alreadyHaveAccountBtn.click();
        this.playerNameField.clear().type(playerName);
        this.loginBtn.click();
    }

    static verifyUnexistedUserSignIn(playerName: string) {
        this.alreadyHaveAccountBtn.click();
        this.playerNameField.clear().type(playerName);
        this.loginBtn.click();
        this.noAccountError.should('be.visible');
    }

    static verifySignUpWithNameAlreadyInUse(playerName: string) {
        this.playerNameField.clear().type(playerName);
        this.createAccountBtn.click();
        this.nameAlreadyTakenError.should('be.visible');
    }
}