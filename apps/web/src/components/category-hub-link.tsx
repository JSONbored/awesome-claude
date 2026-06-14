import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import type { Category } from "@/types/registry";

type CategoryHubLinkProps = {
  category: Category;
  children: ReactNode;
  className?: string;
};

export function CategoryHubLink({ category, children, className }: CategoryHubLinkProps) {
  if (category === "tools") {
    return (
      <Link to="/browse" search={{ category }} className={className}>
        {children}
      </Link>
    );
  }

  return (
    <Link to="/$category" params={{ category }} className={className}>
      {children}
    </Link>
  );
}
