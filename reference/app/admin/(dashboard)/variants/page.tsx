"use client";

import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { fetchVariants, selectAdminVariants, selectAdminVariantsLoading } from "@/lib/store/features/adminVariantsSlice";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit, Trash, ListTree } from "lucide-react";

export default function VariantsPage() {
  const dispatch = useAppDispatch();
  const variants = useAppSelector(selectAdminVariants);
  const loading = useAppSelector(selectAdminVariantsLoading);

  useEffect(() => {
    dispatch(fetchVariants());
  }, [dispatch]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Variants</h1>
          <p className="text-sm text-muted-foreground">Manage all product variants globally across the store.</p>
        </div>
        <Button variant="outline" className="gap-2">
          <ListTree className="h-4 w-4" /> Filter Options
        </Button>
      </div>

      <div className="rounded-md border bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Variant Name</TableHead>
              <TableHead>SKU</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead>Options</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center h-24 text-muted-foreground">
                  Loading variants...
                </TableCell>
              </TableRow>
            ) : variants.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center h-24 text-muted-foreground">
                  No variants found.
                </TableCell>
              </TableRow>
            ) : (
              variants.map((variant) => (
                <TableRow key={variant._id}>
                  <TableCell className="font-medium text-sm">
                    {variant.title}
                  </TableCell>
                  <TableCell>{variant.sku}</TableCell>
                  <TableCell>${variant.price}</TableCell>
                  <TableCell>
                    <span className={variant.stock === 0 ? "text-red-500 font-bold" : "font-medium"}>
                      {variant.stock || 0}
                    </span>
                  </TableCell>
                  <TableCell>
                    {variant.optionValues && Object.entries(variant.optionValues).map(([key, val]) => (
                      <span key={key} className="inline-block bg-accent px-1.5 py-0.5 rounded-sm mr-1.5 text-xs text-muted-foreground font-medium">
                        {key}: {val as string}
                      </span>
                    ))}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon"><Edit className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon" className="text-destructive"><Trash className="h-4 w-4" /></Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
