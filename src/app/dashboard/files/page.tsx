import { FileManager } from "@/components/files/file-manager";

export default function FilesPage() {
  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="font-display text-3xl mb-2">File Manager</h1>
        <p className="text-sm text-muted">
          Upload InBody reports, blood test results, and other documents —
          stored privately, visible to you and your coach.
        </p>
      </div>
      <FileManager />
    </div>
  );
}
