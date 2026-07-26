"use client";

import { useState, useEffect } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { FormField } from "@/components/ui/FormField";

interface ProviderFormData {
  title: string;
  description: string;
  location: string;
  workerType?: string;
  pricePerDay?: number;
  pricePerSqFt?: number;
  experience?: number;
  completedProjects?: number;
  imageUrls: string;
  servicesJson?: string;
}

interface ProviderFormModalProps {
  open: boolean;
  onClose: () => void;
  onSaved: () => void;
  type: "worker" | "contractor";
  editId?: string;
  initial?: Partial<ProviderFormData> & {
    portfolio?: string[];
    services?: {
      name: string;
      pricePerSqFt?: number;
      description?: string;
    }[];
  };
}

const emptyWorker: ProviderFormData = {
  title: "",
  description: "",
  location: "",
  workerType: "Painter",
  pricePerDay: 800,
  experience: 1,
  imageUrls: "",
};

const emptyContractor: ProviderFormData = {
  title: "",
  description: "",
  location: "",
  pricePerSqFt: 1000,
  experience: 5,
  completedProjects: 0,
  imageUrls: "",
  servicesJson:
    '[{"name":"Full Construction","pricePerSqFt":1500,"description":"Turnkey"}]',
};

const inputClass = "w-full rounded-lg px-4 py-2.5";

export function ProviderFormModal({
  open,
  onClose,
  onSaved,
  type,
  editId,
  initial,
}: ProviderFormModalProps) {
  const [form, setForm] = useState<ProviderFormData>(
    type === "worker" ? emptyWorker : emptyContractor
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (open && initial) {
      setForm({
        title: initial.title || "",
        description: initial.description || "",
        location: initial.location || "",
        workerType: initial.workerType || "Painter",
        pricePerDay: initial.pricePerDay,
        pricePerSqFt: initial.pricePerSqFt,
        experience: initial.experience,
        completedProjects: initial.completedProjects,
        imageUrls: (initial.portfolio || []).join("\n"),
        servicesJson: initial.services
          ? JSON.stringify(initial.services, null, 2)
          : emptyContractor.servicesJson,
      });
    } else if (open && !editId) {
      setForm(type === "worker" ? emptyWorker : emptyContractor);
    }
  }, [open, initial, editId, type]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const portfolio = form.imageUrls
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);

    const payload: Record<string, unknown> = {
      type,
      title: form.title,
      description: form.description,
      location: form.location,
      experience: form.experience,
      portfolio,
    };

    if (type === "worker") {
      payload.workerType = form.workerType;
      payload.pricePerDay = form.pricePerDay;
    } else {
      payload.pricePerSqFt = form.pricePerSqFt;
      payload.completedProjects = form.completedProjects;
      try {
        payload.services = JSON.parse(form.servicesJson || "[]");
      } catch {
        setError("Invalid services JSON format");
        setLoading(false);
        return;
      }
    }

    const url = editId ? `/api/providers/${editId}` : "/api/providers";
    const method = editId ? "PATCH" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(data.error || "Save failed");
      return;
    }

    onSaved();
    onClose();
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={editId ? `Edit ${type}` : `Add ${type}`}
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <p className="rounded-lg bg-red-500/10 p-3 text-sm text-red-400">
            {error}
          </p>
        )}

        <FormField label="Title" required>
          {(id) => (
            <input
              id={id}
              required
              className={inputClass}
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />
          )}
        </FormField>

        <FormField label="Description">
          {(id) => (
            <textarea
              id={id}
              rows={3}
              className={inputClass}
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
            />
          )}
        </FormField>

        <FormField label="Location" required>
          {(id) => (
            <input
              id={id}
              required
              className={inputClass}
              placeholder="City, State"
              value={form.location}
              onChange={(e) => setForm({ ...form, location: e.target.value })}
            />
          )}
        </FormField>

        {type === "worker" ? (
          <>
            <FormField label="Worker Type" required>
              {(id) => (
                <select
                  id={id}
                  className={inputClass}
                  value={form.workerType}
                  onChange={(e) =>
                    setForm({ ...form, workerType: e.target.value })
                  }
                >
                  {[
                    "Painter",
                    "Carpenter",
                    "Electrician",
                    "Tile Worker",
                    "Plumber",
                  ].map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              )}
            </FormField>

            <FormField label="Price per Day (₹)" required>
              {(id) => (
                <input
                  id={id}
                  type="number"
                  required
                  min={0}
                  className={inputClass}
                  value={form.pricePerDay ?? ""}
                  onChange={(e) =>
                    setForm({ ...form, pricePerDay: Number(e.target.value) })
                  }
                />
              )}
            </FormField>
          </>
        ) : (
          <>
            <FormField label="Price per sq.ft (₹)" required>
              {(id) => (
                <input
                  id={id}
                  type="number"
                  required
                  min={0}
                  className={inputClass}
                  value={form.pricePerSqFt ?? ""}
                  onChange={(e) =>
                    setForm({ ...form, pricePerSqFt: Number(e.target.value) })
                  }
                />
              )}
            </FormField>

            <FormField label="Completed Projects">
              {(id) => (
                <input
                  id={id}
                  type="number"
                  min={0}
                  className={inputClass}
                  value={form.completedProjects ?? ""}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      completedProjects: Number(e.target.value),
                    })
                  }
                />
              )}
            </FormField>

            <FormField
              label="Services (JSON)"
              hint='Format: [{"name":"Renovation","pricePerSqFt":900,"description":"..."}]'
            >
              {(id) => (
                <textarea
                  id={id}
                  rows={4}
                  className={`${inputClass} font-mono text-sm`}
                  value={form.servicesJson}
                  onChange={(e) =>
                    setForm({ ...form, servicesJson: e.target.value })
                  }
                />
              )}
            </FormField>
          </>
        )}

        <FormField label="Years of Experience" required>
          {(id) => (
            <input
              id={id}
              type="number"
              required
              min={0}
              className={inputClass}
              value={form.experience ?? ""}
              onChange={(e) =>
                setForm({ ...form, experience: Number(e.target.value) })
              }
            />
          )}
        </FormField>

        <FormField
          label="Portfolio Image URLs"
          hint="Enter one public image URL per line"
        >
          {(id) => (
            <textarea
              id={id}
              rows={3}
              className={inputClass}
              placeholder="https://images.unsplash.com/photo-..."
              value={form.imageUrls}
              onChange={(e) => setForm({ ...form, imageUrls: e.target.value })}
            />
          )}
        </FormField>

        <div className="flex gap-3 pt-2">
          <Button type="submit" disabled={loading}>
            {loading ? "Saving..." : editId ? "Update" : "Create"}
          </Button>
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
        </div>
      </form>
    </Modal>
  );
}
