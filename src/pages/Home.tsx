import { useState, useEffect, type ReactNode } from "react";
import "../App.css";
import content from "../data/content.json";
import { getPosts, type Post } from "../lib/posts";
import { useSpotify } from "../hooks/useSpotify";
import { FaSpotify } from "react-icons/fa";
import { Link } from "react-router-dom";
import GitHubGraph from "../components/GitHubGraph";

type Content = typeof content;
type BlogPost = Content["blogPosts"][number];
type Repo = Content["oss"][number];
type Project = Content["projects"][number] & {
  isImage?: boolean;
  isDotFont?: boolean;
};
type WorkItem = Content["work"][number] & { isImage?: boolean };
type NavLink = Content["navLinks"][number];
type Social = Content["social"][number];

const Section = ({
  title,
  id,
  children,
}: {
  title: ReactNode;
  id?: string;
  children: ReactNode;
}) => (
  <section id={id} className="section">
    <div className="section-heading">{title}</div>
    {children}
  </section>
);

const Badge = ({ label }: { label: string }) => (
  <span className="badge">{label}</span>
);

const SimpleList = <T,>({
  items,
  render,
}: {
  items: T[];
  render: (item: T, index: number) => React.ReactNode;
}) => (
  <ul className="simple-list">
    {items.map((item, idx) => (
      <li key={idx} className="simple-list-item">
        {render(item, idx)}
      </li>
    ))}
  </ul>
);

const CardRow = <T,>({
  items,
  render,
}: {
  items: T[];
  render: (item: T, index: number) => React.ReactNode;
}) => (
  <div className="card-row">
    {items.map((item, idx) => (
      <article key={idx} className="card">
        {render(item, idx)}
      </article>
    ))}
  </div>
);

const SocialRail = ({ social }: { social: Social[] }) => (
  <aside className="rail rail-left">
    <div className="rail-label">social</div>
    <div className="rail-line" />
    <ul>
      {social.map((item) => (
        <li key={item.label}>
          <a
            href={item.url}
            target="_blank"
            rel="noreferrer"
            aria-label={item.label}
          >
            {item.label[0]}
          </a>
        </li>
      ))}
    </ul>
  </aside>
);

const EmailRail = ({ email }: { email: string }) => (
  <aside className="rail rail-right">
    <a href={`mailto:${email}`} className="vertical-link">
      {email}
    </a>
  </aside>
);

const formatDate = (value: string) =>
  new Intl.DateTimeFormat("en", { month: "short", year: "2-digit" }).format(
    new Date(value)
  );

const LinkedInIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
);

const TwitterIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const EmailIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
  </svg>
);

const GitHubIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
  </svg>
);

const getSocialIcon = (label: string) => {
  switch (label.toLowerCase()) {
    case "linkedin":
      return <LinkedInIcon />;
    case "twitter":
    case "x":
      return <TwitterIcon />;
    case "email":
      return <EmailIcon />;
    case "github":
      return <GitHubIcon />;
    case "spotify":
      return <FaSpotify />;
    default:
      return null;
  }
};

const CopyIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
  </svg>
);

const CheckIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="20 6 9 17 4 12"></polyline>
  </svg>
);

const ExternalLinkIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M15 3h6v6" />
    <path d="M10 14 21 3" />
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
  </svg>
);

