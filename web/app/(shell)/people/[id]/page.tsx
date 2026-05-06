import { ClientView } from "./ClientView";
import { SEED_PEOPLE } from "@/lib/seed";

export function generateStaticParams() {
  return SEED_PEOPLE.map((p) => ({ id: p.id }));
}

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <ClientView id={id} />;
}
