"use client";

import { useEffect, useMemo, useState } from "react";
import {
  ListFilter,
  Plus,
  Pencil,
  Trash2,
  Save,
  X,
  Circle,
  CheckCircle2,
  Upload,
} from "lucide-react";
import { ImportModal } from "@/components/admin/ImportModal";
import { Button } from "@/components/ui/button";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/lib/store/store";
import {
  createAttributeSet,
  deleteAttributeSet,
  updateAttributeSet,
  bulkImportAttributes,
  fetchAttributes,
} from "@/lib/store/attributes/attributesThunk";

type AttributeFieldDraft = {
  key: string;
  label: string;
  type: string;
  options: string;
  enabled: boolean;
};

type AttributeSetDraft = {
  name: string;
  key: string;
  appliesTo: string;
  contexts: string;
  description: string;
  attributes: AttributeFieldDraft[];
};

type AttributeSetRecord = {
  _id: string;
  name: string;
  key?: string;
  appliesTo?: string;
  contexts?: string[];
  description?: string;
  attributes?: Array<{
    key?: string;
    label?: string;
    type?: string;
    options?: string[];
    enabled?: boolean;
  }>;
};

function createEmptyField(): AttributeFieldDraft {
  return {
    key: "",
    label: "",
    type: "select",
    options: "",
    enabled: true,
  };
}

function createEmptyDraft(): AttributeSetDraft {
  return {
    name: "",
    key: "",
    appliesTo: "product",
    contexts: "",
    description: "",
    attributes: [createEmptyField()],
  };
}

function fromRecord(record: AttributeSetRecord): AttributeSetDraft {
  return {
    name: record.name || "",
    key: record.key || "",
    appliesTo: record.appliesTo || "product",
    contexts: Array.isArray(record.contexts) ? record.contexts.join(", ") : "",
    description: record.description || "",
    attributes:
      Array.isArray(record.attributes) && record.attributes.length > 0
        ? record.attributes.map((attribute) => ({
            key: attribute.key || "",
            label: attribute.label || "",
            type: attribute.type || "select",
            options: Array.isArray(attribute.options)
              ? attribute.options.join(", ")
              : "",
            enabled: attribute.enabled !== false,
          }))
        : [createEmptyField()],
  };
}

function toPayload(draft: AttributeSetDraft) {
  return {
    name: draft.name.trim(),
    key: draft.key.trim(),
    appliesTo: draft.appliesTo,
    contexts: draft.contexts
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean),
    description: draft.description.trim(),
    attributes: draft.attributes
      .map((attribute) => ({
        key: attribute.key.trim(),
        label: attribute.label.trim(),
        type: attribute.type || "select",
        options: attribute.options
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean),
        enabled: attribute.enabled,
      }))
      .filter((attribute) => attribute.key && attribute.label),
  };
}

