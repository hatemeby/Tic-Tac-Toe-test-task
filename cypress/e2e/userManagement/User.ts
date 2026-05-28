
export type Difficulty = 'easy' | 'medium' | 'hard';

export interface GameHistory {
    finishedAt: number
    difficulty: Difficulty
    result: 'win' | 'loss' | 'draw'
}

export interface User {
    name: string
    createdAt: number
    difficulty: Difficulty
    history: GameHistory[]
}

export interface UsersStorage {
    [key: string]: User
}

export interface UserStats {
    win: number
    lose: number
    draw: number
}