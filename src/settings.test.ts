// Share and harness changes, as Buzz runs them: `exportShared` and `carry`
// make a share (`src/features/agents/agent-share.ts` in buzz-app), and a type
// change takes the old type's `carry` into the new one's `adopt`.
import { describe, expect, it } from "vitest";
import { adopt, carry, config, DEFAULT_CONFIG, exportShared } from "./settings";

describe("share", () => {
  it("lists Buzz's Claude runtime with the model and instructions", () => {
    const saved = config({ model: "opus", effort: "max", mode: "acceptEdits", instructions: "Be brief.", workspace: "~/Sites/secret" });
    expect(exportShared(saved)).toEqual({ runtime: "claude", model: "opus" });
    expect(carry(saved).instructions).toBe("Be brief.");
    // Nothing of this computer's: the workspace stays out of what is listed.
    expect(JSON.stringify(exportShared(saved))).not.toContain("secret");
  });

  it("lists Claude's own default model as none", () => {
    expect(exportShared(DEFAULT_CONFIG)).toEqual({ runtime: "claude", model: "" });
    expect(exportShared({ model: "  " })).toEqual({ runtime: "claude", model: "" });
  });
});

describe("changing harness", () => {
  it("keeps the instructions and workspace both ways", () => {
    const brought = carry(config({ instructions: "Review PRs.", workspace: "~/Sites/app" }));
    expect(brought).toEqual({ instructions: "Review PRs.", workspace: "~/Sites/app" });
    expect(carry(adopt(brought, DEFAULT_CONFIG))).toEqual(brought);
  });
});
