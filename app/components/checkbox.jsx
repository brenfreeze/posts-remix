export default function Checkbox({ id, label, error, ...props }) {
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className="flex gap-2 cursor-pointer">
        <input id={id} type="checkbox" className="text-black" {...props} />
        <span className="text-sm">{label}</span>
      </label>

      {error && <span className="text-red-500 text-xs">{error}</span>}
    </div>
  );
}
