"use client";

import useCurrentUser from "@/modules/auth/hooks/use-current-user";

export default function TestCurrentUserPage() {
  const { user, business, auth } = useCurrentUser();

  console.log("USER:", user);
  console.log("BUSINESS:", business);
  console.log("AUTH:", auth);

  return (
    <div className="p-6">
      <h1 className="mb-4 text-xl font-semibold">
        Current User
      </h1>

      <pre className="rounded-lg bg-muted p-4 text-sm">
        {JSON.stringify(
          {
            user,
            business,
            auth,
          },
          null,
          2
        )}
      </pre>
    </div>
  );
}