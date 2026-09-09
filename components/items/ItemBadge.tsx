import { PackageX, PackageCheck } from "lucide-react";
import { ItemType } from "@/types/item";

interface ItemBadgeProps {
  type: ItemType;
  className?: string;
}

export default function ItemBadge({ type, className = "" }: ItemBadgeProps) {
  const isLost = type === "lost";

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium ${
        isLost ? "bg-lost-bg text-lost" : "bg-found-bg text-found"
      } ${className}`}
    >
      {isLost ? (
        <PackageX className="h-3 w-3" aria-hidden="true" />
      ) : (
        <PackageCheck className="h-3 w-3" aria-hidden="true" />
      )}
      {isLost ? "Lost" : "Found"}
    </span>
  );
}