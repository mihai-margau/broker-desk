import { ManageViews } from "@/actions/manageViews";
import { CofaceReactDataTableColumnTypes, TableView, filterFunctionMap } from "../../components/subComponents/CofaceReactDataTable/types";
// import { useEffect } from "react";
import { useGlobal } from "@/app/providers";
import { GetDashboardColumns } from "@/actions/getDashboardColumns";
import { writeInLog } from "@/actions/writeInLog";
import { IViewsColumnsListItem, IViewsFiltersListItem } from "@/models/models";
import { Constants } from "@/app/Constants";
import { getParamValue } from "@/actions/getParamValue";

export function API() {
    const { cg, setCg, search, brokerdata, companyInfo, RTInstance} = useGlobal();
    // useEffect(() => {
    //     search();
    // }, []);

    const SaveView = async (view: TableView): Promise<void> => {
        if (cg) {
            const views: TableView[] = await ManageViews("Add", cg, view.Configuration, view.Title, view.Keywords || "", view.IsDefault.toString()) as unknown as TableView[];
            console.log("views after saving : ", views);
        }
        else {
            writeInLog("Error", "CG number is not defined. Cannot save view.");
        }
    };

    const GetViews = async () => {
        if (cg) {
            const showAllDataView: TableView = { Title: "Show All Data", Configuration: "", IsDefault: false, Id: 0, BrokerCG: cg, globalFiltersConfig: "" };
            let views: TableView[] = [];
            views.push(showAllDataView);
            const currentcgviews: TableView[] = await ManageViews("Get", cg,"", "", "", "") as unknown as TableView[];
            views.push(...currentcgviews);
            return views;
        }
        else {
            writeInLog("Error", "CG number is not defined. Cannot get view.");
            return [];
        }
    };

    const DeleteView = async (Id:number): Promise<void> => {
        if (cg) {
            await ManageViews("Delete", cg,"", Id.toString(), "", "") as unknown as TableView[];
        }
        else {
            writeInLog("Error", "CG number is not defined. Cannot delete view.");
        }
    };


    const GetCategories = () => {
        // Implementation of GetCategories
    };

    const GetTopics = () => {
        // Implementation of GetTopics
    };

    const GetUsefulLinks = () => {
        // Implementation of GetUsefulLinks
    };

    const getWorkflowFormURL = () => {
        // Implementation of getWorkflowFormURL
    };

    const GetViewsFiltersItems = () => {
        //#region  add global filters
        let itemTicketID: IViewsFiltersListItem = {
              Field: { Id: 1, Title: "Id" },
              FilterLabel: "Ticket ID",
              Id: 1,
              FilterOrder: "1",
              FilterType: { Id: 1, Title: "Text" },
              Title: "",
              Views: [],
              Visible: true,
              Activated: false,
              BuiltInField: "Default",
              FieldReferenceId: null,
              FilterContent: [],
              FilterSelectedValue: "",
              FilterSelectedValues: [],
              LogicalOperator: "eq",
            };
        let itemStatus: IViewsFiltersListItem = {
              Field: { Id: 2, Title: "Status" },
              FilterLabel: "Status",
              Id: 2,
              FilterOrder: "2",
              FilterType: { Id: 5, Title: "Dropdown" },
              Title: "",
              Views: [],
              Visible: true,
              Activated: false,
              BuiltInField: "Default",
              FieldReferenceId: null,
              FilterContent: [
                { Id: 1, Title: "Ongoing" },
                { Id: 2, Title: "Canceled" },
                { Id: 3, Title: "Closed" },
                { Id: 4, Title: "Blocked" },
                { Id: 5, Title: "Waiting for client reply" },
              ],
              FilterSelectedValue: "",
              FilterSelectedValues: [],
              LogicalOperator: "eq",
            };
        

          let  finalItem = [
              itemTicketID,
              itemStatus             
            ];
            console.log("ViewsFlter : >>>>>", finalItem);

            return finalItem;
          
    };

    const GetViewsColumnsItems = async (): Promise<IViewsColumnsListItem[]> => {
        // Implementation of GetViewsColumnsItems
        const columns = await GetDashboardColumns()  as unknown as IViewsColumnsListItem[];
        // console.log("columns from power automate : ", columns);
        return columns;
    };

    const GetRequestsListItems = async () => {
        // Implementation of GetRequestsListItems
        // const requests = (await GetRequests(RTInstance.Region)) as any[];
        // const flow = JSON.parse(enveloppe.flowResponse);
        // console.log('requests : ', requests);
    };

    // const GetRequestHistoryListItems = async (RequestId: string) => {
    //     const FLOW_URL = await getParamValue(Constants.POWER_AUTOMATE_GET_HISTORY_URL);
    //     console.log('flow url get history : ' , FLOW_URL);
    //     if (!FLOW_URL) {
    //       return new Response(JSON.stringify({ error: "FLOW_URL not configured" }), { status: 500 });
    //     }
    
    //     // Call the Power Automate Flow
    //     // console.log(body);
    //     const paResponse = await fetch(FLOW_URL, {
    //       method: "POST",
    //       headers: {
    //         "Content-Type": "application/json"
    //       },
    //       body: JSON.stringify({
    //         RequestId: RequestId ? RequestId.toString() : ''})
    //     });
    //     console.log('response of get history url : ', paResponse);
        
    // }
    const GetViewsColumnsTransformedItems = () => {
        // Implementation of GetViewsColumnsTransformedItems
    };


    return {
        SaveView,
        GetViews,
        DeleteView,
        GetCategories,
        GetTopics,
        GetUsefulLinks,
        getWorkflowFormURL,
        GetViewsFiltersItems,
        GetViewsColumnsItems,
        GetRequestsListItems,
        // GetRequestHistoryListItems,
        GetViewsColumnsTransformedItems,
      };
}