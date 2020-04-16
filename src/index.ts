import { getQueryString } from './lib/utils';
import { check } from './lib/dom';
import request from './lib/request';
import * as hacker from './hackers/react';
import { FR_MAP, MODE_KEY, MODE_CONFIG, MODE_REPORT, CGI } from './config';
import { NODATA } from 'dns';

interface OPT{
    dependencies? : string[], // 业务用到的依赖
    pid : number; // noya project id
    id : number; // noya page id
    lifeReport : boolean;
}

class Nuoya {
    dependencies? : string[];
    pid : number;
    id : number;
    lifeReport : boolean;
    constructor(opt:OPT){
        this.dependencies = opt.dependencies; 
        this.pid = opt.pid;
        this.id = opt.id;
        this.lifeReport = opt.lifeReport;
        this.init();
    }
    init(){  
        this.setDefault();
        this.getNoyaConfig(); 
        this.injectNoyaLogic();
    }
    setDefault(){
        window.NOYA_DATA = {
            dependencies : this.dependencies || [],
            mode : (self != top && getQueryString(MODE_KEY) == MODE_CONFIG ) ? MODE_CONFIG : MODE_REPORT,
            eventReport : true,
            lifeReport : this.lifeReport || false,
            page_info : {
                ele_info : [],
                id : this.id,
                pid : this.pid,
                url : ''
           } 
        };
    }
    async getNoyaConfig(){
        if(!this.id){
            console.error(`缺少业务id，请到noya.oa.com申请`);
            return ;
        }
        try{
            const res = await request({
                method : 'get',
                url : CGI.GET_CONFIG,
                params : {
                    id : this.id,
                    pid : this.pid
                }
            }) as RES;
            res&&res.ret==0 
                ? Object.assign(window.NOYA_DATA.page_info, res.data) 
                : Object.assign(window.NOYA_DATA.page_info, {});
        }catch(e){
            console.error(e);
        }
    }
    injectNoyaLogic(){
        if(this.dependencies.includes(FR_MAP['React'])){
            hacker.inject();
        }   
    }
}

export default Nuoya;

