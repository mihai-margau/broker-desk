// import * as React from "react";
// import { Button } from "../../../../../../shadcn-ui/components/ui/button";
// import {
//   Dialog,
//   DialogClose,
//   DialogContent,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "../../../../../../shadcn-ui/components/ui/dialog";
// import {
//   Select,
//   SelectContent,
//   SelectGroup,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "../../../../../../shadcn-ui/components/ui/select";
// import { WorkflowType } from "../types/types";

// type NewRequestButtonProps = {
//   tools: WorkflowType[];
// };

// export function NewRequestButton({
//   tools,
// }: NewRequestButtonProps): JSX.Element {
//   const [tool, setTool] = React.useState<WorkflowType | null>(null);
//   const [isOpen, setIsOpen] = React.useState<boolean>(false);
//   const [error, setError] = React.useState<string>("");
//   const handleOpenChange = (isOpen: boolean) => {
//     setTool(null);
//     setError("");
//     setIsOpen(isOpen);
//   };
//   const handleSelectChange = (value: string) => {
//     const _tool = tools.find((t) => t.id === Number(value));
//     if (_tool) {
//       setTool(_tool);
//     }
//   };
//   const createRequest = () => {
//     if (!tool) {
//       setError("Please select a tool");
//       return;
//     }
//     const newTab = window.open(tool?".newFormUrl, _blank":"");
//     setIsOpen(false);
//     if (newTab) newTab.focus();
//   };
//   return (
//     <Dialog open={isOpen} onOpenChange={handleOpenChange}>
//       <DialogTrigger asChild>
//         <Button
//           variant="outline"
//           className="bg-secondary font-semibold px-5 py-5 text-white hover:bg-secondaryhover hover:text-white"
//         >
//           Create new request
//         </Button>
//       </DialogTrigger>
//       <DialogContent className="sm:max-w-[525px] p-6">
//         <DialogHeader>
//           <DialogTitle>Create new request</DialogTitle>
//         </DialogHeader>
//         <div className="py-4">
//           <Select
//             value={tool?.id.toString()}
//             onValueChange={handleSelectChange}
//           >
//             <SelectTrigger className="font-semibold rounded-md border border-border outline-none">
//               <SelectValue placeholder="Select the tool..." />
//             </SelectTrigger>
//             <SelectContent>
//               <SelectGroup>
//                 {tools.map((tool) => (
//                   <SelectItem
//                     key={tool.id}
//                     value={tool.id.toString()}
//                     className="cursor-pointer"
//                   >
//                     <span className="font-semibold">{tool.title}</span>
//                   </SelectItem>
//                 ))}
//               </SelectGroup>
//             </SelectContent>
//           </Select>
//           {error.length > 0 ? (
//             <p className="text-xs mt-2 font-semibold text-red-500">{error}</p>
//           ) : null}
//         </div>
//         <DialogFooter>
//           <DialogClose asChild>
//             <Button type="button" variant="outline" className="font-semibold">
//               Close
//             </Button>
//           </DialogClose>
//           <Button className="font-semibold text-white" onClick={createRequest}>
//             Create request
//           </Button>
//         </DialogFooter>
//       </DialogContent>
//     </Dialog>
//   );
// }
