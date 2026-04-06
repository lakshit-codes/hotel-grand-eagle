import React from "react";
import { Settings, ShoppingBag, Sparkles, Check, Package } from "lucide-react";
import { SectionCard, InputLabel } from "./Common";
import {
  PRODUCT_TEMPLATE_OPTIONS,
  normalizeProductTemplateKey,
} from "@/lib/commerce-template-options";

interface PublicationSidebarProps {
  status: string;
  templateKey: string;
  allCategories: any[];
  categoryIds: string[];
  primaryCategoryId: string;
  relatedProductCandidates: any[];
  relatedProductIds: string[];
  onFormChange: (field: string, value: any) => void;
  onToggleCategory: (slug: string) => void;
  onToggleRelatedProduct: (id: string) => void;
}

export function PublicationSidebar({
  status,
  templateKey,
  allCategories,
  categoryIds,
  primaryCategoryId,
  relatedProductCandidates,
  relatedProductIds,
  onFormChange,
  onToggleCategory,
  onToggleRelatedProduct,
}: PublicationSidebarProps) {
  // Helper to build hierarchy
  const buildTree = (
    nodes: any[],
    parentId: string | null = null,
    level = 0,
  ): any[] => {
    return nodes
      .filter((node) => node.parentId === parentId)
      .reduce((acc, node) => {
        return [
          ...acc,
          { ...node, level },
          ...buildTree(nodes, node._id, level + 1),
        ];
      }, []);
  };

  const hierarchicalCategories = buildTree(allCategories);

  return (
    <div className="space-y-4">
      <SectionCard
        icon={<Settings className="text-slate-400" size={16} />}
        title="Publication"
      >
        <div className="space-y-4">
          <div>
            <InputLabel label="Asset Status" />
            <div className="grid grid-cols-3 gap-2">
              {["draft", "active", "archived"].map((st) => (
                <button
                  type="button"
                  key={st}
                  onClick={() => onFormChange("status", st)}
                  className={`py-1.5 rounded-lg text-[9px] font-black uppercase tracking-wider transition-all border ${
                    status === st
                      ? "bg-slate-900 border-slate-900 text-white shadow-sm shadow-slate-200"
                      : "bg-white border-slate-200 text-slate-400 hover:border-slate-300"
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>
          <div>
            <InputLabel label="Visual Template" />
            <div className="relative">
              <select
                value={templateKey}
                onChange={(e) =>
                  onFormChange(
                    "templateKey",
                    normalizeProductTemplateKey(e.target.value),
                  )
                }
                className="compact-input appearance-none text-slate-700 font-bold pr-8"
              >
                {PRODUCT_TEMPLATE_OPTIONS.map((opt) => (
                  <option key={opt.key} value={opt.key}>
                    {opt.label}
                  </option>
                ))}
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                <Settings size={12} />
              </div>
            </div>
          </div>
        </div>
      </SectionCard>

      <SectionCard
        icon={<ShoppingBag className="text-pink-400" size={16} />}
        title="Organization"
      >
        <div className="space-y-4">
          <div>
            <InputLabel label="Categories" />
            <div className="space-y-1 max-h-[300px] overflow-y-auto pr-1 flex flex-col gap-1">
              {hierarchicalCategories.map((cat) => {
                const selected = categoryIds.includes(cat.slug);
                return (
                  <div
                    key={cat._id}
                    onClick={() => onToggleCategory(cat.slug)}
                    className={`group flex items-center justify-between p-2 rounded-xl border transition-all cursor-pointer ${
                      selected
                        ? "bg-blue-50/50 border-blue-200"
                        : "bg-white border-slate-100 hover:border-slate-200"
                    }`}
                    style={{ marginLeft: `${cat.level * 16}px` }}
                  >
                    <div>
                      <div
                        className={`text-[11px] font-bold ${selected ? "text-blue-700" : "text-slate-700"}`}
                      >
                        {cat.name}
                      </div>
                      <div className="text-[8px] text-slate-400 font-mono">
                        /{cat.slug}
                      </div>
                    </div>
                    <div
                      className={`h-4 w-4 rounded-md border flex items-center justify-center transition-all ${selected ? "bg-blue-600 border-blue-600 text-white" : "border-slate-200"}`}
                    >
                      {selected && <Check size={10} strokeWidth={3} />}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {categoryIds.length > 0 && (
            <div>
              <InputLabel label="Primary Category" />
              <div className="relative">
                <select
                  value={primaryCategoryId}
                  onChange={(e) =>
                    onFormChange("primaryCategoryId", e.target.value)
                  }
                  className="compact-input appearance-none text-slate-700 font-bold pr-8"
                >
                  <option value="">Select Primary Category</option>
                  {allCategories
                    .filter((cat) => categoryIds.includes(cat.slug))
                    .map((cat) => (
                      <option key={cat._id} value={cat.slug}>
                        {cat.name}
                      </option>
                    ))}
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                  <ShoppingBag size={12} />
                </div>
              </div>
            </div>
          )}
        </div>
      </SectionCard>

      <SectionCard
        icon={<Sparkles className="text-amber-400" size={16} />}
        title="Cross-Sells"
      >
        <div className="space-y-2 max-h-[250px] overflow-y-auto pr-1 flex flex-col gap-1">
          {relatedProductCandidates.map((prod) => {
            const selected = relatedProductIds.includes(prod._id);
            return (
              <div
                key={prod._id}
                onClick={() => onToggleRelatedProduct(prod._id)}
                className={`p-2 rounded-xl border transition-all cursor-pointer flex items-center gap-2 ${selected ? "bg-emerald-50 border-emerald-200" : "bg-white border-slate-100"}`}
              >
                <div
                  className={`w-6 h-6 rounded-md flex items-center justify-center ${selected ? "bg-emerald-100 text-emerald-600" : "bg-slate-100 text-slate-400"}`}
                >
                  <Package size={10} />
                </div>
                <div className="flex-1 overflow-hidden">
                  <div
                    className={`text-[10px] font-bold truncate ${selected ? "text-emerald-700" : "text-slate-700"}`}
                  >
                    {prod.name}
                  </div>
                  <div className="text-[8px] text-slate-400 font-mono tracking-tighter">
                    {prod.sku}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </SectionCard>
    </div>
  );
}
