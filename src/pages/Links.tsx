import React from "react";

const links = [
  { name: "GitHub", url: "https://github.com/alankritkhatri" },
  { name: "LinkedIn", url: "https://linkedin.com/in/alankrit-khatri" },
  { name: "X", url: "https://x.com/lilkeechu" },
  { name: "Email", url: "mailto:alankrit.khatri7@gmail.com" },
  { name: "Phone", url: "tel:8527819152" }
];

export default function Links() {
  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">My Links</h1>
      <ul className="space-y-4">
        {links.map((link) => (
          <li key={link.url}>
            {link.name === "Phone" ? (
              <span className="text-lg">📞 {link.url.replace('tel:', '')}</span>
            ) : link.name === "Email" ? (
              <a
                href={link.url}
                className="text-blue-500 hover:underline text-lg"
              >
                {link.name}
              </a>
            ) : (
              <a
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline text-lg"
              >
                {link.name}
              </a>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
