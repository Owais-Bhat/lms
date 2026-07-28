"use client";

import { useState } from "react";
import clsx from "clsx";
import { Check, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/admin/Badge";
import { blogPosts, faqEntries, reviewsQueue } from "@/lib/admin-data";

const tabs = ["Reviews", "Blog", "FAQ", "Testimonials"] as const;

export default function AdminContentPage() {
  const [tab, setTab] = useState<(typeof tabs)[number]>("Reviews");
  const [reviews, setReviews] = useState(reviewsQueue);

  function setReviewStatus(id: string, status: "Approved" | "Rejected") {
    setReviews((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)));
  }

  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-serif text-3xl text-ink">Reviews & Content</h1>

      <div className="neu-inset rounded-full p-1 flex gap-1 flex-wrap w-fit">
        {tabs.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={clsx(
              "px-4 py-2 rounded-full text-xs font-semibold",
              tab === t ? "neu-raised-sm text-cocoa" : "text-ink-soft"
            )}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === "Reviews" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {reviews.length === 0 && (
            <p className="text-sm text-ink-soft col-span-full">No reviews submitted yet.</p>
          )}
          {reviews.map((r) => (
            <div key={r.id} className="neu-raised rounded-3xl p-5">
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-ink">{r.customer}</span>
                <Badge tone={r.status === "Approved" ? "positive" : "neutral"}>{r.status}</Badge>
              </div>
              <div className="text-xs text-ink-soft mb-1">{r.product}</div>
              <div className="text-cocoa text-sm mb-2">{"★".repeat(r.rating)}</div>
              <p className="text-sm text-ink-soft mb-4">&ldquo;{r.text}&rdquo;</p>
              {r.status === "Pending" && (
                <div className="flex gap-2">
                  <Button size="sm" onClick={() => setReviewStatus(r.id, "Approved")}>
                    <Check size={14} /> Approve
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => setReviewStatus(r.id, "Rejected")}>
                    <X size={14} /> Reject
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {tab === "Blog" && (
        <div className="neu-raised rounded-3xl overflow-x-auto">
          <div className="flex justify-end p-4">
            <Button size="sm">
              <Plus size={14} /> New Post
            </Button>
          </div>
          <table className="w-full text-sm min-w-[600px]">
            <thead>
              <tr className="text-left text-xs text-ink-soft border-b border-ink/5">
                <th className="p-4">Title</th>
                <th className="p-4">Author</th>
                <th className="p-4">Date</th>
                <th className="p-4">Status</th>
              </tr>
            </thead>
            <tbody>
              {blogPosts.map((b) => (
                <tr key={b.id} className="border-b border-ink/5 last:border-0">
                  <td className="p-4 font-semibold text-cocoa">{b.title}</td>
                  <td className="p-4 text-ink-soft">{b.author}</td>
                  <td className="p-4 text-ink-soft">{b.date}</td>
                  <td className="p-4">
                    <Badge tone={b.status === "Published" ? "positive" : "neutral"}>{b.status}</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {blogPosts.length === 0 && (
            <p className="text-sm text-ink-soft p-6 text-center">No blog posts yet.</p>
          )}
        </div>
      )}

      {tab === "FAQ" && (
        <div className="flex flex-col gap-3">
          {faqEntries.length === 0 && <p className="text-sm text-ink-soft">No FAQ entries yet.</p>}
          {faqEntries.map((f) => (
            <div key={f.id} className="neu-raised rounded-2xl p-5">
              <div className="text-xs font-bold text-cocoa uppercase tracking-wide mb-1">{f.category}</div>
              <div className="font-semibold text-ink mb-1">{f.question}</div>
              <div className="text-sm text-ink-soft">{f.answer}</div>
            </div>
          ))}
          <button className="neu-flat rounded-2xl p-5 text-sm font-semibold text-cocoa text-left">
            + Add FAQ Entry
          </button>
        </div>
      )}

      {tab === "Testimonials" && (
        <div className="neu-raised rounded-3xl p-6">
          <p className="text-sm text-ink-soft mb-4">
            Curate which customer reviews appear as featured testimonials on the homepage.
          </p>
          <div className="flex flex-col gap-2">
            {reviews
              .filter((r) => r.status === "Approved")
              .map((r) => (
                <div key={r.id} className="neu-raised-sm rounded-2xl px-4 py-3 flex items-center justify-between text-sm">
                  <span className="text-ink">
                    {r.customer} — {r.product}
                  </span>
                  <Badge tone="positive">Featured</Badge>
                </div>
              ))}
            {reviews.filter((r) => r.status === "Approved").length === 0 && (
              <p className="text-sm text-ink-soft">No approved reviews yet.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
