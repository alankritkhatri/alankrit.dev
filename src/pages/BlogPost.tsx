import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import { getPost, type Post } from "../lib/posts";
import "../App.css";

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<Post | null>(null);

  useEffect(() => {
    if (slug) {
      getPost(slug).then((p) => setPost(p || null));
    }
  }, [slug]);

  if (!post) {
    return (
      <div className="app-shell">
        <main className="surface">
          <div className="nav-row mb-8">
            <nav className="nav-links">
              <Link to="/">Home</Link>
              <Link to="/blog">Blog</Link>
            </nav>
          </div>
          <p>Loading...</p>
        </main>
      </div>
    );
  }

  return (
    <div className="app-shell">
      <div className="halo halo-top" />
      <div className="halo halo-bottom" />

      <main className="surface">
        <div className="nav-row mb-8">
          <nav className="nav-links">
            <Link to="/">Home</Link>
            <Link to="/blog">Blog</Link>
          </nav>
        </div>

        <article className="prose prose-invert max-w-none">
          <header className="mb-8">
            <h1 className="text-3xl font-serif mb-2">{post.title}</h1>
            <time className="text-sm text-neutral-500 font-mono">
              {new Date(post.date).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </time>
          </header>

          <div className="markdown-content">
            <ReactMarkdown>{post.content}</ReactMarkdown>
          </div>
        </article>
      </main>
    </div>
  );
};

export default BlogPost;
