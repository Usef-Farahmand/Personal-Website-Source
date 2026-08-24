"use client";

import { useState } from "react";
import type {
  TeamMemberInput,
  TeamMemberLinkInput,
} from "@/lib/validation/project.schema";

type LinkRow = TeamMemberLinkInput & { key: string };
type MemberRow = { key: string; name: string; links: LinkRow[] };

let rowIdCounter = 0;
function nextKey(prefix: string) {
  rowIdCounter += 1;
  return `${prefix}-${rowIdCounter}`;
}

/**
 * Project Team editor (Task 06.1 section 6). A simple ordered list — no
 * drag-and-drop reordering, per the task's explicit "a simple ordered
 * list is sufficient" — members and their links are added/removed/edited
 * inline, and the whole tree is serialized to one hidden JSON input,
 * same pattern as LinksEditor.
 */
export default function TeamEditor({
  name,
  initialValues,
}: {
  name: string;
  initialValues: TeamMemberInput[];
}) {
  const [members, setMembers] = useState<MemberRow[]>(() =>
    initialValues.map((member) => ({
      key: nextKey("member"),
      name: member.name,
      links: member.links.map((link) => ({ ...link, key: nextKey("link") })),
    }))
  );

  function addMember() {
    setMembers((current) => [
      ...current,
      { key: nextKey("member"), name: "", links: [] },
    ]);
  }

  function removeMember(memberKey: string) {
    setMembers((current) => current.filter((m) => m.key !== memberKey));
  }

  function updateMemberName(memberKey: string, value: string) {
    setMembers((current) =>
      current.map((m) => (m.key === memberKey ? { ...m, name: value } : m))
    );
  }

  function addLink(memberKey: string) {
    setMembers((current) =>
      current.map((m) =>
        m.key === memberKey
          ? {
              ...m,
              links: [...m.links, { key: nextKey("link"), label: "", url: "" }],
            }
          : m
      )
    );
  }

  function updateLink(
    memberKey: string,
    linkKey: string,
    patch: Partial<TeamMemberLinkInput>
  ) {
    setMembers((current) =>
      current.map((m) =>
        m.key === memberKey
          ? {
              ...m,
              links: m.links.map((l) =>
                l.key === linkKey ? { ...l, ...patch } : l
              ),
            }
          : m
      )
    );
  }

  function removeLink(memberKey: string, linkKey: string) {
    setMembers((current) =>
      current.map((m) =>
        m.key === memberKey
          ? { ...m, links: m.links.filter((l) => l.key !== linkKey) }
          : m
      )
    );
  }

  return (
    <div>
      <h2 className="text-base font-semibold text-neutral-900 dark:text-neutral-100">
        Team
      </h2>
      <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
        Solo by default. Add collaborators below — not every member needs a
        link.
      </p>

      {members.length > 0 ? (
        <div className="mt-4 space-y-3">
          {members.map((member) => (
            <div
              key={member.key}
              className="rounded-md border border-neutral-200 p-3 dark:border-neutral-800"
            >
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={member.name}
                  onChange={(event) =>
                    updateMemberName(member.key, event.target.value)
                  }
                  placeholder="Team member name"
                  aria-label="Team member name"
                  className="min-w-[10rem] flex-1 rounded-md border border-neutral-300 px-3 py-1.5 text-sm text-neutral-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100"
                />
                <button
                  type="button"
                  onClick={() => removeMember(member.key)}
                  aria-label={`Remove ${member.name || "team member"}`}
                  className="rounded-md p-1.5 text-red-600 hover:bg-red-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-500 dark:text-red-400 dark:hover:bg-red-950/40"
                >
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 16 16"
                    className="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  >
                    <path strokeLinecap="round" d="m3 3 10 10m0-10L3 13" />
                  </svg>
                </button>
              </div>

              <div className="mt-2.5 ml-1 space-y-2 border-l border-neutral-200 pl-3 dark:border-neutral-800">
                {member.links.length > 0 ? (
                  member.links.map((link) => (
                    <div
                      key={link.key}
                      className="flex flex-wrap items-center gap-2"
                    >
                      <input
                        type="text"
                        value={link.label}
                        onChange={(event) =>
                          updateLink(member.key, link.key, {
                            label: event.target.value,
                          })
                        }
                        placeholder="Label (e.g. LinkedIn)"
                        aria-label="Link label"
                        className="min-w-[8rem] flex-1 rounded-md border border-neutral-300 px-2 py-1.5 text-sm text-neutral-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100"
                      />
                      <input
                        type="url"
                        value={link.url}
                        onChange={(event) =>
                          updateLink(member.key, link.key, {
                            url: event.target.value,
                          })
                        }
                        placeholder="https://…"
                        aria-label="Link URL"
                        className="min-w-[10rem] flex-[2] rounded-md border border-neutral-300 px-2 py-1.5 text-sm text-neutral-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100"
                      />
                      <button
                        type="button"
                        onClick={() => removeLink(member.key, link.key)}
                        aria-label={`Remove ${link.label || "link"}`}
                        className="rounded-md p-1.5 text-red-600 hover:bg-red-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-500 dark:text-red-400 dark:hover:bg-red-950/40"
                      >
                        <svg
                          aria-hidden="true"
                          viewBox="0 0 16 16"
                          className="h-4 w-4"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.5"
                        >
                          <path
                            strokeLinecap="round"
                            d="m3 3 10 10m0-10L3 13"
                          />
                        </svg>
                      </button>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">
                    No links.
                  </p>
                )}
                <button
                  type="button"
                  onClick={() => addLink(member.key)}
                  className="rounded-md border border-neutral-300 px-2.5 py-1 text-xs font-medium text-neutral-700 hover:bg-neutral-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-900"
                >
                  + Add link
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="mt-4 text-sm text-neutral-500 dark:text-neutral-400">
          Solo project — no team members yet.
        </p>
      )}

      <button
        type="button"
        onClick={addMember}
        className="mt-3 rounded-md border border-neutral-300 px-3 py-1.5 text-sm font-medium text-neutral-700 hover:bg-neutral-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-900"
      >
        + Add team member
      </button>

      <input
        type="hidden"
        name={name}
        value={JSON.stringify(
          members
            .filter((m) => m.name.trim())
            .map((m) => ({
              name: m.name.trim(),
              links: m.links
                .filter((l) => l.label.trim() && l.url.trim())
                .map(({ label, url }) => ({ label, url })),
            }))
        )}
      />
    </div>
  );
}
