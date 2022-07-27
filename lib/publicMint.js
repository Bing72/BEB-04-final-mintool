import Caver from "caver-js";
import dotenv from 'dotenv';
import abi from '../contract/abi.js';


//import mkIPFS from './ipfs.js'
dotenv.config({ path: '../.env' });



const publicMint = async (account, contractAddr, amount=1) => {


    try {
         //const caver = new Caver(new Caver.providers.HttpProvider('https://public-node-api.klaytnapi.com/v1/baobab'))

         account = await window.klaytn.enable();
        let mintPrice = 0;

        const contract = new caver.klay.Contract(abi, contractAddr);

        await contract.methods.mintingInformation().call()
            .then(function (result) {
                // console.log(result);
                mintPrice = result[6];
            })

        const gasAmount = await contract.methods.publicMint(amount).estimateGas({
            from: account,
            gas: 6000000,
            value: mintPrice
        })

        const result = await contract.methods.publicMint(amount).send({
            from: account,
            gas: gasAmount,
            value: mintPrice
        })

        // console.log('Minting Done.')
    } catch (err) {
        // console.log(err)
    }

};

export default publicMint;