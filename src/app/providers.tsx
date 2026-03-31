"use client";

import { getBrokerInfo } from "@/actions/getBroker";
import { getCompanyInfo } from "@/actions/getCompany";
import { getCurrentInstance } from "@/actions/getInstance";
import { validateCookie } from "@/actions/validateCookie";
import {
  ColumnFiltersState,
  PaginationState,
  SortingState,
  VisibilityState,
} from "@tanstack/react-table";
import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
  use,
} from "react";
import { useRouter } from "next/navigation";
import { writeInLog } from "@/actions/writeInLog";

import {
  IBrokerData,
  IBrokerCompany,
  IBrokerMappingListItem,
  IViewsFiltersListItem,
} from "@/models/models"; // Adjust the import path as necessary

type GlobalContextType = {
  cg: string;
  setCg: React.Dispatch<React.SetStateAction<string>>;
  brokerdata: IBrokerData | null;
  companyInfo: IBrokerCompany | null;
  RTInstance: IBrokerMappingListItem | null;
  search: () => Promise<boolean>;
};
interface TableState {
  pagination: PaginationState;
  sorting: SortingState;
  columnVisibility: VisibilityState;
  columnFilters: ColumnFiltersState;
  globalFilter: string;
  viewsFiltersListItemFiltred: IViewsFiltersListItem[];
  requestFormUrl: string;
  defaultQueryMessage: string;
  columnOrder: string[];
}
const GlobalContext = createContext<GlobalContextType | undefined>(undefined);

export function GlobalProvider({ children }: { children: ReactNode }) {
  const [cg, setCg] = useState("");
  const [brokerdata, setBrokerData] = useState<IBrokerData | null>(null);
  const [companyInfo, setCompanyInfo] = useState<IBrokerCompany | null>(null);
  const [RTInstance, setRTInstance] = useState<IBrokerMappingListItem | null>(
    null
  );
  const router = useRouter();
  // async function getTokenFromCookies() {
  //   const cookieStore = await cookies();
  //   const token = cookieStore.get("CofaceToken")?.value;
  //   return token;
  // }
  function getTokenFromCookies(): string | undefined {
    const match = document.cookie
      .split("; ")
      .find((row) => row.startsWith("CofaceToken="));

    if (!match) return undefined;

    return decodeURIComponent(match.substring("CofaceToken=".length));
  }
  async function search(): Promise<boolean> {
    try {
      const encryptedToken = await getTokenFromCookies();
      console.log(encryptedToken);
      if (!encryptedToken) return false;
      // static valid encrypted token ZFJzc3UvaHRKR2dneGExNjRPbFU0b3Fya2xlem5FcVhQUzZGZjFHWVAxVEZBNW00YlBmUFRxT2Mzb0N2aU1zVGNvSHhNbDd3a3dLWUxjNDVlOWxoYk93NlVTZ0QvcHVJRnc9PQ==
      // const encryptedToken =
      //   "QTVwS2lmRVM2NXRuWHRNSUw5bGNSbG5SSkQ0R1dOb2QyN0hZSTVIQVRQcFIrY3BzNlc0b2ZLSlZtL2Q1akV1MzhOSGRheFRqVUk3UjRiSFlta1JjakNwUVZiSXVIZk1HSEE9PQ==";
      const cgnumber = (await validateCookie(encryptedToken)) as unknown as
        | string
        | null;

      console.log("[search] starting with cg:", cgnumber);

      setCg(cgnumber ?? "");
      if (cgnumber) {
        const result = (await getBrokerInfo(
          cgnumber ? cgnumber : ""
        )) as unknown as IBrokerData | null;

        setBrokerData(result ?? null);

        if (!result) return false;

        const company = (await getCompanyInfo(
          result?.companyId
        )) as unknown as IBrokerCompany | null;

        setCompanyInfo(company ?? null);

        if (!company) return false;

        const instanceName = await getCurrentInstance(
          company.CnyBaseDataBDT.isoCountryCode
        );

        const parsed = JSON.parse(instanceName);
        const inner = JSON.parse(parsed.flowResponse);

        const results = inner.d?.results as IBrokerMappingListItem[] | null;

        if (results && results.length > 0) {
          console.log("instanceName flow Response: ", results[0]);
          setRTInstance(results[0]);
        } else {
          console.log("No results found");
          await writeInLog(
            "Warning",
            "No results in mapping list for country code: " +
              company.CnyBaseDataBDT.isoCountryCode
          );
        }
        return true;
      } else {
        console.log("No CG number found in cookie, redirecting to login.");
        router.push("/AccessDenied");
        return false;
      }
    } catch (error) {
      console.error("Error during search:", error);
      return false;
    }
  }
  return (
    <GlobalContext.Provider
      value={{
        cg,
        setCg,
        brokerdata,
        companyInfo,
        RTInstance,
        search,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
}

// Optional convenience hook
export function useGlobal() {
  const ctx = useContext(GlobalContext);
  if (!ctx) throw new Error("useGlobal must be used within <GlobalProvider>");
  return ctx;
}
