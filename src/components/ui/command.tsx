"use client";

import { type DialogProps } from "@radix-ui/react-dialog";
import { Command as CommandPrimitive } from "cmdk";
import * as React from "react";

import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";

const Command = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive>
>(({ className, ...props }, ref) => (
  <CommandPrimitive
    ref={ref}
    className={cn(
      "flex h-full w-full flex-col overflow-hidden rounded-lg bg-popover text-popover-foreground",
      className,
    )}
    {...props}
  />
));
Command.displayName = CommandPrimitive.displayName;

const CommandDialog = ({ children, ...props }: DialogProps) => {
  return (
    <Dialog {...props}>
      <DialogTitle className="sr-only">Search Services & Pages</DialogTitle>
      <DialogDescription className="sr-only">Search all car services, maintenance packages, and pages</DialogDescription>
      <DialogContent className="overflow-hidden px-6 py-5 sm:max-w-[640px] w-[calc(100%-32px)] top-[120px] left-1/2 -translate-x-1/2 translate-y-0 bg-white border border-neutral-200 text-neutral-900 shadow-[0_20px_60px_rgba(0,0,0,0.3)] rounded-2xl z-[100] [&>button:last-child]:flex [&>button:last-child]:top-5 [&>button:last-child]:right-5 [&>button:last-child]:w-8 [&>button:last-child]:h-8 [&>button:last-child]:rounded-full [&>button:last-child]:bg-neutral-100 [&>button:last-child]:hover:bg-neutral-200 [&>button:last-child]:text-neutral-700 [&>button:last-child]:justify-center [&>button:last-child]:items-center">
        <Command className="bg-white text-neutral-900">
          {children}
        </Command>
      </DialogContent>
    </Dialog>
  );
};

const CommandInput = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Input>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Input>
>(({ className, ...props }, ref) => (
  <div className="flex items-center border border-neutral-200 rounded-xl px-4 py-2 mb-4 bg-white relative shadow-sm" cmdk-input-wrapper="">
    <MagnifyingGlassIcon width={20} height={20} className="me-3 text-[#E2001A] shrink-0" />
    <CommandPrimitive.Input
      ref={ref}
      className={cn(
        "flex h-10 w-full rounded-lg bg-transparent py-2 text-base font-medium text-neutral-900 outline-none placeholder:text-neutral-400 disabled:cursor-not-allowed disabled:opacity-50 pr-8",
        className,
      )}
      {...props}
    />
  </div>
));

CommandInput.displayName = CommandPrimitive.Input.displayName;

const CommandList = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.List>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.List
    ref={ref}
    className={cn("max-h-[60vh] overflow-y-auto overflow-x-hidden p-0 bg-white flex flex-col gap-1", className)}
    {...props}
  />
));

CommandList.displayName = CommandPrimitive.List.displayName;

const CommandEmpty = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Empty>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Empty>
>((props, ref) => (
  <CommandPrimitive.Empty ref={ref} className="py-8 text-center text-sm font-medium text-neutral-500" {...props} />
));

CommandEmpty.displayName = CommandPrimitive.Empty.displayName;

const CommandGroup = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Group>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Group>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.Group
    ref={ref}
    className={cn(
      "overflow-hidden p-0 text-neutral-900 [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:mt-4 [&_[cmdk-group-heading]]:mb-2 [&_[cmdk-group-heading]]:text-[12px] [&_[cmdk-group-heading]]:font-bold [&_[cmdk-group-heading]]:text-neutral-400 [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-[0.8px]",
      className,
    )}
    {...props}
  />
));

CommandGroup.displayName = CommandPrimitive.Group.displayName;

const CommandSeparator = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.Separator
    ref={ref}
    className={cn("mt-4 mb-2 pt-3 border-t border-neutral-200/70 h-0 bg-transparent mx-2", className)}
    {...props}
  />
));
CommandSeparator.displayName = CommandPrimitive.Separator.displayName;

const CommandItem = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Item>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.Item
    ref={ref}
    className={cn(
      "relative flex cursor-pointer select-none items-center gap-3 rounded-lg px-3.5 py-2.5 mb-1 text-[14.5px] font-semibold leading-relaxed text-neutral-800 outline-none transition-all duration-150 ease-out data-[disabled=true]:pointer-events-none data-[selected=true]:pl-5 data-[selected=true]:bg-[#fdeaea] data-[selected=true]:text-[#E2001A] hover:pl-5 hover:bg-[#fdeaea] hover:text-[#E2001A] active:scale-[0.98] data-[disabled=true]:opacity-50",
      className,
    )}
    {...props}
  />
));

CommandItem.displayName = CommandPrimitive.Item.displayName;

const CommandShortcut = ({ className, ...props }: React.HTMLAttributes<HTMLSpanElement>) => {
  return (
    <kbd
      className={cn(
        "-me-1 ms-auto inline-flex h-5 max-h-full items-center rounded border border-border bg-background px-1 font-[inherit] text-[0.625rem] font-medium text-muted-foreground/70",
        className,
      )}
      {...props}
    />
  );
};
CommandShortcut.displayName = "CommandShortcut";

export {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
};
