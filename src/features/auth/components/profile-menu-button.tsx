"use client";

import { Loader, LogOut } from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import useSignOut from "../api/use-sign-out";
import useCurrent from "../api/use-current";

export default function ProfileMenuButton() {
  const { mutate: signOut } = useSignOut();
  const { data: user, isLoading } = useCurrent();

  if (isLoading) {
    return (
      <Avatar>
        <AvatarFallback>
          <Loader className="size-4 animate-spin" />
        </AvatarFallback>
      </Avatar>
    );
  }

  if (!user) {
    return null;
  }

  const { name, email } = user;

  const avatarFallback = name
    ? name.charAt(0).toUpperCase()
    : email.charAt(0).toUpperCase() ?? "U";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Avatar>
          <AvatarFallback>{avatarFallback}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem className="flex flex-col items-start">
          <div className="font-medium text-sm">{name}</div>
          <div className="font-light text-xs">{email}</div>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => signOut()}>
          <LogOut />
          Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
