"use client";
import * as React from "react";
import { dataGridSource } from "./datasources/dataGridSource";
import { CofaceReactDataTableWrapper } from "../CofaceReactDataTable/CofaceReactDataTableWrapper";
import {
  CofaceDataTableOptions,
  CofaceReactDataTableColumnTypes,
  TableView,
  filterFunctionMap,
} from "../CofaceReactDataTable/types";
import { CofaceReactDataTable } from "../CofaceReactDataTable/CofaceReactDataTable";
import { ColumnDef, Row } from "@tanstack/react-table";
import { JSX } from "react";
import { API } from "@/services/sharepoint/api";
import { GetRequests } from "@/actions/getRequests";
import { IViewsColumnsListItem } from "@/models/models";

type Props = {
  Instance: string | undefined;
};

const TableSkeletonLoader = () => (
  <div className="flex flex-col items-center justify-center h-full">
    <div className="animate-pulse w-full max-w-4xl">
      <div className="h-10 bg-gray-200 rounded mb-4"></div>
      <div className="h-10 bg-gray-200 rounded mb-4"></div>
      <div className="h-10 bg-gray-200 rounded mb-4"></div>
      <div className="h-10 bg-gray-200 rounded mb-4"></div>
      <div className="h-10 bg-gray-200 rounded mb-4"></div>
    </div>
    <div className="text-center text-gray-500 mt-4">
      Generating table, please wait...
    </div>
  </div>
);

const Dashboard = (props: Props): JSX.Element => {
  const [views, setViews] = React.useState<TableView[]>([]);
  const [columns, setColumns] = React.useState<ColumnDef<unknown>[]>([]);
  const [viewsColumns, setViewsColumns] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [ViewsFilter, setViewsFilter] = React.useState<any[]>([]);
  const [data, setData] = React.useState<any[]>([]);
  const [globalView, setGlobalView] = React.useState("1");
  const [requestFormUrl, setRequestFormUrl] = React.useState("");

  // const [options, setOptions] = React.useState({});

  const {
    SaveView,
    GetViews,
    DeleteView,
    GetViewsFiltersItems,
    GetViewsColumnsItems,
    getWorkflowFormURL,
    GetRequestsListItems,
  } = API();

  React.useEffect(() => {
    const getData = async () => {
      let transformedColumns: any[] = [];
      let columns =
        (await GetViewsColumnsItems()) as unknown as IViewsColumnsListItem[];
      columns.forEach((col: any) => {
        if (col.Title === "Ticket ID") {
          transformedColumns.push({
            header: "Ticket ID",
            accessorKey: "requestId",
            id: "requestId",
            filterFn: filterFunctionMap["NumberMultiFilter"],
            enableColumnFilter: true,
            enableSorting: true,
            meta: {
              columnType: CofaceReactDataTableColumnTypes.Number,
            },
            cell: ({ row }: { row: any }) => {
              const url = "/request/edit/";
              const id = row.getValue("requestId") || "";
              const title = row.getValue("requestId") || "Open Link";

              return React.createElement(
                "span",
                {
                  className: "text-secondary",
                  onClick: (e) => {
                    e.stopPropagation();
                    window.open(`${url}${id}`, "_blank", "noopener,noreferrer");
                  },
                },
                title
              );
            },
          });
        } else if (col.TypeColumn === "Date") {
          transformedColumns.push({
            header: col.Title,
            accessorKey: col.BuiltInField,
            id: col.BuiltInField,
            filterFn: filterFunctionMap["DateMultiFilter"],

            enableColumnFilter: true,
            enableSorting: true,
            meta: {
              columnType: CofaceReactDataTableColumnTypes.Date,
            },
          });
        } else {
          transformedColumns.push({
            header: col.Title,
            accessorKey: col.BuiltInField,
            id: col.BuiltInField,
            filterFn: filterFunctionMap["TextMultiFilter"],
            enableColumnFilter: true,
            enableSorting: true,
            meta: {
              columnType: CofaceReactDataTableColumnTypes.Text,
            },
          });
        }
      });

      setColumns(transformedColumns);
      const views = await GetViews();
      // console.log('views of dashboard : ', views);
      setViews(views);

      const data = (await GetRequests(props.Instance)) as unknown as any[]; // dataGridSource;
      setTimeout(() => {
        setLoading(false);
      }, 500);
      setData(data);
    };
    getData();
  }, []);

  async function searchData(queryString: string): Promise<void> {
    setGlobalView(queryString);
    // const viewsColumns: any[] = (await GetViewsColumnsItems(
    //   queryString,
    // )) as any[];
    // setViewsColumns(viewsColumns);
    // const columns: ColumnDef<unknown>[] =
    //   (await GetViewsColumnsTransformedItems(
    //     viewsColumns, []
    //   )) as ColumnDef<unknown>[];
    // setColumns(columns);
    // let data: any[];
    // if (viewsFiltersFiltred && viewsFiltersFiltred.length > 0) {
    //   setViewsFilter(viewsFiltersFiltred);
    //   data = await GetRequestsListItems(
    //     queryString,
    //     [],
    //     viewsFiltersFiltred,
    //     viewsColumns,
    //     false
    //   );
    // } else {
    //   const TempViewsFilter: any[] = (await GetViewsFiltersItems(
    //     queryString,
    //   )) as any[];
    //   setViewsFilter(TempViewsFilter);
    //   data = await GetRequestsListItems(
    //     queryString,
    //     [],
    //     TempViewsFilter,
    //     viewsColumns,
    //     false
    //   );
    // }
    // This can be replaced with actual logic to fetch data
    setTimeout(() => {
      setLoading(false);
    }, 500);
    setData(data);
  }

  const deleteView = async (id: number) => {
    await DeleteView(id);
    const views: TableView[] = await GetViews();
    setViews(views);
  };

  const saveView = async (view: TableView) => {
    await SaveView(view);
    const views: TableView[] = await GetViews();
    setViews(views);
  };

  const options = React.useMemo(
    () => ({
      pageSizes: [10, 20, 50, 100],
      saveView,
      views,
      deleteView,
    }),
    [views]
  );

  const renderSubComponent = ({ row }: { row: Row<any> }) => {
    const propertiesToRemove = ["FieldId", "FieldRefId", "FieldType"];

    const jsonObject = JSON.parse(row.original.AdditionalInformations);
    const modifiedJson = jsonObject.map((item: any) => {
      // Remove properties dynamically based on the list
      propertiesToRemove.forEach((prop) => {
        delete item[prop];
      });
      return item;
    });
    return (
      <div className="flex flex-row m-5 items-center divide-x-2 divide-gray-300">
        {modifiedJson.map((item: any, index: any) => (
          <div key={index} className="flex flex-col justify-items-center p-8">
            {Object.entries(item).map(([key, value]) => (
              <div
                key={key}
                className="flex flex-row gap-2 justify-items-center"
              >
                <div className="font-semibold">{key}:</div>
                <div className="grow">{(value as string) || "N/A"}</div>
              </div>
            ))}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="p-4 px-8">
      {loading ? (
        <TableSkeletonLoader />
      ) : (
        <>
          <CofaceReactDataTableWrapper
            columns={columns}
            data={data}
            options={options}
            viewsFilter={ViewsFilter}
            requestFormUrl={requestFormUrl}
            search={searchData}
            defaultQueryMessage={"Please provide keywords to search the data."}
          >
            <CofaceReactDataTable />
          </CofaceReactDataTableWrapper>
        </>
      )}
    </div>
  );
};

export default Dashboard;
