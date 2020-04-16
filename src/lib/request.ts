import axios from 'axios';
import { ERR } from '../config'

const request =  async (options)=>{
    return new Promise(async (resolve, reject)=>{            
      
        try{
            await axios(options)
            .then((res)=>{
                const { retcode, ret, retCode } = res.data;
                if(retcode==0 || ret==0 || retCode==0){
                    resolve(res.data);
                }else{
                    reject(ERR.CGI);
                }
            })
            .catch((e)=>{
                reject(e);
            });
            
        }catch(e){
            reject(e);
        }
    });
   
};

export default request;