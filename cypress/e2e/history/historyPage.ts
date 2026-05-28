import { convertDate, firstCharCapitilized } from "../../helpers/generators";
import { MainPage } from "../mainPage";
import { GameHistory } from "../userManagement/User";

export class HistoryPage {
    static get clearHistoryBtn() { return cy.get('[data-testid="btn-clear-history"]'); }
    static get historyPageTitle() { return cy.get('[data-testid="history-title"]'); }
    static get gameHistoryEmptyState() { return cy.get('[data-testid="history-empty"]').contains('No games yet. Play one!'); }
    static historyRowEl(item: number) { return cy.get(`[data-testid="history-row-${item}"]`); }
    static historyDate(item: number) { return this.historyRowEl(item).find(`[data-testid="history-date-${item}"]`); }
    static historyDifficulty(item: number) { return this.historyRowEl(item).find(`[data-testid="history-difficulty-${item}"]`); }
    static historyResult(item: number) { return this.historyRowEl(item).find(`[data-testid="history-result-${item}"]`); }
    static rowResultEl(item: number, result: string) { return cy.get(`[data-testid="history-row-${item}"][data-result="${result}"]`); }

    static clearHistory() {
        MainPage.historyNavBtn.click();
        this.historyPageTitle.should('be.visible');
        this.clearHistoryBtn.click();
    }

    static verifyClearedHistory() {
        this.gameHistoryEmptyState.should('be.visible');
        this.clearHistoryBtn.should('not.exist');
    }

    static verifyGameHistoryData(history: GameHistory[]) {
        MainPage.historyNavBtn.click();
        history.forEach((entry, index) => {
            this.historyDate(index).contains(convertDate(entry.finishedAt)).should('be.visible');
            this.historyDifficulty(index).contains(firstCharCapitilized(entry.difficulty)).should('be.visible');
            this.historyResult(index).contains(firstCharCapitilized(entry.result)).should('be.visible');
            this.rowResultEl(index, entry.result).should('be.visible');
        });
    }
}