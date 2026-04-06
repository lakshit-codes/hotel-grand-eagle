import React from "react";
import { DollarSign } from "lucide-react";
import { SectionCard, InputLabel, ToggleSwitch } from "./Common";

interface PricingInventoryProps {
  pricing: {
    price: string;
    compareAtPrice: string;
    costPerItem: string;
    chargeTax: boolean;
    trackQuantity: boolean;
  };
  onPricingChange: (field: string, value: any) => void;
}

export function PricingInventory({
  pricing,
  onPricingChange,
}: PricingInventoryProps) {
  return (
    <SectionCard
      icon={<DollarSign className="text-emerald-500" size={16} />}
      title="Pricing & Inventory"
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <InputLabel label="Direct Price" />
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-xs">
              $
            </span>
            <input
              type="number"
              value={pricing?.price}
              onChange={(e) => onPricingChange("price", e.target.value)}
              className="compact-input pl-7"
            />
          </div>
        </div>
        <div>
          <InputLabel label="Compare At" />
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300 font-bold text-xs">
              $
            </span>
            <input
              type="number"
              value={pricing?.compareAtPrice}
              onChange={(e) =>
                onPricingChange("compareAtPrice", e.target.value)
              }
              className="compact-input pl-7 text-slate-400"
            />
          </div>
        </div>
        <div>
          <InputLabel label="Cost Per Item" />
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300 font-bold text-xs">
              $
            </span>
            <input
              type="number"
              value={pricing?.costPerItem}
              onChange={(e) => onPricingChange("costPerItem", e.target.value)}
              className="compact-input pl-7 text-slate-400"
            />
          </div>
        </div>
        <div className="col-span-full flex flex-wrap gap-4">
          <ToggleSwitch
            label="Track Inventory"
            checked={pricing?.trackQuantity}
            onChange={(v) => onPricingChange("trackQuantity", v)}
          />
          <ToggleSwitch
            label="Taxable"
            checked={pricing?.chargeTax}
            onChange={(v) => onPricingChange("chargeTax", v)}
          />
        </div>
      </div>
    </SectionCard>
  );
}
