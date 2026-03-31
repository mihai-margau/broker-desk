"use client";
import { getRequestById } from "@/actions/getRequestById";
import { getWorkflowTypeConfig } from "@/actions/getWorkflowTypeConfig";
import Header from "@/app/Header";
import { useGlobal } from "../app/providers";
import { ChangeEvent, JSX, SetStateAction, use, useEffect, useState } from "react";
import { Field, FileContent, IContractInfo, IRequestsListListItem, RawExportData, ServiceHubResult } from "@/models/models";
import dynamic from "next/dynamic";
import 'react-quill-new/dist/quill.snow.css';
const ReactQuillNew = dynamic(() => import("react-quill-new"), { ssr: false });


// Dynamically import to avoid SSR
const FilePond = dynamic(
  async () => {
    const mod = await import('react-filepond');
    return mod.FilePond;
  },
  { ssr: false }
);

// Register plugins only in the browser
import { registerPlugin } from 'filepond';

import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type';
import FilePondPluginImagePreview from 'filepond-plugin-image-preview';
import 'filepond/dist/filepond.min.css';
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css';
import { addRequest } from "@/actions/addRequest";
import { useRouter } from "next/navigation";
import { ValidateContract } from "@/actions/validateContract";
import { getParamValue } from "@/actions/getParamValue";
import { searchServiceHubEntryKeyValue } from "@/actions/searchServiceHubEntryKeyValue";
import { Constants } from "@/app/Constants";
import { set } from "date-fns";
import ProgressIndicator from "./common/ProgressIndicator";
import { getRequestHistory } from "@/actions/getRequestHistory";
import { TimeLine } from "./subComponents/Timeline";
import moment from "moment";
import { getFileContent } from "@/actions/getFileContent";
import { updateRequestById } from "@/actions/updateRequest";
// import { UseIsMobile } from "./common/useIsMobile";
type Props = {
  requestid: string | undefined;
};
export const EditRequest = (Props: Props): JSX.Element => {
  const { cg, setCg, search, brokerdata, companyInfo, RTInstance } = useGlobal();
  const [requestData, setRequestData] = useState<IRequestsListListItem | null>(null);
  const [workflowTypeConfig, setWorkflowTypeConfig] = useState<RawExportData | null>(null);
  // const safeFields = Array.isArray(workflowTypeConfig?.formFields) ? workflowTypeConfig.formFields : [];
  const [safeFields, setsafeFields] = useState<Field[]>([]);
  const [activeTab, setActiveTab] = useState('Request');
  const [attachments, setAttachments] = useState<any[]>([]);
  // When you load fields, initialize fieldValues:
  const initialFieldValues: { [key: string]: string | undefined } = {};
  safeFields.forEach(field => {
    initialFieldValues[field.fieldId] = field.fieldValue;
  });
  const [fieldValues, setFieldValues] = useState(initialFieldValues);
  const [history, setHistory] = useState<any[]>([]);
  const [JSONConfig, setJSONConfig] = useState<any>(null);
  const [fileUrls, setFileUrls] = useState({});
  const [loading, setLoading] = useState<boolean>(false);
  const [brokerExchange, setBrokerExchange] = useState<string>("");
  
  useEffect(() => {
    const fetchData = async () => {
      await search();
      
      let history = await getRequestHistory('wer', Props.requestid ? Props.requestid : '0');
      setHistory(history);
      console.log("history : ", history);
      const data: RawExportData = await getWorkflowTypeConfig();
      setWorkflowTypeConfig(data);
      console.log('workflowTypeConfig : ', data);
      let request: IRequestsListListItem = await getRequestById('wer', Props.requestid);
      setRequestData(request);
      console.log('request : ' , request);
      const urls: Record<number, string> = {};
      
      for (const attachment of request.attachmentsUrls || []) {
        const path = attachment.fileURL.replace(Constants.FILE_URL_SERVER_PATH, '');
        const encodedPath = encodeURIComponent(path);

        const fileResponse = await getFileContent(encodedPath);

        const blob = new Blob([fileResponse.content], {
          type: fileResponse.mimeType
        });

        urls[attachment.fileId] = URL.createObjectURL(blob);
      }
      setFileUrls(urls);
     
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (!RTInstance || !workflowTypeConfig || !requestData) return;
    const inputJSON = RTInstance?.Configuration ? RTInstance.Configuration : '';
    console.log('input json : ', inputJSON);
    setJSONConfig(inputJSON);
    let {fields,fieldValues} = mergeWorkflowWithRequest(workflowTypeConfig, requestData);
    setsafeFields(fields);
    console.log('fieldvalues : ', fieldValues);
    setFieldValues(fieldValues);
  }, [RTInstance, workflowTypeConfig, requestData]);

  const fieldTypeToInput = (field: {
    fieldValue: string; fieldId: any; fieldType: any; editableNew?: boolean; readOnly?: boolean; fieldLabel?: string | null; 
}) => (
    <input
      key={field.fieldId}
      id={field.fieldId}
      name={field.fieldId}
      type="text"
      value={fieldValues[field.fieldId] || ''}
      disabled={field.readOnly}
      onChange={e =>
        setFieldValues({
          ...fieldValues,
          [field.fieldId]: e.target.value,
        })
      }
      className="w-full p-2 border border-gray-300 rounded"
    />
  );
  

  function mergeWorkflowWithRequest(workflowTypeConfig: any, request: any): { fields: Field[], fieldValues: Record<number, any> } {
    const inputJSON = RTInstance?.Configuration ? JSON.parse(RTInstance.Configuration) : {};
    console.log('input json in merge : ', inputJSON);

    const formFields = workflowTypeConfig.formFields || [];
    const requestFields = request.requestInformation || [];
    const normalized = requestFields.map((f: any) => ({
      ...f,
      fieldId: Number(f.fieldId),
    }));
    console.log('normalized : ', normalized);
    const configFields = inputJSON?.editForm?.fields || [];

    const fields = configFields.map((field: Field) => {
       // 1. match request values
      const foundRequest  = normalized.find(
        (r: any) => String(r.fieldId) === String(field.fieldId)
      );
      
      // 2. match config fields (labels, readOnly, section, etc.)
      const foundConfig = formFields.find(
          (c: any) => String(c.fieldId) === String(field.fieldId)
        );
      return {
        ...field,            
        ...foundConfig,                    // override/add config properties
        fieldValue: foundRequest?.fieldValue ?? "",
        fieldType:  "text", // default to text if not specified
        fieldId: Number(field.fieldId)
      };
    });

    const fieldValues: Record<number, any> = {};
    fields.forEach((field :Field) => {
        fieldValues[field.fieldId] = field.fieldValue;
    });

    return { fields, fieldValues };
  }

  const updateRequest = async (event: React.FormEvent) => {
    setLoading(true);
    event.preventDefault();
    console.log('Updating request with field values: ', fieldValues);
    const inputJSON = RTInstance?.Configuration ? JSON.parse(RTInstance.Configuration) : {};
    console.log('input json : ', inputJSON);
    console.log('broker exchange : ', brokerExchange);
    //TO-DO remove external fields before updating request
    const output = Object.entries(fieldValues).map(([key, value]) => ({
      fieldId: Number(key),
      fieldValue: value
    }));
    // "formFields":${JSON.stringify(output)},
    // invalid field name like broker name, cg 
    let bodyrequest = `{
    "actionId": 433,
    "cofaceExchangeText": ${JSON.stringify(brokerExchange)}
    }`;
    console.log('body request : ', bodyrequest);
    const update = await updateRequestById('wer', Props.requestid, bodyrequest);
    console.log('update response : ', update);
    // update timeline
    let history = await getRequestHistory('wer', Props.requestid ? Props.requestid : '0');
    setHistory(history);
    setLoading(false);
  }
  return (
    <div><Header />
      <div className="container mx-auto max-width-full" style={{ maxWidth: "95vw" }}>
        <div className="gridForm grid-cols-12 gap-x-2 w-full relative">
          {/* TimeLine */}
          {history.length > 0 ? <TimeLine items={history}
                                        requestId={Props.requestid ? Number(Props.requestid) : 0}
                                        mobile={true}
                                        year={new Date(history[history.length - 1].Created).getFullYear().toString()}
                                        ticketStatus={requestData?.Status ? requestData.Status : "Unknown"}
                                  /> : <></>}
         
        </div>
        <div className="flex mt-5">
          {/* LEFT SIDE — 2/3*/}
          <div className="basis-full lg:basis-2/3 w-full mb-4 mr-4 ml-1 rounded-xl border-2 border-border border-gray-200 divide-y divide-border bg-white shadow-xl overflow-y-hidden mobile-height">
            {/* Tabs*/}
            <div className="flex h-13  border-b-gray-200">
              <div className="xl:flex h-content leading-tight">
                <button onClick={() => setActiveTab('Request')} className={`flex items-center justify-center px-8 py-2 bg-white hover:bg-neutral-100 font-bold h-12 ${activeTab == "Request" ? "selected-tab text-black" : "text-neutral-500"} "}`}> Request </button>
              </div>
              <div className="xl:flex h-content leading-tight">
                <button onClick={() => setActiveTab('Attachments')} className={`flex items-center justify-center px-8 py-2 bg-white hover:bg-neutral-100 font-bold h-12 ${activeTab == "Attachments" ? "selected-tab text-black" : "text-neutral-500"}`}> Attachments </button>
              </div>
              {JSONConfig ? JSON.parse(JSONConfig)?.editForm?.sections.map((section: string, index: number) => 
               <div key={section ?? index} className="xl:flex h-content leading-tight">
               <button onClick={() => setActiveTab(section)} className={`flex items-center justify-center px-8 py-2 bg-white hover:bg-neutral-100 font-bold h-12 ${activeTab == section ? "selected-tab text-black" : "text-neutral-500"}`}> {section} </button>
             </div>) : null}
            </div>

            {/* Body */}
            <div className="xl:flex leading-tight">
              <form className="w-full p-2">
             
                {activeTab == "Request" ? <div><div className="col-span-3 pb-4 text-xl font-bold text-secondary">General Information ({workflowTypeConfig?.title}_{Props.requestid})</div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
                  {safeFields.filter((f: any) => f.section === Constants.GENERAL_INFORMATION).map(field =>
                  field.fieldType && field.fieldLabel ? (
                    <div key={field.fieldId} style={{ marginBottom: 12 }}>
                      <label>
                        {field.fieldLabel}:{" "}
                        {fieldTypeToInput(field)}
                      </label>
                    </div>
                  ) : null
                )} </div> </div>: null}
                {activeTab == "Attachments" ? <div className="w-full">
                  <div className="col-span-3 pb-4 text-xl font-bold text-secondary">Attachments</div>
                  <div className="border rounded border-border overflow-hidden">
                  <table className="w-full bg-white border-collapse">
                      <thead>
                        <tr className="text-left">
                          <th className="p-4 font-semibold">File name</th>
                          <th className="p-4 font-semibold">File Added By</th>
                          <th className="p-4 font-semibold">Date</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y border-t border-border">
                        {requestData?.attachmentsUrls?.map((attachment) => {
                            const key = attachment.fileId ;
                            const url = fileUrls[key as keyof typeof fileUrls];
                          return <tr key={key} className="h-14 text-sm text-neutral-600">
                            <td>
                              <div className="flex items-center">
                                <div className="text-primary">
                                  <svg xmlns="http://www.w3.org/2000/svg" width="3em" height="3em" viewBox="0 0 20 20">
                                    <path fill="currentColor" d="m5.28 10.609l5.304-5.304a2.75 2.75 0 1 1 3.889 3.89l-6.364 6.364A1.25 1.25 0 1 1 6.34 13.79l5.657-5.657a.75.75 0 0 0-1.06-1.06L5.28 12.73a2.75 2.75 0 0 0 3.89 3.89l6.363-6.365a4.25 4.25 0 0 0-6.01-6.01L4.22 9.548a.75.75 0 0 0 1.06 1.06"></path>
                                  </svg>
                                </div>
                                <div>
                                  <a href={url} className="text-black font-bold" target='_blank' data-interception="off">{attachment.fileName.split('.').slice(0, -1).join('.')}</a>
                                  <div className="text-xs text-neutral-500">{'.' + attachment.fileName.split('.').pop()}</div>
                                </div>
                              </div>
                            </td>
                            <td>{attachment.createdBy?.createdByUserName}</td>
                            <td>{moment(attachment.date).local().seconds(0).milliseconds(0).format("DD/MM/YYYY, hh:mm A")}</td>
                          </tr>
                        })}
                 </tbody>
                 </table>
                 </div>
                 </div>
                  : null}
                  {JSONConfig ? JSON.parse(JSONConfig)?.editForm?.sections.map((section: string) =>
                    activeTab == section ? <div key={section}><div className="col-span-3 pb-4 text-xl font-bold text-secondary">{section}</div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
                      {safeFields.filter((f: any) => f.section === section).map((field: any) =>
                        field.fieldname ? (
                          <div key={field.fieldId} style={{ marginBottom: 12 }}>
                            <label>
                              {field.fieldLabel ? field.fieldLabel : field.fieldname}:{" "}
                              {fieldTypeToInput(field)}
                            </label>
                          </div>
                        ) : null
                      )}
                    </div></div>: null): null}
              </form>
            </div>
          </div>
          {/* RIGHT SIDE — 1/3*/}
          <div className="basis-full lg:basis-1/3 w-full mb-4 mr-4 ml-1 rounded-xl border-2 border-border border-gray-200 divide-y divide-border bg-white shadow-xl overflow-y-hidden  mobile-height">
            <div className="h-content  border-b-gray-200">
              <div className="flex justify-between w-full">
                <div className="font-bold h-12 px-8 py-2 flex items-center">
                  Broker Exchanges
                </div>
                <button
                  type="submit"
                  className="xl:w-auto flex items-center justify-center px-8 py-2 bg-secondary border border-secondary rounded text-white font-semibold hover:bg-secondaryhover hover:border-secondaryhover bg-secondaryactive border-secondaryactive"
                  onClick={updateRequest}
                >
                  Update request
                </button>
              </div>
              <div className="text-center"></div>
            </div>
            <div className="p-4 grow overflow-y-auto scrollbar-thin">
              <div>{loading ?
                   <ProgressIndicator label="Updating request..." />
                  :<></>}
                </div>

              <div>
                <div className="col-md-4">
                  <div className="font-bold text-sm">Actions</div>
                  <select
                    className="w-full"
                  >
                    <option>Fill Ticket</option>
                  </select>
                </div>

                <div className="mb-4">
                  <label className="block font-bold mb-2">Description</label>
                  <ReactQuillNew className="w-full border border-gray-300 rounded px-3 py-2 min-h-24 max-h-96"
                                 value={brokerExchange}
                                 onChange={setBrokerExchange} />
                </div>

                <div className="mb-4">
                  <label className="block font-bold mb-2">Attachments</label>
                  <FilePond
                    files={attachments}
                    onupdatefiles={setAttachments}
                    allowMultiple={true}
                    maxFiles={5}
                    name="files"
                    labelIdle='Drag & Drop your files or <span class="filepond--label-action">Browse</span>'
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}