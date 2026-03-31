"use client";
import * as React from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../../../shadcn-ui/components/ui/popover";
import { Button } from "../../../../shadcn-ui/components/ui/button";

import { Label } from "../../../../shadcn-ui/components/ui/label";
import { Input } from "../../../../shadcn-ui/components/ui/input";
import { TableView } from "../types";
import { Checkbox } from "../../../../shadcn-ui/components/ui/checkbox";
import { CheckedState } from "@radix-ui/react-checkbox";
import { useTableContext } from "../context/TableContext";
import { toast } from "../../../../shadcn-ui/components/ui/use-toast";
import { JSX, useEffect } from "react";
import Link from "next/link";
import { useGlobal } from "@/app/providers";
// import { getParamValue } from "@/actions/getParamValue";

const MAX_VIEW_NAME_ALLOWED: number = 30;
let MAX_VIEWS_COUNT_ALLOWED: string = "5";

export function TableSaveViewsPopover(): JSX.Element {
  const { cg, setCg, search, brokerdata, companyInfo, RTInstance} = useGlobal();
  // useEffect(() => {
  //   const fetchData = async () => {
  //     search();
  //     // MAX_VIEWS_COUNT_ALLOWED = await getParamValue('MAX_VIEWS_COUNT_ALLOWED');
  //   };
  //   fetchData();
  // }, []);
  const { table, tableOptions, tableState } = useTableContext();
  const isDisabled = tableOptions.views ? tableOptions.views.length >= parseInt(MAX_VIEWS_COUNT_ALLOWED) : false;
  const [error, setError] = React.useState("");
  const [open, setOpen] = React.useState(false);
  const [viewName, setViewName] = React.useState("");
  const [isDefault, setIsDefault] = React.useState<boolean>(false);
  const [saving, setSaving] = React.useState<boolean>(false);
  const handleCheckedChange = (checked: CheckedState) => {
    setIsDefault(checked === true);
  };

  const handlePopoverChange = (isOpen: boolean) => {
    setError("");
    setViewName("");
    setIsDefault(false);
    setOpen(isOpen);
  };

  const saveView = async (): Promise<void> => {
    setSaving(true);
    const currentTableState = table?.getState();
    const jsonState = JSON.stringify(currentTableState, null, 2);
    //const jsonWorkflowTypesConfig = JSON.stringify(null,2)
    const jsonglobalFiltersConfig = JSON.stringify(tableState.viewsFiltersListItemFiltred,null,2)
    const viewConfig: TableView = {
      Id: 0,
      Title: viewName,
      Configuration: jsonState,
      IsDefault: isDefault,
      BrokerCG: cg,
      globalFiltersConfig: jsonglobalFiltersConfig,
    };
    if (tableOptions.saveView) {
      try {
        await tableOptions.saveView(viewConfig);
        setError("");
        setViewName("");
        setIsDefault(false);
        setOpen(false);
        setSaving(false);
        toast({
          title: "Success",
          description: `The view ${viewConfig.Title} has been saved!`,
          duration: 3000, // Optional, default is 5000ms
        });
      } catch (e) {
        // setError(e.message);
        setSaving(false);
      }
    }
  };
  return (
    <Popover open={open} onOpenChange={handlePopoverChange}>
      <PopoverTrigger asChild>
        <Link href="#"
          className={`min-w-fit lg:w-auto flex items-center justify-center px-8 py-2 bg-primary border border-primary rounded text-white hover:bg-primaryhover hover:border-primaryhover active:bg-primaryactive active:border-primaryactive font-semibold hover:text-white
                    ${isDisabled ? 'opacity-50 cursor-not-allowed' : '' }`}

        >
          <span>Save view</span>
        </Link>
      </PopoverTrigger>
      <PopoverContent className="w-[500px] rounded-xl border-[1px] border-border divide-y divide-border bg-white shadow-md w-full">
        <div className="flex flex-col items-start w-full">
          <Label className="font-semibold mb-2 text-secondary">
            Save current view
          </Label>
          <div className="mb-2 w-full mt-2">
            <Input
              type="text"
              className="border border-border outline-none font-semibold shadow-none"
              placeholder="Enter view name..."
              maxLength={MAX_VIEW_NAME_ALLOWED}
              value={viewName}
              onChange={(e) => setViewName(e.target.value)}
            />
            <p className="text-xs text-muted-foreground mt-2 font-semibold">
              Maximum {MAX_VIEW_NAME_ALLOWED} characters are allowed
            </p>
            {error.length > 0 ? (
              <p className="text-xs mt-2 font-semibold text-red-500">{error}</p>
            ) : null}

            <div className="flex items-center space-x-2 mt-4">
              <Checkbox
                id="isDefault"
                checked={isDefault}
                onCheckedChange={handleCheckedChange}
              />
              <Label
                htmlFor="isDefault"
                className="font-semibold text-secondary"
              >
                Set view as default
              </Label>
            </div>
          </div>
          <div className="flex items-center gap-1 mt-4">
            <Button
              variant="secondary"
              className="text-white font-semibold px-4"
              onClick={saveView}
              disabled={
                (tableOptions.views
                  ? tableOptions.views?.length > MAX_VIEW_NAME_ALLOWED
                  : false) || saving
              }
            >
              <span>{saving ? "Saving..." : "Save"}</span>
            </Button>
            <Button
              variant="default"
              onClick={() => setOpen(false)}
              className="text-white font-semibold"
            >
              Cancel
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
