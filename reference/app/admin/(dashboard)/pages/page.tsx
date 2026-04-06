"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/lib/store/hooks";
import { fetchPagesThunk, deletePageThunk } from "@/lib/store/pages/pageThunk";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Plus,
  Edit,
  Trash,
  Globe,
  FileText,
} from "lucide-react";
import { toast } from "sonner";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store/store";
import { Page } from "@/lib/store/pages/pageType";

function PagesPageContent() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { allPages: pages, isLoading: loading } = useSelector(
    (state: RootState) => state.pages
  );

  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    dispatch(fetchPagesThunk());
  }, [dispatch]);

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete the page "${title}"?`)) return;

    setDeletingId(id);
    const toastId = toast.loading(`Deleting ${title}...`);

    try {
      const resultAction = await dispatch(deletePageThunk(id));
      if (deletePageThunk.fulfilled.match(resultAction)) {
        toast.success(`${title} deleted successfully`, { id: toastId });
      } else {
        toast.error(`Delete failed: ${resultAction.payload || "Unknown error"}`, { id: toastId });
      }
    } catch (err) {
      toast.error("Network error. Please try again.", { id: toastId });
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Pages CMS
          </h1>
          <p className="text-sm text-slate-500">
            Manage your website content pages and structure.
          </p>
        </div>
        <Button
          className="rounded-xl bg-slate-900 text-white hover:bg-slate-800 gap-2 shadow-lg shadow-slate-200"
          onClick={() => router.push("/admin/pages/new")}
        >
          <Plus className="h-4 w-4" /> Add New Page
        </Button>
      </div>

      <div className="rounded-3xl border border-slate-100 bg-white overflow-hidden shadow-sm shadow-slate-200/50">
        <Table>
          <TableHeader className="bg-slate-50/50">
            <TableRow className="hover:bg-transparent border-slate-100">
              <TableHead className="font-bold text-slate-500 uppercase tracking-wider text-[10px]">
                Page Title
              </TableHead>
              <TableHead className="font-bold text-slate-500 uppercase tracking-wider text-[10px]">
                Slug
              </TableHead>
              <TableHead className="font-bold text-slate-500 uppercase tracking-wider text-[10px]">
                Status
              </TableHead>
              <TableHead className="font-bold text-slate-500 uppercase tracking-wider text-[10px]">
                Last Updated
              </TableHead>
              <TableHead className="text-right font-bold text-slate-500 uppercase tracking-wider text-[10px]">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center h-48">
                  <div className="flex flex-col items-center gap-3">
                    <div className="h-6 w-6 animate-spin rounded-full border-2 border-slate-200 border-t-slate-900" />
                    <span className="text-xs text-slate-400 font-bold uppercase tracking-widest">
                      Loading Pages...
                    </span>
                  </div>
                </TableCell>
              </TableRow>
            ) : pages.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="text-center h-48 text-slate-400"
                >
                  No CMS pages found. Create your first page!
                </TableCell>
              </TableRow>
            ) : (
              pages.map((page: Page) => (
                <TableRow
                  key={page._id}
                  className="hover:bg-slate-50/50 border-slate-50 transition-colors"
                >
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 border border-slate-100">
                        <FileText size={20} />
                      </div>
                      <div className="flex flex-col">
                        <span className="font-bold text-slate-700 text-sm">
                          {page.title}
                        </span>
                        <div className="flex items-center gap-1 text-[10px] text-slate-400">
                          <Globe size={10} />
                          <span>/{page.slug}</span>
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="font-mono text-xs text-slate-500">
                    /{page.slug}
                  </TableCell>
                  <TableCell>
                    <span
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider ${
                        page.isPublished
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-slate-100 text-slate-500"
                      }`}
                    >
                      {page.isPublished ? "Published" : "Draft"}
                    </span>
                  </TableCell>
                  <TableCell className="text-xs text-slate-500">
                    {page.updatedAt ? new Date(page.updatedAt).toLocaleDateString() : 'N/A'}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50"
                        onClick={() => router.push(`/admin/pages/${page._id}/edit`)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                        disabled={deletingId === page._id}
                        onClick={() =>
                          page._id &&
                          handleDelete(page._id, page.title)
                        }
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

export default function PagesPage() {
  return (
    <Suspense fallback={<div>Loading Pages CMS...</div>}>
      <PagesPageContent />
    </Suspense>
  );
}
