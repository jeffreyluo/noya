 
import { select } from 'optimal-select';
 /**
  * diff xpath
  * @param event 
  */
export const diff = (event:NOYA_EVENT)=>{
    const { ele_info }  = window.NOYA_DATA.page_info;
    const { ele_path }= event;
    const ele_paths = ele_info&&ele_info.map(_=>_.element_path) || [];
    console.info(`diff ${ele_path} with ${JSON.stringify(ele_paths)}`);
    return ele_paths.includes(ele_path); 
}

/**
 * 判断配置元素是否存在
 */
export const check = (config)=>{
    return true;
}

/**
 * 获取css选择器路径
 */
export const getPath = (event) =>{
    return select(event.target)
}