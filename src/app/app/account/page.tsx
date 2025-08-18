"use client";
import createClient from "@/lib/supabase/browser";
import { useRouter } from "next/navigation";
import { useUserStore } from "../_store/user";
import { useEffect, useState } from "react";

export default function AccountPage() {
  const router = useRouter();
  const { user, updateUser, logout } = useUserStore();
  const [displayName, setDisplayName] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    setDisplayName(user?.displayName ?? "");
    setAvatarUrl(user?.avatarUrl ?? "");
  }, [user?.displayName, user?.avatarUrl]);

  async function saveProfile() {
    setSaving(true);
    setMessage(null);
    const supabase = createClient();
    const { data, error } = await supabase.auth.updateUser({
      data: { display_name: displayName, avatar_url: avatarUrl || null },
    });
    if (error) {
      setMessage(`Failed to save: ${error.message}`);
    } else if (data.user) {
      updateUser(data.user);
      setMessage("Profile saved.");
    }
    setSaving(false);
  }

  async function handleLogOut() {
    const supabase = createClient();
    const { error } = await supabase.auth.signOut({ scope: "local" });
    if (error) console.error("Error logging out:", error.message);
    logout();
    router.push("/");
  }

  return (
    <div className="flex flex-col gap-6">
      <header>
        <h1 className="text-2xl font-semibold">Account</h1>
        <p className="text-foreground-500 mt-1 text-sm">Manage your profile and session</p>
      </header>

      <section className="bg-content2 rounded-lg border border-neutral-700 p-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm">Email</label>
            <input
              value={user?.email ?? ""}
              disabled
              className="bg-content1 w-full rounded-md border border-neutral-700 px-3 py-2 text-sm opacity-70"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm">Display Name</label>
            <input
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="bg-content1 w-full rounded-md border border-neutral-700 px-3 py-2 text-sm"
              placeholder="Your name"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="mb-1 block text-sm">Avatar URL</label>
            <input
              value={avatarUrl}
              onChange={(e) => setAvatarUrl(e.target.value)}
              className="bg-content1 w-full rounded-md border border-neutral-700 px-3 py-2 text-sm"
              placeholder="https://…"
            />
          </div>
        </div>
        {message && <p className="mt-3 text-xs text-foreground-500">{message}</p>}
        <div className="mt-4 flex gap-2">
          <button
            onClick={saveProfile}
            disabled={saving}
            className="bg-foreground text-background hover:opacity-90 rounded-md px-3 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving ? "Saving…" : "Save Profile"}
          </button>
          <button
            onClick={handleLogOut}
            className="hover:bg-content3 rounded-md border border-neutral-700 px-3 py-2 text-sm"
          >
            Logout
          </button>
        </div>
      </section>
    </div>
  );
}
