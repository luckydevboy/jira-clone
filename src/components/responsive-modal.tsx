import { useMedia } from "react-use";

import { cn } from "@/lib/utils";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "./ui/drawer";

interface BaseProps {
  children: React.ReactNode;
}

interface RootProps extends BaseProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

interface Props extends BaseProps {
  className?: string;
  asChild?: boolean;
}

function ResponsiveModal({ children, ...props }: RootProps) {
  const isDesktop = useMedia("(min-width: 768px)", true);
  const ResponsiveModal = isDesktop ? Dialog : Drawer;

  return <ResponsiveModal {...props}>{children}</ResponsiveModal>;
}

function ResponsiveModalHeader({ children, ...props }: Props) {
  const isDesktop = useMedia("(min-width: 768px)", true);
  const ResponsiveModalHeader = isDesktop ? DialogHeader : DrawerHeader;

  return <ResponsiveModalHeader {...props}>{children}</ResponsiveModalHeader>;
}

function ResponsiveModalTitle({ children, ...props }: Props) {
  const isDesktop = useMedia("(min-width: 768px)", true);
  const ResponsiveModalTitle = isDesktop ? DialogTitle : DrawerTitle;

  return <ResponsiveModalTitle {...props}>{children}</ResponsiveModalTitle>;
}

function ResponsiveModalDescription({ children, ...props }: Props) {
  const isDesktop = useMedia("(min-width: 768px)", true);
  const ResponsiveModalDescription = isDesktop
    ? DialogDescription
    : DrawerDescription;

  return (
    <ResponsiveModalDescription {...props}>
      {children}
    </ResponsiveModalDescription>
  );
}

function ResponsiveModalContent({ children, ...props }: Props) {
  const isDesktop = useMedia("(min-width: 768px)", true);
  const ResponsiveModalContent = isDesktop ? DialogContent : DrawerContent;

  return <ResponsiveModalContent {...props}>{children}</ResponsiveModalContent>;
}

function ResponsiveModalBody({ children, className, ...props }: Props) {
  // TODO: get breakpoints from constants
  const isDesktop = useMedia("(min-width: 768px)", true);

  return (
    <div className={cn(className, !isDesktop && "px-4")} {...props}>
      {children}
    </div>
  );
}

function ResponsiveModalFooter({ children, ...props }: Props) {
  const isDesktop = useMedia("(min-width: 768px)", true);
  const ResponsiveModalFooter = isDesktop ? DialogFooter : DrawerFooter;

  return <ResponsiveModalFooter {...props}>{children}</ResponsiveModalFooter>;
}

function ResponsiveModalTrigger({ children, ...props }: Props) {
  const isDesktop = useMedia("(min-width: 768px)", true);
  const ResponsiveModalTrigger = isDesktop ? DialogTrigger : DrawerTrigger;

  return <ResponsiveModalTrigger {...props}>{children}</ResponsiveModalTrigger>;
}

function ResponsiveModalClose({ children, ...props }: Props) {
  const isDesktop = useMedia("(min-width: 768px)", true);
  const ResponsiveModalClose = isDesktop ? DialogClose : DrawerClose;

  return <ResponsiveModalClose {...props}>{children}</ResponsiveModalClose>;
}

export {
  ResponsiveModal,
  ResponsiveModalTrigger,
  ResponsiveModalContent,
  ResponsiveModalFooter,
  ResponsiveModalClose,
  ResponsiveModalHeader,
  ResponsiveModalDescription,
  ResponsiveModalTitle,
  ResponsiveModalBody,
};
