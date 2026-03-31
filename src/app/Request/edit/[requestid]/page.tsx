import { EditRequest } from "@/components/EditRequest";
import { use } from "react";

export default function EditRequestPage({ params }: { params: Promise<{ requestid: string }> }) {
  const resolvedParams = use(params);

  return (
    <main>
      <div>
        <EditRequest requestid={resolvedParams.requestid} />
      </div>
    </main>
  );
}