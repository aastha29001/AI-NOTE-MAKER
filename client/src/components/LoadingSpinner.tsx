interface Props {
  size?: number;
  text?: string;
}

export default function LoadingSpinner({ size = 24, text }: Props) {
  return (
    <div className="flex flex-col items-center justify-center gap-3">
      <div
        className="rounded-full border-2 border-slate-700 border-t-primary-500 animate-spin"
        style={{ width: size, height: size }}
      />
      {text && <p className="text-slate-400 text-sm animate-pulse">{text}</p>}
    </div>
  );
}
