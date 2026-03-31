import * as React from "react";
import { tools } from "../datasources/tools";
import { UsefulLink } from "../types/types";
import { JSX } from "react";

type DrawerProps = {
  links: UsefulLink[];
  title: string;
};

export default function Drawer({ links, title }: DrawerProps): JSX.Element {
  const [open, setOpen] = React.useState(false);

  const goToTool = (url: string) => {
    const newTab = window.open(url, "_blank");
    if (newTab) newTab.focus();
  };

  return (
    <div className="">
      {/* Drawer Panel */}
      <div
        className={`fixed top-0 left-0 h-full w-[300px]  bg-white shadow-lg border-r transform transition-transform duration-300 z-[48] ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-4">
          <h2 className="text-lg font-semibold p-4">{title}</h2>
          <div className="w-full max-w-sm mx-auto p-4">
            <ul className="space-y-3">
              {links.map((link) => (
                <li key={link.id}>
                  <div
                    onClick={() => goToTool(link.url)}
                    className="cursor-pointer flex items-center gap-3 p-2 px-4 rounded-lg bg-gray-100 hover:bg-gray-200 transition-all"
                  >
                    {/* Tool Title */}
                    <span className="text-sm text-gray-800 font-semibold">
                      {link.title}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Button that moves with the drawer */}
      <button
        onClick={() => setOpen(!open)}
        className={`fixed top-[250px] left-0 py-2 text-primary z-[49] transform transition-transform duration-300 ${
          open ? "translate-x-[300px]" : "translate-x-0"
        }`}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="2em"
          height="2em"
          viewBox="0 0 20 20"
        >
          <path
            fill="currentColor"
            d="M5.75 4a1.75 1.75 0 1 1-3.5 0a1.75 1.75 0 0 1 3.5 0m0 6a1.75 1.75 0 1 1-3.5 0a1.75 1.75 0 0 1 3.5 0M4 17.75a1.75 1.75 0 1 0 0-3.5a1.75 1.75 0 0 0 0 3.5M11.75 4a1.75 1.75 0 1 1-3.5 0a1.75 1.75 0 0 1 3.5 0M10 11.75a1.75 1.75 0 1 0 0-3.5a1.75 1.75 0 0 0 0 3.5M11.75 16a1.75 1.75 0 1 1-3.5 0a1.75 1.75 0 0 1 3.5 0M16 5.75a1.75 1.75 0 1 0 0-3.5a1.75 1.75 0 0 0 0 3.5M17.75 10a1.75 1.75 0 1 1-3.5 0a1.75 1.75 0 0 1 3.5 0M16 17.75a1.75 1.75 0 1 0 0-3.5a1.75 1.75 0 0 0 0 3.5"
          />
        </svg>
        {/* {open ? "Close Drawer" : "Open Drawer"} */}
      </button>

      {/* Overlay (click outside to close) */}
      {open && (
        <div
          className="fixed inset-0 bg-black bg-opacity-10 z-[47]"
          onClick={() => setOpen(false)}
        ></div>
      )}
    </div>
  );
}
