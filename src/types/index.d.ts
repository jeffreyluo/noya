interface NUOYA_PROPS{
    [props:string] : string;
}
interface ELE_INFO {
    event_type: string;
    element_tag: string;
    element_path: string;
    element_desc: string;
    element_attr: object;
    comnponent_name: string;
    ext: object;
}

interface PAGE_INFO {
    ele_info : ELE_INFO[];
    id: number;
    pid: number;
    url: string;
    reportUrl? : string;
}

interface NOYA_DATA {
    page_info : PAGE_INFO;
    mode : string;
    eventReport : boolean;
    lifeReport : boolean;
    dependencies : string[];
}

interface Window { 
    NOYA_DATA : NOYA_DATA;
} 

interface NOYA_EVENT{
    pid : number; // noya分配的项目id
    id : number; // noya分配的id
    ele_path : string; // 唯一ID
    ele_tag : string; // 标签类型
    type : string; // 事件类型
    ext1? : any // 扩展
}

interface RES{
    ret: number;
    data: any;
}