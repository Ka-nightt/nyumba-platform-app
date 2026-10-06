import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export const cn = (...inputs) => twMerge(clsx(inputs));

export const formatPrice = (price, listing_type) => {
  const n = Number(price);
  const formatted = new Intl.NumberFormat("en-KE", {
    style: "currency",
    currency: "KES",
    maximumFractionDigits: 0,
  }).format(n);
  if (listing_type === "bnb") return `${formatted}/night`;
  if (listing_type === "rent") return `${formatted}/mo`;
  return formatted;
};

export const COUNTIES = [
  "Nairobi",
  "Mombasa",
  "Kisumu",
  "Nakuru",
  "Uasin Gishu",
  "Kiambu",
  "Machakos",
  "Kajiado",
  "Murang'a",
  "Kirinyaga",
  "Nyeri",
  "Meru",
  "Embu",
  "Kilifi",
  "Kwale",
  "Taita Taveta",
  "Laikipia",
];

export const PROPERTY_TYPES = [
  { value: "apartment", label: "Apartment" },
  { value: "house", label: "House" },
  { value: "villa", label: "Villa" },
  { value: "bedsitter", label: "Bedsitter" },
  { value: "commercial", label: "Commercial" },
  { value: "land", label: "Land" },
];
