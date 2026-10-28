# v0.1.0 — Windsor OSM review and local workflow preview

First public release of the Codex-assisted Windsor OSM/municipal-data review.

Includes the complete citywide source inputs, local API verification data, final GeoJSON/CSV analysis, offline review map, English/Chinese workflow documentation, SVG/Mermaid diagram, nine JOSM context files, a 40-node reviewed-tag editor, portable refresh code, and tests. Early/stale data are retained in a clearly labelled archive and excluded from final statistics.

Data is a snapshot, not a live mirror. The analysis has 713 review records, not confirmed errors. No OSM modifications have been uploaded. Municipal owner/editor identifiers, private correspondence and local author paths are excluded. Source geometry and comparison fields are retained; the privacy-filtered inputs reproduce all 713 candidate keys and geometries.

Validation: 22 export-logic tests plus full offline snapshot replay, syntax/privacy checks and file checksums. New online refresh, rendered-browser export and live JOSM upload are not validated end to end. City-source import compatibility, current physical conditions and applicable community processes require review before edits.

Download the source ZIP for the complete data and tools. Extract locally, open review/LOCAL-WORKFLOW.html, and follow the bilingual guide. For scripts, use Node.js 22+ and run node tools/validate.mjs. The full OSM snapshot is compressed and is expanded automatically by the replay helper.
