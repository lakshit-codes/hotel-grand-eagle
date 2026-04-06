"use client";

import React, { useState } from "react";
import { Image as ImageIcon, X } from "lucide-react";
import { Btn, Inp } from "../ui";

interface MediaLibraryModalProps {
  onSelect: (media: { url: string; alt: string }) => void;
  trigger?: React.ReactNode;
}

export const MediaLibraryModal = ({
  onSelect,
  trigger,
}: MediaLibraryModalProps) => {
  const [open, setOpen] = useState(false);
  const [url, setUrl] = useState("");
  const [alt, setAlt] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;
    onSelect({ url, alt });
    setOpen(false);
    setUrl("");
    setAlt("");
  };

  return (
    <>
      <div onClick={() => setOpen(true)} className="cursor-pointer" style={{ display: 'inline-block' }}>
        {trigger || (
          <Btn variant="outline" size="sm" style={{ padding: "8px" }}>
            <ImageIcon size={14} /> 
          </Btn>
        )}
      </div>

      {open && (
        <div className="modal-overlay" onClick={() => setOpen(false)} style={{ zIndex: 9999 }}>
          <div className="modal-box modal-box-sm" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <span className="modal-title">Select Image</span>
              <button className="modal-close" onClick={() => setOpen(false)}>
                <X size={18} />
              </button>
            </div>
            <div className="modal-body">
               <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  <div>
                    <label style={{ fontSize: 11, fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', marginBottom: 6, display: 'block' }}>Image URL</label>
                    <Inp value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://example.com/image.jpg" autoFocus />
                  </div>
                  <div>
                    <label style={{ fontSize: 11, fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', marginBottom: 6, display: 'block' }}>Alt Text</label>
                    <Inp value={alt} onChange={(e) => setAlt(e.target.value)} placeholder="Description of image..." />
                  </div>
                  <div style={{ marginTop: 8, display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
                    <Btn type="button" variant="ghost" onClick={() => setOpen(false)}>Cancel</Btn>
                    <Btn onClick={handleSubmit} disabled={!url.trim()}>Insert Image</Btn>
                  </div>
               </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
