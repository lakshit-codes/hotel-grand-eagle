"use client";

import React, { useEffect, useMemo, useState } from "react";
import { ArrowLeft, Eye, Package, Save } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";

import {
  setProductFormField,
  resetProductForm,
  setPricingField,
  setCurrentProduct,
} from "@/lib/store/products/productsSlices";
import { saveProduct } from "@/lib/store/products/productsThunk";
import { fetchCategories } from "@/lib/store/categories/categoriesThunk";

import {
  VariantRow,
  slugify,
  sanitizeKey,
  buildCombinationTitle,
  buildVariantCombinations,
  readFileAsDataUrl,
  generateSKUWithBaseSKU,
} from "@/lib/admin-products/utils";

import { GeneralInformation } from "./studio/GeneralInformation";
import { PricingInventory } from "./studio/PricingInventory";
import { VisualMedia } from "./studio/VisualMedia";
import { OptionConfiguration } from "./studio/OptionConfiguration";
import { VariantMatrix } from "./studio/VariantMatrix";
import { PublicationSidebar } from "./studio/PublicationSidebar";
import { useToast } from "@/hooks/useToast";
import { Toast } from "./studio/Toast";
import { AppDispatch, RootState } from "@/lib/store/store";
import { useSelector } from "react-redux";
import { useParams, useRouter } from "next/navigation";

