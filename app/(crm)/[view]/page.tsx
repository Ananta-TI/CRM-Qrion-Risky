import { notFound } from "next/navigation";
import ViewRouter from "@/features/ViewRouter";
import { VIEWS } from "@/lib/core";

export function generateStaticParams() {
  return VIEWS.map(([view]) => ({ view }));
}
export const dynamicParams = false;

export default async function Page({ params }: { params: Promise<{ view: string }> }) {
  const { view } = await params;
  if (!VIEWS.some(([k]) => k === view)) notFound();
  return <ViewRouter view={view} />;
}
