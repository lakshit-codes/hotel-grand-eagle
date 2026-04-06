"use client";

import React, { useState, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Upload,
  Download,
  FileJson,
  X,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { toast } from "sonner";

interface ImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (data: any[]) => Promise<any>;
  sampleData: any[];
  title: string;
  description: string;
  fileName: string;
}

export function ImportModal({
  isOpen,
  onClose,
  onImport,
  sampleData,
  title,
  description,
  fileName,
}: ImportModalProps) {
  const [file, setFile] = useState<File | null>(null);
  const [previewData, setPreviewData] = useState<any[]>([]);
  const [isImporting, setIsImporting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    if (selectedFile.type !== "application/json") {
      toast.error("Please upload a valid JSON file.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        if (Array.isArray(json)) {
          setPreviewData(json.slice(0, 5));
          setFile(selectedFile);
        } else {
          toast.error("JSON must be an array of records.");
        }
      } catch (err) {
        toast.error("Failed to parse JSON file.");
      }
    };
    reader.readAsText(selectedFile);
  };

  const handleDownloadSample = () => {
    const dataStr = JSON.stringify(sampleData, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const exportFileDefaultName = `${fileName}_sample.json`;

    const linkElement = document.createElement("a");
    linkElement.setAttribute("href", url);
    linkElement.setAttribute("download", exportFileDefaultName);
    linkElement.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = async () => {
    if (!file) return;

    setIsImporting(true);
    try {
      const reader = new FileReader();
      reader.onload = async (event) => {
        try {
          const json = JSON.parse(event.target?.result as string);
          const result = await onImport(json);
          toast.success(result.message || "Import completed successfully");
          handleClose();
        } catch (err: any) {
          toast.error(err.message || "Import failed.");
        } finally {
          setIsImporting(false);
        }
      };
      reader.readAsText(file);
    } catch (err) {
      toast.error("Failed to read file.");
      setIsImporting(false);
    }
  };

  const handleClose = () => {
    setFile(null);
    setPreviewData([]);
    setIsImporting(false);
    onClose();
  };

  const removeFile = () => {
    setFile(null);
    setPreviewData([]);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-5xl sm:rounded-3xl border-slate-100 shadow-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <div className="p-2 bg-slate-900 text-white rounded-xl">
              <FileJson size={20} />
            </div>
            {title}
          </DialogTitle>
          <DialogDescription className="text-slate-500">
            {description}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {!file ? (
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-slate-200 rounded-2xl p-8 flex flex-col items-center justify-center gap-3 cursor-pointer hover:border-slate-400 hover:bg-slate-50 transition-all group"
            >
              <div className="p-4 bg-slate-100 text-slate-400 group-hover:bg-slate-200 group-hover:text-slate-600 rounded-full transition-colors">
                <Upload size={24} />
              </div>
              <div className="text-center">
                <p className="text-sm font-bold text-slate-700">
                  Click to upload or drag and drop
                </p>
                <p className="text-xs text-slate-400">JSON files only</p>
              </div>
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept=".json"
                onChange={handleFileChange}
              />
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-emerald-50 border border-emerald-100 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-emerald-100 text-emerald-600 rounded-lg">
                    <CheckCircle2 size={18} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-emerald-900">
                      {file.name}
                    </p>
                    <p className="text-[10px] text-emerald-600 font-medium">
                      Ready to import
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-emerald-600 hover:bg-emerald-100 rounded-lg"
                  onClick={removeFile}
                >
                  <X size={16} />
                </Button>
              </div>

              {previewData.length > 0 && (
                <div className="space-y-2">
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
                    Preview (First {previewData.length} records)
                  </p>
                  <div className="rounded-xl border border-slate-100 overflow-hidden bg-slate-50/50">
                    <Table>
                      <TableHeader className="bg-slate-100/50">
                        <TableRow className="hover:bg-transparent border-slate-100">
                          <TableHead className="text-[9px] font-black uppercase text-slate-500 px-3 py-2">
                            Name/Title
                          </TableHead>
                          <TableHead className="text-[9px] font-black uppercase text-slate-500 px-3 py-2">
                            Identifier
                          </TableHead>
                          <TableHead className="text-right text-[9px] font-black uppercase text-slate-500 px-3 py-2">
                            Fields
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {previewData.map((item, idx) => (
                          <TableRow
                            key={idx}
                            className="border-slate-100 hover:bg-white transition-colors"
                          >
                            <TableCell className="text-[11px] font-bold text-slate-700 px-3 py-2">
                              {item.name || item.title || "Untitled"}
                            </TableCell>
                            <TableCell className="text-[10px] font-mono text-slate-500 px-3 py-2">
                              {item.sku || item.slug || item.key || "-"}
                            </TableCell>
                            <TableCell className="text-right text-[10px] text-slate-400 px-3 py-2 font-medium">
                              {Object.keys(item).length}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="flex items-center justify-between px-1">
            <Button
              variant="link"
              className="text-xs text-slate-600 font-bold p-0 h-auto gap-2 hover:text-slate-900"
              onClick={handleDownloadSample}
            >
              <Download size={14} />
              Sample JSON
            </Button>
            <div className="flex items-center gap-2 text-[11px] text-slate-400 font-medium">
              <AlertCircle size={12} className="text-amber-500" />
              Existing items will be skipped
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0 pt-2">
          <Button
            variant="ghost"
            onClick={handleClose}
            className="rounded-xl text-slate-500 font-bold px-6"
          >
            Cancel
          </Button>
          <Button
            onClick={handleImport}
            disabled={!file || isImporting}
            className="rounded-xl bg-slate-900 text-white hover:bg-slate-800 px-8 font-bold shadow-lg shadow-slate-200"
          >
            {isImporting ? (
              <>
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white mr-2" />
                Importing...
              </>
            ) : (
              "Start Import"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
