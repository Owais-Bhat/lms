"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";

export default function ProfilePage() {
  const [name, setName] = useState("Ananya Rao");
  const [email, setEmail] = useState("ananya.rao@example.com");
  const [phone, setPhone] = useState("+1 555 010 8823");
  const [saved, setSaved] = useState(false);

  return (
    <div className="neu-raised rounded-3xl p-6 flex flex-col gap-4 max-w-lg">
      <div>
        <label className="text-xs font-bold text-ink block mb-1.5">Full Name</label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="neu-inset rounded-xl px-4 py-3 text-sm w-full outline-none"
        />
      </div>
      <div>
        <label className="text-xs font-bold text-ink block mb-1.5">Email</label>
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="neu-inset rounded-xl px-4 py-3 text-sm w-full outline-none"
        />
      </div>
      <div>
        <label className="text-xs font-bold text-ink block mb-1.5">Phone</label>
        <input
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="neu-inset rounded-xl px-4 py-3 text-sm w-full outline-none"
        />
      </div>
      <Button
        className="self-start"
        onClick={() => {
          setSaved(true);
          setTimeout(() => setSaved(false), 2000);
        }}
      >
        {saved ? "Saved!" : "Save Changes"}
      </Button>

      <button className="text-xs text-red-700 font-semibold self-start mt-4">
        Request Account Deletion
      </button>
    </div>
  );
}
