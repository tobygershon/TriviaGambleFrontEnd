import axios from "axios";

const localHost = axios.create({
    baseURL: 'http://127.0.0.1:5000'
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

export function createNewGame(playerName: string) {
    localHost.post('/new_game', {
        player: playerName
    }).then(function (response) {
        console.log(response)
        return response
    }).catch(function (error) {
        console.log('There was an error w/new_game endpt: ' + error)
    })
}

export async function addNewPlayer(gameId: string, playerName: string) {
    try {
    const response = await localHost.put(`/${gameId}/add_player`, {
        player: playerName
    })
        return response.data.player_id
    } catch(error) {
        console.log('There was an error w/add_player endpt: ' + error)
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


export function endBetting(gameId: string, playerName: string, highBet: number) {
    localHost.put(`/${gameId}/end_betting`, {
        player: playerName,
        bet: highBet
    }).then(function (response) {
        console.log(response)
        return response
    }).catch(function (error) {
        console.log('There was an error w/end_betting endpt: ' + error)
    })
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

export function submitJudgement(gameId: string, answerId: string, updatedStatus: boolean) {
    localHost.put(`/${gameId}/judge`, {
        answer_id: answerId,
        status: updatedStatus
    }).then(function (response) {
        console.log(response)
        return response
    }).catch(function (error) {
        console.log('There was an error w/judge endpt: ' + error)
    })
}

// no payload.  call fx when timer expires on answering.  will return status 'PENDING' if still waiting on answer judgment
// 'PENDING' returned only if num of pending answers could be enough to win round 
export function endRound(gameId: string) {
    localHost.put(`/${gameId}/end_round`)
        .then(function (response) {
            console.log(response)
            return response
        }).catch(function (error) {
            console.log('There was an error w/judge endpt: ' + error)
        })
}

// put endpt to /<game_id>/dispute not yet written on back end
// export function disputeAnswer()   This method 