export function ProductStudio() {
  const router = useRouter();
  const params: { id: string } = useParams();

  const editId = params.id ? params.id : null;
  const dispatch = useAppDispatch();
  const isEditing = Boolean(editId);

  const onClose = () => {
    router.back();
  };

  const { allCategories } = useSelector(
    (state: RootState) => state.adminCategories,
  );
  const { allattributes } = useSelector(
    (state: RootState) => state.adminAttributes,
  );

  const {
    allProducts,
    currentProduct: form,
    saving,
    loading: productLoading,
  } = useSelector((state: RootState) => state.adminProducts);

  const [loading, setLoading] = useState(true);
  const [galleryUrlDraft, setGalleryUrlDraft] = useState("");
  const [productSlug, setProductSlug] = useState("");

  const relatedProductCandidates = useMemo(
    () => allProducts.filter((item: any) => item._id !== editId),
    [allProducts, editId],
  );

  const { toast, showToast } = useToast();

  // Initial Load
  useEffect(() => {
    const init = async () => {
      setLoading(true);
      try {
        if (isEditing && editId && allProducts.length > 0) {
          const singleProduct = allProducts.find(
            (item: any) => item._id === editId,
          );
          if (singleProduct) {
            dispatch(setCurrentProduct(singleProduct));
            setProductSlug(singleProduct.slug || "");
          }
        } else {
          dispatch(resetProductForm());
          setProductSlug("");
        }
      } catch (err) {
        console.error("Failed to load initial data", err);
      } finally {
        setLoading(false);
      }
    };
    init();
  }, [editId, allProducts, isEditing, dispatch]);

  const handleSave = async () => {
    if (!form) return;
    if (!form.name.trim() || !form.sku.trim())
      return showToast("Name and SKU required", "error");

    const payload = {
      ...form,
      name: form.name.trim(),
      sku: form.sku.trim(),
      slug: productSlug.trim(),
      price: Number(form.pricing.price || 0),
      pricing: {
        ...form.pricing,
        price: Number(form.pricing.price || 0),
        compareAtPrice: Number(form.pricing.compareAtPrice || 0),
        costPerItem: Number(form.pricing.costPerItem || 0),
      },
      variants: form.variants.map((v: any) => ({
        ...v,
        price: Number(v.price || form.pricing.price || 0),
        stock: Number(v.stock || 0),
      })),
    };

    try {
      const action: any = await dispatch(
        saveProduct({ id: editId || undefined, payload }),
      );
      if (saveProduct.fulfilled.match(action)) {
        showToast(isEditing ? "Updated successfully" : "Created successfully");
        setTimeout(() => onClose(), 1500);
      } else {
        showToast(action.payload || "Failed to save", "error");
      }
    } catch (e) {
      showToast("An error occurred", "error");
    }
  };

  const regenerateVariants = () => {
    if (!form) return;
    const combos = buildVariantCombinations(form.options);
    const nextVariants: VariantRow[] = combos.map((combo, index) => {
      const existing = form.variants.find((v: any) =>
        Object.entries(combo).every(
          ([key, val]) => v.optionValues[key] === val,
        ),
      );

      return {
        _id: existing?._id || `v-${index}-${Date.now()}`,
        title:
          existing?.title ||
          buildCombinationTitle(combo) ||
          `Variant ${index + 1}`,
        optionValues: combo,
        sku: existing?.sku || generateSKUWithBaseSKU(form.sku, combo),
        price: existing?.price || form.pricing.price,
        stock: existing?.stock || "0",
        productId: existing?.productId || "",
        status: existing?.status || "active",
        createdAt: existing?.createdAt || "",
      };
    });

    dispatch(setProductFormField({ field: "variants", value: nextVariants }));
    showToast(`Generated ${nextVariants.length} variants`);
  };

  const toggleAttributeSet = (id: string) => {
    if (!form) return;
    const isRemoving = form.attributeSetIds.includes(id);
    const nextIds = isRemoving
      ? form.attributeSetIds.filter((i: string) => i !== id)
      : [...form.attributeSetIds, id];

    const nextOptions = isRemoving
      ? form.options.filter((o: any) => o.attributeSetId !== id)
      : [
          ...form.options,
          ...(
            allattributes.find((s: any) => (s.key || s._id) === id)
              ?.attributes || []
          )
            .filter((a: any) => a.enabled !== false)
            .map((a: any) => ({
              key: sanitizeKey(a.key || a.label || ""),
              label: a.label || a.key || "Option",
              values: a.options || [],
              selectedValues: [],
              useForVariants: false,
              draftValue: "",
              attributeSetId: id,
            })),
        ];

    dispatch(setProductFormField({ field: "attributeSetIds", value: nextIds }));
    dispatch(setProductFormField({ field: "options", value: nextOptions }));
    dispatch(setProductFormField({ field: "variants", value: [] }));
  };

  const toggleCategory = (slug: string) => {
    if (!form) return;
    const exists = form.categoryIds.includes(slug);
    const nextIds = exists
      ? form.categoryIds.filter((i: string) => i !== slug)
      : [...form.categoryIds, slug];

    dispatch(setProductFormField({ field: "categoryIds", value: nextIds }));

    if (exists && form.primaryCategoryId === slug) {
      dispatch(setProductFormField({ field: "primaryCategoryId", value: "" }));
    } else if (!exists && nextIds.length === 1) {
      dispatch(
        setProductFormField({ field: "primaryCategoryId", value: slug }),
      );
    }
  };

  const addOptionValue = (idx: number) => {
    if (!form) return;
    const opt = form.options[idx];
    if (!opt.draftValue.trim()) return;
    const next = [...form.options];
    next[idx] = {
      ...opt,
      values: [...opt.values, opt.draftValue.trim()],
      draftValue: "",
    };
    dispatch(setProductFormField({ field: "options", value: next }));
  };

  if (loading || productLoading || !form)
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-slate-900" />
      </div>
    );

  return (
    <div className="mx-auto max-w-7xl px-4 py-4 space-y-4 animate-in fade-in duration-500 bg-slate-50/30 rounded-3xl border border-slate-100 shadow-2xl shadow-slate-200/50">
      <Toast toast={toast} />

      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <button
            onClick={onClose}
            className="p-2 bg-white border border-slate-200 rounded-xl text-slate-500 hover:bg-slate-50 transition-all shadow-sm"
          >
            <ArrowLeft size={16} />
          </button>
          <div>
            <div className="text-lg font-bold text-slate-900 tracking-tight">
              {isEditing ? "Edit Product" : "New Creation"}
            </div>
            <div className="flex items-center gap-1.5 text-slate-400">
              <Package size={12} />
              <span className="text-[10px] font-bold uppercase tracking-wider">
                {form.sku || "Generating Identity"}
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white border border-slate-200 text-slate-600 text-xs font-bold hover:bg-slate-50 transition-all shadow-sm disabled:opacity-50"
          >
            <Eye size={14} />
            Preview
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-1.5 px-6 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition-all shadow-lg disabled:opacity-60"
          >
            {saving ? (
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-slate-400 border-t-white" />
            ) : (
              <Save size={14} />
            )}
            <span>{isEditing ? "Update" : "Launch"}</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 pb-12">
        {/* Main Column */}
        <div className="lg:col-span-8 space-y-4">
          <GeneralInformation
            name={form.name}
            sku={form.sku}
            slug={productSlug}
            description={form.description}
            onFormChange={(field, value) =>
              dispatch(setProductFormField({ field: field as any, value }))
            }
            onSlugChange={setProductSlug}
          />

          <PricingInventory
            pricing={form.pricing}
            onPricingChange={(field, value) =>
              dispatch(setPricingField({ field: field as any, value }))
            }
          />

          <VisualMedia
            gallery={form.gallery}
            primaryImageId={form.primaryImageId}
            galleryUrlDraft={galleryUrlDraft}
            onGalleryChange={(gallery) =>
              dispatch(
                setProductFormField({ field: "gallery", value: gallery }),
              )
            }
            onPrimaryImageChange={(id) =>
              dispatch(
                setProductFormField({ field: "primaryImageId", value: id }),
              )
            }
            onGalleryUrlDraftChange={setGalleryUrlDraft}
            onAddGalleryItem={(item) => {
              dispatch(
                setProductFormField({
                  field: "gallery",
                  value: [...form.gallery, item],
                }),
              );
              if (!form.primaryImageId) {
                dispatch(
                  setProductFormField({
                    field: "primaryImageId",
                    value: item.id,
                  }),
                );
              }
            }}
          />

          <OptionConfiguration
            attributeSetIds={form.attributeSetIds}
            options={form.options}
            onToggleAttributeSet={toggleAttributeSet}
            onOptionChange={(idx, opt) => {
              const next = [...form.options];
              next[idx] = opt;
              dispatch(setProductFormField({ field: "options", value: next }));
            }}
            onAddOptionValue={addOptionValue}
            onRegenerateVariants={regenerateVariants}
          />

          <VariantMatrix
            variants={form.variants}
            onVariantsChange={(variants) =>
              dispatch(
                setProductFormField({ field: "variants", value: variants }),
              )
            }
          />
        </div>

        {/* Sidebar Column */}
        <div className="lg:col-span-4">
          <PublicationSidebar
            status={form.status}
            templateKey={form.templateKey}
            allCategories={allCategories}
            categoryIds={form.categoryIds}
            primaryCategoryId={form.primaryCategoryId}
            relatedProductCandidates={relatedProductCandidates}
            relatedProductIds={form.relatedProductIds}
            onFormChange={(field, value) =>
              dispatch(setProductFormField({ field: field as any, value }))
            }
            onToggleCategory={toggleCategory}
            onToggleRelatedProduct={(id) =>
              dispatch(
                setProductFormField({
                  field: "relatedProductIds",
                  value: form.relatedProductIds.includes(id)
                    ? form.relatedProductIds.filter((rid: string) => rid !== id)
                    : [...form.relatedProductIds, id],
                }),
              )
            }
          />
        </div>
      </div>

      <style jsx global>{`
        .compact-input {
          width: 100%;
          padding: 8px 12px;
          border-radius: 12px;
          background: #ffffff;
          border: 1px solid #e2e8f0;
          color: #334155;
          font-size: 13px;
          font-weight: 500;
          transition: all 0.15s ease;
        }
        .compact-input:focus {
          outline: none;
          border-color: #94a3b8;
          background: #f8fafc;
          box-shadow: 0 0 0 3px rgba(226, 232, 240, 0.4);
        }
        .compact-input::placeholder {
          color: #cbd5e1;
          font-weight: 400;
          font-size: 12px;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #f1f5f9;
          border-radius: 10px;
        }
      `}</style>
    </div>
  );
}
