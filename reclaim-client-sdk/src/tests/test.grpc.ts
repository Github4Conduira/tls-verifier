import {makeGrpcClient} from '../api-client'
import {ethers} from 'ethers';
import { describe } from 'node:test';

describe('client', () => {

    it('should create a client', async () => {
    const wallet = ethers.Wallet.createRandom();
    const client = await makeGrpcClient(wallet.privateKey);

    expect(client).toBeDefined();

    const res = await client?.updateUser({firebaseToken: "testtoken"})
    console.log(res)

    })
})