import pinataSDK from "@pinata/sdk";
import dotenv from 'dotenv'
import fs from 'fs'
dotenv.config({ path: '../.env' });

const mkIPFS = async (projectname) => {

    const api = process.env.PINATA_API_KEY;
    const secret = process.env.PINATA_SECRET_KEY;
    const pinata = pinataSDK(api, secret);
    const path = './pages/api/fs/' + projectname;

    const file_list =  fs.readdirSync(path + '/img'); //img폴더 파일 개수 불러오기


        let imgIPFS = await pinata.pinFromFS(path + '/img', {
            pinataMetadata: {
                name: projectname + '_img',
            }
        });

        let tokenId = 0;
        for (let i of file_list) {

            const dataBuffer = fs.readFileSync(path + '/meta/' + tokenId)
            const dataJSON = dataBuffer.toString()
            const obj = JSON.parse(dataJSON)
            obj.image = 'ipfs://' + imgIPFS.IpfsHash + '/' + tokenId //object image update
            const json = JSON.stringify(obj)
            fs.writeFileSync(path + '/meta/' + tokenId+'.json', json)

            tokenId = tokenId + 1;
        }

    let result = await pinata.pinFromFS(path + '/meta', {
        pinataMetadata: {
            name: projectname + '_meta',
        }
    });
    return result.IpfsHash


}


export default mkIPFS;