export default function AttributesPage() {
  const { allattributes: records, attributeLoading: loading } = useSelector(
    (state: RootState) => state.adminAttributes,
  );
  const dispatch = useDispatch<AppDispatch>();
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [toast, setToast] = useState("");
  const [showImportModal, setShowImportModal] = useState(false);
  const [form, setForm] = useState<AttributeSetDraft>(createEmptyDraft());

  const filtered = useMemo(() => {
    const keyword = search.toLowerCase().trim();
    if (!keyword) return records;
    return records.filter(
      (r) =>
        r.name.toLowerCase().includes(keyword) ||
        r.key?.toLowerCase().includes(keyword),
    );
  }, [records, search]);

  const showToast = (message: string) => {
    setToast(message);
    setTimeout(() => setToast(""), 2200);
  };

  const resetForm = () => {
    setForm(createEmptyDraft());
    setEditingId(null);
    setShowForm(false);
  };

  const handleEdit = (record: AttributeSetRecord) => {
    setForm(fromRecord(record));
    setEditingId(record._id);
    setShowForm(true);
  };

  const handleSave = async () => {
    const payload = toPayload(form);
    if (!payload.name || payload.attributes.length === 0) {
      showToast("Name and at least one attribute are required.");
      return;
    }

    setSaving(true);
    let resultAction;
    if (editingId) {
      resultAction = await dispatch(
        updateAttributeSet({ id: editingId, payload }),
      );
    } else {
      resultAction = await dispatch(createAttributeSet(payload));
    }
    setSaving(false);

    if (
      createAttributeSet.fulfilled.match(resultAction) ||
      updateAttributeSet.fulfilled.match(resultAction)
    ) {
      showToast(
        editingId ? "Attribute set updated!" : "Attribute set created!",
      );
      resetForm();
    } else {
      showToast(
        (resultAction.payload as any)?.message ||
          "Failed to save attribute set.",
      );
    }
  };

  const handleDelete = async (record: AttributeSetRecord) => {
    if (!confirm(`Delete attribute set "${record.name}"?`)) return;
    const resultAction = await dispatch(deleteAttributeSet(record._id));
    if (deleteAttributeSet.fulfilled.match(resultAction)) {
      showToast("Attribute set deleted!");
    } else {
      showToast(
        (resultAction.payload as any)?.message ||
          "Failed to delete attribute set.",
      );
    }
  };
  const handleImport = async (data: any[]) => {
    const resultAction = await dispatch(bulkImportAttributes(data));
    if (bulkImportAttributes.fulfilled.match(resultAction)) {
      showToast("Attributes imported successfully!");
    } else {
      showToast((resultAction.payload as any)?.message || "Import failed");
    }
  };

  const attributeSampleData = [
    {
      name: "Vehicle Details",
      key: "vehicle-details",
      appliesTo: "product",
      description: "Attributes specifically for car and bike listings.",
      contexts: ["automotive"],
      attributes: [
        {
          key: "fuel-type",
          label: "Fuel Type",
          type: "select",
          options: ["Petrol", "Diesel", "Electric"],
          enabled: true,
        },
        {
          key: "transmission",
          label: "Transmission",
          type: "select",
          options: ["Manual", "Automatic"],
          enabled: true,
        },
      ],
    },
  ];

  const updateAttribute = (
    index: number,
    patch: Partial<AttributeFieldDraft>,
  ) => {
    setForm((prev) => ({
      ...prev,
      attributes: prev.attributes.map((a, i) =>
        i === index ? { ...a, ...patch } : a,
      ),
    }));
  };

  const removeAttribute = (index: number) => {
    setForm((prev) => ({
      ...prev,
      attributes: prev.attributes.filter((_, i) => i !== index),
    }));
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 p-8">
      {toast && (
        <div className="fixed right-4 top-4 z-50 rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground shadow-lg">
          {toast}
        </div>
      )}

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-primary/30 bg-primary/10 text-primary">
            <ListFilter size={20} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              Attribute Sets
            </h1>
            <p className="text-xs text-muted-foreground">
              Manage attribute sets for products and variants.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => setShowImportModal(true)}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 px-4 py-2 text-sm font-bold"
          >
            <Upload size={14} /> Import JSON
          </Button>
          <ImportModal
            isOpen={showImportModal}
            onClose={() => setShowImportModal(false)}
            onImport={handleImport}
            sampleData={attributeSampleData}
            title="Import Attribute Sets"
            description="Upload a JSON file containing attribute set records. Existing keys will be skipped."
            fileName="attributes"
          />
          <button
            onClick={() => {
              setForm(createEmptyDraft());
              setEditingId(null);
              setShowForm(true);
            }}
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-bold text-primary-foreground hover:bg-primary/90"
          >
            <Plus size={14} /> New Set
          </button>
        </div>
      </div>

      <div className="max-w-md">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search attributes..."
          className="w-full rounded-lg border border-border bg-background shadow-xs px-3 py-2 text-sm text-foreground"
        />
      </div>

      {showForm && (
        <section className="rounded-xl border border-border bg-card p-5 mt-4">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-sans text-sm font-bold uppercase tracking-wider text-foreground">
              {editingId ? "Edit Attribute Set" : "Create Attribute Set"}
            </h2>
            <button
              onClick={resetForm}
              className="rounded-md p-1 text-muted-foreground hover:bg-muted/50 "
            >
              <X size={14} />
            </button>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div>
              <label className="mb-1 block text-[10px] uppercase tracking-widest text-muted-foreground">
                Name
              </label>
              <input
                value={form.name}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, name: e.target.value }))
                }
                className="w-full rounded-lg border border-border bg-background shadow-xs px-3 py-2 text-sm text-foreground"
                placeholder="Name"
              />
            </div>
            <div>
              <label className="mb-1 block text-[10px] uppercase tracking-widest text-muted-foreground">
                Key
              </label>
              <input
                value={form.key}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, key: e.target.value }))
                }
                className="w-full rounded-lg border border-border bg-background shadow-xs px-3 py-2 text-sm font-mono text-foreground"
                placeholder="key"
              />
            </div>
          </div>

          <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
            <input
              value={form.description}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, description: e.target.value }))
              }
              className="w-full rounded-lg border border-border bg-background shadow-xs px-3 py-2 text-sm text-foreground"
              placeholder="Optional Description"
            />
            <input
              value={form.contexts}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, contexts: e.target.value }))
              }
              className="w-full rounded-lg border border-border bg-background shadow-xs px-3 py-2 text-sm text-foreground"
              placeholder="Contexts (comma separated)"
            />
          </div>

          <div className="mt-5 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-sans text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                Attributes
              </h3>
              <button
                onClick={() =>
                  setForm((prev) => ({
                    ...prev,
                    attributes: [...prev.attributes, createEmptyField()],
                  }))
                }
                className="inline-flex items-center gap-1 rounded-lg border border-secondary/30 bg-secondary/10 px-3 py-1.5 text-xs font-semibold text-secondary"
              >
                <Plus size={12} /> Add Field
              </button>
            </div>

            {form.attributes.map((attribute, index) => (
              <div
                key={`${index}`}
                className="grid grid-cols-1 gap-2 rounded-lg border border-border bg-background shadow-xs p-3 md:grid-cols-12"
              >
                <input
                  value={attribute.key}
                  onChange={(e) =>
                    updateAttribute(index, { key: e.target.value })
                  }
                  placeholder="key"
                  className="rounded-lg border border-border bg-background shadow-xs px-3 py-2 text-xs text-foreground md:col-span-2"
                />
                <input
                  value={attribute.label}
                  onChange={(e) =>
                    updateAttribute(index, { label: e.target.value })
                  }
                  placeholder="label"
                  className="rounded-lg border border-border bg-background shadow-xs px-3 py-2 text-xs text-foreground md:col-span-3"
                />
                <select
                  value={attribute.type}
                  onChange={(e) =>
                    updateAttribute(index, { type: e.target.value })
                  }
                  className="rounded-lg border border-border bg-background shadow-xs px-3 py-2 text-xs text-foreground md:col-span-2"
                >
                  <option value="select">Select</option>
                  <option value="multiselect">Multi Select</option>
                  <option value="text">Text</option>
                  <option value="number">Number</option>
                  <option value="boolean">Boolean</option>
                </select>
                <input
                  value={attribute.options}
                  onChange={(e) =>
                    updateAttribute(index, { options: e.target.value })
                  }
                  placeholder="Options (comma separated)"
                  className="rounded-lg border border-border bg-background shadow-xs px-3 py-2 text-xs text-foreground md:col-span-4"
                />
                <button
                  onClick={() => removeAttribute(index)}
                  className="rounded-lg border border-rose-500/30 bg-rose-500/10 px-2 py-2 text-rose-300 md:col-span-1 flex justify-center"
                >
                  <Trash2 size={12} />
                </button>
              </div>
            ))}
          </div>

          <div className="mt-4">
            <button
              onClick={handleSave}
              disabled={saving}
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-60"
            >
              <Save size={14} />{" "}
              {saving ? "Saving..." : editingId ? "Update Set" : "Create Set"}
            </button>
          </div>
        </section>
      )}

      {loading ? (
        <div className="py-16 text-center text-sm text-muted-foreground">
          Loading attribute sets...
        </div>
      ) : filtered.length === 0 ? (
        <div className="py-16 text-center text-sm text-muted-foreground">
          No attribute sets found.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 mt-4">
          {filtered.map((record) => (
            <article
              key={record._id}
              className="rounded-xl border border-border bg-card shadow-sm p-4 hover:shadow-md"
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-sans text-sm font-semibold text-foreground">
                    {record.name}
                  </h3>
                  <p className="text-[11px] text-muted-foreground font-mono">
                    {record.key || "no-key"} | {record.attributes?.length || 0}{" "}
                    attributes
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(record)}
                    className="rounded-md p-1.5 text-muted-foreground hover:bg-muted/50 hover:text-primary"
                  >
                    <Pencil size={13} />
                  </button>
                  <button
                    onClick={() => handleDelete(record)}
                    className="rounded-md p-1.5 text-muted-foreground hover:bg-muted/50 hover:text-rose-300"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
              <div className="space-y-1 text-xs text-muted-foreground mt-3">
                {(record.attributes || []).slice(0, 3).map((a, i) => (
                  <div
                    key={i}
                    className="flex justify-between border-b border-border/60 py-1"
                  >
                    <span>{a.label}</span>
                    <span className="text-[10px] text-muted-foreground">
                      {a.type}
                    </span>
                  </div>
                ))}
                {(record.attributes || []).length > 3 && (
                  <p className="pt-1 text-[11px] text-muted-foreground">
                    + {(record.attributes || []).length - 3} more fields
                  </p>
                )}
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
