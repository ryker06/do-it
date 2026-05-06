import { ClientView } from "./ClientView";

export function generateStaticParams() {
  return [
    { id: "v1" },
    { id: "v2" },
    { id: "v3" },
    { id: "v4" },
    { id: "v5" },
    { id: "v6" },
    { id: "v7" },
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
