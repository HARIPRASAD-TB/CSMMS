"use client";

import { Suspense, useCallback, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { MapPin, BadgeCheck, Plus, Pencil } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { StarRating } from "@/components/ui/StarRating";
import { ImageSlider } from "@/components/ui/ImageSlider";
import { DetailModal, type DetailItem } from "@/components/ui/DetailModal";
import { ProviderFormModal } from "@/components/forms/ProviderFormModal";
import { useAuth } from "@/context/AuthContext";
import { useAddToCart } from "@/lib/use-add-to-cart";
import { useBookService } from "@/lib/use-book-service";
import { workerToCartItem, contractorToCartItem } from "@/lib/cart-helpers";
import {
  canManageWorkers,
  canManageContractors,
  canEditProvider,
} from "@/lib/permissions";

interface Worker {
  _id: string;
  userId: string;
  title: string;
  description?: string;
  workerType: string;
  location: string;
  pricePerDay: number;
  rating: number;
  experience?: number;
  portfolio: string[];
  isVerified: boolean;
  user?: { name: string };
}

interface Contractor {
  _id: string;
  userId: string;
  title: string;
  description?: string;
  location: string;
  rating: number;
  pricePerSqFt?: number;
  experience?: number;
  completedProjects: number;
  portfolio: string[];
  services?: { name: string; pricePerSqFt?: number; description?: string }[];
  isVerified: boolean;
}

const workerTypes = [
  "Painter",
  "Carpenter",
  "Electrician",
  "Tile Worker",
  "Plumber",
];

const contractorServiceTypes = [
  "Full Construction",
  "Labour Only",
  "Renovation",
  "Interior",
  "Commercial",
  "Residential",
];

type ServiceTab = "workers" | "contractors";

function ServicesPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tab: ServiceTab =
    searchParams.get("tab") === "contractors" ? "contractors" : "workers";

  const { user } = useAuth();
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [contractors, setContractors] = useState<Contractor[]>([]);
  const [workerFilters, setWorkerFilters] = useState({
    location: "",
    workerType: "",
    minRating: "",
  });
  const [contractorFilters, setContractorFilters] = useState({
    location: "",
    serviceType: "",
    minRating: "",
  });
  const [detail, setDetail] = useState<DetailItem | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [formType, setFormType] = useState<ServiceTab>("workers");
  const [editWorker, setEditWorker] = useState<Worker | null>(null);
  const [editContractor, setEditContractor] = useState<Contractor | null>(null);

  const loadWorkers = useCallback(() => {
    const params = new URLSearchParams();
    Object.entries(workerFilters).forEach(([k, v]) => v && params.set(k, v));
    fetch(`/api/workers?${params}`)
      .then((r) => r.json())
      .then((d) =>
        setWorkers(
          (d.workers || []).map(
            (w: Worker & { userId?: { toString?: () => string } }) => ({
              ...w,
              userId: String(w.userId),
            })
          )
        )
      );
  }, [workerFilters]);

  const loadContractors = useCallback(() => {
    const params = new URLSearchParams();
    Object.entries(contractorFilters).forEach(([k, v]) => v && params.set(k, v));
    fetch(`/api/contractors?${params}`)
      .then((r) => r.json())
      .then((d) =>
        setContractors(
          (d.contractors || []).map((c: Contractor) => ({
            ...c,
            userId: String(c.userId),
          }))
        )
      );
  }, [contractorFilters]);

  useEffect(() => {
    if (tab === "workers") loadWorkers();
    else loadContractors();
  }, [tab, loadWorkers, loadContractors]);

  function setTab(next: ServiceTab) {
    router.push(`/workers?tab=${next}`);
  }

  function openWorkerDetail(w: Worker) {
    setDetail({ kind: "worker", ...w });
  }

  function openContractorDetail(c: Contractor) {
    setDetail({ kind: "contractor", ...c });
  }

  function handleEdit(item: DetailItem) {
    if (item.kind === "worker") {
      const w = workers.find((x) => x._id === item._id);
      if (w) {
        setEditWorker(w);
        setFormType("workers");
        setFormOpen(true);
        setDetail(null);
      }
    } else if (item.kind === "contractor") {
      const c = contractors.find((x) => x._id === item._id);
      if (c) {
        setEditContractor(c);
        setFormType("contractors");
        setFormOpen(true);
        setDetail(null);
      }
    }
  }

  async function handleDelete(id: string, kind: DetailItem["kind"]) {
    const label = kind === "worker" ? "worker" : "contractor";
    if (!confirm(`Delete this ${label} listing?`)) return;
    const res = await fetch(`/api/providers/${id}`, {
      method: "DELETE",
      credentials: "include",
    });
    if (res.ok) {
      setDetail(null);
      if (tab === "workers") loadWorkers();
      else loadContractors();
    } else {
      alert("Delete failed — check permissions");
    }
  }

  const addToCart = useAddToCart("/workers");
  const bookService = useBookService("/workers");
  const canAddWorker = canManageWorkers(user?.role ?? null);
  const canAddContractor = canManageContractors(user?.role ?? null);

  const filters =
    tab === "workers" ? workerFilters : contractorFilters;

  return (
    <div className="mx-auto flex max-w-7xl gap-6 px-4 py-8">
      <aside className="hidden w-64 shrink-0 space-y-6 rounded-xl border border-zinc-800 bg-surface p-6 lg:block">
        <h3 className="font-semibold">Filters</h3>
        <div>
          <label className="text-sm text-zinc-400">Location</label>
          <input
            className="mt-1 w-full rounded-lg px-3 py-2"
            placeholder="City..."
            value={filters.location}
            onChange={(e) =>
              tab === "workers"
                ? setWorkerFilters({ ...workerFilters, location: e.target.value })
                : setContractorFilters({
                    ...contractorFilters,
                    location: e.target.value,
                  })
            }
          />
        </div>
        {tab === "workers" ? (
          <div>
            <label className="text-sm text-zinc-400">Worker Type</label>
            <select
              className="mt-1 w-full rounded-lg px-3 py-2"
              value={workerFilters.workerType}
              onChange={(e) =>
                setWorkerFilters({ ...workerFilters, workerType: e.target.value })
              }
            >
              <option value="">All</option>
              {workerTypes.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
        ) : (
          <div>
            <label className="text-sm text-zinc-400">Service Type</label>
            <select
              className="mt-1 w-full rounded-lg px-3 py-2"
              value={contractorFilters.serviceType}
              onChange={(e) =>
                setContractorFilters({
                  ...contractorFilters,
                  serviceType: e.target.value,
                })
              }
            >
              <option value="">All</option>
              {contractorServiceTypes.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
        )}
        <div>
          <label className="text-sm text-zinc-400">Min Rating</label>
          <input
            type="number"
            min={1}
            max={5}
            step={0.5}
            className="mt-1 w-full rounded-lg px-3 py-2"
            value={filters.minRating}
            onChange={(e) =>
              tab === "workers"
                ? setWorkerFilters({
                    ...workerFilters,
                    minRating: e.target.value,
                  })
                : setContractorFilters({
                    ...contractorFilters,
                    minRating: e.target.value,
                  })
            }
          />
        </div>
      </aside>

      <div className="flex-1">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Services</h1>
            <p className="mt-1 text-sm text-zinc-400">
              Hire skilled workers or book verified contractors
            </p>
          </div>
          {tab === "workers" && canAddWorker && (
            <Button
              size="sm"
              onClick={() => {
                setEditWorker(null);
                setFormType("workers");
                setFormOpen(true);
              }}
            >
              <Plus className="mr-1 h-4 w-4" />
              Add Worker
            </Button>
          )}
          {tab === "contractors" && canAddContractor && (
            <Button
              size="sm"
              onClick={() => {
                setEditContractor(null);
                setFormType("contractors");
                setFormOpen(true);
              }}
            >
              <Plus className="mr-1 h-4 w-4" />
              Add Contractor
            </Button>
          )}
        </div>

        <div className="mb-6 flex gap-2 rounded-xl border border-zinc-800 bg-surface p-1">
          <button
            type="button"
            onClick={() => setTab("workers")}
            className={`flex-1 rounded-lg px-4 py-2.5 text-sm font-medium transition ${
              tab === "workers"
                ? "bg-accent text-black"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            Skilled Workers
          </button>
          <button
            type="button"
            onClick={() => setTab("contractors")}
            className={`flex-1 rounded-lg px-4 py-2.5 text-sm font-medium transition ${
              tab === "contractors"
                ? "bg-accent text-black"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            Contractors
          </button>
        </div>

        {/* Mobile filters */}
        <div className="mb-6 grid gap-3 rounded-xl border border-zinc-800 bg-surface p-4 sm:grid-cols-3 lg:hidden">
          <input
            className="rounded-lg px-3 py-2 text-sm"
            placeholder="Location..."
            value={filters.location}
            onChange={(e) =>
              tab === "workers"
                ? setWorkerFilters({ ...workerFilters, location: e.target.value })
                : setContractorFilters({
                    ...contractorFilters,
                    location: e.target.value,
                  })
            }
          />
          {tab === "workers" ? (
            <select
              className="rounded-lg px-3 py-2 text-sm"
              value={workerFilters.workerType}
              onChange={(e) =>
                setWorkerFilters({ ...workerFilters, workerType: e.target.value })
              }
            >
              <option value="">All worker types</option>
              {workerTypes.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          ) : (
            <select
              className="rounded-lg px-3 py-2 text-sm"
              value={contractorFilters.serviceType}
              onChange={(e) =>
                setContractorFilters({
                  ...contractorFilters,
                  serviceType: e.target.value,
                })
              }
            >
              <option value="">All service types</option>
              {contractorServiceTypes.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          )}
          <input
            type="number"
            min={1}
            max={5}
            step={0.5}
            placeholder="Min rating"
            className="rounded-lg px-3 py-2 text-sm"
            value={filters.minRating}
            onChange={(e) =>
              tab === "workers"
                ? setWorkerFilters({
                    ...workerFilters,
                    minRating: e.target.value,
                  })
                : setContractorFilters({
                    ...contractorFilters,
                    minRating: e.target.value,
                  })
            }
          />
        </div>

        {tab === "workers" ? (
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {workers.map((w) => {
              const editable =
                user && canEditProvider(user.role, user._id, w.userId);
              return (
                <div
                  key={w._id}
                  className="overflow-hidden rounded-xl border border-zinc-800 bg-surface"
                >
                  <button
                    type="button"
                    className="block w-full text-left"
                    onClick={() => openWorkerDetail(w)}
                  >
                    <ImageSlider
                      images={w.portfolio || []}
                      alt={w.title}
                      height="h-40"
                    />
                  </button>
                  <div className="p-4">
                    <div className="mb-1 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold">
                          {w.user?.name || w.title}
                        </h3>
                        {w.isVerified && (
                          <BadgeCheck className="h-4 w-4 text-accent" />
                        )}
                      </div>
                      {editable && (
                        <button
                          type="button"
                          onClick={() => {
                            setEditWorker(w);
                            setFormType("workers");
                            setFormOpen(true);
                          }}
                          className="text-zinc-400 hover:text-accent"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                    <p className="text-sm text-accent">{w.workerType}</p>
                    <StarRating rating={w.rating} size={14} />
                    <p className="mt-2 font-bold text-accent">
                      ₹{w.pricePerDay}/day
                    </p>
                    <p className="flex items-center gap-1 text-sm text-zinc-400">
                      <MapPin className="h-3 w-3" />
                      {w.location}
                    </p>
                    <div className="mt-4 flex gap-2">
                      <Button
                        className="flex-1"
                        size="sm"
                        onClick={() => bookService(`/workers/${w._id}`)}
                      >
                        Book
                      </Button>
                      <Button
                        className="flex-1"
                        size="sm"
                        variant="outline"
                        onClick={() => addToCart(workerToCartItem(w))}
                      >
                        Add to Cart
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
            {workers.length === 0 && (
              <p className="col-span-full text-center text-zinc-500">
                No workers match your filters. Try adjusting location or worker
                type.
              </p>
            )}
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {contractors.map((c) => {
              const editable =
                user && canEditProvider(user.role, user._id, c.userId);
              const primaryService = c.services?.[0]?.name;
              return (
                <div
                  key={c._id}
                  className="overflow-hidden rounded-xl border border-zinc-800 bg-surface"
                >
                  <button
                    type="button"
                    className="block w-full text-left"
                    onClick={() => openContractorDetail(c)}
                  >
                    <ImageSlider
                      images={c.portfolio || []}
                      alt={c.title}
                      height="h-40"
                    />
                  </button>
                  <div className="p-4">
                    <div className="mb-1 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold">{c.title}</h3>
                        {c.isVerified && (
                          <BadgeCheck className="h-4 w-4 text-accent" />
                        )}
                      </div>
                      {editable && (
                        <button
                          type="button"
                          onClick={() => {
                            setEditContractor(c);
                            setFormType("contractors");
                            setFormOpen(true);
                          }}
                          className="text-zinc-400 hover:text-accent"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                    {primaryService && (
                      <p className="text-sm text-accent">{primaryService}</p>
                    )}
                    <StarRating rating={c.rating} size={14} />
                    <p className="mt-2 font-bold text-accent">
                      From ₹{c.pricePerSqFt}/sq.ft
                    </p>
                    <p className="text-sm text-zinc-400">
                      {c.completedProjects} projects completed
                    </p>
                    <p className="flex items-center gap-1 text-sm text-zinc-400">
                      <MapPin className="h-3 w-3" />
                      {c.location}
                    </p>
                    <div className="mt-4 flex gap-2">
                      <Button
                        className="flex-1"
                        size="sm"
                        onClick={() => bookService(`/contractors/${c._id}`)}
                      >
                        Book
                      </Button>
                      <Button
                        className="flex-1"
                        size="sm"
                        variant="outline"
                        onClick={() => addToCart(contractorToCartItem(c))}
                      >
                        Add to Cart
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
            {contractors.length === 0 && (
              <p className="col-span-full text-center text-zinc-500">
                No contractors match your filters. Try adjusting location or
                service type.
              </p>
            )}
          </div>
        )}
      </div>

      <DetailModal
        item={detail}
        onClose={() => setDetail(null)}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onBook={(item) => {
          if (item.kind === "worker") bookService(`/workers/${item._id}`);
          if (item.kind === "contractor") {
            bookService(`/contractors/${item._id}`);
          }
        }}
        onAddToCart={(item) => {
          if (item.kind === "worker") addToCart(workerToCartItem(item));
          if (item.kind === "contractor") {
            addToCart(contractorToCartItem(item));
          }
        }}
        canEdit={
          !!detail &&
          !!user &&
          ((detail.kind === "worker" &&
            canEditProvider(
              user.role,
              user._id,
              workers.find((w) => w._id === detail._id)?.userId || ""
            )) ||
            (detail.kind === "contractor" &&
              canEditProvider(
                user.role,
                user._id,
                contractors.find((c) => c._id === detail._id)?.userId || ""
              )))
        }
      />

      <ProviderFormModal
        open={formOpen}
        onClose={() => {
          setFormOpen(false);
          setEditWorker(null);
          setEditContractor(null);
        }}
        onSaved={() => {
          if (formType === "workers") loadWorkers();
          else loadContractors();
        }}
        type={formType === "workers" ? "worker" : "contractor"}
        editId={formType === "workers" ? editWorker?._id : editContractor?._id}
        initial={formType === "workers" ? editWorker || undefined : editContractor || undefined}
      />
    </div>
  );
}

export default function WorkersPage() {
  return (
    <Suspense
      fallback={
        <p className="py-20 text-center text-zinc-500">Loading services...</p>
      }
    >
      <ServicesPage />
    </Suspense>
  );
}
