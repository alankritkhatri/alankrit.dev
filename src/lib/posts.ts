export interface Post {
  slug: string;
  title: string;
  date: string;
  description: string;
  content: string;
}

export async function getPosts(): Promise<Post[]> {
  const modules = import.meta.glob("../content/posts/*.md", {
    query: "?raw",
    import: "default",
  });
  const posts: Post[] = [];

  for (const path in modules) {
    const content = (await modules[path]()) as string;
    const slug = path.split("/").pop()?.replace(".md", "") || "";

    // Simple frontmatter parser
    const match = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
    if (match) {
      const frontmatter = match[1];
      const body = match[2];
      const metadata: any = {};

      frontmatter.split("\n").forEach((line) => {
        const [key, ...value] = line.split(":");
        if (key && value) {
          metadata[key.trim()] = value.join(":").trim().replace(/^"|"$/g, "");
        }
      });

      posts.push({
        slug,
        title: metadata.title || slug,
        date: metadata.date || "",
        description: metadata.description || "",
        content: body,
      });
    }
  }

  return posts.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

export async function getPost(slug: string): Promise<Post | undefined> {
  const posts = await getPosts();
  return posts.find((p) => p.slug === slug);
}
