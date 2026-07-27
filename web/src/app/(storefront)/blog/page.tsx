import CakeIllustration from "@/components/CakeIllustration";
import type { CakeVariant } from "@/components/CakeIllustration";

const posts: { title: string; excerpt: string; readTime: string; illustration: CakeVariant }[] = [
  {
    title: "5 Tips for Storing Your Cake Overnight",
    excerpt: "Keep your cake fresh and moist with these simple storage tips from our head baker.",
    readTime: "3 min read",
    illustration: "whole-vanilla",
  },
  {
    title: "Choosing the Right Cake for a Summer Wedding",
    excerpt: "Heat-friendly flavors, frostings, and delivery timing for warm-weather celebrations.",
    readTime: "5 min read",
    illustration: "tiered-wedding",
  },
  {
    title: "Behind the Scenes: A Day in Our Kitchen",
    excerpt: "From 4am dough prep to the final piping — a look at how your cake comes together.",
    readTime: "4 min read",
    illustration: "cookie",
  },
];

export default function BlogPage() {
  return (
    <div className="px-4 md:px-8 py-10 max-w-5xl mx-auto">
      <h1 className="font-serif text-4xl text-ink mb-8">From the Bakery Journal</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post) => (
          <div key={post.title} className="neu-raised rounded-3xl p-5">
            <div className="neu-inset rounded-2xl aspect-video p-6 mb-4">
              <CakeIllustration variant={post.illustration} className="w-full h-full" />
            </div>
            <div className="text-xs text-ink-soft mb-2">{post.readTime}</div>
            <div className="font-serif text-lg text-ink mb-2">{post.title}</div>
            <p className="text-sm text-ink-soft">{post.excerpt}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
