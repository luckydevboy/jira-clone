"use client";

import { DialogClose } from "@radix-ui/react-dialog";
import { useRouter } from "next/navigation";

import {
  ResponsiveModal,
  ResponsiveModalBody,
  ResponsiveModalContent,
  ResponsiveModalHeader,
  ResponsiveModalTitle,
} from "@/components/responsive-modal";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";

interface Props {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  data: {
    name: string;
    workspaceId: string;
  };
}

export default function SwitchWorkspaceModal({
  isOpen,
  onOpenChange,
  data: { name, workspaceId },
}: Props) {
  const router = useRouter();

  return (
    <ResponsiveModal open={isOpen} onOpenChange={onOpenChange}>
      <ResponsiveModalContent>
        <ResponsiveModalHeader>
          <ResponsiveModalTitle>Switch workspace</ResponsiveModalTitle>
        </ResponsiveModalHeader>
        <ResponsiveModalBody>
          Are you sure you want to switch to the workspace{" "}
          <span className="font-semibold underline">{name}</span> with ID{" "}
          <code className="bg-muted relative rounded px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold">
            {workspaceId}
          </code>
          ?
        </ResponsiveModalBody>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button
            onClick={() => router.push(`/dashboard/workspaces/${workspaceId}`)}
          >
            Switch
          </Button>
        </DialogFooter>
      </ResponsiveModalContent>
    </ResponsiveModal>
  );
}
