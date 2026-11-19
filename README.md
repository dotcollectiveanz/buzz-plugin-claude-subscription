# Claude (subscription) for Buzz

**Private, for personal use only. Do not publish or share this plugin.**

A [Buzz](https://github.com/block/buzz-app) desktop plugin (`claude-subscription`) that adds a
**Claude (subscription)** harness: Buzz agents that run on *your own* signed-in Claude Code, using
your Claude subscription instead of an Anthropic API key.

Buzz's built-in Claude harness only accepts an API key. Anthropic's terms say third-party products
shouldn't offer claude.ai (subscription) sign-in unless Anthropic approves them, so this plugin is
kept private to its owner's own computer and agents. Agents running on it use your subscription's
usage limits.

## What it does

- **Harness:** Claude (subscription) in Agents → Harness, for new agents or by switching an existing
  one. Its instructions and workspace carry over, both ways.
- **One session per conversation.** Each thread (or each channel, if you choose) is one continuing
  Claude Code session, with the Buzz tools.
- **Settings:** Permissions (Claude Code's permission mode: Manual, Accept edits, Plan, Auto, Bypass),
  Model and Thinking, listed from your Claude Code, and Instructions; then Workspace and
  Conversations (per thread or per channel).
- **Activity:** the agent's conversations, whether each is working, and each one's transcript, read
  from Claude Code's own history in `~/.claude/projects`.
- **Share to the Marketplace.** The agent's card menu offers **Share**, as for Buzz's own Claude
  agents. The listing is an ordinary Buzz Claude agent (name, picture, model and instructions):
  whoever adds it runs it on Buzz's own Claude harness with their own sign-in. This plugin, your
  subscription and your workspace are never part of it.
- **Synced settings:** permissions, model, thinking level and conversations sync across your
  devices.
- **Huddle voice:** start a Huddle in your DM with the agent, or add it from the Huddle's members, and
  talk to it. `google/gemini-2.5-flash` transcribes your speech, the agent works on it in its Claude
  session for that room (with its tools, as for a typed message), and `openai/gpt-audio-mini` reads
  its answer aloud, word for word, as the agent. Its first sentence plays as soon as it's voiced, while
  the rest is voiced behind it. Both run through OpenRouter on the key OpenCode is signed in with
  (`opencode auth login`): your Claude subscription has no audio models. Your words are posted in the
  room under your name, and its answer as a normal message from the agent. If you leave before it
  answers, the work carries on and the answer is still posted.
- **Failures are reported.** A failed turn says so in its thread and tags you.

Claude runs commands as you, so an agent acts only on your own mentions, or ones you attested: Buzz's
harness kit admits nothing else.

## Requirements

- Buzz desktop 1.0 on macOS.
- Claude Code installed and signed in with your subscription (`claude`, then `/login`). Check with
  `claude auth status`.
- Node.js 22 or later, with `npx` on the PATH your login shell gives Buzz.

Nothing else to set up: the plugin runs the Claude Code ACP adapter with `npx`, pinned to
`@agentclientprotocol/claude-agent-acp@0.106.0`. The first start downloads it (about 20 seconds), and
later starts use npm's cache.

It uses your whole Claude Code setup: `~/.claude/settings.json`, your model routing, MCP servers and
skills. The plugin removes `ANTHROPIC_API_KEY` from Claude's environment so the subscription login is
used, not a key.

## Install

1. In Buzz: **Settings → Plugins → Manage plugins → Add → Browse** under "Add from folder", pick this
   repository's `plugin/` folder, review the access it asks for, and install.
2. Create an agent with **Claude (subscription)** as its Harness, or switch one to it.
3. Add it to a channel, or open a DM with it, and mention it.

### Access it asks for

- Run `npx -y @agentclientprotocol/claude-agent-acp@0.106.0` (the Claude Code ACP adapter).
- Serve the Buzz tools to Claude on this computer (MCP), acting as the agent.
- Read files: uploads you ask the agent to make, Claude Code's transcripts for Activity, and
  OpenCode's OpenRouter login (`~/.local/share/opencode/auth.json`) for voice.
- Reach `https://openrouter.ai`, for voice only. Your Huddle speech goes there to be transcribed, and
  the agent's answers to be voiced.

## How it works

Buzz's side of each turn comes from the plugin API's harness kit (`ctx.agents.harness`); Claude's
side is one `claude-agent-acp` process (the Agent Client Protocol adapter for Claude Code,
Apache-2.0) driven by a copy of Buzz's ACP client (`src/acp/`). For each conversation it:

1. keeps one Claude Code session, started in the agent's workspace, with Buzz's tools served to it
   over MCP as the agent;
2. sends the turn, with Buzz's prompt appended to Claude Code's own system prompt;
3. lets Claude reply with Buzz's `send` tool, which ends the turn.

Buzz ends a turn as soon as the agent's final `send` posts; Claude Code then records that send as
refused and the turn as interrupted. The transcript reader shows those as posted and finished.

## Develop

See [AGENTS.md](AGENTS.md).

```sh
npm install
npm run build        # src/ → plugin/plugin.js
npm test
npm run types        # Buzz's plugin API types, for typecheck
npm run check        # typecheck, tests, manifest, icon and build freshness
CLAUDE_LIVE=1 npx vitest run src/runtime.live.test.ts   # a real turn on your Claude Code login
```

## Licence

Apache-2.0. See [LICENSE](LICENSE) and [NOTICE.md](NOTICE.md).
