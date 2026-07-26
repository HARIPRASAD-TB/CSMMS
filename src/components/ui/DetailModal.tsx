"use client";

import Link from "next/link";
import { MapPin, BadgeCheck } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { ImageSlider } from "@/components/ui/ImageSlider";
import { StarRating } from "@/components/ui/StarRating";
import { Button } from "@/components/ui/Button";

interface WorkerDetail {
  kind: "worker";
  _id: string;
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
  userId?: string;
}

interface ContractorDetail {
  kind: "contractor";
  _id: string;
  title: string;
  description?: string;
  location: string;
  pricePerSqFt?: number;
  rating: number;
  experience?: number;
  completedProjects?: number;
  portfolio: string[];
  services?: { name: string; pricePerSqFt?: number; description?: string }[];
  isVerified: boolean;
  userId?: string;
}

interface ProductDetail {
  kind: "product";
  _id: string;
  name: string;
  description?: string;
  category: string;
  price: number;
  unit: string;
  stock?: number;
  image: string;
  features?: string[];
  rating: number;
  vendorId?: string;
}

export type DetailItem = WorkerDetail | ContractorDetail | ProductDetail;

interface DetailModalProps {
  item: DetailItem | null;
  onClose: () => void;
  onEdit?: (item: DetailItem) => void;
  onDelete?: (id: string, kind: DetailItem["kind"]) => void;
  canEdit?: boolean;
  onAddToCart?: (item: DetailItem) => void;
  onBook?: (item: DetailItem) => void;
}

export function DetailModal({
  item,
  onClose,
  onEdit,
  onDelete,
  canEdit,
  onAddToCart,
  onBook,
}: DetailModalProps) {
  if (!item) return null;

  const images =
    item.kind === "product"
      ? item.image
        ? [item.image]
        : []
      : item.portfolio || [];

  const title =
    item.kind === "product"
      ? item.name
      : item.kind === "worker"
        ? item.user?.name || item.title
        : item.title;

  return (
    <Modal open={!!item} onClose={onClose} title={title} size="xl">
      <div className="grid gap-6 md:grid-cols-2">
        <ImageSlider images={images} alt={title} height="h-64 md:h-80" />

        <div>
          {item.kind !== "product" && (
            <div className="mb-2 flex items-center gap-2">
              {item.isVerified && (
                <BadgeCheck className="h-5 w-5 text-accent" />
              )}
              <StarRating rating={item.rating} />
            </div>
          )}
          {item.kind === "product" && (
            <StarRating rating={item.rating} />
          )}

          {item.kind === "worker" && (
            <>
              <p className="text-accent">{item.workerType}</p>
              <p className="mt-2 text-2xl font-bold text-accent">
                ₹{item.pricePerDay}/day
              </p>
            </>
          )}
          {item.kind === "contractor" && (
            <p className="mt-2 text-2xl font-bold text-accent">
              From ₹{item.pricePerSqFt}/sq.ft
            </p>
          )}
          {item.kind === "product" && (
            <p className="mt-2 text-2xl font-bold text-accent">
              ₹{item.price.toLocaleString()}/{item.unit}
            </p>
          )}

          {item.kind !== "product" && (
            <p className="mt-2 flex items-center gap-1 text-zinc-400">
              <MapPin className="h-4 w-4" />
              {item.location}
              {item.experience ? ` · ${item.experience} yrs exp` : ""}
            </p>
          )}

          {item.description && (
            <p className="mt-4 text-zinc-300">{item.description}</p>
          )}

          {item.kind === "contractor" && item.services?.length ? (
            <div className="mt-4">
              <h4 className="font-semibold">Services</h4>
              <ul className="mt-2 space-y-2">
                {item.services.map((s) => (
                  <li
                    key={s.name}
                    className="rounded-lg border border-zinc-700 p-3 text-sm"
                  >
                    <span className="font-medium">{s.name}</span>
                    <span className="ml-2 text-accent">
                      ₹{s.pricePerSqFt}/sq.ft
                    </span>
                    {s.description && (
                      <p className="text-zinc-500">{s.description}</p>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          {item.kind === "product" && item.features?.length ? (
            <ul className="mt-4 list-inside list-disc text-zinc-400">
              {item.features.map((f) => (
                <li key={f}>{f}</li>
              ))}
            </ul>
          ) : null}

          <div className="mt-6 flex flex-wrap gap-3">
            {item.kind === "worker" && (
              <>
                {onBook && (
                  <Button size="sm" onClick={() => onBook(item)}>
                    Book Now
                  </Button>
                )}
                {onAddToCart && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onAddToCart(item)}
                  >
                    Add to Cart
                  </Button>
                )}
                <Link href={`/reviews/${item._id}`}>
                  <Button size="sm" variant="outline">
                    View Reviews
                  </Button>
                </Link>
              </>
            )}
            {item.kind === "contractor" && (
              <>
                {onBook && (
                  <Button size="sm" onClick={() => onBook(item)}>
                    Book Now
                  </Button>
                )}
                {onAddToCart && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onAddToCart(item)}
                  >
                    Add to Cart
                  </Button>
                )}
              </>
            )}
            {item.kind === "product" && onAddToCart && (
              <Button size="sm" onClick={() => onAddToCart(item)}>
                Add to Cart
              </Button>
            )}
            {item.kind === "product" && (
              <Link href={`/materials/${item._id}`}>
                <Button size="sm" variant="outline">
                  Full Page
                </Button>
              </Link>
            )}
            {canEdit && onEdit && (
              <Button size="sm" variant="outline" onClick={() => onEdit(item)}>
                Edit
              </Button>
            )}
            {canEdit && onDelete && (
              <Button
                size="sm"
                variant="ghost"
                className="text-red-400"
                onClick={() => onDelete(item._id, item.kind)}
              >
                Delete
              </Button>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
}
