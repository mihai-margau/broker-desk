import * as React from "react";

export const createHyperlink = (url: string, innerText: string) => {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="text-blue-500 underline"
    >
      {innerText}
    </a>
  );
};

export const createHtmlDiv = (innerText: string) => {
  return <div dangerouslySetInnerHTML={{ __html: innerText as string }} />;
};
