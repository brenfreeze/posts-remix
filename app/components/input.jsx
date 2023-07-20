import clsx from "clsx";

export default function Input({ id, label, required, error, ...props }) {
  const InputComponent = props.type === "textarea" ? "textarea" : "input";

  return (
    <label htmlFor={id} className="flex flex-col gap-1 ">
      <span className={clsx("text-sm", error && "text-red-500")}>
        {label} {required && <i className="text-red-500">*</i>}
      </span>
      <InputComponent
        id={id}
        className={clsx(
          "rounded-md px-2 py-2 text-sm border",
          error ? "border-red-500" : "border-black"
        )}
        placeholder={`Enter ${label}`}
        {...props}
      />
      {error && <span className="text-red-500 text-xs">{error}</span>}
    </label>
  );
}
