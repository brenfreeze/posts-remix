import clsx from "clsx";

export default function Select({
  id,
  label,
  required,
  options,
  error,
  ...props
}) {
  return (
    <label htmlFor={id} className="flex flex-col gap-1">
      <span className={clsx("text-sm", error && "text-red-500")}>
        {label} {required && <i className="text-red-500">*</i>}
      </span>
      <select
        id={id}
        {...props}
        className={clsx(
          "border rounded-md px-2 py-2 text-sm cursor-pointer",
          error ? "border-red-500" : "border-black"
        )}
      >
        <option hidden>Select {label}</option>
        {options.map(({ value, label, id }) => (
          <option key={id} value={value}>
            {label}
          </option>
        ))}
      </select>
      {error && <span className="text-red-500 text-xs">{error}</span>}
    </label>
  );
}
