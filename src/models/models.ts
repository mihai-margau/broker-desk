export interface IBrokerData {
    companyId: string;
    subscriberName: string;
    subscriberFirstName: string;
    subscriberEmail: { communicationValue: string };
  }
export interface IBrokerCompany {
    CnyBaseDataBDT: {
        businessName: string;
        legalId:{identifierValue: string};
        crsValue: string;
        postalCode: string;
        cityName: {_:string;LanguageCode: string};
        isoCountryCode: string;
    }
  }
  export interface IContractInfo {
    ContractIdentifiersBDT: {
      xmlns: string;
      ctrctId: string;
      ctrctNum: string;
      subCtrctNum: string;
      creatingSystem: string;
      portfolioNum: string;
      subCtrctSupport: boolean;
      ctrctType: string;
      policyHolderEstablishmentId: string;
    }
  }
  export interface IBrokerMappingListItem {
    id: number;
    title: string;
    Region: string;
    RTInstanceName: string;
    RTInstaceURL: string;
    RTApiUrl: string;
    Configuration: string;
  };
  export interface IBrokerParamValue {
    Title :string;
    Value:string;
  }
 export interface IViewsFiltersListItem {
    Id: number;
    Title: string;
    Views: LookupItem[];
    Field: LookupItem;
    Visible: boolean;
    FilterOrder: string;
    FilterLabel: string;
    FilterContent: LookupItem[];
    LogicalOperator: string;
    BuiltInField: string;
    FilterType: LookupItem;
    FilterSelectedValue: string;
    FilterSelectedValues: LookupItem[];
    FieldReferenceId: number | null;
    Activated: boolean;
  }
  type LookupItem = {
    Id: string | number;
    Title: string;
  };
  export interface IViewsColumnsListItem {
    Id: number;
    Title: string;
    TypeColumn: string;
    BuiltInField: string;
    Visible: boolean;
    ColumnOrder: string;
  }
  export interface IRequestsListListItem {
    Id: number;
    Title: string;
    BrokerCG: string;
    BrokerName: string;
    BrokerCompany: string;
    BrokerEmail: string;
    Status: string;
    Created: Date | undefined;
    Author: string;
    WorkflowType: LookupItem;
    Category: LookupItem;
    Topic: LookupItem;
    RequestType: string;
    ContractNumber: string;
    ClientCG: string;
    ClientCompany: string;
    ClientEmail: string;
    ClientName: string;
    ClientPhone: string;
    BrokerEasyNumber: string;
    CurrentAction: LookupItem;
    Approvers: LookupItem;
    PreviousApprovers: LookupItem;
    TakenBy: string;
    AssignedToGroup: LookupItem;
    GeneralInformation: string;
    RequestDescription: string;
    Step: LookupItem;
    attachmentsUrls: AttachmentUrl[];
  }
  
export interface AttachmentUrl {
  fileId: number;
  fileURL: string;
  fileName: string;
  createdBy:{
    createdByEmail: string;
    createdByUserId: number;
    createdByUserName: string;
  } ;
  /** ISO 8601 string e.g. "2026-02-26T13:31:31Z" */
  date: string; // keep as string, or use Date if you parse it
}

  export type RawExportData = {
    title: string;
    allowedRequestTypes: Array<{
            requestTypeId: number;
            requestTypeTitle: string;
            allowedEntryKeys: Array<{
                entryKeyId: number;
                entryKeyTitle: string;
            }>
    }>;
    formFields: Array<Field>;
      };
      // {
      //   fieldId: number;
      //   fieldType:  | "Text"
      //   | "Textarea"
      //   | "Number"
      //   | "HyperLink"
      //   | "Dropdown"
      //   | "DateTime"
      //   | "Checkbox"
      //   | "External";
      //   editableNew: boolean;
      //   editableEdit: boolean;
      //   fieldLabel: string | null;
      //   } 
  // export type Option = { label: string; value: string };
  // export type UiField = {
  //   id: number;                 // SharePoint Field.Id
  //   key: string;                // stable name to use in form state
  //   label: string;
  //   type:
  //     | "text"
  //     | "textarea"
  //     | "number"
  //     | "url"
  //     | "select"
  //     | "date"
  //     | "checkbox"
  //     | "external";             // read-only placeholder
  //   required: boolean;
  //   editable: boolean;
  //   section: string;
  //   options?: Option[];         // for select
  // };
  
  // const typeMap: Record<string, UiField["type"]> = {
  //   Text: "text",
  //   Textarea: "textarea",
  //   Number: "number",
  //   HyperLink: "url",
  //   Dropdown: "select",
  //   DateTime: "date",
  //   Checkbox: "checkbox",
  //   External: "external",
  // };

  export type Field = {
    fieldId: number;
    fieldType: string | null;
    editableNew: boolean;
    editableEdit: boolean;
    fieldLabel: string | null;
    fieldValue: string;
    fieldname: string;
  };
  export type ServiceHubResult = {
    key: string;
    value: string;
  };
  export interface RequestsHistoryListBuildInItem {
    Id?: number;
    Title?: string;
    Request?: number;
    Action?: string;
    BusinessGroup?: string;
    Step?: number;
    StepTitle?: string;
    ActionBy?: string;
    Status?: string;
    Created?: string | Date;
  }
  export interface FileContent {
    mimeType: string;
    content: ArrayBuffer;
  }