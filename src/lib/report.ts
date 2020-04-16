import { diff } from './dom';
import { CGI } from '../config';
import request from './request';
/**
 * report event
 * 信息收集起来，周期内发送
 * navigator.sendBeacon method post
 */
export const reportEvent = async (event)=>{
   
    if(diff(event)&&window.NOYA_DATA.eventReport){
        try{
            const res = await request({
                method : 'post',
                url : window.NOYA_DATA.page_info.reportUrl || CGI.REPORT,
                data : event
            });
        }catch(e){
            console.error(e);
        }
    }
}

export const reportLifecycle = (component)=>{
    console.log(component);
}