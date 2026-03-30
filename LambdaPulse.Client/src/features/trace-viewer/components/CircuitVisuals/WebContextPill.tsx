interface WebContextPillProps {
  type: "Request" | "Response";
}

export const WebContextPill = ({ type }: WebContextPillProps) => {
  return (
    <div className="px-4 py-1.5 rounded-full bg-surface-20 border border-surface-40 text-[10px] uppercase font-bold text-surface-60 tracking-wider shadow-sm z-10">
      HTTP {type}
    </div>
  );
};
