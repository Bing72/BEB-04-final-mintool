import Caver from "caver-js";
import dotenv from 'dotenv'
import abi from '../contract/abi.js';
import transferOwnership from './transferOwnership.js';

//import mkIPFS from './ipfs.js'
dotenv.config({ path: '../.env' });

const setPublicMint = async (URI,contractAddr, blockNum, price, ownerAddress, totaltokenNum=101, startTokenidx=0) => {

    const key = process.env.WALLET_SECRET_KEY;

    try {
        const caver = new Caver(new Caver.providers.HttpProvider('https://public-node-api.klaytnapi.com/v1/baobab'))

        const account = caver.klay.accounts.wallet.add(key)
        
        const contract = new caver.klay.Contract(abi, contractAddr);

        // await contract.methods.setBaseURI(URI).send({
        //     from: account.address,
        //     gas: '10000000',
        //     value: '0',
        // }) //baseURI 설정 

        await contract.methods.setupSale(5,1,3,blockNum,startTokenidx,totaltokenNum-1,((price*1000000000000000000).toString())).send({
            from: account.address,
            gas: '10000000',
            value: '0',
        })
        // .then(console.log)

        await contract.methods.setPublicMintEnabled(true).send({
            from: account.address,
            gas: '10000000',
            value: '0',
        })

        await contract.methods.reveal(true).send({
            from: account.address,
            gas: '10000000',
            value: '0',
        })

        await transferOwnership(ownerAddress, contractAddr);

        console.log('Done.')
        return true;
    } catch (err) {
        console.log(err);
        return false;
    }

};

export default setPublicMint;