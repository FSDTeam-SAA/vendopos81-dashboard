"use client";

import { useAllProducts } from "@/lib/hooks/useProduct";

export default function Products() {
  const { data, isLoading, error } = useAllProducts();
  console.log(data);
  return (
    <div className="flex justify-center items-center p-8 text-center"></div>
  );
}
