import { json, redirect } from "@remix-run/node";
import Button from "../components/button";
import { commitSession, destroySession, getSession } from "../sessions";
import { Form, useLoaderData } from "@remix-run/react";

export const meta = () => {
  return [{ title: "Home @ Posts" }, { name: "description", content: "Posts" }];
};

export async function action({ request }) {
  const session = await getSession(request.headers.get("Cookie"));

  return redirect("/", {
    headers: {
      "Set-Cookie": await destroySession(session),
    },
  });
}

export async function loader({ request }) {
  const session = await getSession(request.headers.get("Cookie"));

  return json(
    {
      isAuth: session.has("profile"),
    },
    {
      headers: {
        "Set-Cookie": await commitSession(session),
      },
    }
  );
}

export default function Index() {
  const { isAuth } = useLoaderData();

  return (
    <div className="grid place-content-center min-h-screen">
      <div className="flex flex-col items-center max-w-screen-sm text-center px-4">
        <h1 className="text-5xl lg:text-7xl font-black mb-4">
          Welcome to Posts!
        </h1>
        <p className="mb-4">
          Lorem ipsum dolor sit amet consectetur, adipisicing elit. Sint, quae
          possimus? Est fugiat porro quis et similique ullam tempore quas!
        </p>
        {isAuth ? (
          <div className="flex gap-2">
            <Button as="link" to="/profile">
              Profile
            </Button>
            <Form method="post">
              <Button type="submit">Logout</Button>
            </Form>
          </div>
        ) : (
          <Button as="link" to="/sign-up">
            Sign Up
          </Button>
        )}
      </div>
    </div>
  );
}
