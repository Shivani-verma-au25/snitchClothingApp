import Imagekit from '@imagekit/nodejs'
import { config } from '../configrations/config.js'

const client = new Imagekit({
    privateKey : config.IMAGE_KIT_PRIVATE_KEY
})


export async function uploadFile({buffer , fileName , folder = 'snitch'}){
    try {
        const result = await client.files.upload({
            file : await Imagekit.toFile(buffer),
            fileName,
            folder
        });
        console.log("Image file" ,result);
        return {
            url: result.url
        };
    } catch (error) {
        console.log("error from file upload " ,error);   
    }
}