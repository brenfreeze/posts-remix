import {
  Form,
  useActionData,
  useLoaderData,
  useNavigation,
} from "@remix-run/react";
import Button from "../components/button";
import Input from "../components/input";
import Select from "../components/select";
import Checkbox from "../components/checkbox";
import { json, redirect } from "@remix-run/node";
import { commitSession, getSession } from "../sessions";
import clsx from "clsx";

export function meta() {
  return [
    { title: "Sign Up @ Posts" },
    { name: "description", content: "Posts" },
  ];
}

export async function loader({ request }) {
  const session = await getSession(request.headers.get("Cookie"));
  const users = await fetch("https://jsonplaceholder.typicode.com/users").then(
    (res) => res.json()
  );

  if (session.has("profile")) {
    return redirect("/profile", {
      headers: {
        "Set-Cookie": await commitSession(session),
      },
    });
  }

  return json(
    {
      users,
    },
    {
      headers: {
        "Set-Cookie": await commitSession(session),
      },
    }
  );
}

export async function action({ request }) {
  const session = await getSession(request.headers.get("Cookie"));
  const errors = {};
  const body = await request.formData();

  body.forEach((value, key) => {
    if (!value) {
      errors[key] = `${key} is required`;
      return;
    }

    if (key === "title" && value.length < 5) {
      errors[key] = `${key} should be longer than 5 characters`;
      return;
    }

    if (key === "body" && value.length < 20) {
      errors[key] = `${key} should be longer than 20 characters`;
      return;
    }

    if (key === "username" && value.startsWith("Select")) {
      errors[key] = `${key} is required`;
      return;
    }
  });

  if (!body.has("is-human")) {
    errors["is-human"] = "please verify if you are a human";
  }

  if (Object.keys(errors).length) {
    return json(
      {
        errors,
      },
      { status: 422 }
    );
  }

  const bodyObj = Object.fromEntries(body);

  try {
    const res = await fetch("https://jsonplaceholder.typicode.com/posts", {
      method: "POST",
      body: JSON.stringify({
        title: bodyObj.title,
        body: bodyObj.body,
        userId: Number(bodyObj.username),
      }),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    }).then((res) => res.json());

    session.set("profile", res);

    return redirect("/profile", {
      headers: {
        "Set-Cookie": await commitSession(session),
      },
    });
  } catch (error) {
    throw error;
  }
}

export default function SignUp() {
  const { users } = useLoaderData();
  const actionData = useActionData();
  const navigation = useNavigation();

  const usersOptions = users.map((user) => ({
    id: user.id,
    label: user.name,
    value: Number(user.id),
  }));

  const isSubmitting = Boolean(navigation.state === "submitting");

  return (
    <div className="grid place-content-center min-h-screen">
      <div className="flex flex-col items-center max-w-screen-sm text-center px-4">
        <h1 className="text-5xl lg:text-7xl font-black mb-8">
          Sign Up to Posts!
        </h1>
        <Form method="post" className="contents">
          <fieldset
            className={clsx(
              "text-left max-w-xs w-full flex flex-col gap-2",
              isSubmitting ? "opacity-50" : "opacity-100",
              "disabled:cursor-wait",
              "transition-opacity duration-150"
            )}
            disabled={isSubmitting}
          >
            <Input
              label="Title"
              type="text"
              id="title"
              name="title"
              error={actionData?.errors?.title}
              required
            />
            <Input
              label="Body"
              type="textarea"
              id="body"
              name="body"
              rows={4}
              error={actionData?.errors?.body}
              required
            />
            <Select
              label="Username"
              id="username"
              name="username"
              options={usersOptions}
              error={actionData?.errors?.username}
              required
            />
            <Checkbox
              label="I am a human 👤"
              id="is-human"
              name="is-human"
              error={actionData?.errors?.["is-human"]}
            />
            <div className="flex gap-2">
              <Button type="submit" className="flex-1" loading={isSubmitting}>
                Sign Up
              </Button>
              <Button as="link" to="/" className="bg-white !text-black">
                Go back
              </Button>
            </div>
          </fieldset>
        </Form>
      </div>
    </div>
  );
}
