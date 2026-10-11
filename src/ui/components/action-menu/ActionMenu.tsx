import { Menu } from '@base-ui/react/menu'
import type { ComponentProps, ReactNode } from 'react'
import { cn } from '@/ui/cn'
import { Icon } from '@/ui/components/icon/Icon'
import { popupSurfaceClass } from '@/ui/components/field/controlStyles'

// A "more actions" menu: one quiet icon button that opens the secondary actions of a row. It scales in from the trigger
// (never from the centre) in 150ms and leaves faster than it came.
export function ActionMenu({ label, children }: { label: string; children: ReactNode }) {
  return <Menu.Root>
    <Menu.Trigger aria-label={label} className="grid size-9 cursor-pointer place-items-center rounded-[10px] border-0 bg-transparent p-0 text-text-secondary transition-[background-color,color,scale] duration-150 ease-[cubic-bezier(.23,1,.32,1)] outline-none hover:bg-paper hover:text-ink focus-visible:outline-2 focus-visible:outline-primary active:scale-[.96] data-popup-open:bg-paper data-popup-open:text-ink motion-reduce:transition-none max-md:size-11">
      <Icon name="more" size={18} />
    </Menu.Trigger>
    <Menu.Portal>
      <Menu.Positioner align="end" sideOffset={6} className="z-[10000] outline-none">
        <Menu.Popup className={cn(popupSurfaceClass, 'min-w-52 origin-(--transform-origin) rounded-[14px] p-1.5 shadow-[0_16px_40px_rgb(15_23_42/18%),0_2px_10px_rgb(15_23_42/8%)] outline-none transition-[opacity,scale] duration-150 ease-[cubic-bezier(.23,1,.32,1)] data-ending-style:scale-95 data-ending-style:opacity-0 data-ending-style:duration-100 data-starting-style:scale-95 data-starting-style:opacity-0 motion-reduce:transition-none')}>{children}</Menu.Popup>
      </Menu.Positioner>
    </Menu.Portal>
  </Menu.Root>
}

const item = 'flex min-h-10 w-full cursor-pointer items-center gap-2.5 rounded-lg border-0 bg-transparent px-3 py-2 text-start text-[14px] leading-5 font-semibold text-ink no-underline outline-none data-highlighted:bg-paper data-disabled:cursor-default data-disabled:opacity-50 [&>svg]:shrink-0 [&>svg]:text-text-muted data-[tone=danger]:text-danger-text data-[tone=danger]:[&>svg]:text-danger-text data-[tone=success]:text-success-strong data-[tone=success]:[&>svg]:text-success-strong'

export function MenuItem({ className, ...props }: ComponentProps<typeof Menu.Item>) {
  return <Menu.Item className={cn(item, className as string | undefined)} {...props} />
}

export function MenuLink({ className, ...props }: ComponentProps<typeof Menu.LinkItem>) {
  return <Menu.LinkItem className={cn(item, className as string | undefined)} {...props} />
}

export function MenuSeparator() {
  return <Menu.Separator className="mx-1 my-1.5 h-px bg-paper" />
}
