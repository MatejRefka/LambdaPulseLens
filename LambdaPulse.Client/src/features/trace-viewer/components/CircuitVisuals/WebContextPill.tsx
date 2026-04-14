interface WebContextPillProps {
  type: "Request" | "Response";
}

export const WebContextPill = ({ type }: WebContextPillProps) => {
  return (
    <div className="px-4 py-1.5 rounded-full bg-surface-20 border border-surface-40 text-[10px] uppercase font-bold text-text-20 tracking-widest">
      HTTP {type}
    </div>
  );
};
