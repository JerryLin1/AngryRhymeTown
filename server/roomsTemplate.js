// Only intended for use as a reference
var rooms = {
    roomId: {
        clients: {
            clientId: {
                name: "exampleName",
                points: 0
            }
        },
        settings: {
            numberOfRounds: 1,
            pairingTime: 5000,
            writingTime: 5000,
            votingTime: 5000,
            votingResultsTime: 5000,
            roundResultsTime: 5000
        },
        rounds: [
            {
                "socketId": {
                    bars: ["asd", "asd", "asd", "asd"],
                    opponent: "opponentSocketId",
                    presented: false
                }
            }
        ]
    }
}