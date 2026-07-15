import "@ncdai/react-wheel-picker/style.css";

import * as WheelPickerPrimitive from "@ncdai/react-wheel-picker";

import { cn } from "@/lib/utils";

function WheelPickerWrapper({ className, ...props }) {
  return (
    <WheelPickerPrimitive.WheelPickerWrapper
      className={cn(
        "w-90 rounded-lg   px-1  dark:border-zinc-700/80 dark:bg-zinc-900",
        "*:data-rwp:first:*:data-rwp-highlight-wrapper:rounded-s-md",
        "*:data-rwp:last:*:data-rwp-highlight-wrapper:rounded-e-md",
        className,
      )}
      {...props}
    />
  );
}

function WheelPicker({ classNames, ...props }) {
  return (
    <WheelPickerPrimitive.WheelPicker
      classNames={{
        optionItem: cn(
          "text-zinc-400 dark:text-zinc-500 data-disabled:opacity-40",
          classNames?.optionItem,
        ),
        highlightWrapper: cn(
          "bg-white border text-zinc-950 dark:bg-zinc-800 dark:text-zinc-50",
          "data-rwp-focused:inset-ring-2 data-rwp-focused:inset-ring-zinc-300 dark:data-rwp-focused:inset-ring-zinc-600",
          classNames?.highlightWrapper,
        ),
        highlightItem: cn(
          "data-disabled:opacity-40",
          classNames?.highlightItem,
        ),
      }}
      {...props}
    />
  );
}

export { WheelPicker, WheelPickerWrapper };
