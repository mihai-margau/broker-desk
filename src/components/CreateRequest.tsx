"use client";
import Link from "next/link";
import { useGlobal } from "../app/providers";
import { ChangeEvent, SetStateAction, useEffect, useState } from "react";
import Header from "@/app/Header";
import { getWorkflowTypeConfig } from "@/actions/getWorkflowTypeConfig";
import { Field, IContractInfo, RawExportData, ServiceHubResult } from "@/models/models";
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

registerPlugin(FilePondPluginFileValidateType, FilePondPluginImagePreview);
export default  function CreateRequest() {
  const router = useRouter();
  const { cg, setCg, search, brokerdata, companyInfo, RTInstance } = useGlobal();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [safeFields, setsafeFields] = useState<Field[]>([]);
  const [files, setFiles] = useState<any[]>([]);
  const [attachments, setAttachments] = useState<any[]>([]);
  const [fieldValues, setFieldValues] = useState<Record<string, any>>({});
  const [requestDescription, setRequestDescription] = useState<string>('');
  const [selectedType, setSelectedType] = useState("");
  const [selectedTypeId, setSelectedTypeId] = useState<number | null>(null);
  const [categoryValue, setCategoryValue] = useState("");
  const [topicValue, setTopicValue] = useState("");
  const [priorityValue, setPriorityValue] = useState("");
  const [contractNumber, setContractNumber] = useState("");
  const [contractInfo, setContractInfo] = useState<IContractInfo | null>(null);
  const [workflowTypeConfig, setWorkflowTypeConfig] = useState<RawExportData | null>(null);
  const [fieldsServiceHUB, setFieldsServiceHUB] = useState<Array<ServiceHubResult>>([]);
  const [fieldsServiceHubFiltered, setFieldsServiceHubFiltered] = useState<ServiceHubResult[] | null>(null);
  useEffect(() => {
    search();
    let cancelled = false;
    
        (async () => {
          try {
            const data = await getWorkflowTypeConfig(); // ✅ call server action from client
            console.log('data of workflow type : ', data);
            console.log('config of workflow type : ', data.formFields);
            if (!cancelled) setWorkflowTypeConfig(data);
          } catch (e) {
            if (!cancelled) setError((e as Error).message);
          } finally {
            if (!cancelled) setLoading(false);
          }
        })();
    
        return () => { cancelled = true; };
      }, []);
    useEffect(() => {
        if (!RTInstance || !workflowTypeConfig ) return;
        const inputJSON = RTInstance?.Configuration ? JSON.parse(RTInstance.Configuration) : {};
    console.log('input json : ', inputJSON);
    const configFields = inputJSON?.newForm?.fields || [];
    const formFields = workflowTypeConfig?.formFields || [];
    const fieldsFromServiceHUB = fieldsServiceHUB || [];

    
    const fields = configFields.map((field: Field) => {
        // match config fields (labels, readOnly, section, etc.)
        const foundConfig = formFields.find(
          (c: any) => String(c.fieldId) === String(field.fieldId)
        );
        
        const foundServiceHub  = fieldsFromServiceHUB?.find(
            (r: any) => String(r.key) === String(field.fieldname)
          );
        
         return {
          ...field,            
          ...foundConfig,
          fieldValue: foundServiceHub?.value ?? "",
          fieldId: Number(field.fieldId)
        };
    });
    // const fieldsServiceHubFiltered =  fieldsServiceHUB?.filter(field => inputJSON.hasOwnProperty(field.key || ''));
    // console.log('fields from service hub : ', fieldsServiceHUB);
    // console.log('fieldsServiceHubFiltered : ', fieldsServiceHubFiltered);
    // setFieldsServiceHubFiltered(fieldsServiceHubFiltered? fieldsServiceHubFiltered : []);
    // const filteredFields = workflowTypeConfig?.formFields.filter(field => inputJSON.hasOwnProperty(field.fieldLabel || ''));
    // console.log('fields from workflow type config : ', workflowTypeConfig?.formFields);
    const fieldValues: Record<number, any> = {};
    fields.forEach((field :Field) => {
        fieldValues[field.fieldId] = field.fieldValue;
    });
    console.log('filtered fields : ', fields);
    setsafeFields(fields);
    setFieldValues(fieldValues);
    console.log('fieldValues: ', fieldValues);
      }, [RTInstance, workflowTypeConfig]);
  
 
  const fieldTypeToInput = (field: { fieldId: any; fieldType: any; editableNew?: boolean; editableEdit?: boolean; fieldLabel?: string | null; }) => (
     <input
        id={field.fieldId}
        name={field.fieldId}
        type={field.fieldType}
        value={fieldValues[field.fieldId] || ''}
        onChange={e =>
          setFieldValues({
            ...fieldValues,
            [field.fieldId]: e.target.value,
          })
        }
        className="w-full p-2 border border-gray-300 rounded"
      />
  );

  const handleRequestTypeChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    console.log('value of selected request type : ', e.target.value);
    setSelectedType(e.target.value);
    
    const selectedObj = workflowTypeConfig?.allowedRequestTypes.find(
        (x) => x.requestTypeTitle === e.target.value
      );
    setSelectedTypeId(selectedObj ? selectedObj.requestTypeId : null);    
  }

  const handleUpdateFiles = (fileItems: any[]) => {
    setFiles(fileItems);
    const attachs: SetStateAction<any[]> = [];
    fileItems.forEach(item => {
      const file = item.file;
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = reader.result?.toString().split(',')[1]; // get base64 part
        attachs.push({
          binary: base64,
          fileName: file.name
        });
      };
      reader.readAsDataURL(file);
    });
    setAttachments(attachs);
  };
  // Construct attachments array dynamically

  const SaveRequest = async (event: React.FormEvent) => {
    setLoading(true);
    event.preventDefault();
    console.log(fieldValues);
    //TO-DO remove external fields before saving request 
    const formFields = Object.entries(fieldValues).map(([fieldId, fieldValue]) => ({
      fieldId: Number(fieldId),
      fieldValue: String(fieldValue),
    }));
    
    console.log(formFields);
    const payload = {
      requestTypeId: selectedTypeId,
      entryKeyId: 2,
      entryKeyValue: cg,
      reference: "",
      description: requestDescription,
      workflowTypeId: Constants.WORKFLOW_TYPE_ID,
      formFields: formFields,
      attachments: attachments
    };
    try {
      const response = await addRequest(payload);
      setLoading(false);
      console.log('response of add request : ', response);
    } catch (err) {
      setError((err as Error).message);
      console.error('Request failed:', err);
    }
    router.push("/");
  }

  async function validateContractNumber(): Promise<void> {
    let contractInfo: IContractInfo = await ValidateContract(contractNumber);
    console.log('validate contract response : ', contractInfo);
    setContractInfo(contractInfo);

    let fieldsServiceHUB = await searchServiceHubEntryKeyValue("contractNumber", contractNumber);    
    console.log('fields from service hub : ', fieldsServiceHUB);
    setFieldsServiceHUB(fieldsServiceHUB);
    const fields = safeFields.map((field: Field) => {
     
      const foundServiceHub  = fieldsServiceHUB?.find(
          (r: any) => String(r.key) === String(field.fieldname)
        );
      
       return {
        ...field,            
        fieldValue: foundServiceHub?.value ?? "",
      };
    });
    const fieldValues: Record<number, any> = {};
    fields.forEach((field :Field) => {
        fieldValues[field.fieldId] = field.fieldValue;
    });
    console.log('filtered fields : ', fields);
    console.log('fieldValues: ', fieldValues);
    setsafeFields(fields);
    setFieldValues(fieldValues);
  }

  return (
    <div>
      <Header />
      <div className="border-2 border-border border-gray-200 rounded divide-y divide-border bg-white shadow-xl m-10">

        <form onSubmit={SaveRequest} className="h-content leading-tight">
          <h1 className="text-secondary font-bold text-lg col-span-3 p-8 border-bottom border-gray-200">New Request</h1>
          <div className="border-1 border-gray-200 rounded "> </div>
          <div className="flex flex-row gap-4 w-full mb-4">
            <div className="flex-1 mt-2 ml-2">
              <h3 className="font-bold text-lg">Workflow Type</h3>
              <select disabled className="w-full p-2 border border-gray-300 rounded bg-gray-100" onChange={handleRequestTypeChange}>
              <option>
                {workflowTypeConfig ? workflowTypeConfig.title : "Loading..."}
              </option>
              </select>
            </div>
            <div className="flex-1 mt-2 mr-2">
              <h3 className="font-bold text-lg">Request Type</h3>
              <select value={selectedType} className="w-full p-2 border border-gray-300 rounded" onChange={handleRequestTypeChange}>
                <option value='-1'>Select a request type</option>
                
                {workflowTypeConfig? workflowTypeConfig.allowedRequestTypes?.map((item) => {
                    return (
                    <option key={item.requestTypeId} value={item.requestTypeTitle}>
                      {item.requestTypeTitle}
                    </option>
                )}) : <option>Loading...</option>}

              </select>
            </div>

            {selectedType == Constants.BROKERAGE_CLIENT_REQUEST ? <div className="flex-1 mt-2 mr-2">
              <h3 className="font-bold text-lg">Contract Number</h3>
              <input value={contractNumber} className="p-2 border border-gray-300 rounded" onChange={(e) => setContractNumber(e.target.value)} />
              <button
                type="button"
                className="px-4 py-2 rounded"
                onClick={validateContractNumber}
              >
                Validate
              </button>
            </div> : <></>}
          </div>
          {/* {brokerdata && <pre>{JSON.stringify(brokerdata, null, 2)}</pre>}
      {companyInfo && <pre>{JSON.stringify(companyInfo, null, 2)}</pre>}
      {RTInstance && <p>Instance Region: {RTInstance.Region}</p>}   */}
          {selectedType ?<div>
           <div className="gridForm grid-cols-1 xl:gap-x-6 xl:grid-cols-3 pt-6 pb-2 p-2">
             {RTInstance?.Configuration? JSON.parse(RTInstance?.Configuration)?.newForm?.sections.map((section: string) => 
             <div key={section} ><div className="col-span-3 pb-4 text-xl font-bold text-secondary">{section}</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 12}}>
                {safeFields.filter((f: any) => f.section === section).map(field =>
                  field.fieldLabel || field.fieldname ? (
                    <div key={field.fieldId} style={{ marginBottom: 12 }}>
                      <label className="font-bold">
                      {field.fieldLabel ? field.fieldLabel : field.fieldname}:{" "}
                      </label>
                        {fieldTypeToInput(field)}
                    </div>
                  ) : null)}
                  </div></div>) : <></>}     

              </div>
              <div className="mt-12 p-2">

                <h3 className="pt-4 font-bold text-lg col-span-3">REQUEST DESCRIPTION</h3>
                <div className="w-full mb-12 h-48"><ReactQuillNew className="w-full mb-12 h-48"
                  value={requestDescription}
                  onChange={setRequestDescription} />
                  </div>
                <h3 className="pt-4 font-bold text-lg col-span-3">ATTACHMENTS</h3>
                <FilePond
                  files={files}
                  onupdatefiles={handleUpdateFiles}
                  allowMultiple={true}
                  maxFiles={5}
                  name="files"
                  labelIdle='Drag & Drop your files or <span class="filepond--label-action">Browse</span>' />

              </div>
              <div className="flex justify-center">
              {loading ?
                   <ProgressIndicator label="Saving request..." />
                  :<></>}
                </div>
              <div className="flex justify-center">
                <button className="xl:w-auto m-4 flex items-center justify-center px-8 py-2 bg-primary border border-primary rounded text-white font-semibold hover:bg-primaryhover hover:border-primaryhover bg-primaryactive border-primaryactive" onClick={SaveRequest}>Submit Request</button>
                <Link href="/" className="xl:w-auto m-4 flex items-center justify-center px-8 py-2 border border-secondary rounded text-black font-semibold ">Return to dashboard</Link>
              </div>
              </div> :<></>}
        </form>
      </div>
    </div>
  );
}