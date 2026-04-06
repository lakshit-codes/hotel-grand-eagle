import React from "react";
import { Info } from "lucide-react";
import { SectionCard, InputLabel } from "./Common";
import { slugify } from "@/lib/admin-products/utils";

interface GeneralInformationProps {
  name: string;
  sku: string;
  slug: string;
  description: string;
  onFormChange: (field: string, value: string) => void;
  onSlugChange: (slug: string) => void;
}

export function GeneralInformation({
  name,
  sku,
  slug,
  description,
  onFormChange,
  onSlugChange,
}: GeneralInformationProps) {
  return (
    <SectionCard
      icon={<Info className="text-blue-500" size={16} />}
      title="General Information"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="col-span-1">
          <InputLabel label="Product Name" />
          <input
            value={name}
            onChange={(e) => onFormChange("name", e.target.value)}
            onBlur={() => !slug && onSlugChange(slugify(name))}
            placeholder="e.g. Premium Rubber Tire"
            className="compact-input"
          />
        </div>
        <div className="col-span-1">
          <InputLabel label="SKU Identifer" />
          <input
            value={sku}
            onChange={(e) => onFormChange("sku", e.target.value.toUpperCase())}
            placeholder="e.g. TIRE-102"
            className="compact-input font-mono"
          />
        </div>
        <div className="col-span-2">
          <InputLabel label="URL Slug" />
          <div className="flex items-center">
            <div className="px-3 py-2 bg-slate-50 border border-r-0 border-slate-200 rounded-l-xl text-slate-400 text-[10px] font-mono">
              /product/
            </div>
            <input
              value={slug}
              onChange={(e) => onSlugChange(slugify(e.target.value))}
              className="compact-input rounded-l-none flex-1 font-mono text-blue-600"
            />
          </div>
        </div>
        <div className="col-span-2">
          <InputLabel label="Description" />
          <textarea
            value={description}
            onChange={(e) => onFormChange("description", e.target.value)}
            rows={3}
            placeholder="Detailed product Story..."
            className="compact-input resize-none"
          />
        </div>
      </div>
    </SectionCard>
  );
}
