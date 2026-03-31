
export class Constants {

    // flows and service Hub Urls
    static readonly POWER_AUTOMATE_BROKER_URL = "POWER_AUTOMATE_BROKER_URL";
    static readonly POWER_AUTOMATE_COMPANY_URL = "POWER_AUTOMATE_COMPANY_URL";
    static readonly POWER_AUTOMATE_GETCOLUMNS_URL = "POWER_AUTOMATE_GETCOLUMNS_URL";
    static readonly POWER_AUTOMATE_GETINSTANCE_URL = "POWER_AUTOMATE_GETINSTANCE_URL";
    static readonly POWER_AUTOMATE_PARAMVALUE_URL =  process.env.POWER_AUTOMATE_PARAMVALUE_URL|| "https://4a3af1a6c009eb8f8daa28089ec959.54.environment.api.powerplatform.com:443/powerautomate/automations/direct/workflows/15dc5ff3050441f7b18724df2475aa7b/triggers/manual/paths/invoke?api-version=1&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=OWNYZRjxZDegORmHal5u83i7kfpVUT6T18331ELfEv4";
    static readonly POWER_AUTOMATE_LOG_URL = "POWER_AUTOMATE_LOG_URL";
    static readonly POWER_AUTOMATE_MANAGE_VIEWS_URL = "POWER_AUTOMATE_MANAGE_VIEWS_URL";
    static readonly SERVICE_HUB_SEARCH_URL = "SERVICE_HUB_SEARCH_URL";
    static readonly POWER_AUTOMATE_CONTRACT_URL = "POWER_AUTOMATE_CONTRACT_URL";
    static readonly POWER_AUTOMATE_VALIDATE_TOKEN_URL = "POWER_AUTOMATE_VALIDATE_TOKEN_URL";
    static readonly POWER_AUTOMATE_GET_HISTORY_URL = "POWER_AUTOMATE_GET_HISTORY_URL";
    static readonly POWER_AUTOMATE_GET_FILE_CONTENT_URL = "POWER_AUTOMATE_GET_FILE_CONTENT_URL";
    
    // workflow type Id
    static readonly WORKFLOW_TYPE_ID = 228;

    // constants for request types 
    static readonly BROKERAGE_CLIENT_REQUEST = 'Brokerage Client Request';
    static readonly BROKERAGE_REQUEST = 'Brokerage Request';

    // filter showed columns 
    static readonly GENERAL_INFORMATION = 'General Information';
    static readonly FILE_URL_SERVER_PATH = 'https://cofacecorpprod.sharepoint.com/sites/SHPIAT/RequestTool/sites/SHPIAT/RequestTool';

}  