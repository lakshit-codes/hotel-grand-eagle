"use client";

import React, { useState } from "react";
import { PageEditor } from "@/components/admin/cms/PageEditor";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Page } from "@/lib/store/pages/pageType";
import { createPageThunk } from "@/lib/store/pages/pageThunk";
import { useAppDispatch } from "@/lib/store/hooks";

export default function NewPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);

  const handleSave = async (pageData: Page) => {
    setLoading(true);
    const toastId = toast.loading("Creating page...");

    try {
      const resultAction = await dispatch(createPageThunk(pageData));
      if (createPageThunk.fulfilled.match(resultAction)) {
        toast.success("Page created successfully", { id: toastId });
        router.push("/admin/pages");
      } else {
        toast.error(
          `Failed to create page: ${resultAction.payload || "Unknown error"}`,
          { id: toastId },
        );
      }
    } catch (err) {
      toast.error("Network error. Please try again.", { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-10">
      <PageEditor onSave={handleSave} isLoading={loading} />
    </div>
  );
}
