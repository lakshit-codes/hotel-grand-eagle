"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Type, 
  AlignLeft, 
  Image as ImageIcon, 
  Link as LinkIcon, 
  List, 
  Trash, 
  ChevronDown,
  ChevronUp,
  FileText,
  Layers,
  CreditCard,
  Zap,
  Quote,
  GalleryHorizontal,
  PlusCircle
} from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SectionBlock } from "./SectionBlock";
import { MediaLibraryModal } from "../media/MediaLibraryModal";

interface ContentItemProps {
  item: any;
  onChange: (updates: any) => void;
  onRemove: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  isFirst: boolean;
  isLast: boolean;
}

export const ContentItem: React.FC<ContentItemProps> = ({
  item,
  onChange,
  onRemove,
  onMoveUp,
  onMoveDown,
  isFirst,
  isLast,
}) => {
  const renderFields = () => {
    switch (item.type) {
      case "carousel":
        return (
          <div className="space-y-4">
            {(item.items || []).map((slide: any, idx: number) => (
              <div key={idx} className="bg-slate-50/50 p-4 rounded-2xl border border-slate-100 relative group/slide">
                <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100/50">
                   <div className="flex items-center gap-2">
                     <span className="p-1 px-2 rounded-lg bg-slate-900 text-[8px] font-black uppercase text-white">Slide #{idx + 1}</span>
                     <Input 
                        value={slide.adminTitle || ""} 
                        onChange={(e) => {
                          const newItems = [...item.items];
                          newItems[idx] = { ...slide, adminTitle: e.target.value };
                          onChange({ items: newItems });
                        }} 
                        placeholder="Slide Title (Internal)..." 
                        className="h-6 text-[10px] font-bold border-none bg-transparent p-0 w-32 focus-visible:ring-0" 
                     />
                   </div>
                   <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-7 w-7 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-lg" 
                    onClick={() => {
                      const newItems = item.items.filter((_: any, i: number) => i !== idx);
                      onChange({ items: newItems });
                    }}
                  >
                    <Trash size={14} />
                  </Button>
                </div>
                <div className="mt-2 border-l-2 border-slate-200 pl-4 py-2 w-full">
                  <SectionBlock
                    section={slide}
                    onUpdate={(updates) => {
                      const newItems = [...item.items];
                      newItems[idx] = { ...slide, ...updates };
                      onChange({ items: newItems });
                    }}
                    onRemove={() => {
                      const newItems = item.items.filter((_: any, i: number) => i !== idx);
                      onChange({ items: newItems });
                    }}
                    onMoveUp={() => {
                      if (idx === 0) return;
                      const newItems = [...item.items];
                      [newItems[idx], newItems[idx-1]] = [newItems[idx-1], newItems[idx]];
                      onChange({ items: newItems });
                    }}
                    onMoveDown={() => {
                      if (idx === item.items.length - 1) return;
                      const newItems = [...item.items];
                      [newItems[idx], newItems[idx+1]] = [newItems[idx+1], newItems[idx]];
                      onChange({ items: newItems });
                    }}
                    isFirst={idx === 0}
                    isLast={idx === (item.items || []).length - 1}
                  />
                </div>
              </div>
            ))}
            <Button variant="outline" size="sm" className="w-full text-[10px] h-10 border-dashed border-slate-200 text-slate-400 hover:text-slate-600 rounded-2xl gap-2" onClick={() => {
              const newItems = [...(item.items || []), { 
                id: Math.random().toString(36).substr(2, 9),
                adminTitle: "",
                layout: "grid-1", 
                columns: [[]] 
              }];
              onChange({ items: newItems });
            }}>
              <PlusCircle size={14} /> Add New slide
            </Button>
          </div>
        );

      case "section":
        return (
          <div className="mt-2 border-l-2 border-slate-200 pl-4 py-2 w-full">
            <SectionBlock
              section={item}
              onUpdate={(updates) => onChange(updates)}
              onRemove={onRemove}
              onMoveUp={onMoveUp}
              onMoveDown={onMoveDown}
              isFirst={isFirst}
              isLast={isLast}
            />
          </div>
        );

      case "heading":
        return (
          <div className="flex flex-col gap-3">
            <div className="flex gap-2 items-center">
              <Select
                value={item.level || "h1"}
                onValueChange={(val) => onChange({ level: val })}
              >
                <SelectTrigger className="w-[70px] h-8 text-[10px] font-bold">
                  <SelectValue placeholder="Level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="h1">H1</SelectItem>
                  <SelectItem value="h2">H2</SelectItem>
                  <SelectItem value="h3">H3</SelectItem>
                  <SelectItem value="h4">H4</SelectItem>
                  <SelectItem value="h5">H5</SelectItem>
                  <SelectItem value="h6">H6</SelectItem>
                </SelectContent>
              </Select>
              <Input
                placeholder="Heading text..."
                value={item.text || ""}
                onChange={(e) => onChange({ text: e.target.value })}
                className="h-8 text-sm font-bold border-slate-200"
              />
            </div>
          </div>
        );

      case "paragraph":
        return (
          <Textarea
            placeholder="Write your content here..."
            value={item.text || ""}
            onChange={(e) => onChange({ text: e.target.value })}
            className="min-h-[80px] text-sm border-slate-200"
          />
        );

      case "image":
        return (
          <div className="space-y-4">
            {!item.url ? (
              <MediaLibraryModal 
                onSelect={(m) => onChange({ url: m.url, alt: m.alt || item.alt })}
                trigger={
                  <Button variant="outline" className="w-full h-24 border-dashed border-slate-200 rounded-2xl flex flex-col gap-2 text-slate-400 hover:text-slate-600 hover:border-slate-300 transition-all bg-slate-50/30">
                    <ImageIcon size={20} />
                    <span className="text-xs font-bold uppercase tracking-widest">Select Image</span>
                  </Button>
                }
              />
            ) : (
              <div className="space-y-3">
                <div className="relative group/img-preview rounded-2xl overflow-hidden border border-slate-100 bg-slate-50 flex items-center justify-center min-h-[160px] max-h-[300px]">
                  <img src={item.url} alt={item.alt} className="w-full h-full object-contain" />
                  <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover/img-preview:opacity-100 transition-opacity flex items-center justify-center gap-3">
                    <MediaLibraryModal 
                      onSelect={(m) => onChange({ url: m.url, alt: m.alt || item.alt })}
                      trigger={
                        <Button variant="secondary" size="sm" className="rounded-xl font-bold gap-2">
                           <ImageIcon size={14} /> Change Image
                        </Button>
                      }
                    />
                    <Button 
                      variant="destructive" 
                      size="sm" 
                      className="rounded-xl font-bold"
                      onClick={() => onChange({ url: "", alt: "" })}
                    >
                      Remove
                    </Button>
                  </div>
                </div>
                {item.alt && (
                  <p className="text-[10px] text-slate-400 italic text-center font-medium">Alt: {item.alt}</p>
                )}
              </div>
            )}
          </div>
        );

      case "button":
        // Migration: convert single button to array if needed
        const buttonItems = item.buttons || (item.label ? [{ id: 'migrated', label: item.label, link: item.link, actionType: 'link' }] : []);
        
        return (
          <div className="space-y-3">
             {buttonItems.map((btn: any, idx: number) => (
                <div key={idx} className="bg-slate-50/50 p-4 rounded-xl border border-slate-100 space-y-4 relative group/btn">
                  <div className="flex items-center justify-between border-b border-slate-100/50 pb-2 mb-2">
                    <div className="flex items-center gap-3">
                       <span className="text-[9px] font-black uppercase text-slate-400 tracking-widest">Button #{idx + 1}</span>
                       <Select
                          value={btn.actionType || "link"}
                          onValueChange={(val) => {
                            const newButtons = [...buttonItems];
                            newButtons[idx] = { ...btn, actionType: val };
                            onChange({ buttons: newButtons, label: undefined, link: undefined });
                          }}
                        >
                          <SelectTrigger className="w-[100px] h-7 text-[9px] font-bold rounded-lg px-2">
                            <SelectValue placeholder="Action" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="link">🔗 Link</SelectItem>
                            <SelectItem value="button">⚡ Button</SelectItem>
                          </SelectContent>
                        </Select>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-6 w-6 text-slate-300 hover:text-rose-500 rounded-lg"
                      onClick={() => {
                        const newButtons = buttonItems.filter((_: any, i: number) => i !== idx);
                        onChange({ buttons: newButtons, label: undefined, link: undefined });
                      }}
                    >
                      <Trash size={12} />
                    </Button>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 block">Label</label>
                      <Input
                        placeholder="Click here"
                        value={btn.label || ""}
                        onChange={(e) => {
                          const newButtons = [...buttonItems];
                          newButtons[idx] = { ...btn, label: e.target.value };
                          onChange({ buttons: newButtons, label: undefined, link: undefined });
                        }}
                        className="h-9 text-xs border-slate-200 rounded-lg font-bold"
                      />
                    </div>

                    {btn.actionType === "link" ? (
                      <div className="space-y-1.5">
                        <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 block">Link URL (href)</label>
                        <Input
                          placeholder="/shop"
                          value={btn.link || ""}
                          onChange={(e) => {
                            const newButtons = [...buttonItems];
                            newButtons[idx] = { ...btn, link: e.target.value };
                            onChange({ buttons: newButtons, label: undefined, link: undefined });
                          }}
                          className="h-9 text-xs border-slate-200 rounded-lg"
                        />
                      </div>
                    ) : (
                      <div className="space-y-1.5">
                        <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 block">Button Type</label>
                        <Select
                          value={btn.buttonType || "button"}
                          onValueChange={(val) => {
                            const newButtons = [...buttonItems];
                            newButtons[idx] = { ...btn, buttonType: val };
                            onChange({ buttons: newButtons, label: undefined, link: undefined });
                          }}
                        >
                          <SelectTrigger className="h-9 text-xs border-slate-200 rounded-lg">
                            <SelectValue placeholder="Type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="button">Standard Button</SelectItem>
                            <SelectItem value="submit">Submit Form</SelectItem>
                            <SelectItem value="reset">Reset Form</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                  </div>

                  {btn.actionType === "link" && (
                    <div className="flex items-center gap-3 pt-1">
                      <label className="text-[9px] font-black uppercase tracking-widest text-slate-400">Open in:</label>
                      <Select
                        value={btn.target || "_self"}
                        onValueChange={(val) => {
                          const newButtons = [...buttonItems];
                          newButtons[idx] = { ...btn, target: val };
                          onChange({ buttons: newButtons, label: undefined, link: undefined });
                        }}
                      >
                        <SelectTrigger className="w-[140px] h-7 text-[9px] font-bold rounded-lg px-2">
                          <SelectValue placeholder="Target" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="_self">Same Window</SelectItem>
                          <SelectItem value="_blank">New Window</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </div>
             ))}

             <Button 
                variant="outline" 
                size="sm" 
                className="w-full text-[10px] h-9 border-dashed border-slate-200 text-slate-400 hover:text-slate-600 rounded-xl gap-2"
                onClick={() => {
                  const newButtons = [...buttonItems, { id: Math.random().toString(36).substr(2, 9), label: "New Button", actionType: "link", link: "#" }];
                  onChange({ buttons: newButtons, label: undefined, link: undefined });
                }}
              >
                <PlusCircle size={14} /> Add Button
              </Button>
          </div>
        );

      case "cta":
        return (
          <div className="space-y-3 bg-slate-50/50 p-3 rounded-xl border border-slate-100">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1 block">Title</label>
                <Input value={item.title || ""} onChange={(e) => onChange({ title: e.target.value })} className="h-8 text-xs border-slate-200" />
              </div>
              <div>
                <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1 block">Subtitle</label>
                <Input value={item.subtitle || ""} onChange={(e) => onChange({ subtitle: e.target.value })} className="h-8 text-xs border-slate-200" />
              </div>
            </div>
            <Textarea placeholder="CTA Description" value={item.description || ""} onChange={(e) => onChange({ description: e.target.value })} className="text-xs h-16 min-h-[60px] border-slate-200" />
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1 block">Button Text</label>
                <Input value={item.buttonLabel || ""} onChange={(e) => onChange({ buttonLabel: e.target.value })} className="h-8 text-xs border-slate-200" />
              </div>
              <div>
                <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1 block">Button Link</label>
                <Input value={item.buttonLink || ""} onChange={(e) => onChange({ buttonLink: e.target.value })} className="h-8 text-xs border-slate-200" />
              </div>
            </div>
          </div>
        );

      case "cards":
        return (
          <div className="space-y-3">
            {(item.items || []).map((card: any, idx: number) => (
              <div key={idx} className="bg-slate-50/50 p-3 rounded-xl border border-slate-100 relative group/card">
                <div className="flex items-center justify-between mb-2 pb-2 border-b border-slate-100/50">
                  <span className="text-[8px] font-black uppercase tracking-widest text-slate-300">Card Item #{idx + 1}</span>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-6 w-6 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-lg" 
                    onClick={() => {
                      const newItems = item.items.filter((_: any, i: number) => i !== idx);
                      onChange({ items: newItems });
                    }}
                  >
                    <Trash size={12} />
                  </Button>
                </div>
                <div className="grid grid-cols-2 gap-2 mb-2">
                  <Input placeholder="Title" value={card.title || ""} onChange={(e) => {
                    const newItems = [...item.items];
                    newItems[idx] = { ...card, title: e.target.value };
                    onChange({ items: newItems });
                  }} className="h-8 text-[11px] font-bold border-slate-200" />
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                       <label className="text-[10px] font-bold text-slate-500">Image URL</label>
                       <MediaLibraryModal onSelect={(m) => {
                          const newItems = [...item.items];
                          newItems[idx] = { ...card, image: m.url };
                          onChange({ items: newItems });
                       }} />
                    </div>
                    <Input placeholder="Image URL" value={card.image || ""} onChange={(e) => {
                      const newItems = [...item.items];
                      newItems[idx] = { ...card, image: e.target.value };
                      onChange({ items: newItems });
                    }} className="h-8 text-[11px] border-slate-200 rounded-lg" />
                  </div>
                </div>
                <Textarea placeholder="Description" value={card.description || ""} onChange={(e) => {
                  const newItems = [...item.items];
                  newItems[idx] = { ...card, description: e.target.value };
                  onChange({ items: newItems });
                }} className="text-[11px] h-14 min-h-[50px] border-slate-200" />
              </div>
            ))}
            <Button variant="outline" size="sm" className="w-full text-[10px] h-8 border-dashed border-slate-200 text-slate-400 hover:text-slate-600 rounded-xl" onClick={() => {
              const newItems = [...(item.items || []), { title: "", description: "", image: "", link: "" }];
              onChange({ items: newItems });
            }}>+ Add Card</Button>
          </div>
        );

      case "features":
        return (
          <div className="space-y-3">
            {(item.items || []).map((feature: any, idx: number) => (
              <div key={idx} className="flex gap-2 items-start bg-slate-50/50 p-3 rounded-xl border border-slate-100 group/feat">
                <div className="flex-1 space-y-2">
                  <Input placeholder="Feature Title" value={feature.title || ""} onChange={(e) => {
                    const newItems = [...item.items];
                    newItems[idx] = { ...feature, title: e.target.value };
                    onChange({ items: newItems });
                  }} className="h-8 text-[11px] font-bold border-slate-200" />
                  <Textarea placeholder="Feature description" value={feature.description || ""} onChange={(e) => {
                    const newItems = [...item.items];
                    newItems[idx] = { ...feature, description: e.target.value };
                    onChange({ items: newItems });
                  }} className="text-[11px] h-14 min-h-[50px] border-slate-200" />
                </div>
                <Button variant="ghost" size="icon" className="h-7 w-7 text-slate-300 hover:text-rose-500 rounded-lg flex-shrink-0" onClick={() => {
                  const newItems = item.items.filter((_: any, i: number) => i !== idx);
                  onChange({ items: newItems });
                }}><Trash size={12} /></Button>
              </div>
            ))}
            <Button variant="outline" size="sm" className="text-[10px] h-8 border-dashed border-slate-200 text-slate-400 hover:text-slate-600 rounded-xl" onClick={() => {
              const newItems = [...(item.items || []), { title: "", description: "" }];
              onChange({ items: newItems });
            }}>+ Add Feature</Button>
          </div>
        );

      case "testimonial":
        return (
          <div className="space-y-3 bg-slate-50/50 p-3 rounded-xl border border-slate-100">
            <Textarea placeholder="Quote" value={item.quote || ""} onChange={(e) => onChange({ quote: e.target.value })} className="text-sm italic border-slate-200" />
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1 block">Author Name</label>
                <Input value={item.author || ""} onChange={(e) => onChange({ author: e.target.value })} className="h-8 text-xs border-slate-200" />
              </div>
              <div>
                <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1 block">Role/Company</label>
                <Input value={item.role || ""} onChange={(e) => onChange({ role: e.target.value })} className="h-8 text-xs border-slate-200" />
              </div>
            </div>
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                 <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 block">Avatar URL</label>
                 <MediaLibraryModal onSelect={(m) => onChange({ avatar: m.url })} />
              </div>
              <Input value={item.avatar || ""} onChange={(e) => onChange({ avatar: e.target.value })} className="h-8 text-xs border-slate-200 rounded-lg" />
            </div>
          </div>
        );

      case "list":
        return (
          <div className="space-y-2">
            {(item.items || []).map((li: string, idx: number) => (
              <div key={idx} className="flex gap-2">
                <Input
                  value={li}
                  placeholder={`Item ${idx + 1}`}
                  onChange={(e) => {
                    const newItems = [...(item.items || [])];
                    newItems[idx] = e.target.value;
                    onChange({ items: newItems });
                  }}
                  className="h-8 text-xs border-slate-200"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-slate-200 hover:text-rose-500 rounded-lg flex-shrink-0"
                  onClick={() => {
                    const newItems = (item.items || []).filter((_: any, i: number) => i !== idx);
                    onChange({ items: newItems });
                  }}
                >
                  <Trash size={12} />
                </Button>
              </div>
            ))}
            <Button
              variant="outline"
              size="sm"
              className="text-[10px] h-8 border-dashed border-slate-200 text-slate-400 hover:text-slate-600 rounded-xl"
              onClick={() => {
                const newItems = [...(item.items || []), ""];
                onChange({ items: newItems });
              }}
            >
              + Add List Item
            </Button>
          </div>
        );

      default:
        return <div className="text-xs text-slate-400 italic">Unknown component type</div>;
    }
  };

  const getIcon = () => {
    switch (item.type) {
      case "heading": return <Type size={14} />;
      case "paragraph": return <AlignLeft size={14} />;
      case "image": return <ImageIcon size={14} />;
      case "button": return <LinkIcon size={14} />;
      case "list": return <List size={14} />;
      case "section": return <Layers size={14} />;
      case "cta": return <Zap size={14} />;
      case "cards": return <CreditCard size={14} />;
      case "features": return <Zap size={14} />;
      case "testimonial": return <Quote size={14} />;
      case "carousel": return <GalleryHorizontal size={14} />;
      default: return <FileText size={14} />;
    }
  };

  if (item.type === "section") {
    return renderFields();
  }

  return (
    <div className="group relative bg-white border border-slate-100 rounded-2xl p-4 shadow-sm hover:border-slate-300 transition-all">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-slate-50 rounded-lg text-slate-400">
            {getIcon()}
          </div>
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
            {item.type}
          </span>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-slate-50 rounded-xl border border-slate-100 p-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 rounded-lg text-slate-400 hover:text-slate-900 hover:bg-white"
              onClick={onMoveUp}
              disabled={isFirst}
            >
              <ChevronUp size={12} />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 rounded-lg text-slate-400 hover:text-slate-900 hover:bg-white"
              onClick={onMoveDown}
              disabled={isLast}
            >
              <ChevronDown size={12} />
            </Button>
          </div>
          
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-xl text-slate-300 hover:text-rose-500 hover:bg-rose-50"
            onClick={onRemove}
          >
            <Trash size={14} />
          </Button>
        </div>
      </div>

      <div className="pl-0">{renderFields()}</div>
    </div>
  );
};
