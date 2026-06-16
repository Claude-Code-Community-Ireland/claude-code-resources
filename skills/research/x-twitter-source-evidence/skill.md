---
name: x-twitter-source-evidence
description: Collect verifiable X/Twitter evidence packets for research, launch tracking, support triage, social listening, and competitive monitoring while keeping humans in control of posting and final claims.
source: tweetclaw (MIT)
---

# X/Twitter Source Evidence

Use this skill when a user needs grounded X/Twitter context before writing,
prioritizing, support triage, monitoring, or reporting. Produce evidence that a
human can inspect: source URLs, account handles, timestamps, post text excerpts,
engagement fields when available, query terms, and any filtering decisions.

Do not use this skill to auto-publish, mass-message users, impersonate accounts,
evade platform limits, or turn unverified posts into final claims. Keep drafting,
approval, scheduling, posting, analytics, and account-control decisions outside
this skill unless the user explicitly supplies a separate approved workflow.

## Workflow

1. Restate the research question and the decision it will support.
2. Choose the narrowest query set: accounts, keywords, URLs, replies, mentions,
   media, followers, or recent monitor events.
3. Collect source data with an approved project tool. TweetClaw is one option
   for Claude Code and OpenClaw projects that already use Xquik: install
   `@xquik/tweetclaw`, configure the required Xquik API key, and run only the
   read or export commands needed for the current question.
4. Normalize each result into an evidence packet with URL, author, timestamp,
   text excerpt, query, collection time, and relevant numeric fields.
5. Deduplicate reposts, near-duplicates, and repeated replies before drawing
   conclusions.
6. Separate direct observations from interpretation. Label unsupported,
   ambiguous, stale, or deleted-source findings.
7. Return concise findings plus a short appendix of source packets.

## Evidence Packet

```yaml
source_url: "https://x.com/example/status/123"
author: "@example"
published_at: "2026-06-16T10:30:00Z"
collected_at: "2026-06-16T11:00:00Z"
query: "brand launch"
excerpt: "Short quoted excerpt or paraphrase for review."
metrics:
  replies: 12
  reposts: 3
  likes: 47
notes: "Why this source matters or why confidence is limited."
```

## Safety Checks

- Use public or explicitly authorized data only.
- Keep credentials in local secret stores. Never paste keys, cookies, tokens, or
  account session material into prompts, logs, issues, pull requests, or reports.
- Prefer links and short excerpts over copied threads.
- Avoid demographic, medical, financial, legal, or political targeting unless
  the project has explicit policy approval.
- Ask for human review before any external communication based on the findings.

## Output Shape

Return:

- `summary`: 3 to 5 bullets answering the research question.
- `confidence`: high, medium, or low, with one reason.
- `source_packets`: compact evidence packets with canonical URLs.
- `gaps`: missing accounts, time windows, permissions, or data that could change
  the conclusion.