const EmailDisplay = ({ email }: { email: string }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = (e: React.MouseEvent) => {
    e.preventDefault();
    navigator.clipboard.writeText(email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex items-center gap-2 text-neutral-400 hover:text-white transition-colors group">
      <a
        href={`mailto:${email}`}
        className="text-sm font-mono no-underline hover:underline"
      >
        {email}
      </a>
      <button
        onClick={handleCopy}
        className="p-1.5 rounded-md hover:bg-neutral-800 transition-colors cursor-pointer"
        aria-label="Copy email"
        title="Copy email"
      >
        {copied ? <CheckIcon /> : <CopyIcon />}
      </button>
    </div>
  );
};

const Home = () => {
  const {
    navLinks,
    profile,
    listening,
    blogPosts,
    oss,
    projects,
    work,
    social,
    contact,
  } = content as Content;

  const song = useSpotify();
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    getPosts().then((fetchedPosts) => setPosts(fetchedPosts.slice(0, 3)));
  }, []);

  return (
    <div className="app-shell" id="top">
      <div className="halo halo-top" />
      <div className="halo halo-bottom" />

      <main className="surface">
        <div className="nav-row">
          <nav className="nav-links">
            {navLinks.map((link: NavLink) => (
              <a key={link.label} href={link.href}>
                {link.label}
              </a>
            ))}
            <Link to="/blog">Blog</Link>
          </nav>
          <div className="flex gap-4 items-center">
            {social
              .filter((s: Social) =>
                ["github", "linkedin", "twitter", "x"].includes(
                  s.label.toLowerCase()
                )
              )
              .map((s: Social) => (
                <a
                  key={s.label}
                  href={s.url}
                  className="text-white hover:text-gray-300 transition-colors"
                  target="_blank"
                  rel="noreferrer"
                  aria-label={s.label}
                >
                  {getSocialIcon(s.label)}
                </a>
              ))}
          </div>
        </div>

        <div className="banner" aria-label={profile.banner.alt}>
          <img
            className="banner-image opacity-50"
            src={profile.banner.image}
            alt={profile.banner.alt}
          />
          <div></div>
        </div>
        <div className="flex flex-row justify-between items-center mb-8">
          <div className="listening">
            {song?.isPlaying ? (
              <div className="flex flex-wrap gap-1">
                <div className="flex items-center gap-2">
                  <FaSpotify className="text-[#1DB954] size-4" />
                  <span className="muted text-200">Listening to</span>
                  <strong>
                    <a
                      href={song.songUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="hover:underline text-white"
                    >
                      {song.title}
                    </a>
                  </strong>
                </div>
                <div className="flex items-center">
                  <span className="muted text-200">by {song.artist}</span>
                  <span className="dancer" aria-label="Playing">
                    🕺
                  </span>
                </div>
              </div>
            ) : (
              <>
                <span className="muted text-200">{listening.status}</span>
                {listening.track && <strong>{listening.track}</strong>}
                <span className="dancer" aria-label="Loading">
                  🕺
                </span>
              </>
            )}
          </div>
          <div className="location-text !mb-0">
            in {profile.location} <span className="dot green" />
          </div>
        </div>

        <header className="profile relative">
          <h1 className="mb-1">{profile.name}</h1>
          <div className="flex flex-wrap items-center gap-3 mb-6">
            <p className="eyebrow !mb-0 text-neutral-300">{profile.role}</p>
            <EmailDisplay email={contact.email} />
          </div>
          <p className="bio">{profile.bio}</p>
        </header>

        <Section
          title={
            <Link to="/blog" className="hover:underline">
              Blog
            </Link>
          }
          id="blog"
        >
          {posts.length > 0 ? (
            <SimpleList
              items={posts}
              render={(post: Post) => (
                <Link to={`/blog/${post.slug}`} className="blog-row">
                  <span className="blog-title">{post.title}</span>
                  <span className="row-spacer" />
                  <time className="blog-date">{formatDate(post.date)}</time>
                </Link>
              )}
            />
          ) : (
            <SimpleList
              items={blogPosts}
              render={(post: BlogPost) => (
                <a href={post.url} className="blog-row" target="_blank" rel="noreferrer">
                  <span className="blog-title">{post.title}</span>
                  <span className="row-spacer" />
                  <time className="blog-date">{formatDate(post.date)}</time>
                </a>
              )}
            />
          )}
        </Section>

        <Section title="Open Source">
          <SimpleList
            items={oss}
            render={(repo: Repo) => (
              <a href={repo.url} className="oss-row" target="_blank" rel="noreferrer">
                <span className="oss-name">{repo.name}</span>
                <span className="row-spacer" />
                <span className="oss-external-link">
                  <ExternalLinkIcon />
                </span>
              </a>
            )}
          />
        </Section>

        <Section title="Github Activity">
          <GitHubGraph />
        </Section>

        <Section title="Projects">
          <CardRow
            items={projects}
            render={(project: Project) => (
              <a href={project.url} className="project-card" target="_blank" rel="noreferrer">
                <div className="project-icon">
                  {project.isImage ? (
                    <img
                      src={project.icon}
                      alt={project.name}
                      className="w-full h-full object-contain rounded-md"
                    />
                  ) : (
                    <span
                      style={
                        project.isDotFont
                          ? { fontFamily: '"DotGothic16", sans-serif' }
                          : {}
                      }
                    >
                      {project.icon}
                    </span>
                  )}
                </div>
                <div className="flex-1">
                  <h3>{project.name}</h3>
                  <p>{project.description}</p>
                </div>
                <span className="open-button">Open</span>
              </a>
            )}
          />
        </Section>

        <Section title="Work">
          <CardRow
            items={work}
            render={(job: WorkItem) => (
              <a href={job.url} className="work-card" target="_blank" rel="noreferrer">
                <div
                  className="work-logo"
                  style={{
                    backgroundColor: job.logoColor,
                    color: job.logoTextColor,
                  }}
                >
                  {job.isImage ? (
                    <img
                      src={job.logo}
                      alt={job.company}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    job.logo
                  )}
                </div>
                <div className="flex-1">
                  <h3>{job.company}</h3>
                  <p>{job.description}</p>
                </div>
                <span className="open-button">Open</span>
              </a>
            )}
          />
        </Section>

        <footer className="mt-20 mb-8 flex flex-col gap-4 border-t border-dashed border-neutral-800 pt-8">
          <div className="flex gap-6 items-center justify-center flex-wrap">
            {social.map((s: Social) => {
              if (s.label.toLowerCase() === "email") {
                const email = s.url.replace("mailto:", "");
                return <EmailDisplay key={s.label} email={email} />;
              }
              return (
                <a
                  key={s.label}
                  href={s.url}
                  className="text-neutral-400 hover:text-white transition-colors"
                  target="_blank"
                  rel="noreferrer"
                  aria-label={s.label}
                >
                  {getSocialIcon(s.label)}
                </a>
              );
            })}
          </div>
        </footer>
      </main>
    </div>
  );
};

export default Home;
