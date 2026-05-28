// ====== Типы ======

export type CellState = 'empty' | 'x' | 'o'
export type Board = CellState[]
export type Strategy = 'win' | 'lose' | 'first-empty'

// ====== Константы ======

/** Все 8 выигрышных линий (3 горизонтали + 3 вертикали + 2 диагонали). */
export const WIN_LINES: ReadonlyArray<readonly [number, number, number]> = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6],
]

// ====== Чистая логика игры (без Cypress) — легко тестируется ======

/** Возвращает победителя ('x' | 'o'), 'draw' если ничья, null если игра не окончена. */
export function checkWinner(board: Board): CellState | 'draw' | null {
    for (const [a, b, c] of WIN_LINES) {
        if (board[a] !== 'empty' && board[a] === board[b] && board[b] === board[c]) {
            return board[a]
        }
    }
    return board.includes('empty') ? null : 'draw'
}

/** Индексы пустых клеток. */
export function emptyIndices(board: Board): number[] {
    const result: number[] = []
    for (let i = 0; i < board.length; i++) {
        if (board[i] === 'empty') result.push(i)
    }
    return result
}

/**
 * Минимакс. Возвращает оценку с точки зрения игрока `me`:
 *   +10 - me выигрывает (быстрее = лучше),
 *   -10 - оппонент выигрывает (медленнее = лучше),
 *    0  - ничья.
 * depth учитывается, чтобы предпочитать быстрые победы и долгие поражения.
 */
export function minimax(
    board: Board,
    me: 'x' | 'o',
    toMove: 'x' | 'o',
    depth = 0,
): number {
    const winner = checkWinner(board)
    if (winner === me) return 10 - depth
    if (winner && winner !== 'draw') return depth - 10
    if (winner === 'draw') return 0

    const opp: 'x' | 'o' = toMove === 'x' ? 'o' : 'x'
    const isMaximizing = toMove === me
    let best = isMaximizing ? -Infinity : Infinity

    for (const i of emptyIndices(board)) {
        board[i] = toMove
        const score = minimax(board, me, opp, depth + 1)
        board[i] = 'empty'
        best = isMaximizing ? Math.max(best, score) : Math.min(best, score)
    }
    return best
}

/** Оценка конкретного хода для игрока `me`. Не мутирует переданную доску. */
export function scoreMove(board: Board, me: 'x' | 'o', moveIndex: number): number {
    const opp: 'x' | 'o' = me === 'x' ? 'o' : 'x'
    const copy = [...board]
    copy[moveIndex] = me
    return minimax(copy, me, opp)
}

/** Лучший ход (для победы) — классический минимакс. */
export function pickBestMove(board: Board, me: 'x' | 'o'): number {
    let bestScore = -Infinity
    let bestMove = -1
    for (const i of emptyIndices(board)) {
        const score = scoreMove(board, me, i)
        if (score > bestScore) {
            bestScore = score
            bestMove = i
        }
    }
    return bestMove
}

/**
 * Худший ход (для гарантированного проигрыша).
 * Если есть ход, ведущий к поражению (-10), выбираем его.
 * Если нет, выбираем тот, что максимизирует шансы соперника.
 */
export function pickWorstMove(board: Board, me: 'x' | 'o'): number {
    let worstScore = Infinity
    let worstMove = -1
    for (const i of emptyIndices(board)) {
        const score = scoreMove(board, me, i)
        if (score < worstScore) {
            worstScore = score
            worstMove = i
        }
    }
    return worstMove
}

/** Определяет, кем играет человек (x или o), по числу занятых клеток. */
export function detectHumanSymbol(board: Board): 'x' | 'o' {
    // В этой игре человек ВСЕГДА X (ходит первым).
    // Эвристика "по числу ходов" ненадёжна: между нашим ходом и ответом ИИ
    // на доске xs > os, и эвристика бы вернула 'o' — это приводит к тому,
    // что минимакс играет за противника, а не за нас.
    return 'x'
}

/**
 * Высокоуровневая функция: получает доску + стратегию, возвращает индекс хода.
 * Возвращает -1, если ходить некуда.
 */
export function pickMove(board: Board, strategy: Strategy): number {
    const empties = emptyIndices(board)
    if (empties.length === 0) return -1

    if (strategy === 'first-empty') return empties[0]

    const me = detectHumanSymbol(board)
    return strategy === 'win' ? pickBestMove(board, me) : pickWorstMove(board, me)
}