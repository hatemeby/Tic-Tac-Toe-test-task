import { Strategy, CellState, Board, pickMove } from "../../helpers/play"


// Расширяем стратегию игры на 'hint' — играем по подсказкам из UI.
type GameStrategy = Strategy | 'hint'

export class PlayPage {
    static ticTacToeBoardGrid = '[aria-label="Tic-Tac-Toe board"]'

    static get difficultyEl() { return cy.get('[data-testid="label-difficulty"]') }
    static get difficultySelection() { return cy.get('select[data-testid="select-difficulty"]') }
    static get yourTurnGameStatus() { return cy.get('[data-testid="status"][data-status="your-turn"]') }
    static get opponentTurnGameStatus() { return cy.get('[data-testid="status"][data-status="computer-thinking"]') }
    static gameResultStatus(status: 'computer' | 'human' | 'draw' = 'human') {
        return cy.get(`[data-testid="status"][data-status="${status}"]`)
    }
    static gameCellEl(item: number) {
        return cy.get(`${this.ticTacToeBoardGrid} [data-testid="cell-${item}"]`)
    }
    static gameCellState(item: number, state: CellState = 'empty') {
        return cy.get(`${this.ticTacToeBoardGrid} [data-testid="cell-${item}"][data-state="${state}"]`)
    }
    static get newGameBtn() { return cy.get('[data-testid="btn-new"]') }
    static get getHintBtn() { return cy.get('[data-testid="btn-hint"]') }
    static get resetBtn() { return cy.get('[data-testid="btn-reset"]') }

    static get hintedCell() {
        return cy.get(`${this.ticTacToeBoardGrid} .cell.is-hint`)
    }

    private static readBoard(): Cypress.Chainable<Board> {
        return cy.get(`${this.ticTacToeBoardGrid} [data-testid^="cell-"]`).then(($cells) => {
            const board: Board = Array(9).fill('empty')
            $cells.each((_, el) => {
                const id = el.getAttribute('data-testid') ?? ''
                const state = (el.getAttribute('data-state') ?? 'empty') as CellState
                const idx = Number(id.replace('cell-', ''))
                if (!Number.isNaN(idx) && idx >= 0 && idx < 9) {
                    board[idx] = state
                }
            })
            return board
        })
    }

    private static chooseMoveIndex(strategy: Strategy): Cypress.Chainable<number> {
        return this.readBoard().then((board) => pickMove(board, strategy))
    }

    private static requestHintIndex(): Cypress.Chainable<number> {
        this.getHintBtn.click()
        return this.hintedCell
            .should('exist')
            .first()
            .invoke('attr', 'data-testid')
            .then((id) => {
                if (!id) throw new Error('Hinted cell has no data-testid')
                const idx = Number(id.replace('cell-', ''))
                if (Number.isNaN(idx)) throw new Error(`Cannot parse hint cell index from "${id}"`)
                return idx
            })
    }

    private static makeMove(strategy: GameStrategy) {
        const indexChainable: Cypress.Chainable<number> =
            strategy === 'hint'
                ? this.requestHintIndex()
                : this.chooseMoveIndex(strategy)

        return indexChainable.then((index) => {
            if (index === -1) throw new Error('No empty cells available')
            return this.gameCellEl(index).click()
        })
    }

    private static waitForYourTurn() {
        return this.yourTurnGameStatus.should('be.visible')
    }

    private static waitForOpponentFinish() {
        return cy.get('[data-testid="status"]').should(($el) => {
            const status = $el.attr('data-status')
            expect(status).to.not.equal('computer-thinking')
        })
    }

    private static isGameFinished(): Cypress.Chainable<boolean> {
        return cy.get('[data-testid="status"]').then(($el) => {
            const status = $el.attr('data-status')
            return status === 'human' || status === 'computer' || status === 'draw'
        })
    }

    private static verifyBoardEmpty() {
        cy.get(`${this.ticTacToeBoardGrid} [data-testid^="cell-"]`)
            .should('have.length', 9)
            .each(($cell) => {
                expect($cell.attr('data-state')).to.equal('empty')
            })
    }

    static resetGame() {
        this.resetBtn.should('be.visible').click()
        this.verifyBoardEmpty()
        this.yourTurnGameStatus.should('be.visible')
    }

    static verifyResetMidGameAndReplay() {
        this.waitForYourTurn()
        this.makeMove('win')
        this.waitForOpponentFinish()
        this.resetGame()
        this.verifyBoardEmpty();
    }

    static verifyDifficultyChangeMidGameRestarts(
        newDifficulty: 'easy' | 'medium' | 'hard',
    ) {
        this.waitForYourTurn()
        this.makeMove('win')
        this.waitForOpponentFinish()
        this.difficultySelection.select(newDifficulty)
        this.difficultySelection.should('have.value', newDifficulty)
        this.verifyBoardEmpty()
        this.yourTurnGameStatus.should('be.visible')
    }

    /**
     * Choose strategy:
     * - 'win'         — trying to win
     * - 'lose'        — all for lose (better for hard difficulty)
     * - 'hint'        — plays only within hints
     * - 'first-empty' — initial state
     */
    static attemptGame(strategy: GameStrategy = 'win') {
        const playStep = () => {
            this.isGameFinished().then((finished) => {
                if (finished) return

                this.waitForYourTurn()
                this.makeMove(strategy)
                this.waitForOpponentFinish()

                playStep()
            });
        }
        playStep()
    }

    static playToWin() {
        this.attemptGame('win')
        this.gameResultStatus('human').should('be.visible')
    }

    static playToLose() {
        this.attemptGame('lose')
        this.gameResultStatus('computer').should('be.visible')
    }

    static playWithHints() {
        this.attemptGame('hint')
    }

    static playToDraw() {
        this.attemptGame('win');
        this.gameResultStatus('draw').should('be.visible')
    }

    static verifyHintAppears() {
        this.waitForYourTurn()
        this.getHintBtn.click()
        this.hintedCell.should('have.length', 1)
        this.hintedCell.should('have.attr', 'data-state', 'empty')
    }

    static verifyHintIsOptimal() {
        this.waitForYourTurn()
        this.readBoard().then((board) => {
            const expectedIndex = pickMove(board, 'win')
            this.getHintBtn.click()
            this.hintedCell
                .first()
                .should('have.attr', 'data-testid', `cell-${expectedIndex}`)
        })
    }
}