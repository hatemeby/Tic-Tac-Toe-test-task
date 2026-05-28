import { createUserWithSession, setUserDifficulty, } from "../../../helpers/users";
import { PlayPage } from "../playPage";

describe('Play tests', () => {
    let playerName: string;

    beforeEach(() => {
        createUserWithSession().then(val => {
            playerName = val.name;
            cy.visit('index.html');
        });
    });

    it('Authorized user can verify Get Hint feature (workflow)', () => {
        PlayPage.playWithHints();
    });

    it('Authorized user can win in Tic-Tac-Toe game (workflow)', () => {
        PlayPage.playToWin();
    });

    it('Authorized user can lose in Tic-Tac-Toe game (workflow)', () => {
        setUserDifficulty(playerName, 'hard');
        cy.reload();
        PlayPage.playToLose();
    });

    // [BUG: For some reason, the computer opponent overwrites my second move selection, breaking the entire game logic.]
    it.skip('Authorized user can draw in Tic-Tac-Toe game (worfklow)', () => {
        setUserDifficulty(playerName, 'hard');
        cy.reload();
        PlayPage.playToDraw();
    });

    it('Authorized user can verify reset game (workflow)', () => {
        PlayPage.verifyResetMidGameAndReplay();
    });

    it('Authorized user can verify difficulty change in mid-game (workflow)', () => {
        PlayPage.verifyDifficultyChangeMidGameRestarts('medium');
    });
});