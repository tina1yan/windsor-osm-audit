# Portable refresh

Start with ../LOCAL-WORKFLOW.en.md or ../LOCAL-WORKFLOW.zh-CN.md. Requires Node.js 22+. No dependencies. Windows: RUN-UPDATE.cmd. Other OS: node refresh.mjs. Use --help for saved-snapshot replay and previous-run comparison.

Downloads are read-only. Results go to a new ../runs/TIMESTAMP folder. The current node editor and nine snapshots remain tied to their original audit; this runner does not renew their evidence or approvals. Recheck source URLs and the manually maintained PXO list before every online run. Preserve a previous review file for queue-delta comparison.
