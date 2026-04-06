"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ContentItem } from "./ContentItem";
import { 
  Plus, 
  Trash, 
  Layers, 
  ChevronUp, 
  ChevronDown,
  LayoutGrid,
  ChevronRight,
  ChevronDown as ChevronDownIcon,
  Columns as ColumnsIcon,
  GalleryHorizontal
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface SectionBlockProps {
  section: any;
  onUpdate: (updates: any) => void;
  onRemove: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  isFirst: boolean;
  isLast: boolean;
}

export const SectionBlock: React.FC<SectionBlockProps> = ({
  section,
  onUpdate,
  onRemove,
  onMoveUp,
  onMoveDown,
  isFirst,
  isLast,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  // Ensure columns exist and are initialized
  useEffect(() => {
    if (!section.columns || section.columns.length === 0) {
      // Migrate from flat content to columns if exists
      const initialContent = section.content || [];
      onUpdate({ columns: [initialContent], content: [] });
    }
  }, []);

  const getColCount = (layout: string) => {
    switch (layout) {
      case "grid-1": return 1;
      case "grid-2": return 2;
      case "grid-3": return 3;
      case "grid-4": return 4;
      default: return 1;
    }
  };

  const handleLayoutChange = (newLayout: string) => {
    const newCount = getColCount(newLayout);
    const currentCols = section.columns || [[]];
    const newCols = [...currentCols];

    if (newCount > currentCols.length) {
      // Add empty columns
      for (let i = currentCols.length; i < newCount; i++) {
        newCols.push([]);
      }
    } else if (newCount < currentCols.length) {
      // Merge removed columns into the last remaining column
      const mergedContent = [...newCols[newCount - 1]];
      for (let i = newCount; i < currentCols.length; i++) {
        mergedContent.push(...currentCols[i]);
      }
      newCols[newCount - 1] = mergedContent;
      newCols.splice(newCount);
    }

    onUpdate({ layout: newLayout, columns: newCols });
  };

  const addContentElement = (type: string, colIndex: number = 0) => {
    const newItem = {
      id: Math.random().toString(36).substr(2, 9),
      type,
      ...(type === "heading" ? { level: "h2", text: "" } : {}),
      ...(type === "paragraph" ? { text: "" } : {}),
      ...(type === "image" ? { url: "", alt: "" } : {}),
      ...(type === "button" ? { buttons: [{ id: Math.random().toString(36).substr(2, 9), label: "Button", link: "#", actionType: "link" }] } : {}),
      ...(type === "list" ? { items: [""] } : {}),
      ...(type === "section" ? { layout: "grid-1", columns: [[]] } : {}),
      ...(type === "carousel" ? { items: [{ id: Math.random().toString(36).substr(2, 9), adminTitle: "Slide 1", layout: "grid-1", columns: [[]] }] } : {}),
      ...(type === "cta" ? { title: "", subtitle: "", description: "", buttonLabel: "", buttonLink: "" } : {}),
      ...(type === "cards" ? { items: [] } : {}),
      ...(type === "features" ? { items: [] } : {}),
      ...(type === "testimonial" ? { quote: "", author: "", role: "", avatar: "" } : {}),
    };

    const newCols = [...(section.columns || [[]])];
    if (!newCols[colIndex]) newCols[colIndex] = [];
    newCols[colIndex] = [...newCols[colIndex], newItem];
    
    onUpdate({ columns: newCols });
    setIsOpen(true);
  };

  const updateItem = (itemId: string, colIndex: number, updates: any) => {
    const newCols = [...(section.columns || [[]])];
    newCols[colIndex] = newCols[colIndex].map((item: any) =>
      item.id === itemId ? { ...item, ...updates } : item
    );
    onUpdate({ columns: newCols });
  };

  const removeItem = (itemId: string, colIndex: number) => {
    const newCols = [...(section.columns || [[]])];
    newCols[colIndex] = newCols[colIndex].filter((item: any) => item.id !== itemId);
    onUpdate({ columns: newCols });
  };

  const moveItem = (index: number, colIndex: number, direction: "up" | "down") => {
    const newCols = [...(section.columns || [[]])];
    const colContent = [...newCols[colIndex]];
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= colContent.length) return;
    
    [colContent[index], colContent[targetIndex]] = [
      colContent[targetIndex],
      colContent[index],
    ];
    newCols[colIndex] = colContent;
    onUpdate({ columns: newCols });
  };

  const columns = section.columns || [section.content || []];
  const totalItemCount = columns.reduce((acc: number, col: any[]) => acc + (col?.length || 0), 0);

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-4 space-y-4 relative group/section transition-all hover:border-slate-300 shadow-sm border-l-4 border-l-slate-900">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 flex-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-xl text-slate-400 hover:text-slate-900"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <ChevronDownIcon size={18} /> : <ChevronRight size={18} />}
          </Button>

          <div className="p-1.5 bg-slate-900 rounded-lg text-white">
            <Layers size={14} />
          </div>
          
          <div className="flex flex-col flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-0.5">
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 leading-none">Section Block</span>
              {!isOpen && totalItemCount > 0 && (
                 <span className="px-1.5 py-0.5 rounded-md bg-slate-50 text-[10px] font-bold text-slate-500 border border-slate-100">
                   {totalItemCount} item{totalItemCount !== 1 ? 's' : ''}
                 </span>
              )}
            </div>
            {isOpen ? (
              <Input 
                value={section.adminTitle || ""} 
                onChange={(e) => onUpdate({ adminTitle: e.target.value })} 
                placeholder="Section Display Title (Internal)..." 
                className="h-7 text-xs font-bold border-none bg-transparent p-0 focus-visible:ring-0 text-slate-700" 
              />
            ) : (
              <span className="text-sm font-bold text-slate-700 truncate cursor-pointer" onClick={() => setIsOpen(true)}>
                {section.adminTitle || "Content Wrapper"}
              </span>
            )}
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="flex items-center bg-slate-50 rounded-xl border border-slate-100 p-0.5">
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 rounded-lg text-slate-400 hover:text-slate-900 hover:bg-white"
              onClick={onMoveUp}
              disabled={isFirst}
            >
              <ChevronUp size={14} />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 rounded-lg text-slate-400 hover:text-slate-900 hover:bg-white"
              onClick={onMoveDown}
              disabled={isLast}
            >
              <ChevronDown size={14} />
            </Button>
          </div>

          <Select
            value={section.layout || "grid-1"}
            onValueChange={handleLayoutChange}
          >
            <SelectTrigger className="w-[120px] h-8 text-[10px] font-bold rounded-lg border-slate-200 bg-white">
              <LayoutGrid size={12} className="mr-2 text-slate-400" />
              <SelectValue placeholder="Layout" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="grid-1">1 Column</SelectItem>
              <SelectItem value="grid-2">2 Columns</SelectItem>
              <SelectItem value="grid-3">3 Columns</SelectItem>
              <SelectItem value="grid-4">4 Columns</SelectItem>
            </SelectContent>
          </Select>

          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-xl text-slate-300 hover:text-rose-500 hover:bg-rose-50"
            onClick={onRemove}
          >
            <Trash size={16} />
          </Button>
        </div>
      </div>

      {isOpen && (
        <div className={cn(
          "grid gap-6 animate-in fade-in duration-200",
          columns.length === 1 ? "grid-cols-1" : 
          columns.length === 2 ? "grid-cols-2" :
          columns.length === 3 ? "grid-cols-3" : "grid-cols-4"
        )}>
          {columns.map((col: any[], colIdx: number) => (
            <div key={colIdx} className={cn(
              "space-y-4 pb-4",
              columns.length > 1 ? "border-r border-slate-100 last:border-r-0 pr-4 last:pr-0" : ""
            )}>
              {columns.length > 1 && (
                <div className="flex items-center gap-2 mb-2 px-1">
                   <ColumnsIcon size={12} className="text-slate-300" />
                   <span className="text-[9px] font-black uppercase text-slate-300">Column {colIdx+1}</span>
                </div>
              )}
              
              <div className="space-y-4 min-h-[50px]">
                {(col || []).map((item: any, idx: number) => (
                  <ContentItem
                    key={item.id}
                    item={item}
                    onChange={(updates) => updateItem(item.id, colIdx, updates)}
                    onRemove={() => removeItem(item.id, colIdx)}
                    onMoveUp={() => moveItem(idx, colIdx, "up")}
                    onMoveDown={() => moveItem(idx, colIdx, "down")}
                    isFirst={idx === 0}
                    isLast={idx === (col?.length || 0) - 1}
                  />
                ))}
              </div>

              <div className="flex flex-wrap items-center gap-1.5 pt-4 border-t border-slate-50 mt-4">
                <button
                  onClick={() => addContentElement("heading", colIdx)}
                  className="p-1 px-2 rounded-lg border border-slate-100 bg-white text-[9px] font-bold text-slate-400 hover:border-slate-300 hover:text-slate-900 transition-all flex items-center gap-1"
                >
                  <Plus size={10} /> Heading
                </button>
                <button
                  onClick={() => addContentElement("paragraph", colIdx)}
                  className="p-1 px-2 rounded-lg border border-slate-100 bg-white text-[9px] font-bold text-slate-400 hover:border-slate-300 hover:text-slate-900 transition-all flex items-center gap-1"
                >
                  <Plus size={10} /> Text
                </button>
                <button
                  onClick={() => addContentElement("image", colIdx)}
                  className="p-1 px-2 rounded-lg border border-slate-100 bg-white text-[9px] font-bold text-slate-400 hover:border-slate-300 hover:text-slate-900 transition-all flex items-center gap-1"
                >
                  <Plus size={10} /> Image
                </button>
                <button
                  onClick={() => addContentElement("section", colIdx)}
                  className="p-1 px-2 rounded-lg border border-blue-50 bg-white text-[9px] font-bold text-blue-400 hover:border-blue-300 hover:text-blue-900 transition-all flex items-center gap-1"
                >
                  <Plus size={10} /> Sub
                </button>
                <button
                  onClick={() => addContentElement("button", colIdx)}
                  className="p-1 px-2 rounded-lg border border-slate-100 bg-white text-[9px] font-bold text-slate-400 hover:border-slate-300 hover:text-slate-900 transition-all flex items-center gap-1"
                >
                  <Plus size={10} /> Btn
                </button>
                <button
                  onClick={() => addContentElement("carousel", colIdx)}
                  className="p-1 px-2 rounded-lg border border-purple-50 bg-white text-[9px] font-bold text-purple-400 hover:border-purple-300 hover:text-purple-900 transition-all flex items-center gap-1"
                >
                  <Plus size={10} /> Carousel
                </button>
                <button
                  onClick={() => addContentElement("cards", colIdx)}
                  className="p-1 px-2 rounded-lg border border-slate-100 bg-white text-[9px] font-bold text-slate-400 hover:border-slate-300 hover:text-slate-900 transition-all flex items-center gap-1"
                >
                  <Plus size={10} /> Card
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
