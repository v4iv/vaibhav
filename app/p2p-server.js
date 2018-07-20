/**
 * Created by vaibhav on 27/6/18
 */
const Websocket = require('ws');

const P2P_PORT = process.env.P2P_PORT || 5000;
const peers = process.env.PEERS ? process.env.PEERS.split(',') : [];

class P2PServer {
    constructor(blockchain) {
        this.blockchain = blockchain;
        this.sockets = [];
    }

    listen() {
        const server = new Websocket.Server({port: P2P_PORT});
        server.on('connection', socket => this.connectSocket(socket));

        this.connectToPeers();

        console.log(`Listening To Peer-To-Peer Connections On: ${P2P_PORT}`);
    }

    connectToPeers() {
        peers.forEach(peer => {
            const socket = new Websocket(peer);

            socket.on('open', () => this.connectSocket(socket));
        });
    }

    connectSocket(socket) {
        this.sockets.push(socket);
        console.log('Socket Connected');

        this.messageHandler(socket);

        socket.send(JSON.stringify(this.blockchain.chain));
    }

    messageHandler(socket) {
        socket.on('message', message => {
            const data = JSON.parse(message);
            console.log('Data: ', data);
        });
    }
}

module.exports = P2PServer;