/* eslint-disable @typescript-eslint/no-unused-vars */

import { dataGridSource } from "../datasources/dataGridSource";
export type DataGridRowItem = {
  id: number;
  createdBy: string;
  created: string;
  workflowType: string;
  status: string;
  step: string;
  currentApprovers: string;
}; //(typeof dataGridSource)[number];

export type WorkflowType = {
  id: number;
  title: string;
  checked: boolean;
};

export type UsefulLink = {
  id: number;
  title: string;
  url: string;
};

export type ConfigurationParameter = {
  title: string;
  value: string;
};
