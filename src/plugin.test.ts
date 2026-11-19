/// <reference types="node" />
// Loads the built plugin.js as Buzz would, with a stand-in context, and
// renders each tab it registers. Run `npm run build` first.
import { readFileSync } from "node:fs";
import * as React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { expect, it } from "vitest";

it("activates from plugin.js, registering the Claude type with its tabs", async () => {
  const source = readFileSync(
    new URL("../plugin/plugin.js", import.meta.url),
    "utf8",
  );
  const plugin = await import(
    `data:text/javascript;base64,${Buffer.from(source).toString("base64")}`
  );
  expect(plugin.inject).toEqual(["react", "agents", "host"]);
  let registered: Record<string, any> | undefined;
  const store = new Map<string, string>();
  const cleanups: (() => void)[] = [];
  const cards: Record<string, any>[] = [];
  const settingsCards = { register: (card: Record<string, any>) => cards.push(card) };
  plugin.apply({
    inject: (_deps: string[], run: (scope: unknown) => void) => run({ settingsCards }),
    react: React,
    pluginOwner: { id: "claude-subscription", revision: "test" },
    effect: (start: () => () => void) => cleanups.push(start()),
    agents: {
      register: (type: Record<string, unknown>) => {
        registered = type;
      },
      snapshot: () => ({ status: "ready", running: [] }),
      subscribe: () => () => {},
      relay: () => undefined,
      tools: () => [],
      storage: { get: (key: string) => store.get(key) ?? null, set: async () => {} },
      harness: {},
    },
    host: {
      spawn: async () => {
        throw new Error("not in this test");
      },
      resolveDirectory: async (path: string) => path,
      serveMcp: async () => {
        throw new Error("not in this test");
      },
    },
  });
  expect(registered).toMatchObject({ id: "claude", title: "Claude (subscription)" });
  // Huddles seat only agent types with voice.
  expect(typeof registered?.voice).toBe("function");
  // The Gemini key for voice is set in the plugin's own Settings card.
  expect(cards).toMatchObject([{ id: "voice", title: "Claude voice", group: "App" }]);
  const card = renderToStaticMarkup(React.createElement(cards[0]!.component, { active: () => true }));
  expect(card).toContain("Gemini API key");
  expect(card).toContain('type="password"');
  // Buzz's agent menu offers Share only with `exportShared`.
  expect(registered?.exportShared({ model: "sonnet", workspace: "~/x" })).toEqual({ runtime: "claude", model: "sonnet" });
  const roles = registered?.tabs.map((tab: { role: string }) => tab.role);
  expect(roles).toEqual(["settings", "activity"]);
  const agent = {
    key: "a".repeat(64),
    name: "Ada",
    config: { model: "sonnet", instructions: "Track UAT." },
  };
  const props = { agent, save: async () => {} };
  const identity = renderToStaticMarkup(
    React.createElement(registered?.tabs[0].component, {
      ...props,
      settingsSection: "identity",
    }),
  );
  for (const text of ["Permissions", "Model", "Thinking", "Instructions", "Track UAT."])
    expect(identity).toContain(text);
  expect(identity).not.toContain("Workspace");
  const settings = renderToStaticMarkup(
    React.createElement(registered?.tabs[0].component, {
      ...props,
      settingsSection: "runtime",
    }),
  );
  for (const text of ["Workspace", "~/.buzz", "Conversations"])
    expect(settings).toContain(text);
  const activity = renderToStaticMarkup(
    React.createElement(registered?.tabs[1].component, {
      ...props,
      conversation: { channelId: "c".repeat(8), rootId: "e".repeat(64) },
    }),
  );
  expect(activity).toContain("This thread");
  expect(activity).toContain("No Claude session here yet.");
  expect(activity).toContain("Recent conversations");
  const create = renderToStaticMarkup(
    React.createElement(registered?.Create, {
      config: registered?.defaults().config,
      onChange: () => {},
      disabled: false,
    }),
  );
  for (const text of ["Permissions", "Workspace", "Instructions"])
    expect(create).toContain(text);
  expect(registered?.summary({ config: { mode: "plan", model: "m" } })).toBe(
    "plan · m",
  );
  for (const cleanup of cleanups) cleanup();
});
