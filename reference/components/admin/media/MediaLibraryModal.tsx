"use client";

import React, { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { MediaUploader } from "./MediaManage";
import { Button } from "@/components/ui/button";
import { ImageIcon, X } from "lucide-react";

interface MediaLibraryModalProps {
  onSelect: (media: { url: string; alt: string }) => void;
  trigger?: React.ReactNode;
}

export const MediaLibraryModal = ({
  onSelect,
  trigger,
}: MediaLibraryModalProps) => {
  const [open, setOpen] = useState(false);

  const handleSelect = (media: any) => {
    onSelect({
      url: media.url,
      alt: media.alt || "",
    });
    setOpen(false);
  };

  return (
    <>
      <div onClick={() => setOpen(true)} className="cursor-pointer">
        {trigger || (
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 rounded-lg text-slate-400 hover:text-slate-600 transition-colors"
          >
            <ImageIcon size={14} />
          </Button>
        )}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="!h-[90vh] !max-w-[90vw] w-[90vw] !p-0 overflow-hidden border-none bg-transparent shadow-none [&>button]:hidden">
          <div className="bg-white rounded-3xl overflow-hidden shadow-2xl border border-slate-200 flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-slate-50/50">
              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  Media Library
                </h2>
                <p className="text-xs text-slate-500 font-medium tracking-wide pt-0.5">
                  Select or upload media for your page
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setOpen(false)}
                className="rounded-xl text-slate-400 hover:text-slate-900"
              >
                <X size={20} />
              </Button>
            </div>

            <div className="flex-1 overflow-y-auto">
              <MediaUploader onSelect={handleSelect} hideHeader={true} />
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
