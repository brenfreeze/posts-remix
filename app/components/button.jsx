import { Link } from "@remix-run/react";
import clsx from "clsx";
import { Fragment } from "react";
import Spinner from "./spinner";

export default function Button({
  children,
  className,
  as,
  type = "button",
  to,
  loading = false,
  ...props
}) {
  const Container = as === "link" ? Link : Fragment;

  return (
    <Container {...(as === "link" ? { to } : {})}>
      <button
        type={type}
        className={clsx(
          "flex items-center justify-center px-4 py-2 font-medium rounded-md bg-black border border-black text-white",
          loading && "cursor-wait",
          className
        )}
        {...props}
      >
        {loading && <Spinner />}
        {children}
      </button>
    </Container>
  );
}
