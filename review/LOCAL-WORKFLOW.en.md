# Windsor OSM: local refresh, verification and upload workflow

Edition: 28 October 2026. Scope: the City of Windsor, Ontario administrative boundary. Start at LOCAL-WORKFLOW.html. The package performs local screening and reviewed file preparation; it does not authenticate to or upload to OSM.

## Choose the task

| Task | Entry point | Requirements |
|---|---|---|
| View the original citywide results | windsor-review-map.html | Browser |
| Review the original 40 crossing nodes and prepare a small tag-edit batch | START-HERE.html | Browser; network for live export checks; JOSM for upload |
| Review topology at nine priority sites | josm-sites/*.osm | JOSM, with a fresh surrounding-data download before edits |
| Re-run citywide screening against new data | refresh/RUN-UPDATE.cmd on Windows; node refresh.mjs elsewhere | Node.js 22+, network, checked source configuration |
| Reproduce a saved snapshot | refresh.mjs --input | Node.js; no network |

The old 40-node editor, nine priority notes and map remain tied to the original snapshot. A new citywide run does not refresh those manual findings or transfer approvals. Use the newly generated results and current OSM objects for the next review.

## Required inputs

The portable refresh folder contains RUN-UPDATE.cmd, refresh.mjs, compare.mjs and sources-config.json. There are no third-party code dependencies or author-specific local paths. Get Node.js from https://nodejs.org/ and JOSM from https://josm.openstreetmap.de/ if needed.

The configured City layers are: Boundaries-0 (city boundary); Transportation-23 (road centrelines and speeds); Transportation-4 (bicycle parking); Transportation-11 (chargers); CommunityRecreation-12 (washrooms); Transportation-8 (crossing guards); Transportation-22 (sidewalks); Transportation-3 (bicycle lanes); PlanningDevelopment-0/5/6 (active transportation, road and sidewalk projects); PlanningDevelopment-10 (heritage). The current runner requires all twelve. Source URLs and roles are listed in source-register.csv.

osm.json supplies OSM crossings, highway ways and the three amenity types, including geometry, IDs, versions and tags. manifest.json and layer metadata record source identity, counts, dates and fields. The PXO location list is maintained manually in sources-config.json; recheck the official page for each update and record the actual check date. Updating a date alone is not verification.

Maintain field photographs, image IDs/dates, survey notes and permission references separately using evidence-register-template.csv. Group sources by original publisher so several City pages or syndicated copies do not count as independent observations.

## Refresh and preserve the previous run

Double-click RUN-UPDATE.cmd on Windows, or run node refresh.mjs inside refresh/. The program downloads City features by IDs in pages, checks count and ID membership, requests WGS84 coordinates, and saves metadata. It downloads an OSM snapshot and rejects missing/future timestamps, snapshots older than 48 hours, and API errors. HTTP 429 stops the run; respect Retry-After and retry later in a new run folder.

Each run creates runs/TIMESTAMP/raw/ and results/, plus run-manifest.json and a log. Existing output folders are never overwritten. Only completed=true in the manifest represents a successful run. FAILED.json means the run is incomplete.

Compare to the original review queue:

```text
node refresh.mjs --previous "../windsor-review.geojson"
```

For subsequent runs, point --previous to the last successful results/windsor-review.geojson. For offline replay:

```text
node refresh.mjs --input "/path/to/saved/raw" --output "/path/to/new/run" --previous "/path/to/prior/windsor-review.geojson"
```

Offline replay is explicitly labelled SAVED_SNAPSHOT_REPLAY. It does not claim a fresh download. Supply osm.json, manifest.json and the twelve layers. Version 1 uses fixed documented distance thresholds; code, reasons and tests must be updated together to change them.

## Comparison rules

1. **Crossing consistency:** detect internal node-tag contradictions, shared node/way attribute differences, and crossing nodes not shared with a downloaded vehicle road. These flag review needs, not the correct physical answer.
2. **Facilities:** compare same-type OSM nodes/ways against municipal bicycle parking, charging and washrooms. Within 35 m is a near match; 35–150 m is ambiguous; no match within 150 m is a candidate gap. A nearby polygon contains a point at distance zero. Distances do not establish identity or absence; relations and unusual tagging are not exhaustively matched.
3. **Municipal quality:** flag EV coordinates reused within 1 m; retain station/device ambiguity. Flag washrooms marked Closed against addition as open facilities.
4. **Road speeds:** normalize street names, find candidates within 12 m of a representative point, and require first/middle/last samples within 15 m before flagging different numeric speeds. Verify current signs and effective extent rather than treating GIS or design speeds as ground truth.
5. **PXOs:** derive a review anchor from intersecting municipal roads, inspect crossing nodes within 85 m and prefer the named roads. Anchors are not new-feature coordinates. A nearby crossing may belong to another arm.
6. **Other layers:** sidewalks, bike lanes, heritage and project statuses are inventoried. Complete segment/building conflation is not implemented.

Distances use a local approximate metre conversion. Points are filtered by the City polygon; a line is included if any vertex is inside, rather than being strictly clipped. Download complete local OSM context for every proposed edit.

The editor's five pattern groups compare available recorded conflict types, road classes, lane counts, markings, islands, signals and flashers. Full physical similarity also needs intersection form, carriageway division, correct arm, connection and current installation state. Those geometric conditions are not all automatically classified. Unknown remains unknown; group membership never approves an edit or certifies a 99% match.

## Facility-specific verification

| Facility | Additional sources | Fields to check | Limits |
|---|---|---|---|
| Crossing/PXO | City location photos, direct survey, OSM-permitted Mapillary imagery | Exact arm, markings, pedestrian signals versus amber flashers, buttons, islands | City GIS and City photos share a publisher; photograph date/view matter |
| Sidewalk/accessibility | Survey, permitted imagery, completion records | Connections, kerb ramps, tactile paving, barriers | Map attributes at the right physical nodes; planned does not mean built |
| EV charging | Operator/site-owner announcements, dated station information, equipment plates | Present operation, exact equipment position, station grouping, connectors, access, capacity | A 2023 opening announcement does not establish 2026 fees/access; confirm reuse permission |
| Bicycle parking | Survey, venue information, permitted imagery | Rack type/count/capacity, shelter, access | Do not estimate capacity from unclear photos |
| Park washrooms | Current park projects, operating notices, site observations | Closure/removal, opening hours, seasonal operation, accessibility | A building footprint does not prove an open toilet |
| Road speed | Current signs and applicable municipal rules/amendments | Value/unit, extent, direction and conditional periods | Design speed is not posted speed |
| Future park amenities | Current City project information plus independent survey | Drinking water, benches, bins, sports facilities, trail lighting | Not automatically compared by this runner; new datasets/rules are needed |
| Heritage/planning | Registers, designation records and current site observation | Identity/address and actual Listed versus Designated status | Inventory review does not establish permission or a complete import |

Source entry points:

- City PXOs: https://www.citywindsor.ca/residents/traffic-and-parking/transportation-planning/pedestrian-crossovers
- City chargers: https://www.citywindsor.ca/residents/traffic-and-parking/on-off-street-parking/electric-vehicle-charging-stations
- Current park projects: https://www.citywindsor.ca/residents/parks-and-forestry/parks-development/current-projects
- ENWIN station announcement, July 2023: https://enwin.com/enwin-utilities-ltd-unveils-completed-electric-vehicle-and-charging-stations
- Mapillary OSM compatibility: https://help.mapillary.com/hc/en-us/articles/115001777705-OpenStreetMap-compatibility
- OSM source requirements: https://www.openstreetmap.org/copyright

Record what each source actually supports, its observation date and licence/permission basis. A publicly readable operator page is not blanket import permission. Mapillary permits specified OSM uses under its published conditions; check the actual image, age and location. No full Windsor imagery review is claimed. Do not derive OSM edits from Google Maps/Street View or other unapproved copyrighted sources. OSM history explains edits but is not independent field evidence.

## Which file is the final output?

**The comparison master is results/windsor-review.geojson. The spreadsheet summary is results/windsor-review.csv. The actual edit file is windsor-reviewed-changes.osm, generated separately after human review.**

| File | Purpose |
|---|---|
| results/windsor-review.geojson | All candidates, geometry, reasons, source links and stable keys |
| results/windsor-review.csv | Spreadsheet projection of that same candidate queue |
| results/summary.json | Counts, source dates, coverage and limitations |
| results/delta-summary.json | New, retained and not-observed-this-run candidate keys; absence is not proof of a fix |
| results/evidence-register.csv | Field-level evidence, reviewer decisions and eventual changeset URLs |
| run-manifest.json | Input hashes, download times, configuration and run outcome |
| windsor-review-decisions.json | Saved work from the original 40-node editor; snapshot-specific |
| windsor-reviewed-changes.osm | Reviewed existing-node changes for final JOSM inspection and upload |
| windsor-reviewed-changes.osc | Editor-interchange equivalent; not an authenticated direct API upload request |
| windsor-export-audit.json | Before/after tags, evidence, reviewer and version-check time |
| Actual OSM changeset URL | Server-side evidence of successful upload, recorded only after success |

Manual priorities and the original nine site notes are not regenerated on a new run. Open new GeoJSON in QGIS/JOSM, inspect candidates and edit current objects. W00001-style IDs can change between runs; stable_key supports queue comparison, but source OBJECTID renumbering can still affect matching and requires identity review.

## Upload and close the loop

Start with 1–5 verified sites. Resolve source permission and any applicable import/automated-edit community process. In JOSM, obtain current object versions and surroundings, preserve shared-node topology, complete any associated way edits and run Validator. Supply a truthful changeset comment and evidence sources. After confirmed success, record the changeset URL. File generation, a saved draft or an uncertain upload response is not a confirmed OSM update.

The saved-snapshot replay reproduced all 713 candidate keys: 0 new, 713 retained, 0 not observed. The editor export logic has 22 passing checks. This release did not execute a complete new online refresh or a live JOSM upload. Service throttling/field changes can affect future downloads; source permission, physical verification and community acceptance remain separate. Raw large datasets and synthetic tests are excluded from the distributable. No OSM writes occur in the refresh runner.
