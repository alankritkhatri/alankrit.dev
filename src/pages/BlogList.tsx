import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getPosts, type Post } from "../lib/posts";
import "../App.css";

const BlogList = () => {
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    getPosts().then(setPosts);
  }, []);

  return (
    <div className="app-shell">
      <div className="halo halo-top" />
      <div className="halo halo-bottom" />

      <main className="surface">
        <div className="nav-row mb-8">
          <nav className="nav-links">
            <Link to="/">Home</Link>
            <Link to="/blog" className="text-white">
              Blog
            </Link>
          </nav>
        </div>

        <header className="profile relative mb-12">
          <h1 className="mb-4">Blog</h1>
          <p className="bio">Thoughts, tutorials, and updates.</p>
        </header>

        <div className="flex flex-col gap-8">
          {posts.map((post) => (
            <Link
              key={post.slug}
              to={`/blog/${post.slug}`}
              className="group block"
            >
              <article className="flex flex-col gap-2">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline gap-1 sm:gap-4">
                  <h2 className="text-xl font-medium group-hover:text-blue-400 transition-colors">
                    {post.title}
                  </h2>
                  <time className="text-sm text-neutral-500 font-mono shrink-0">
                    {new Date(post.date).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </time>
                </div>
                <p className="text-neutral-400 leading-relaxed">
                  {post.description}
                </p>
              </article>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
};

export default BlogList;
