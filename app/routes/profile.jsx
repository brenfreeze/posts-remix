import { json, redirect } from "@remix-run/node";
import { commitSession, destroySession, getSession } from "../sessions";
import { Form, useLoaderData, useNavigation } from "@remix-run/react";
import clsx from "clsx";
import ContactCard from "../components/contact-card";
import Button from "../components/button";

export const meta = () => {
  return [
    { title: "Your Profile @ Posts" },
    { name: "description", content: "Posts" },
  ];
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
  const session = await getSession(request.headers.get("cookie"));

  const profile = session.get("profile");
  const users = await fetch("https://jsonplaceholder.typicode.com/users").then(
    (res) => res.json()
  );

  if (!session.has("profile")) {
    return redirect("/sign-up", {
      headers: {
        "Set-Cookie": await commitSession(session),
      },
    });
  }

  return json(
    {
      profile,
      users,
    },
    {
      headers: {
        "Set-Cookie": await commitSession(session),
      },
    }
  );
}

export default function Profile() {
  const { profile, users } = useLoaderData();
  const navigation = useNavigation();

  const user = users.find((user) => {
    return user.id === profile.userId;
  });

  return (
    <div className="grid place-content-center min-h-screen">
      <div className="flex flex-col items-center max-w-screen-sm w-full text-center">
        <h1 className="text-5xl lg:text-7xl font-black mb-8">
          {user?.name}'s Profile.
        </h1>
        <div className={clsx("text-left max-w-xs w-full flex flex-col gap-4")}>
          <ContactCard name={user?.name} username={user?.username} />

          <div className="flex flex-col">
            <span className="mb-2 text-sm">Your recent post:</span>

            <div className="flex flex-col gap-4 px-4 py-2 border border-gray-300 shadow-md rounded-md ">
              <h1 className="text-xl font-semibold leading-tight">
                {profile.title} <br />
                <small className="text-gray-500 text-sm">by {user?.name}</small>
              </h1>
              <p className="peer-checked:line-clamp-none line-clamp-4 text-sm">
                {profile.body}
              </p>
              {profile.body.length > 200 && (
                <>
                  <input type="checkbox" id="see-more" className="peer hidden" />
                  <label htmlFor="see-more" className="cursor-pointer hover:underline relative text-sm before:content-['See_More'] peer-checked:before:content-['See_Less']" />
                </>
              )}
            </div>
          </div>
          <Form method="post">
            <Button
              type="submit"
              loading={Boolean(navigation.state === "submitting")}
            >
              Logout
            </Button>
          </Form>
        </div>
      </div>
    </div>
  );
}
