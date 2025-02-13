// pages/index.tsx

import ExcaliSketch from "../../../components/ExcaliSketch"; // adjust the path as needed
export default async function HomePage({
  params,
}: {
  params: Promise<{ roomId: string }>;
}) {
  const param = await params;

  return (
    <div>
      <ExcaliSketch roomId={parseInt(param.roomId)} />
    </div>
  );
}
