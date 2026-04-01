import React, { useState } from "react";
import { User, Mail, ShieldCheck, Save } from "lucide-react";
import Card from "../../components/ui/Card";
import { useAuth } from "../../hooks/useAuth";

const Profile: React.FC = () => {
  const { user, updateUser, storageType, tokenExpiresAt } = useAuth();
  const [name, setName] = useState(user?.name ?? "");
  const [avatar, setAvatar] = useState(user?.avatar ?? "");
  const [saved, setSaved] = useState(false);

  const handleSave = (event: React.FormEvent) => {
    event.preventDefault();
    updateUser({ name, avatar });
    setSaved(true);
    window.setTimeout(() => setSaved(false), 1500);
  };

  return (
    <section className="flex-1 p-5 md:p-8 bg-linear-to-b from-slate-50 to-white">
      <div className="max-w-4xl mx-auto space-y-6">
        <Card
          className="max-w-none"
          title="Profile"
          description="Manage your account details"
          icon={User}
          color="blue"
        >
          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="block text-sm text-slate-700 mb-1">Name</label>
              <input
                value={name}
                onChange={(event) => setName(event.target.value)}
                className="w-full border border-slate-300 rounded-lg px-3 py-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm text-slate-700 mb-1">
                Avatar URL
              </label>
              <input
                value={avatar}
                onChange={(event) => setAvatar(event.target.value)}
                className="w-full border border-slate-300 rounded-lg px-3 py-2"
                placeholder="https://..."
              />
            </div>
            <button
              type="submit"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
            >
              <Save className="h-4 w-4" />
              Save changes
            </button>
            {saved && (
              <p className="text-sm text-emerald-600">Profile updated.</p>
            )}
          </form>
        </Card>

        <Card
          className="max-w-none"
          title="Account Info"
          color="gray"
          icon={ShieldCheck}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
            <div className="rounded-lg border border-slate-200 p-4 bg-white">
              <p className="text-slate-500">Email</p>
              <p className="mt-1 font-medium text-slate-800 inline-flex items-center gap-2">
                <Mail className="h-4 w-4" />
                {user?.email ?? "-"}
              </p>
            </div>
            <div className="rounded-lg border border-slate-200 p-4 bg-white">
              <p className="text-slate-500">Session Storage</p>
              <p className="mt-1 font-medium text-slate-800">
                {storageType ?? "-"}
              </p>
            </div>
            <div className="rounded-lg border border-slate-200 p-4 bg-white md:col-span-2">
              <p className="text-slate-500">Access Token Expires</p>
              <p className="mt-1 font-medium text-slate-800">
                {tokenExpiresAt
                  ? new Date(tokenExpiresAt).toLocaleString()
                  : "No active session"}
              </p>
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
};

export default Profile;
