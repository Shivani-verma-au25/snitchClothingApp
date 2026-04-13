import {app} from './src/app.js'
import { config } from "./src/configrations/config.js";
import { connectToDataBase } from './src/db/database.js';

connectToDataBase().then(() =>(
    app.listen(config.PORT , () =>{
    console.log(`Server is running on port ${config.PORT}`);
    })
)).catch((error) =>{
    console.log("failed to connect db",error);
})




