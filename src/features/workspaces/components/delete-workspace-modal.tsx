import { DialogClose } from "@radix-ui/react-dialog";

import {
  ResponsiveModal,
  ResponsiveModalBody,
  ResponsiveModalContent,
  ResponsiveModalDescription,
  ResponsiveModalHeader,
  ResponsiveModalTitle,
} from "@/components/responsive-modal";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";

import useDeleteWorkspace from "../api/use-delete-workspace";

interface Props {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  data: {
    name: string;
    workspaceId: string;
  };
}

export default function DeleteWorkspaceModal({
  isOpen,
  onOpenChange,
  data: { name, workspaceId },
}: Props) {
  const { mutate, isPending } = useDeleteWorkspace();

  return (
    <ResponsiveModal open={isOpen} onOpenChange={onOpenChange}>
      <ResponsiveModalContent>
        <ResponsiveModalHeader>
          <ResponsiveModalTitle>Delete workspace</ResponsiveModalTitle>
          <ResponsiveModalDescription>
            This action is not reversible.
          </ResponsiveModalDescription>
        </ResponsiveModalHeader>
        <ResponsiveModalBody>
          Are you sure you want to delete the workspace{" "}
          <span className="font-semibold underline">{name}</span> with ID{" "}
          <code className="bg-muted relative rounded px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold">
            {workspaceId}
          </code>
          ?
        </ResponsiveModalBody>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" disabled={isPending}>
              Cancel
            </Button>
          </DialogClose>
          <Button
            variant="destructive"
            isLoading={isPending}
            onClick={() =>
              mutate(
                {
                  param: {
                    workspaceId,
                  },
                },
                {
                  onSuccess: () => {
                    onOpenChange(false);
                  },
                }
              )
            }
          >
            Delete
          </Button>
        </DialogFooter>
      </ResponsiveModalContent>
    </ResponsiveModal>
  );
}
