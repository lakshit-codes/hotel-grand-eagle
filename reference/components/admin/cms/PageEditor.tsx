"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SectionBlock } from "./SectionBlock";
import {
  Save,
  PlusCircle,
  Settings,
  Layout,
  Eye,
  ArrowLeft,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Page, PageBlock } from "@/lib/store/pages/pageType";

import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface PageEditorProps {
  initialData?: Page;
  onSave: (page: Page) => Promise<void>;
  isLoading?: boolean;
}

export const PageEditor: React.FC<PageEditorProps> = ({
  initialData,
  onSave,
  isLoading = false,
}) => {
  const router = useRouter();
  const [page, setPage] = useState<Page>(
    initialData || {
      title: "",
      slug: "",
      content: [],
      metaTitle: "",
      metaDescription: "",
      isPublished: false,
    },
  );

  const addSection = () => {
    const newSection: PageBlock = {
      id: Math.random().toString(36).substr(2, 9),
      type: "section",
      layout: "grid-1",
      adminTitle: "New Section",
      content: [],
    };
    setPage({ ...page, content: [...page.content, newSection] });
  };

  const updateSection = (sectionId: string, updates: any) => {
    setPage({
      ...page,
      content: page.content.map((sec) =>
        sec.id === sectionId ? { ...sec, ...updates } : sec,
      ),
    });
  };

  const removeSection = (sectionId: string) => {
    setPage({
      ...page,
      content: page.content.filter((sec) => sec.id !== sectionId),
    });
  };

  const moveSection = (index: number, direction: "up" | "down") => {
    const newContent = [...page.content];
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
      toast.error("Please provide a title and slug for the page.");
      return;
    }
    await onSave(page);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      <div className="flex items-center justify-between border-b border-slate-100 pb-6">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            className="h-10 w-10 rounded-full hover:bg-slate-100"
            onClick={() => router.back()}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              {initialData ? "Edit Page" : "Create New Page"}
            </h1>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">
              CMS Editor
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 mr-4 bg-slate-50 px-4 py-2 rounded-2xl border border-slate-100">
            <Label
              htmlFor="publish-toggle"
              className="text-xs font-black uppercase tracking-widest text-slate-500 cursor-pointer"
            >
              {page.isPublished ? "Published" : "Draft"}
            </Label>
            <Switch
              id="publish-toggle"
              checked={page.isPublished}
              onCheckedChange={(val: boolean) =>
                setPage({ ...page, isPublished: val })
              }
            />
          </div>
          <Button
            variant="outline"
            className="rounded-xl border-slate-200 text-slate-600 hover:bg-slate-50 gap-2 font-bold px-5"
            disabled={isLoading}
          >
            <Eye className="h-4 w-4" /> Preview
          </Button>
          <Button
            className="rounded-xl bg-slate-900 text-white hover:bg-slate-800 gap-2 shadow-lg shadow-slate-200 px-6 font-bold"
            onClick={handleSave}
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            {initialData ? "Update Page" : "Save Page"}
          </Button>
        </div>
      </div>

      <Tabs defaultValue="content" className="w-full">
        <TabsList className="grid w-full grid-cols-2 max-w-[400px] mb-8 bg-slate-50 p-1 rounded-2xl h-12">
          <TabsTrigger
            value="content"
            className="rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-sm gap-2 font-bold transition-all"
          >
            <Layout size={16} /> Content
          </TabsTrigger>
          <TabsTrigger
            value="settings"
            className="rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-sm gap-2 font-bold transition-all"
          >
            <Settings size={16} /> SEO & Settings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="content" className="space-y-8 outline-none">
          <div className="flex flex-col gap-8">
            <div className="w-full space-y-6">
              <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm">
                <div className="space-y-4">
                  <div>
                    <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block">
                      Page Title
                    </Label>
                    <Input
                      placeholder="e.g. About Us"
                      value={page.title}
                      onChange={(e) =>
                        setPage({ ...page, title: e.target.value })
                      }
                      className="h-12 text-lg font-bold rounded-xl border-slate-200"
                    />
                  </div>
                  <div>
                    <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block">
                      Slug Path
                    </Label>
                    <div className="flex items-center">
                      <span className="bg-slate-50 border border-r-0 border-slate-200 rounded-l-xl h-12 px-4 flex items-center text-slate-400 text-sm">
                        /
                      </span>
                      <Input
                        placeholder="about-us"
                        value={page.slug}
                        onChange={(e) =>
                          setPage({
                            ...page,
                            slug: e.target.value
                              .toLowerCase()
                              .replace(/ /g, "-"),
                          })
                        }
                        className="h-12 rounded-l-none rounded-r-xl border-slate-200"
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
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={addSection}
                    className="rounded-xl border-slate-200 text-slate-600 gap-2 h-9"
                  >
                    <PlusCircle size={16} /> Add Section
                  </Button>
                </div>

                {page.content.length === 0 ? (
                  <div className="h-64 rounded-3xl border-2 border-dashed border-slate-100 flex flex-col items-center justify-center text-slate-300 gap-4">
                    <Layout size={40} className="opacity-20" />
                    <p className="text-sm font-medium">
                      Your page is empty. Start by adding a section.
                    </p>
                    <Button
                      variant="outline"
                      className="rounded-xl border-slate-200"
                      onClick={addSection}
                    >
                      Add First Section
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {page.content.map((section, idx) => (
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
                        isLast={idx === page.content.length - 1}
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
        </TabsContent>

        <TabsContent value="settings" className="space-y-8 outline-none">
          <div className="max-w-2xl bg-white rounded-3xl border border-slate-100 p-8 shadow-sm space-y-6">
            <h3 className="text-lg font-bold text-slate-900 mb-2">
              Search Engine Optimization (SEO)
            </h3>
            <div className="space-y-4">
              <div>
                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block">
                  Meta Title
                </Label>
                <Input
                  placeholder="Page title as it appears in search results"
                  value={page.metaTitle}
                  onChange={(e) =>
                    setPage({ ...page, metaTitle: e.target.value })
                  }
                  className="rounded-xl border-slate-200"
                />
              </div>
              <div>
                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block">
                  Meta Description
                </Label>
                <Textarea
                  placeholder="A short summary of the page for search engines"
                  value={page.metaDescription}
                  onChange={(e) =>
                    setPage({ ...page, metaDescription: e.target.value })
                  }
                  className="rounded-xl border-slate-200 min-h-[120px]"
                />
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
