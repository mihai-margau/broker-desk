import * as React from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../../../../shadcn-ui/components/ui/alert-dialog";
import { JSX } from "react";

type TableViewsDeleteViewProps = {
  viewName: string;
  viewId: number | null;
  isOpen: boolean;
  deleting: boolean;
  deleteView: (id: number | null) => void;
  cancelAlert: (value: boolean) => void;
};

export const TableViewsDeleteView = ({
  viewName,
  viewId,
  isOpen,
  deleting,
  deleteView,
  cancelAlert,
}: TableViewsDeleteViewProps): JSX.Element => {
  return (
    <AlertDialog open={isOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Are you sure you want to delete the view: {viewName} ?
          </AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the
            selected view.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel
            className="font-semibold"
            onClick={() => cancelAlert(false)}
          >
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            className="font-semibold text-white"
            disabled={deleting}
            onClick={() => {
              deleteView(viewId);
            }}
          >
            {!deleting ? "Continue" : "Deleting..."}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
