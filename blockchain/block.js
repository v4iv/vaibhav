/**
 * Created by vaibhav on 26/6/18
 */
const SHA256 = require('crypto-js/sha256');

class Block {
    constructor(timestamp, lastHash, hash, data) {
        this.timestamp = timestamp;
        this.lastHash = lastHash;
        this.hash = hash;
        this.data = data;
    }

    toString() {
        return `
            Block:
            Timestamp: ${this.timestamp},
            Last Hash: ${this.lastHash.substring(0, 10)},
            Hash: ${this.hash.substring(0, 10)},
            Data: ${this.data}
        `;
    }

    static genesis() {
        return new this('1530011263099', '----------', '4bbb344e9b99cb5df0bb7d85b7f82cd80477a532336e0ec0a6d924e5424f6d2b', []);
    }

    static mineBlock(lastBlock, data) {
        const timestamp = Date.now();
        const lastHash = lastBlock.hash;
        const hash = Block.hash(timestamp, lastHash, data);

        return new this(timestamp, lastHash, hash, data);
    }

    static hash(timestamp, lastHash, data) {
        return SHA256(`${timestamp}${lastHash}${data}`).toString();
    }

    static blockHash(block) {
        const {timestamp, lastHash, data} = block;
        return Block.hash(timestamp, lastHash, data);
    }
}

module.exports = Block;