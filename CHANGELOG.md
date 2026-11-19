# Changelog

## 1.2.0 (2026-11-19)

- **Huddle voice:** Claude (subscription) agents can join a Huddle and talk, as OpenCode agents do
  (OpenCode plugin 1.2.3). `google/gemini-2.5-flash` transcribes your speech, the agent works on it in
  its Claude session for that room, with its tools, and `openai/gpt-audio-mini` says its answer word
  for word, in the first person. What the voice says is checked against the answer; if it strays, it
  tries once more, then stays quiet rather than say something the agent didn't. The first sentence
  plays as soon as it's voiced, while the rest is voiced behind it.
- Your words are posted in the room as "Name: …" and the agent's answer as a normal message from it.
- Voice runs through OpenRouter on the key OpenCode is signed in with (`opencode auth login`). Updating
  asks you to approve access to `https://openrouter.ai`.

## 1.2.0 (2026-11-18)

- **Share to the Marketplace:** the agent's card menu now offers **Share**, as it does for Buzz's own
  Claude agents. The listing is an ordinary Buzz Claude agent with its name, picture, model and
  instructions; whoever adds it runs it on Buzz's Claude harness with their own sign-in. The plugin,
  your subscription and your workspace aren't shared.
- `npm test` runs only this plugin's tests, not those of a Buzz checkout made by `npm run types`.
- **Releases on merge:** a version merged to `main` is tagged and released automatically, with its
  changelog section as the notes.
- README and AGENTS.md rewritten: the privacy and Share rules, Buzz's UI and settings conventions,
  the manifest's access, and how a release is made.

## 1.1.0 (2026-11-12)

- **No manual install:** the Claude Code ACP adapter now runs with `npx`, pinned to
  `@agentclientprotocol/claude-agent-acp@0.106.0`, so it no longer needs `npm install -g`. The first
  start downloads it; later starts use npm's cache. Needs Node.js 22+ on your PATH.
- Changes the plugin's host access, so Buzz asks you to approve the update.

## 1.0.0 (2026-11-12)

First version, private.

- **Claude (subscription) harness** on your signed-in Claude Code through `claude-agent-acp`, with no
  API key. Each thread (or channel) is one continuing Claude Code session with the Buzz tools.
- **Identity:** Permissions, Model and Thinking from Claude Code, and Instructions.
- **Settings:** Workspace and Conversations.
- **Activity:** conversations with their status, and transcripts read from `~/.claude/projects`.
- **Synced settings and harness changes**, and failed turns reported in their thread.
