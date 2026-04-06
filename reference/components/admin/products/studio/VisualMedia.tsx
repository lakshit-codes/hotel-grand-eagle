import React from "react";
import { Image as ImageIcon, ImagePlus, Star, Trash2, Plus } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { SectionCard } from "./Common";
import { ProductGalleryItem, readFileAsDataUrl } from "@/lib/admin-products/utils";
import { MediaLibraryModal } from "../../media/MediaLibraryModal";

interface VisualMediaProps {
  gallery: ProductGalleryItem[];
  primaryImageId: string;
  galleryUrlDraft: string;
  onGalleryChange: (gallery: ProductGalleryItem[]) => void;
  onPrimaryImageChange: (id: string) => void;
  onGalleryUrlDraftChange: (value: string) => void;
  onAddGalleryItem: (item: ProductGalleryItem) => void;
}

export function VisualMedia({
  gallery,
  primaryImageId,
  galleryUrlDraft,
  onGalleryChange,
  onPrimaryImageChange,
  onGalleryUrlDraftChange,
  onAddGalleryItem,
}: VisualMediaProps) {
  const handleGalleryUpload = async (files: FileList | null) => {
    if (!files) return;
    for (const file of Array.from(files)) {
      if (!file.type.startsWith("image/")) continue;
      const url = await readFileAsDataUrl(file);
      const id = `gal-${Date.now()}-${Math.random().toString(36).slice(2, 5)}`;
      onAddGalleryItem({ id, url, alt: file.name, order: gallery.length });
    }
  };

  const handleAddRemoteUrl = () => {
    if (!galleryUrlDraft) return;
    const id = `gal-url-${Date.now()}`;
    onAddGalleryItem({
      id,
      url: galleryUrlDraft,
      alt: "",
      order: gallery.length,
    });
    onGalleryUrlDraftChange("");
  };

  return (
    <SectionCard
      icon={<ImageIcon className="text-purple-500" size={16} />}
      title="Visual Media"
    >
      <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
        <AnimatePresence mode="popLayout">
          {gallery.map((item) => (
            <motion.div
              layout
              key={item.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className={`relative aspect-square group rounded-xl overflow-hidden border transition-all ${
                primaryImageId === item.id
                  ? "border-slate-900 shadow-sm"
                  : "border-slate-100"
              }`}
            >
              <img src={item.url} alt="" className="h-full w-full object-cover" />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5">
                <button
                  type="button"
                  onClick={() => onPrimaryImageChange(item.id)}
                  className={`p-1.5 rounded-full ${
                    primaryImageId === item.id
                      ? "bg-amber-400 text-white"
                      : "bg-white/20 text-white"
                  }`}
                >
                  <Star
                    size={12}
                    fill={primaryImageId === item.id ? "currentColor" : "none"}
                  />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const nextGallery = gallery.filter((g) => g.id !== item.id);
                    onGalleryChange(nextGallery);
                    if (primaryImageId === item.id) {
                      onPrimaryImageChange(nextGallery[0]?.id || "");
                    }
                  }}
                  className="p-1.5 rounded-full bg-rose-500 text-white"
                >
                  <Trash2 size={12} />
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        <MediaLibraryModal
          onSelect={(media) => {
            const id = `gal-${Date.now()}-${Math.random().toString(36).slice(2, 5)}`;
            onAddGalleryItem({
              id,
              url: media.url,
              alt: media.alt || "",
              order: gallery.length,
            });
          }}
          trigger={
            <div className="aspect-square flex flex-col items-center justify-center gap-1 rounded-xl border-2 border-dashed border-slate-200 bg-slate-50/50 hover:bg-slate-50 cursor-pointer transition-all h-full w-full">
              <ImagePlus className="text-slate-400" size={18} />
              <span className="text-[8px] font-black uppercase text-slate-400">
                Add
              </span>
            </div>
          }
        />
      </div>
    </SectionCard>
  );
}
