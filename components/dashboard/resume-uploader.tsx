"use client";

import { useRef, useState } from "react";
import { FileUp, Loader2, UploadCloud } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast-provider";
import { useResumeAnalysis } from "@/hooks/use-resume-analysis";
import { normalizeAnalysis } from "@/lib/resume-analysis";
import { cn } from "@/lib/utils";

export function ResumeUploader({ compact = false }: { compact?: boolean }) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const { toast } = useToast();
  const { setAnalysis } = useResumeAnalysis();
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  async function upload(file?: File) {
    if (!file) return;
    if (!file.name.match(/\.(pdf|docx|doc)$/i)) {
      toast({ variant: "error", title: "Unsupported file", description: "Upload a PDF or DOCX resume." });
      return;
    }

    setUploading(true);
    setProgress(18);
    const timer = window.setInterval(() => setProgress((value) => Math.min(value + 12, 88)), 280);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("targetRole", "Software Engineering Intern");

      const response = await fetch("/api/resume/upload", { method: "POST", body: formData });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error || "Upload failed");

      setAnalysis(normalizeAnalysis(payload?.analysis));
      setProgress(100);
      toast({ title: "Resume analyzed", description: "ATS score and improvement plan are ready." });
    } catch (error) {
      toast({
        variant: "error",
        title: "Resume upload failed",
        description: error instanceof Error ? error.message : "Please try again."
      });
    } finally {
      window.clearInterval(timer);
      window.setTimeout(() => {
        setUploading(false);
        setProgress(0);
      }, 500);
    }
  }

  return (
    <div
      className={cn(
        "rounded-lg border border-dashed bg-background transition",
        dragging ? "border-primary bg-blue-50/60 dark:bg-blue-950/20" : "border-border",
        compact ? "p-4" : "p-5"
      )}
      onDragOver={(event) => {
        event.preventDefault();
        setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={(event) => {
        event.preventDefault();
        setDragging(false);
        void upload(event.dataTransfer.files[0]);
      }}
    >
      <input
        ref={inputRef}
        type="file"
        className="hidden"
        accept=".pdf,.doc,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        onChange={(event) => void upload(event.target.files?.[0])}
      />
      <div className={cn("flex gap-4", compact ? "items-center" : "flex-col sm:flex-row sm:items-center")}>
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground">
          {uploading ? <Loader2 className="h-5 w-5 animate-spin" /> : <UploadCloud className="h-5 w-5" />}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium">{uploading ? "Analyzing resume..." : "Upload resume"}</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Drop a PDF or DOCX here, or choose a file from your computer.
          </p>
          {uploading && (
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-muted">
              <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${progress}%` }} />
            </div>
          )}
        </div>
        <Button type="button" variant={compact ? "outline" : "default"} onClick={() => inputRef.current?.click()} disabled={uploading}>
          <FileUp className="h-4 w-4" />
          Choose file
        </Button>
      </div>
    </div>
  );
}
