import * as React from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../../../shadcn-ui/components/ui/popover";
import { Button } from "../../../../shadcn-ui/components/ui/button";

import { Label } from "../../../../shadcn-ui/components/ui/label";
import { Checkbox } from "../../../../shadcn-ui/components/ui/checkbox";
import { useTableContext } from "../context/TableContext";
import { clsx } from "clsx";
import { TableViewsDeleteView } from "./TableViewsDeleteView";
import { toast } from "../../../../shadcn-ui/components/ui/use-toast";
import { WorkflowType } from "../../DashboardDataTable/types/types";
import { JSX } from "react";
import Link from "next/link";
import { IViewsFiltersListItem } from "@/models/models";
// import { IViewsFiltersListItem, LookupDropdown, LookupItem } from "../../../../Services/IViewsFiltersListListItem";

export function TableViewsPopover(): JSX.Element {
  const {
    tableOptions,
    tableState,
    setLoading,
    importState,
    resetTable,
    updateViewsFiltersListItemFiltred,
    onSearch,
  } = useTableContext();
  const [open, setOpen] = React.useState(false);
  const [alert, setAlert] = React.useState(false);
  const [deleteViewId, setDeleteViewId] = React.useState<number | null>(null);
  const [deleteViewTitle, setDeleteViewTitle] = React.useState<string>("");
  const [deletingView, setDeletingView] = React.useState<boolean>(false);
  const [selectedViewTitle, setSelectedViewTitle] = React.useState("My Views");
  const [selectedViewId, setSelectedViewId] = React.useState<number | null>(
    null
  );
  const [previousSelectedViewId, setPreviousSelectedViewId] = React.useState<
    number | null
  >(null);

  React.useEffect(() => {
    console.log(tableOptions);
    if (tableOptions.views) {
      if (tableOptions.views.length > 0) {
        setSelectedViewId(
          tableOptions.views.filter((f) => f.IsDefault === true).length > 0
            ? tableOptions.views.filter((f) => f.IsDefault === true)[0].Id
            : null
        );
        setPreviousSelectedViewId(
          tableOptions.views.filter((f) => f.IsDefault === true).length > 0
            ? tableOptions.views.filter((f) => f.IsDefault === true)[0].Id
            : null
        );
        setSelectedViewTitle(
          tableOptions.views.filter((f) => f.IsDefault === true).length > 0
            ? tableOptions.views.filter((f) => f.IsDefault === true)[0].Title
            : "My Views"
        );
      } else {
        setSelectedViewTitle("My Views");
        setSelectedViewId(null);
        setPreviousSelectedViewId(null);
      }
    }
  }, [tableOptions]);
  const handleDelete = async (id: number, title: string) => {
    // Remove the item from the list
    setAlert(true);
    setDeleteViewId(id);
    setDeleteViewTitle(title);
  };

  const deleteView = async (id: number | null) => {
    setDeletingView(true);
    if (tableOptions.deleteView) {
      setLoading(true);
      await tableOptions.deleteView(id ? id : 0);
      setTimeout(() => setLoading(false), 1000);
      setOpen(false);
      setAlert(false);
      toast({
        title: "Success",

        description: `The view ${deleteViewTitle} has been deleted!`,
        duration: 3000, // Optional, default is 5000ms
      });
      setDeleteViewId(null);
      setDeleteViewTitle("");
    }
    setDeletingView(false);
  };

  const applyView = () => {
    if (tableOptions.views) {
      const view = tableOptions.views.find((f) => f.Id === selectedViewId);
      setSelectedViewTitle(view ? view?.Title : "");
      setPreviousSelectedViewId(selectedViewId);
      if (view?.Id === 0 || view?.Title === "Show All Data") {
        setLoading(true);
        resetTable();
        onSearch("1", []);
        setTimeout(() => {
          setLoading(false);
          toast({
            title: "Success",
            description: `The view ${view.Title} has been loaded!`,
            duration: 3000, // Optional, default is 5000ms
          });
        }, 2000);
        setOpen(false);

        return;
      }
      if (view) {
        setLoading(true);
        importState(view.Configuration);
        let workflowTypesFiltredFromView: WorkflowType[] = [];
        let globalFiltersFiltredFromView: IViewsFiltersListItem[] = [];
        if (view) {
          globalFiltersFiltredFromView =
            view.globalFiltersConfig?.length > 0
              ? JSON.parse(view.globalFiltersConfig)
              : [];
        }
        updateViewsFiltersListItemFiltred(globalFiltersFiltredFromView);
        onSearch("1", globalFiltersFiltredFromView);
        setTimeout(() => {
          //setLoading(false);
          toast({
            title: "Success",
            description: `The view ${view.Title} has been loaded!`,
            duration: 3000, // Optional, default is 5000ms
          });
        }, 2000);
      }
      setOpen(false);
    }
  };

  const handleCheckboxChange = (id: number, title: string) => {
    setSelectedViewId(id); // Set the selected checkbox as the only selected oneq<
  };

  const handleOpenChange = (isOpen: boolean) => {
    if (selectedViewId !== previousSelectedViewId)
      setSelectedViewId(previousSelectedViewId);
    setOpen(isOpen);
  };
  // console.log(tableOptions.views);
  return (
    <>
      <Popover open={open} onOpenChange={handleOpenChange}>
        <PopoverTrigger asChild>
          <Link
            href="#"
            className="ml-auto flex justify-end items-center relative min-w-fit  lg:w-auto justify-center items-center pl-1 lg:px-8 py-2 bg-white border border-primary rounded hover:bg-neutral-100 hover:border-primaryhover active:bg-neutral-200 active:border-primaryactive font-semibold outline-none"
          >
            <span>
              {selectedViewTitle !== "My Views"
                ? "View: " + selectedViewTitle
                : selectedViewTitle}
            </span>
          </Link>
        </PopoverTrigger>
        <PopoverContent className="w-[400px] rounded-xl border-[1px] border-border divide-y divide-border bg-white shadow-md w-full">
          <div className="flex flex-col items-start w-full">
            {/* <Label className="font-semibold mb-2 text-secondary">
            Save current view
          </Label> */}
            <div className="mb-2 w-full mt-1">
              {tableOptions.views &&
                tableOptions.views.length > 1 &&
                tableOptions.views?.map((view) => (
                  <div
                    key={view.Id}
                    className={clsx(
                      "flex items-center space-x-2 w-full hover:bg-neutral-50",
                      view.Id === 0 && "pb-2 border-neutral-200 border-b-[1px]"
                    )}
                  >
                    <Checkbox
                      id={`checkbox-${view.Id}`}
                      checked={selectedViewId === view.Id} // Only the selected checkbox will be checked
                      onCheckedChange={() =>
                        handleCheckboxChange(view.Id, view.Title)
                      }
                    />
                    <Label
                      htmlFor={`checkbox-${view.Id}`}
                      className="font-semibold text-secondary w-full"
                    >
                      {view.Title}
                    </Label>
                    {view.Id !== 0 ? (
                      <button
                        onClick={() => handleDelete(view.Id, view.Title)}
                        className="w-8 h-8 border border-transparent rounded-full hover:bg-neutral-100 active:bg-neutral-200"
                      >
                        <svg
                          className="h-6 ml-1 mt-0.5"
                          xmlns="http://www.w3.org/2000/svg"
                          width="1.2em"
                          height="1.2em"
                          viewBox="0 0 12 12"
                        >
                          <path
                            fill="currentColor"
                            d="M5 3h2a1 1 0 0 0-2 0M4 3a2 2 0 1 1 4 0h2.5a.5.5 0 0 1 0 1h-.441l-.443 5.17A2 2 0 0 1 7.623 11H4.377a2 2 0 0 1-1.993-1.83L1.941 4H1.5a.5.5 0 0 1 0-1zm3.5 3a.5.5 0 0 0-1 0v2a.5.5 0 0 0 1 0zM5 5.5a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5M3.38 9.085a1 1 0 0 0 .997.915h3.246a1 1 0 0 0 .996-.915L9.055 4h-6.11z"
                          />
                        </svg>
                      </button>
                    ) : null}
                  </div>
                ))}
            </div>
            {tableOptions.views !== undefined ? (
              tableOptions.views.length > 1 ? (
                <div className="flex items-center gap-1 mt-4">
                  <Button
                    variant="secondary"
                    className="text-white font-semibold px-4"
                    onClick={applyView}
                  >
                    <span>Apply</span>
                  </Button>
                  <Button
                    variant="default"
                    onClick={() => setOpen(false)}
                    className="text-white font-semibold"
                  >
                    Cancel
                  </Button>
                </div>
              ) : (
                <p className="font-semibold text-center text-sm w-full">
                  There are no views
                </p>
              )
            ) : (
              <p className="font-semibold text-center  text-sm w-full">
                There are no views
              </p>
            )}
          </div>
        </PopoverContent>
      </Popover>
      {alert ? (
        <TableViewsDeleteView
          viewName={deleteViewTitle}
          viewId={deleteViewId}
          deleteView={deleteView}
          isOpen={alert}
          cancelAlert={setAlert}
          deleting={deletingView}
        />
      ) : null}
    </>
  );
}
