"use client";

import React from "react";
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
import { Btn, Inp, Sel } from "../ui";
import { SectionBlock } from "./SectionBlock";
import { MediaLibraryModal } from "./MediaLibraryModal";

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
                     <Inp 
                        value={slide.adminTitle || ""} 
                        onChange={(e) => {
                          const newItems = [...item.items];
                          newItems[idx] = { ...slide, adminTitle: e.target.value };
                          onChange({ items: newItems });
                        }} 
                        placeholder="Slide Title (Internal)..." 
                        className="h-6 text-[10px] font-bold border-none bg-transparent p-0 w-32 focus-visible:ring-0" 
                        style={{ padding: 0, height: 'auto', border: 'none', background: 'transparent', boxShadow: 'none' }}
                     />
                   </div>
                   <button 
                    className="btn btn-ghost"
                    style={{ padding: '4px', color: '#f43f5e' }}
                    onClick={() => {
                      const newItems = item.items.filter((_: any, i: number) => i !== idx);
                      onChange({ items: newItems });
                    }}
                  >
                    <Trash size={14} />
                  </button>
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
                      if (idx === (item.items || []).length - 1) return;
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
            <button className="btn btn-outline" style={{ width: '100%', display: 'flex', justifyContent: 'center', fontSize: '11px', textTransform: 'uppercase', padding: '10px', borderStyle: 'dashed' }} onClick={() => {
              const newItems = [...(item.items || []), { 
                id: Math.random().toString(36).substr(2, 9),
                adminTitle: "",
                layout: "grid-1", 
                columns: [[]] 
              }];
              onChange({ items: newItems });
            }}>
              <PlusCircle size={14} style={{ marginRight: 6 }}/> Add New slide
            </button>
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
              <Sel
                value={item.level || "h1"}
                onChange={(e) => onChange({ level: e.target.value })}
                opts={['h1', 'h2', 'h3', 'h4', 'h5', 'h6']}
                style={{ width: '70px', padding: '6px' }}
              />
              <Inp
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
          <textarea
            placeholder="Write your content here..."
            value={item.text || ""}
            onChange={(e) => onChange({ text: e.target.value })}
            className="textarea min-h-[80px] text-sm border-slate-200"
            style={{ width: '100%', minHeight: '80px' }}
          />
        );

      case "image":
        return (
          <div className="space-y-4">
            {!item.url ? (
              <MediaLibraryModal 
                onSelect={(m) => onChange({ url: m.url, alt: m.alt || item.alt })}
                trigger={
                  <button className="btn btn-outline" style={{ width: '100%', height: '96px', borderStyle: 'dashed', flexDirection: 'column', gap: '8px' }}>
                    <ImageIcon size={20} />
                    <span className="text-xs font-bold uppercase tracking-widest">Select Image</span>
                  </button>
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
                        <Btn variant="secondary" size="sm" style={{ fontWeight: 'bold' }}>
                           <ImageIcon size={14} style={{ marginRight: 6 }}/> Change Image
                        </Btn>
                      }
                    />
                    <Btn 
                      variant="danger" 
                      size="sm" 
                      onClick={() => onChange({ url: "", alt: "" })}
                    >
                      Remove
                    </Btn>
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
        const buttonItems = item.buttons || (item.label ? [{ id: 'migrated', label: item.label, link: item.link, actionType: 'link' }] : []);
        
        return (
          <div className="space-y-3">
             {buttonItems.map((btn: any, idx: number) => (
                <div key={idx} className="bg-slate-50/50 p-4 rounded-xl border border-slate-100 space-y-4 relative group/btn">
                  <div className="flex items-center justify-between border-b border-slate-100/50 pb-2 mb-2">
                    <div className="flex items-center gap-3">
                       <span className="text-[9px] font-black uppercase text-slate-400 tracking-widest">Button #{idx + 1}</span>
                       <Sel
                          value={btn.actionType || "link"}
                          onChange={(e) => {
                            const newButtons = [...buttonItems];
                            newButtons[idx] = { ...btn, actionType: e.target.value };
                            onChange({ buttons: newButtons, label: undefined, link: undefined });
                          }}
                          opts={[
                            { v: 'link', l: '🔗 Link' },
                            { v: 'button', l: '⚡ Button'}
                          ]}
                          style={{ padding: '4px', fontSize: '11px', width: '100px' }}
                        />
                    </div>
                    <button 
                      className="btn btn-ghost"
                      style={{ padding: '4px', color: '#f43f5e' }}
                      onClick={() => {
                        const newButtons = buttonItems.filter((_: any, i: number) => i !== idx);
                        onChange({ buttons: newButtons, label: undefined, link: undefined });
                      }}
                    >
                      <Trash size={12} />
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 block">Label</label>
                      <Inp
                        placeholder="Click here"
                        value={btn.label || ""}
                        onChange={(e) => {
                          const newButtons = [...buttonItems];
                          newButtons[idx] = { ...btn, label: e.target.value };
                          onChange({ buttons: newButtons, label: undefined, link: undefined });
                        }}
                      />
                    </div>

                    {btn.actionType === "link" ? (
                      <div className="space-y-1.5">
                        <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 block">Link URL (href)</label>
                        <Inp
                          placeholder="/shop"
                          value={btn.link || ""}
                          onChange={(e) => {
                            const newButtons = [...buttonItems];
                            newButtons[idx] = { ...btn, link: e.target.value };
                            onChange({ buttons: newButtons, label: undefined, link: undefined });
                          }}
                        />
                      </div>
                    ) : (
                      <div className="space-y-1.5">
                        <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 block">Button Type</label>
                        <Sel
                          value={btn.buttonType || "button"}
                          onChange={(e) => {
                            const newButtons = [...buttonItems];
                            newButtons[idx] = { ...btn, buttonType: e.target.value };
                            onChange({ buttons: newButtons, label: undefined, link: undefined });
                          }}
                          opts={[
                            { v: 'button', l: 'Standard Button' },
                            { v: 'submit', l: 'Submit Form' },
                            { v: 'reset', l: 'Reset Form' }
                          ]}
                        />
                      </div>
                    )}
                  </div>

                  {btn.actionType === "link" && (
                    <div className="flex items-center gap-3 pt-1">
                      <label className="text-[9px] font-black uppercase tracking-widest text-slate-400">Open in:</label>
                      <Sel
                        value={btn.target || "_self"}
                        onChange={(e) => {
                          const newButtons = [...buttonItems];
                          newButtons[idx] = { ...btn, target: e.target.value };
                          onChange({ buttons: newButtons, label: undefined, link: undefined });
                        }}
                        opts={[
                          { v: '_self', l: 'Same Window' },
                          { v: '_blank', l: 'New Window' }
                        ]}
                        style={{ padding: '4px', fontSize: '11px', width: '120px' }}
                      />
                    </div>
                  )}
                </div>
             ))}

             <button 
                className="btn btn-outline"
                style={{ width: '100%', display: 'flex', justifyContent: 'center', fontSize: '11px', padding: '10px', borderStyle: 'dashed' }}
                onClick={() => {
                  const newButtons = [...buttonItems, { id: Math.random().toString(36).substr(2, 9), label: "New Button", actionType: "link", link: "#" }];
                  onChange({ buttons: newButtons, label: undefined, link: undefined });
                }}
              >
                <PlusCircle size={14} style={{ marginRight: 6 }}/> Add Button
              </button>
          </div>
        );

      case "cta":
        return (
          <div className="space-y-3 bg-slate-50/50 p-3 rounded-xl border border-slate-100">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1 block">Title</label>
                <Inp value={item.title || ""} onChange={(e) => onChange({ title: e.target.value })} />
              </div>
              <div>
                <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1 block">Subtitle</label>
                <Inp value={item.subtitle || ""} onChange={(e) => onChange({ subtitle: e.target.value })} />
              </div>
            </div>
            <textarea placeholder="CTA Description" value={item.description || ""} onChange={(e) => onChange({ description: e.target.value })} className="textarea text-xs min-h-[60px]" style={{ width: '100%' }} />
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1 block">Button Text</label>
                <Inp value={item.buttonLabel || ""} onChange={(e) => onChange({ buttonLabel: e.target.value })} />
              </div>
              <div>
                <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1 block">Button Link</label>
                <Inp value={item.buttonLink || ""} onChange={(e) => onChange({ buttonLink: e.target.value })} />
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
                  <button 
                    className="btn btn-ghost"
                    style={{ padding: '4px', color: '#f43f5e' }}
                    onClick={() => {
                      const newItems = item.items.filter((_: any, i: number) => i !== idx);
                      onChange({ items: newItems });
                    }}
                  >
                    <Trash size={12} />
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-2 mb-2">
                  <Inp placeholder="Title" value={card.title || ""} onChange={(e) => {
                    const newItems = [...item.items];
                    newItems[idx] = { ...card, title: e.target.value };
                    onChange({ items: newItems });
                  }} />
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                       <label className="text-[10px] font-bold text-slate-500">Image URL</label>
                       <MediaLibraryModal onSelect={(m) => {
                          const newItems = [...item.items];
                          newItems[idx] = { ...card, image: m.url };
                          onChange({ items: newItems });
                       }} />
                    </div>
                    <Inp placeholder="Image URL" value={card.image || ""} onChange={(e) => {
                      const newItems = [...item.items];
                      newItems[idx] = { ...card, image: e.target.value };
                      onChange({ items: newItems });
                    }} />
                  </div>
                </div>
                <textarea placeholder="Description" value={card.description || ""} onChange={(e) => {
                  const newItems = [...item.items];
                  newItems[idx] = { ...card, description: e.target.value };
                  onChange({ items: newItems });
                }} className="textarea text-[11px] h-14 min-h-[50px] border-slate-200" style={{ width: '100%' }} />
              </div>
            ))}
            <button className="btn btn-outline" style={{ width: '100%', fontSize: '11px', padding: '6px', borderStyle: 'dashed' }} onClick={() => {
              const newItems = [...(item.items || []), { title: "", description: "", image: "", link: "" }];
              onChange({ items: newItems });
            }}>+ Add Card</button>
          </div>
        );

      case "features":
        return (
          <div className="space-y-3">
            {(item.items || []).map((feature: any, idx: number) => (
              <div key={idx} className="flex gap-2 items-start bg-slate-50/50 p-3 rounded-xl border border-slate-100 group/feat">
                <div className="flex-1 space-y-2">
                  <Inp placeholder="Feature Title" value={feature.title || ""} onChange={(e) => {
                    const newItems = [...item.items];
                    newItems[idx] = { ...feature, title: e.target.value };
                    onChange({ items: newItems });
                  }} />
                  <textarea placeholder="Feature description" value={feature.description || ""} onChange={(e) => {
                    const newItems = [...item.items];
                    newItems[idx] = { ...feature, description: e.target.value };
                    onChange({ items: newItems });
                  }} className="textarea text-[11px] h-14 min-h-[50px] border-slate-200" style={{ width: '100%' }} />
                </div>
                <button className="btn btn-ghost" style={{ padding: '4px', color: '#f43f5e' }} onClick={() => {
                  const newItems = item.items.filter((_: any, i: number) => i !== idx);
                  onChange({ items: newItems });
                }}><Trash size={12} /></button>
              </div>
            ))}
            <button className="btn btn-outline" style={{ width: '100%', fontSize: '11px', padding: '6px', borderStyle: 'dashed' }} onClick={() => {
              const newItems = [...(item.items || []), { title: "", description: "" }];
              onChange({ items: newItems });
            }}>+ Add Feature</button>
          </div>
        );

      case "testimonial":
        return (
          <div className="space-y-3 bg-slate-50/50 p-3 rounded-xl border border-slate-100">
            <textarea placeholder="Quote" value={item.quote || ""} onChange={(e) => onChange({ quote: e.target.value })} className="textarea text-sm italic border-slate-200" style={{ width: '100%' }} />
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1 block">Author Name</label>
                <Inp value={item.author || ""} onChange={(e) => onChange({ author: e.target.value })} />
              </div>
              <div>
                <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1 block">Role/Company</label>
                <Inp value={item.role || ""} onChange={(e) => onChange({ role: e.target.value })} />
              </div>
            </div>
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                 <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 block">Avatar URL</label>
                 <MediaLibraryModal onSelect={(m) => onChange({ avatar: m.url })} />
              </div>
              <Inp value={item.avatar || ""} onChange={(e) => onChange({ avatar: e.target.value })} />
            </div>
          </div>
        );

      case "list":
        return (
          <div className="space-y-2">
            {(item.items || []).map((li: string, idx: number) => (
              <div key={idx} className="flex gap-2">
                <Inp
                  value={li}
                  placeholder={`Item ${idx + 1}`}
                  onChange={(e) => {
                    const newItems = [...(item.items || [])];
                    newItems[idx] = e.target.value;
                    onChange({ items: newItems });
                  }}
                />
                <button
                  className="btn btn-ghost"
                  style={{ padding: '4px', color: '#f43f5e' }}
                  onClick={() => {
                    const newItems = (item.items || []).filter((_: any, i: number) => i !== idx);
                    onChange({ items: newItems });
                  }}
                >
                  <Trash size={12} />
                </button>
              </div>
            ))}
            <button
              className="btn btn-outline"
              style={{ width: '100%', fontSize: '11px', padding: '6px', borderStyle: 'dashed' }}
              onClick={() => {
                const newItems = [...(item.items || []), ""];
                onChange({ items: newItems });
              }}
            >
              + Add List Item
            </button>
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
            <button
              className="btn btn-ghost" style={{ padding: '4px', borderRadius: '8px' }}
              onClick={onMoveUp}
              disabled={isFirst}
            >
              <ChevronUp size={12} />
            </button>
            <button
              className="btn btn-ghost" style={{ padding: '4px', borderRadius: '8px' }}
              onClick={onMoveDown}
              disabled={isLast}
            >
              <ChevronDown size={12} />
            </button>
          </div>
          
          <button
            className="btn btn-ghost" style={{ padding: '6px', color: '#f43f5e', borderRadius: '10px' }}
            onClick={onRemove}
          >
            <Trash size={14} />
          </button>
        </div>
      </div>

      <div className="pl-0">{renderFields()}</div>
    </div>
  );
};
