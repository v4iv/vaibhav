/**
 * Created by vaibhav on 26/6/18
 */
const BlockChain = require('./index');
const Block = require('./block');

describe("BlockChain", () => {
    let bc, bc2;

    beforeEach(() => {
        bc = new BlockChain();
        bc2 = new BlockChain();
    });

    it('Starts with genesis block', () => {
        expect(bc.chain[0]).toEqual(Block.genesis());
    });

    it('Adds a new block', () => {
        const data = 'foo';
        bc.addBlock(data);
        expect(bc.chain[bc.chain.length - 1].data).toEqual(data);
    });

    it('Validates a valid chain', () => {
        bc2.addBlock('foo');
        expect(bc.isValidChain(bc2.chain)).toBe(true);
    });

    it('Invalidates a chain with corrupt genesis block', () => {
        bc2.chain[0].data = "Bad Data";
        expect(bc.isValidChain(bc2.chain)).toBe(false);
    });

    it('Invalidates a corrupt chain', () => {
        bc2.addBlock('foo');
        bc2.chain[1].data = 'not foo';
        expect(bc.isValidChain(bc2.chain)).toBe(false);
    });

    it('Replaces the chain with a valid chain', () => {
        bc2.addBlock('goo');
        bc.replaceChain(bc2.chain);

        expect(bc.chain).toEqual(bc2.chain);
    });

    it("Does not replaces chain with one that is less than or equal to length", () => {
        bc.addBlock('foo');
        bc.replaceChain(bc2.chain);

        expect(bc.chain).not.toEqual(bc2.chain);
    });
});