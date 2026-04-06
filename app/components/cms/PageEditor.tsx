"use client";

import React, { useState } from "react";
import { SectionBlock } from "./SectionBlock";
import { Save, PlusCircle, Settings, Layout, Eye, ArrowLeft } from "lucide-react";
import { Inp, Btn, Toggle } from "../ui";
import type { CMSPage, PageBlock } from "../types";

// Using CMSPage instead of Page from Redux
interface PageEditorProps {
  initialData?: Partial<CMSPage>;
  onSave: (page: Partial<CMSPage>) => Promise<void>;
  isLoading?: boolean;
  onCancel: () => void;
}

export const PageEditor: React.FC<PageEditorProps> = ({
  initialData,
  onSave,
  isLoading = false,
  onCancel
}) => {
  const [page, setPage] = useState<Partial<CMSPage>>({
    title: initialData?.title || "",
    slug: initialData?.slug || "",
    content: initialData?.content ? (typeof initialData.content === 'string' ? [] : initialData.content) : [],
    metaTitle: initialData?.metaTitle || "",
    metaDescription: initialData?.metaDescription || "",
    isPublished: initialData?.isPublished || false,
    id: initialData?.id
  });

  const [activeTab, setActiveTab] = useState<"content" | "settings">("content");

  const addSection = () => {
    const newSection: PageBlock = {
      id: Math.random().toString(36).substr(2, 9),
      type: "section",
      layout: "grid-1",
      adminTitle: "New Section",
      content: [],
      columns: [[]]
    };
    setPage({ ...page, content: [...(page.content as PageBlock[]), newSection] });
  };

  const updateSection = (sectionId: string, updates: any) => {
    setPage({
      ...page,
      content: (page.content as PageBlock[]).map((sec) =>
        sec.id === sectionId ? { ...sec, ...updates } : sec,
      ),
    });
  };

  const removeSection = (sectionId: string) => {
    setPage({
      ...page,
      content: (page.content as PageBlock[]).filter((sec) => sec.id !== sectionId),
    });
  };

  const moveSection = (index: number, direction: "up" | "down") => {
    const newContent = [...(page.content as PageBlock[])];
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newContent.length) return;

    [newContent[index], newContent[targetIndex]] = [
      newContent[targetIndex],
      newContent[index],
    ];
    setPage({ ...page, content: newContent });
  };

  const handleSave = async () => {
    if (!page.title || !page.slug) {
      alert("Please provide a title and slug for the page.");
      return;
    }
    await onSave(page);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      <div className="flex items-center justify-between border-b border-slate-200 pb-6">
        <div className="flex items-center gap-4">
          <button
            className="btn btn-ghost"
            style={{ borderRadius: "50%", padding: "10px" }}
            onClick={onCancel}
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              {initialData?.title ? "Edit Page" : "Create New Page"}
            </h1>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">
              CMS Editor
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 mr-4 bg-slate-50 px-4 py-2 rounded-2xl border border-slate-200">
            <Toggle
              checked={page.isPublished!}
              onChange={(val) => setPage({ ...page, isPublished: val })}
              label={page.isPublished ? "Published" : "Draft"}
            />
          </div>
          <Btn
            variant="outline"
            style={{ borderRadius: "12px", border: "1px solid #e2e8f0", color: "#475569", fontWeight: "bold" }}
            disabled={isLoading}
          >
            <Eye size={16} /> Preview
          </Btn>
          <Btn
            onClick={handleSave}
            disabled={isLoading}
            style={{ background: "#0f172a", color: "#fff", borderRadius: "12px", fontWeight: "bold", padding: "10px 24px", boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)" }}
          >
            {isLoading ? "Saving..." : <><Save size={16} /> {initialData?.title ? "Update Page" : "Save Page"}</>}
          </Btn>
        </div>
      </div>

      <div className="tab-bar" style={{ maxWidth: '400px', height: '48px', padding: '4px', borderRadius: '12px' }}>
        <button
           className={`tab-btn ${activeTab === 'content' ? 'active' : ''}`}
           onClick={() => setActiveTab('content')}
           style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontWeight: 'bold' }}
        >
          <Layout size={16} /> Content
        </button>
        <button
           className={`tab-btn ${activeTab === 'settings' ? 'active' : ''}`}
           onClick={() => setActiveTab('settings')}
           style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontWeight: 'bold' }}
        >
          <Settings size={16} /> SEO & Settings
        </button>
      </div>

      {activeTab === 'content' && (
        <div className="space-y-8 outline-none animate-in fade-in">
          <div className="flex flex-col gap-8">
            <div className="w-full space-y-6">
              <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
                <div className="space-y-4">
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block">
                      Page Title
                    </label>
                    <Inp
                      placeholder="e.g. About Us"
                      value={page.title || ""}
                      onChange={(e) =>
                        setPage({ ...page, title: e.target.value })
                      }
                      style={{ height: '48px', fontSize: '18px', fontWeight: 'bold' }}
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block">
                      Slug Path
                    </label>
                    <div className="flex items-center">
                      <span className="bg-slate-50 border border-r-0 border-slate-200 h-12 px-4 flex items-center text-slate-400 text-sm" style={{ borderRadius: '12px 0 0 12px' }}>
                        /
                      </span>
                      <Inp
                        placeholder="about-us"
                        value={page.slug || ""}
                        onChange={(e) =>
                          setPage({
                            ...page,
                            slug: e.target.value
                              .toLowerCase()
                              .replace(/ /g, "-"),
                          })
                        }
                        style={{ height: '48px', borderRadius: '0 12px 12px 0' }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">
                    Page Blocks
                  </h3>
                  <Btn
                    variant="outline"
                    onClick={addSection}
                    style={{ borderRadius: "12px", border: "1px solid #e2e8f0", color: "#475569" }}
                  >
                    <PlusCircle size={16} /> Add Section
                  </Btn>
                </div>

                {!page.content || page.content.length === 0 ? (
                  <div className="h-64 rounded-3xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-300 gap-4">
                    <Layout size={40} className="opacity-20" />
                    <p className="text-sm font-medium text-slate-400">
                      Your page is empty. Start by adding a section.
                    </p>
                    <Btn
                      variant="outline"
                      onClick={addSection}
                      style={{ borderRadius: "12px", border: "1px solid #e2e8f0", color: "#475569", fontWeight: "bold" }}
                    >
                      Add First Section
                    </Btn>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {(page.content as PageBlock[]).map((section, idx) => (
                      <SectionBlock
                        key={section.id}
                        section={section}
                        onUpdate={(updates) =>
                          updateSection(section.id, updates)
                        }
                        onRemove={() => removeSection(section.id)}
                        onMoveUp={() => moveSection(idx, "up")}
                        onMoveDown={() => moveSection(idx, "down")}
                        isFirst={idx === 0}
                        isLast={idx === (page.content as PageBlock[]).length - 1}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="bg-slate-900 rounded-3xl p-8 text-white shadow-xl shadow-slate-200">
              <h4 className="text-xs font-black uppercase tracking-widest text-slate-500 mb-6">
                Quick Help
              </h4>
              <ul className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
                <li className="flex gap-3">
                  <div className="h-5 w-5 rounded-full bg-slate-800 flex items-center justify-center text-xs text-white flex-shrink-0">
                    1
                  </div>
                  <p className="text-slate-400">
                    Add **Sections** to organize your page layout.
                  </p>
                </li>
                <li className="flex gap-3">
                  <div className="h-5 w-5 rounded-full bg-slate-800 flex items-center justify-center text-xs text-white flex-shrink-0">
                    2
                  </div>
                  <p className="text-slate-400">
                    Inside each section, add **Content Blocks** like headings
                    or images.
                  </p>
                </li>
                <li className="flex gap-3">
                  <div className="h-5 w-5 rounded-full bg-slate-800 flex items-center justify-center text-xs text-white flex-shrink-0">
                    3
                  </div>
                  <p className="text-slate-400">
                    Use the arrows on the top-right of each block to reorder.
                  </p>
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'settings' && (
        <div className="space-y-8 outline-none animate-in fade-in">
          <div className="max-w-2xl bg-white rounded-3xl border border-slate-200 p-8 shadow-sm space-y-6">
            <h3 className="text-lg font-bold text-slate-900 mb-2">
              Search Engine Optimization (SEO)
            </h3>
            <div className="space-y-4">
              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block">
                  Meta Title
                </label>
                <Inp
                  placeholder="Page title as it appears in search results"
                  value={page.metaTitle || ""}
                  onChange={(e) =>
                    setPage({ ...page, metaTitle: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block">
                  Meta Description
                </label>
                <textarea
                  placeholder="A short summary of the page for search engines"
                  value={page.metaDescription || ""}
                  onChange={(e) =>
                    setPage({ ...page, metaDescription: e.target.value })
                  }
                  className="textarea min-h-[120px]"
                  style={{ width: '100%' }}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
