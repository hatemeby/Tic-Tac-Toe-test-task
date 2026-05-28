
export class MainPage {
    static get playNavBtn() { return cy.get('[data-testid="nav-play"]'); }
    static get currentUserEl() { return cy.get('[data-testid="hello-user"]'); }
    static get profileNavBtn() { return cy.get('[data-testid="nav-profile"]'); }
    static get historyNavBtn() { return cy.get('[data-testid="nav-history"]'); }
    static get logOutBtn() { return cy.get('[data-testid="btn-logout"]'); }
    static get themeBtn() { return cy.get('[data-testid="btn-theme"]'); }
    static currentThemeEl(theme: 'light' | 'dark' = 'light') { return cy.get(`[data-theme="${theme}"]`); }
    static get langugageSelector() { return cy.get(`select[data-testid="select-language"]`); }
    static get avatarEl() { return cy.get('[data-testid="avatar"]'); }
    static currentLocalisation(lang: 'en' | 'fa' = 'en') { return cy.get(`[lang="${lang}"]`); }

    static verifyCurrentUserSession(playerName: string) {
        MainPage.avatarEl.contains(playerName[0]).should('be.visible');
        MainPage.currentUserEl.contains(`Hello, ${playerName}`).should('be.visible');
    }
    
}