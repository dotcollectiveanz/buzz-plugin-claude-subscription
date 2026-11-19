# Changelog

## 1.3.0 (2026-11-19)

- **Huddle voice:** Claude (subscription) agents can join a Huddle and talk. `google/gemini-2.5-flash` transcribes your speech, the agent works on it in
  its Claude session for that room, with its tools, and `openai/gpt-audio-mini` says its answer word
  for word, in the first person. What the voice says is checked against the answer; if it strays, it
  tries once more, then stays quiet rather than say something the agent didn't. The first sentence
  plays as soon as it's voiced, while the rest is voiced behind it.
- Your words are posted in the room as "Name: …" and the agent's answer as a normal message from it.
- **Talk over the agent:** it hears you while it speaks. Talk over it for a moment and it stops, then
  answers what you said. Speakers can still set it off, so headphones work best.
- **It keeps listening while it works:** what you say during a turn is answered next.
- **"On it":** when a turn runs longer than a second and a half, the agent says so, then gives its
  answer when it's done.
- **It speaks up when it needs you:** while you're in a Huddle with the agent, any message it posts
  elsewhere that tags you is read aloud too, with where it was posted.
- **Live voice with Gemini:** add a Gemini API key in **Settings → Claude voice** and Huddles run on
  Gemini Live (`gemini-3.8-live`), a speech-to-speech model, for both listening and speaking. It answers
  small talk at once, lets you talk over it, and hands anything that needs the agent to its Claude
  session in the background, so you can keep talking while it works. The key is checked with Google
  when you save it and kept on this computer only; the OpenCode plugin shares it.
- Without a Gemini key, voice runs through OpenRouter on the key OpenCode is signed in with
  (`opencode auth login`). Updating asks you to approve access to `https://openrouter.ai` and
  `https://generativelanguage.googleapis.com`.

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
