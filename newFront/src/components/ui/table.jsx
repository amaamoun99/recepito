import React from "react"

import { cn } from "@/lib/utils"

export const Table = React.forwardRef(({ className, children, ...props }, ref) => (
  <table ref={ref} className={className} {...props}>
    {children}
  </table>
))
Table.displayName = "Table"

export const TableHeader = React.forwardRef(({ className, children, ...props }, ref) => (
  <thead ref={ref} className={className} {...props}>
    {children}
  </thead>
))
TableHeader.displayName = "TableHeader"

export const TableBody = React.forwardRef(({ className, children, ...props }, ref) => (
  <tbody ref={ref} className={className} {...props}>
    {children}
  </tbody>
))
TableBody.displayName = "TableBody"

const TableFooter = React.forwardRef(({ className, ...props }, ref) => (
  <tfoot
    ref={ref}
    className={cn(
      "border-t bg-muted/50 font-medium [&>tr]:last-b-0",
      className
    )}
    {...props}
  />
))
TableFooter.displayName = "TableFooter"

export const TableRow = React.forwardRef(({ className, children, ...props }, ref) => (
  <tr ref={ref} className={className} {...props}>
    {children}
  </tr>
))
TableRow.displayName = "TableRow"

export const TableHead = React.forwardRef(({ className, children, ...props }, ref) => (
  <th ref={ref} className={className} {...props}>
    {children}
  </th>
))
TableHead.displayName = "TableHead"

export const TableCell = React.forwardRef(({ className, children, ...props }, ref) => (
  <td ref={ref} className={className} {...props}>
    {children}
  </td>
))
TableCell.displayName = "TableCell"

const TableCaption = React.forwardRef(({ className, ...props }, ref) => (
  <caption
    ref={ref}
    className={cn("mt-4 text-sm text-muted-foreground", className)}
    {...props}
  />
))
TableCaption.displayName = "TableCaption"
