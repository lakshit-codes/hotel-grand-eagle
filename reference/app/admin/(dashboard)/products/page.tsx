"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import {
  fetchProducts,
  deleteProduct,
  bulkImportProducts,
} from "@/lib/store/products/productsThunk";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Plus,
  Edit,
  Trash,
  ChevronDown,
  ChevronUp,
  Upload,
  Image as ImageIcon,
} from "lucide-react";
import { toast } from "sonner";
import { ProductStudio } from "@/components/admin/products/ProductStudio";
import { ImportModal } from "@/components/admin/ImportModal";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store/store";

function ProductsPageContent() {
  const dispatch = useAppDispatch();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { allProducts: products, loading } = useSelector(
    (state: RootState) => state.adminProducts,
  );

  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const [showImportModal, setShowImportModal] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const action = searchParams.get("action");
  const editId = searchParams.get("id");
  // const isStudioMode = action === "new" || !!editId;

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"?`)) return;

    setDeletingId(id);
    const toastId = toast.loading(`Deleting ${name}...`);

    try {
      const resultAction = await dispatch(deleteProduct(id));
      if (deleteProduct.fulfilled.match(resultAction)) {
        toast.success(`${name} deleted successfully`, { id: toastId });
        dispatch(fetchProducts());
      } else {
        toast.error(
          `Delete failed: ${resultAction.payload || "Unknown error"}`,
          { id: toastId },
        );
      }
    } catch (err) {
      toast.error("Network error. Please try again.", { id: toastId });
    } finally {
      setDeletingId(null);
    }
  };

  const handleImport = async (data: any[]) => {
    const resultAction = await dispatch(bulkImportProducts(data));
    if (bulkImportProducts.fulfilled.match(resultAction)) {
      return resultAction.payload;
    } else {
      throw new Error((resultAction.payload as any) || "Import failed");
    }
  };

  const productSampleData = [
    {
      name: "Modern Leather Sofa",
      sku: "SOFA-LR-001",
      price: 1299.99,
      status: "active",
      type: "physical",
      description: "Premium Italian leather sofa with oak legs.",
      categories: ["furniture", "living-room"],
      variants: [
        {
          sku: "SOFA-LR-001-BROWN",
          title: "Cognac Brown",
          price: 1299.99,
          stock: 5,
        },
        {
          sku: "SOFA-LR-001-BLACK",
          title: "Noir Black",
          price: 1349.99,
          stock: 3,
        },
      ],
    },
  ];
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 font-display">
            Products
          </h1>
          <p className="text-sm text-slate-500">
            Manage your product catalog and inventory details.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            className="rounded-xl border-slate-200 text-slate-600 hover:bg-slate-50 gap-2 font-bold px-5"
            onClick={() => setShowImportModal(true)}
          >
            <Upload className="h-4 w-4" /> Import JSON
          </Button>

          <ImportModal
            isOpen={showImportModal}
            onClose={() => setShowImportModal(false)}
            onImport={handleImport}
            sampleData={productSampleData}
            title="Import Products"
            description="Upload a JSON file containing product records. Existing SKUs will be skipped."
            fileName="products"
          />
          <Button
            className="rounded-xl bg-slate-900 text-white hover:bg-slate-800 gap-2 shadow-lg shadow-slate-200"
            onClick={() => router.push("products/new")}
          >
            <Plus className="h-4 w-4" /> Add Product
          </Button>
        </div>
      </div>

      <div className="rounded-3xl border border-slate-100 bg-white overflow-hidden shadow-sm shadow-slate-200/50">
        <Table>
          <TableHeader className="bg-slate-50/50">
            <TableRow className="hover:bg-transparent border-slate-100">
              <TableHead className="font-bold text-slate-500 uppercase tracking-wider text-[10px]">
                Product
              </TableHead>
              <TableHead className="font-bold text-slate-500 uppercase tracking-wider text-[10px]">
                SKU
              </TableHead>
              <TableHead className="font-bold text-slate-500 uppercase tracking-wider text-[10px]">
                Status
              </TableHead>
              <TableHead className="font-bold text-slate-500 uppercase tracking-wider text-[10px]">
                Variants
              </TableHead>
              <TableHead className="text-right font-bold text-slate-500 uppercase tracking-wider text-[10px]">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center h-48">
                  <div className="flex flex-col items-center gap-3">
                    <div className="h-6 w-6 animate-spin rounded-full border-2 border-slate-200 border-t-slate-900" />
                    <span className="text-xs text-slate-400 font-bold uppercase tracking-widest">
                      Hydrating Catalog...
                    </span>
                  </div>
                </TableCell>
              </TableRow>
            ) : products.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="text-center h-48 text-slate-400"
                >
                  No products found in your inventory.
                </TableCell>
              </TableRow>
            ) : (
              products.map((prod) => (
                <React.Fragment key={prod._id}>
                  <TableRow
                    className={`hover:bg-slate-50/50 border-slate-50 transition-colors ${prod._id && expandedRow === prod._id ? "bg-slate-50/30" : ""}`}
                  >
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="relative h-12 w-12 rounded-xl overflow-hidden border border-slate-100 bg-slate-50 flex-shrink-0">
                          {prod.primaryImageId &&
                          prod.gallery?.find(
                            (g: any) => g.id === prod.primaryImageId,
                          ) ? (
                            <img
                              src={
                                prod.gallery.find(
                                  (g: any) => g.id === prod.primaryImageId,
                                )
                                  ? prod.gallery.find(
                                      (g: any) => g.id === prod.primaryImageId,
                                    )?.url
                                  : prod.gallery?.[0]?.url
                              }
                              alt={prod.name}
                              className="h-full w-full object-cover"
                            />
                          ) : prod.gallery?.[0]?.url ? (
                            <img
                              src={prod.gallery[0].url}
                              alt={prod.name}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="h-full w-full flex items-center justify-center text-slate-300">
                              <ImageIcon size={20} />
                            </div>
                          )}
                        </div>
                        <div className="flex flex-col">
                          <span className="font-bold text-slate-700 text-sm">
                            {prod.name ?? "Unnamed Product"}
                          </span>
                          <span className="text-xs text-slate-400 font-medium">
                            ${prod.pricing?.price || prod.price || "0"}
                          </span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="font-mono text-xs text-slate-500">
                      {prod.sku}
                    </TableCell>
                    <TableCell>
                      <span
                        className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider ${
                          prod.status === "active"
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-amber-100 text-amber-700"
                        }`}
                      >
                        {prod.status}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 gap-x-2 rounded-lg hover:bg-slate-100 text-slate-500 font-bold text-xs"
                        onClick={() =>
                          prod._id &&
                          setExpandedRow(
                            expandedRow === prod._id ? null : prod._id,
                          )
                        }
                      >
                        {prod.variants?.length || 0} Variations
                        {expandedRow === prod._id ? (
                          <ChevronUp className="h-3 w-3" />
                        ) : (
                          <ChevronDown className="h-3 w-3" />
                        )}
                      </Button>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50"
                          onClick={() =>
                            router.push(`products/${prod._id}/edit`)
                          }
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                          disabled={deletingId === prod._id}
                          onClick={() =>
                            prod._id &&
                            handleDelete(prod._id, prod.name ?? "this product")
                          }
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                  {prod._id &&
                    expandedRow === prod._id &&
                    prod.variants &&
                    prod.variants.length > 0 && (
                      <TableRow className="bg-slate-50/20 hover:bg-slate-50/20">
                        <TableCell
                          colSpan={5}
                          className="p-4 border-b border-slate-50"
                        >
                          <div className="rounded-2xl border border-slate-100 bg-white overflow-hidden shadow-sm">
                            <Table>
                              <TableHeader className="bg-slate-50/50">
                                <TableRow className="hover:bg-transparent border-slate-50">
                                  <TableHead className="text-[9px] font-black uppercase tracking-widest text-slate-400 px-4 py-2">
                                    Variant
                                  </TableHead>
                                  <TableHead className="text-[9px] font-black uppercase tracking-widest text-slate-400 px-4 py-2">
                                    SKU
                                  </TableHead>
                                  <TableHead className="text-[9px] font-black uppercase tracking-widest text-slate-400 px-4 py-2">
                                    Price
                                  </TableHead>
                                  <TableHead className="text-[9px] font-black uppercase tracking-widest text-slate-400 px-4 py-2">
                                    Stock
                                  </TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {prod.variants.map((v: any) => (
                                  <TableRow
                                    key={v._id}
                                    className="border-slate-50 hover:bg-slate-50/30"
                                  >
                                    <TableCell className="text-[11px] font-bold text-slate-600 px-4 py-2">
                                      {v.title}
                                    </TableCell>
                                    <TableCell className="text-[10px] font-mono text-slate-400 px-4 py-2">
                                      {v.sku}
                                    </TableCell>
                                    <TableCell className="text-[11px] font-bold text-slate-700 px-4 py-2">
                                      ${v.price}
                                    </TableCell>
                                    <TableCell className="px-4 py-2">
                                      <span
                                        className={`text-[10px] font-black px-1.5 py-0.5 rounded ${v.stock <= 0 ? "bg-rose-50 text-rose-600" : "bg-slate-100 text-slate-500"}`}
                                      >
                                        {v.stock} pcs
                                      </span>
                                    </TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                </React.Fragment>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div>Loading Page...</div>}>
      <ProductsPageContent />
    </Suspense>
  );
}
