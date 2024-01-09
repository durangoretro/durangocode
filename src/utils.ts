/**
 * Command Data Utility Class
 */
export class CommandData{

    /**
     * Data to be stored
     */
    private data:any;

    /**
     * Class Constructor
     * @param data data for copy
     */
    public constructor(data:any=[]){
        this.data=data;
    }

    /**
     * Get current data using a key
     * @param key Key to be retrieved
     * @param defaultData Default data in case there is no key (undefined by default).
     * @returns the content data or the default data otherwise
     */
    public getData(key:string,defaultData:any=undefined){
        let content = this.data[key];

        return content?content:defaultData;
    }
};