import { ClientView } from "./ClientView";

export function generateStaticParams() {
  return [
    { id: "business" },
    { id: "religion" },
    { id: "learning" },
    { id: "fitness" },
    { id: "home" },
  ];
}

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <ClientView id={id} />;
}
