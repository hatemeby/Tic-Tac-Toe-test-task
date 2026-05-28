import { convertDate } from "../../../helpers/generators";
import { createUserWithSession, calcUserStats } from "../../../helpers/users";
import { GameHistory, UserStats } from "../../userManagement/User";
import { HistoryPage } from "../historyPage";

describe('History workflow tests', () => {
    let playerName: string
    let gameStatistics: UserStats;
    let dateCreation: string;
    let gameHistoryData: GameHistory[];

    beforeEach(() => {
        createUserWithSession().then(val => {
            playerName = val.name;
            gameHistoryData = val.history;
            gameStatistics = calcUserStats(gameHistoryData);
            dateCreation = convertDate(val.createdAt);
            cy.visit('index.html');
        });
    });

    it('Auhorized user can clear game history (workflow)', () => {
        HistoryPage.clearHistory();
        HistoryPage.verifyClearedHistory();
    });

    it('Authorized user can veriyf game history data (UI)', () => {
        HistoryPage.verifyGameHistoryData(gameHistoryData);
    });
});