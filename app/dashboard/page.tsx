"use client";

import { useUser } from "@/utils/queries/user/getUser.ts";

export default function Dashboard() {
  const { user, loading, error } = useUser();

  console.log(user);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p className="text-red-500">
        Error: {error.message}
    </p>;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-3xl font-bold">Welcome to your dashboard, {user?.email}</h1>
      <p className="mt-4">Here you can manage your account and settings.</p>
    </div>
  );
}