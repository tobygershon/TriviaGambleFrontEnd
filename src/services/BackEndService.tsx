import axios from "axios";

const localHost = axios.create({
    baseURL: 'https://triviagambleflaskbackend-production.up.railway.app'
})

// get all unstarted games

export async function getAllUnstartedGames() {
    try {
        const response = await localHost.get('')
        return response.data.unstarted_games
    } catch (error) {
        console.log('There was an error w/new_game endpt: ' + error)
    }
}

// new game

export async function createNewGame(playerName: string) {

    try {
        const response = await localHost.post('/new_game', {
            player: playerName
        })
        return response.data
    } catch (error) {
        console.log('There was an error w/new_game endpt: ' + error)
    }
}

export async function addNewPlayer(gameId: string, playerName: string) {
    try {
        const response = await localHost.put(`/${gameId}/add_player`, {
            player: playerName
        })
        return response.data.player_id
    } catch (error) {
        console.log('There was an error w/add_player endpt: ' + error)
    }
}

export function updateGamePhase(gameId: string, newPhase: string) {
    try {
        localHost.put(`/${gameId}/phase`, {
            newGamePhase: newPhase
        })
    } catch(error) {
        console.log('There was an error w/updatePhase endpt: ' + error)
    }
}

export function createNewCategory(gameId: string, newCategory: string) {
    localHost.put(`/${gameId}/category`, {
        category: newCategory
    }).then(function (response) {
        console.log(response)
        return response
    }).catch(function (error) {
        console.log('There was an error w/category endpt: ' + error)
    })
}

// @app.put("/<game_id>/bet") endpoint not written.  method to update in firebase service to directly control from front end?


export async function endBetting(gameId: string, playerId: string, highBet: number) {
    try {
        const response = await localHost.put(`/${gameId}/end_betting`, {
            player: playerId,
            bet: highBet
        })
        return response.data
    } catch(error) {
        console.log('There was an error w/end_betting endpt: ' + error)
    }
}

export function addAnswer(gameId: string, newAnswer: string) {
    localHost.put(`/${gameId}/answer`, {
        answer: newAnswer
    }).then(function (response) {
        console.log(response)
        return response
    }).catch(function (error) {
        console.log('There was an error w/answer endpt: ' + error)
    })
}

export async function submitJudgement(gameId: string, answerId: string, updatedStatus: boolean | string, waitingForJudge: boolean) {
    try {
        const response = await localHost.put(`/${gameId}/judge`, {
            answer_id: answerId,
            status: updatedStatus,
            waiting: waitingForJudge
        })
        return response.data
    } catch(error) {
            console.log('There was an error w/judge endpt: ' + error)
        }
}

// no payload.  call fx when timer expires on answering.  will return status 'PENDING' if still waiting on answer judgment
// 'PENDING' returned only if num of pending answers could be enough to win round 
export async function endRound(gameId: string) {
    try {
        const response = await localHost.put(`/${gameId}/end_round`)
            return response.data
        } catch(error) {
            console.log('There was an error w/end_round endpt: ' + error)
        }
}

export async function startNewRound(gameId: string) {
    try {
        const response = await localHost.put(`/${gameId}/new_round`)
        return response.data
    } catch(error) {
        console.log('There was an error w/new_round endpt: ' + error)
    }
}

// put endpt to /<game_id>/dispute not yet written on back end
// export function disputeAnswer()   This method 