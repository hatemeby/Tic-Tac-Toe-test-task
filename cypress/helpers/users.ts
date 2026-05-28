import { Difficulty, GameHistory, User, UsersStorage, UserStats } from "../e2e/userManagement/User"
import { randomString } from "./generators";

const USERS_KEY = 'ttt:users'
const SESSION_KEY = 'ttt:session'

export function clearAllUsers() {
    cy.window().then((win) => {
        win.localStorage.setItem(USERS_KEY, JSON.stringify({}))
    })
}

export function createUser(): Cypress.Chainable<User> {
    const playerName = `Test user ${randomString(6)}`
    return cy.window().then((win) => {
        const users: UsersStorage = JSON.parse(
            win.localStorage.getItem(USERS_KEY) || '{}'
        )

        const newUser: User = {
            name: playerName,
            createdAt: Date.now(),
            difficulty: 'easy',
            history: [
                { finishedAt: Date.now(), difficulty: 'easy', result: 'win' },
                { finishedAt: Date.now(), difficulty: 'medium', result: 'win' },
                { finishedAt: Date.now(), difficulty: 'medium', result: 'win' },
                { finishedAt: Date.now(), difficulty: 'hard', result: 'loss' },
                { finishedAt: Date.now(), difficulty: 'medium', result: 'draw' },
                { finishedAt: Date.now(), difficulty: 'hard', result: 'loss' },
            ],
        }

        users[playerName.toLowerCase()] = newUser
        win.localStorage.setItem(USERS_KEY, JSON.stringify(users))

        return newUser
    })
}

export function createUserWithSession(): Cypress.Chainable<User> {
    return createUser().then((user) => {
        return cy.window().then((win) => {
            win.localStorage.setItem(SESSION_KEY, user.name)
            return user
        })
    })
}

export function setUserDifficulty(userName: string, difficulty: Difficulty) {
    return cy.window().then((win) => {
        const users: UsersStorage = JSON.parse(
            win.localStorage.getItem(USERS_KEY) || '{}'
        )

        const key = userName.toLowerCase()
        if (!users[key]) {
            throw new Error(`User "${userName}" not found in localStorage`)
        }

        users[key].difficulty = difficulty
        win.localStorage.setItem(USERS_KEY, JSON.stringify(users))

        return users
    })
}

export function calcUserStats(history: GameHistory[]): UserStats {
    const stats: UserStats = { win: 0, lose: 0, draw: 0 }
    for (const entry of history) {
        if (entry.result === 'win') stats.win++
        else if (entry.result === 'loss') stats.lose++
        else if (entry.result === 'draw') stats.draw++
    }
    return stats
}