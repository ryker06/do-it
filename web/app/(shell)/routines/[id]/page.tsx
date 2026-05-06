import { ClientView } from "./ClientView";

export function generateStaticParams() {
  return [
    { id: "r1" },
    { id: "r2" },
    { id: "r3" },
    { id: "r4" },
    { id: "new" },
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
