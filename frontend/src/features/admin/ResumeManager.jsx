import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { API_BASE_URL } from "@/app/config";
import {
  HiOutlineUpload,
  HiOutlineTrash,
  HiOutlinePencil,
  HiOutlineDownload,
  HiOutlineDocumentDownload,
  HiOutlinePlus,
  HiX,
} from "react-icons/hi";

const SUGGESTIONS = [
  "Frontend Developer Resume",
  "Full Stack Developer Resume",
  "React Developer Resume",
  "Software Engineer Resume",
  "Network Engineer Resume",
];

export default function ResumeManager() {
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fileInputRef = useRef(null);
  const editFileInputRef = useRef(null);

  // Form states (Upload / Edit)
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [roleName, setRoleName] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  // Edit states
  const [editingResume, setEditingResume] = useState(null);
  const [editRoleName, setEditRoleName] = useState("");
  const [editFile, setEditFile] = useState(null);

  const token = localStorage.getItem("adminToken");

  const fetchResumes = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/resume`);
      const data = await response.json();
      if (response.ok && data.success) {
        setResumes(data.resumes || []);
      }
    } catch (err) {
      console.error("Fetch resumes error:", err);
      setError("Failed to fetch resumes from database.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResumes();
  }, []);

  const handleFileChange = (e, isEdit = false) => {
    const file = e.target.files[0];
    if (!file) return;

    // Check size limit (5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError("File size exceeds 5MB limit. Please upload a smaller file.");
      e.target.value = null;
      return;
    }

    // Check mime type (PDF only)
    if (file.type !== "application/pdf") {
      setError("Only PDF files are allowed.");
      e.target.value = null;
      return;
    }

    setError("");
    if (isEdit) {
      setEditFile(file);
    } else {
      setSelectedFile(file);
    }
  };

  const handleUploadSubmit = async (e) => {
    e.preventDefault();
    if (!roleName || !selectedFile) {
      setError("Please fill in the role name and select a PDF file.");
      return;
    }

    setUploading(true);
    setError("");
    setSuccess("");

    const formData = new FormData();
    formData.append("roleName", roleName);
    formData.append("resume", selectedFile);

    try {
      const response = await fetch(`${API_BASE_URL}/resume`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setSuccess("Resume uploaded successfully!");
        setRoleName("");
        setSelectedFile(null);
        setShowUploadForm(false);
        fetchResumes();
      } else {
        setError(data.message || "Failed to upload resume.");
      }
    } catch (err) {
      console.error("Upload error:", err);
      setError("Connection error while uploading file.");
    } finally {
      setUploading(false);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!editRoleName) {
      setError("Role name cannot be empty.");
      return;
    }

    setUploading(true);
    setError("");
    setSuccess("");

    const formData = new FormData();
    formData.append("roleName", editRoleName);
    if (editFile) {
      formData.append("resume", editFile);
    }

    try {
      const response = await fetch(`${API_BASE_URL}/resume/${editingResume._id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setSuccess("Resume updated successfully!");
        setEditingResume(null);
        setEditRoleName("");
        setEditFile(null);
        fetchResumes();
      } else {
        setError(data.message || "Failed to update resume.");
      }
    } catch (err) {
      console.error("Edit error:", err);
      setError("Connection error while updating file.");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this resume? This cannot be undone.")) {
      return;
    }

    setError("");
    setSuccess("");

    try {
      const response = await fetch(`${API_BASE_URL}/resume/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setSuccess("Resume deleted successfully!");
        fetchResumes();
      } else {
        setError(data.message || "Failed to delete resume.");
      }
    } catch (err) {
      console.error("Delete error:", err);
      setError("Connection error while deleting file.");
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-100">Resume Management</h1>
          <p className="text-xs text-text-400 mt-1">
            Upload and configure multiple resumes for different target roles.
          </p>
        </div>

        <button
          onClick={() => {
            setEditingResume(null);
            setShowUploadForm(!showUploadForm);
            setError("");
            setSuccess("");
          }}
          className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white text-xs font-semibold rounded-xl hover:bg-primary-light transition-colors cursor-pointer shadow-md shadow-primary/20 self-start"
        >
          {showUploadForm ? <HiX size={15} /> : <HiOutlinePlus size={15} />}
          {showUploadForm ? "Cancel" : "Add Resume"}
        </button>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-error/10 border border-error/20 text-xs text-error font-medium">
          {error}
        </div>
      )}

      {success && (
        <div className="p-4 rounded-xl bg-success/10 border border-success/20 text-xs text-success font-medium">
          {success}
        </div>
      )}

      {/* Upload Form (Collapsible) */}
      <AnimatePresence>
        {showUploadForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <form onSubmit={handleUploadSubmit} className="glass-card rounded-2xl p-6 sm:p-8 space-y-6">
              <h3 className="text-base font-bold text-text-100 flex items-center gap-2 border-b border-surface-600/20 pb-4">
                <HiOutlineUpload size={18} className="text-primary-light" />
                Upload New Resume
              </h3>

              <div className="space-y-6">
                <div>
                  <label className="block text-xs font-semibold text-text-400 uppercase tracking-wider mb-2">
                    Target Role Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Frontend Developer"
                    value={roleName}
                    onChange={(e) => setRoleName(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-surface-600/50 bg-surface-800/40 text-text-100 text-sm focus:outline-none focus:border-primary transition-all duration-200"
                  />

                  {/* Suggestions list */}
                  <div className="flex flex-wrap gap-1.5 mt-2.5">
                    {SUGGESTIONS.map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setRoleName(s)}
                        className="px-2 py-1 bg-surface-700/60 hover:bg-surface-600 border border-surface-600/40 text-[10px] text-text-400 hover:text-text-200 rounded-md transition-colors cursor-pointer"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-text-400 uppercase tracking-wider mb-2">
                    Upload Resume PDF (Max 5MB)
                  </label>
                  <div className="flex items-center justify-center w-full">
                    <label className="flex flex-col items-center justify-center w-full h-36 border-2 border-primary/30 border-dashed rounded-xl cursor-pointer bg-surface-800/10 hover:bg-surface-800/30 hover:border-primary transition-all duration-200">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <HiOutlineDocumentDownload className="w-8 h-8 text-primary mb-2" />
                        <p className="text-xs text-text-200 font-semibold mb-1">
                          Click here to choose PDF file
                        </p>
                        <p className="text-[10px] text-text-500 font-mono">
                          Supports Files, Gallery (PDF format, up to 5MB)
                        </p>
                      </div>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept=".pdf"
                        required
                        onChange={(e) => handleFileChange(e)}
                        className="hidden"
                      />
                    </label>
                  </div>

                  {selectedFile && (
                    <div className="mt-3 text-xs text-primary-light font-medium flex items-center gap-2 bg-primary/8 p-3 rounded-xl border border-primary/20">
                      Selected File: <span className="text-text-200 font-mono font-bold break-all">{selectedFile.name}</span>
                    </div>
                  )}
                </div>
              </div>

              <button
                type="submit"
                onClick={(e) => {
                  if (!selectedFile) {
                    e.preventDefault();
                    fileInputRef.current?.click();
                  }
                }}
                disabled={uploading}
                className="w-full inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-primary text-white text-xs font-semibold rounded-xl hover:bg-primary-light transition-all duration-200 cursor-pointer shadow-md shadow-primary/25 disabled:opacity-50"
              >
                {uploading ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    {selectedFile ? "Upload Resume" : "Choose File & Upload"}
                    <HiOutlineUpload size={14} />
                  </>
                )}
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Edit Form Modal */}
      <AnimatePresence>
        {editingResume && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-surface-800 border border-surface-600/40 rounded-2xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative"
            >
              <button
                onClick={() => setEditingResume(null)}
                className="absolute top-4 right-4 p-1.5 rounded-lg hover:bg-surface-700 text-text-400 hover:text-text-100 transition-colors"
              >
                <HiX size={18} />
              </button>

              <h3 className="text-lg font-bold text-text-100 flex items-center gap-2 mb-6 border-b border-surface-600/20 pb-4">
                <HiOutlinePencil size={20} className="text-primary-light" />
                Edit Resume details
              </h3>

              <form onSubmit={handleEditSubmit} className="space-y-5">
                <div>
                  <label className="block text-xs font-semibold text-text-400 uppercase tracking-wider mb-2">
                    Target Role Name
                  </label>
                  <input
                    type="text"
                    required
                    value={editRoleName}
                    onChange={(e) => setEditRoleName(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-surface-600/50 bg-surface-900 text-text-100 text-sm focus:outline-none focus:border-primary transition-all duration-200"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-text-400 uppercase tracking-wider mb-2">
                    Replace Resume PDF (Optional)
                  </label>
                  <div className="flex items-center justify-center w-full">
                    <label className="flex flex-col items-center justify-center w-full h-28 border-2 border-surface-600/50 border-dashed rounded-xl cursor-pointer bg-surface-900 hover:bg-surface-800/50 transition-all duration-200">
                      <div className="flex flex-col items-center justify-center pt-4 pb-4">
                        <HiOutlineDocumentDownload className="w-6 h-6 text-text-400 mb-1" />
                        <p className="text-xs text-text-300 font-semibold">
                          Click to select a new PDF file
                        </p>
                      </div>
                      <input
                        type="file"
                        accept=".pdf"
                        onChange={(e) => handleFileChange(e, true)}
                        className="hidden"
                      />
                    </label>
                  </div>

                  {editFile && (
                    <div className="mt-2 text-xs text-primary-light font-medium flex items-center gap-1.5">
                      New PDF: <span className="text-text-300 font-mono">{editFile.name}</span>
                    </div>
                  )}
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-surface-600/20">
                  <button
                    type="button"
                    onClick={() => setEditingResume(null)}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-text-400 hover:text-text-200 border border-surface-600/50 hover:bg-surface-700/50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={uploading}
                    className="inline-flex items-center justify-center gap-2 px-5 py-2 bg-primary text-white text-xs font-semibold rounded-xl hover:bg-primary-light transition-all duration-200 cursor-pointer shadow-md shadow-primary/25 disabled:opacity-50"
                  >
                    {uploading ? (
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        Save Changes
                        <HiOutlinePencil size={12} />
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Resumes List */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
        </div>
      ) : resumes.length === 0 ? (
        <div className="glass-card rounded-2xl p-8 text-center text-xs text-text-500">
          No resumes uploaded yet. Click "Add Resume" above to upload your first resume.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {resumes.map((res) => (
            <motion.div
              key={res._id}
              layout
              className="glass-card rounded-2xl p-5 border border-surface-500/10 flex flex-col justify-between hover:border-primary/30 transition-all duration-200"
            >
              <div>
                <span className="text-[10px] font-bold font-mono text-primary-light uppercase tracking-wider">
                  PDF Resume
                </span>
                <h4 className="text-base font-bold text-text-100 mt-1.5">
                  {res.roleName}
                </h4>
                <p className="text-[11px] text-text-500 mt-2 font-mono">
                  Uploaded: {new Date(res.uploadDate || res.createdAt).toLocaleDateString(undefined, {
                    dateStyle: "medium"
                  })}
                </p>
              </div>

              <div className="flex items-center justify-between mt-6 pt-4 border-t border-surface-600/10">
                <div className="flex items-center gap-4">
                  <a
                    href={`${API_BASE_URL}/resume/${res._id}/download`}
                    className="inline-flex items-center gap-1.5 text-xs text-text-300 hover:text-primary transition-colors font-semibold"
                  >
                    <HiOutlineDownload size={15} />
                    Download
                  </a>
                  <a
                    href={`${API_BASE_URL}/resume/${res._id}/view`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs text-text-300 hover:text-primary transition-colors font-semibold"
                  >
                    <svg className="w-3.5 h-3.5 text-text-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    Open
                  </a>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setEditingResume(res);
                      setEditRoleName(res.roleName);
                      setEditFile(null);
                      setError("");
                      setSuccess("");
                    }}
                    className="p-2 rounded-lg hover:bg-surface-700 text-text-400 hover:text-text-200 transition-all cursor-pointer"
                    title="Edit details"
                  >
                    <HiOutlinePencil size={15} />
                  </button>

                  <button
                    onClick={() => handleDelete(res._id)}
                    className="p-2 rounded-lg hover:bg-rose/10 text-rose hover:text-rose-light transition-all cursor-pointer"
                    title="Delete resume"
                  >
                    <HiOutlineTrash size={15} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
