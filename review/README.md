# City of Windsor: OpenStreetMap and municipal open-data review

Review date: 27 October 2026 (America/Toronto). Scope: the entire City of Windsor, Ontario administrative boundary, not only Downtown. OSM analysis snapshot: 2026-10-28T03:27:02Z (27 October, 23:27:02 EDT). Older cached query results were excluded from the final statistics.

## Update: review and edit kit

Open [START-HERE.html](START-HERE.html) for the 40-node reviewed-tag editor and nine JOSM site snapshots. See [JOSM-WORKFLOW.md](JOSM-WORKFLOW.md) for how to verify, export a small reviewed batch and upload through JOSM. This addition enables file preparation; it does not establish physical facts or make unverified candidates upload-ready.

## Start here

Extract the ZIP, then open [windsor-review-map.html](windsor-review-map.html) in a browser. The map works offline, supports filtering, search and evidence links, and can export the selected records as GeoJSON. Internet access is only needed to open external evidence links.

This is an **AI-assisted review package**, not a ground survey or an approved import. All 713 records are screening results; they are not 713 confirmed mapping errors. **Upload-ready objects: 0. OSM edits made by this audit: 0.** GeoJSON is suitable for GIS review but does not itself encode a safe OSM changeset. Proposed OSM edits require feature-level verification, suitable source permission, conflation with existing objects and applicable community review.

The package includes the [nine priority sites](priority-review.geojson), [full review GeoJSON](windsor-review.geojson), [CSV](windsor-review.csv), [OSM crossing baseline](osm-crossings.geojson), [municipal boundary](windsor-boundary.geojson), [statistics](summary.json), [source index](sources.json), [API verification manifest](verification-manifest.json), [readiness status](upload-readiness.json), [community discussion brief](community-review-draft.md), and SHA-256 checksums. Coordinates are WGS84 longitude, latitude. PXO review anchors are **not proposed new crossing coordinates**.

## Screening results

| Check | Count | Interpretation |
|---|---:|---|
| OSM crossing nodes | 9,141 | Includes unmarked crossings and driveways; not a count of marked crosswalks |
| OSM crossing ways | 7,255 | Can overlap with node representations; do not add these counts |
| Internally inconsistent node tags | 40 | For example, unmarked together with markings=lines; which value is correct remains unresolved |
| Tags differ on a shared crossing node and way | 126 | One generic/specific marked combination excluded; still requires arm-level review |
| Crossing node not shared with a downloaded vehicle highway | 14 | May reflect pedestrian areas or missing road geometry; not grounds for deletion |
| Road speed differences | 385 municipal segments / 167 distinct OSM ways | Spatial/name screening, not confirmed speed-limit errors |
| Main OSM API verification | 255 QA objects and 13 local maps | The 255 object versions matched the analysis snapshot |

Records may overlap in place or OSM object. The 713 total includes near matches, source-data issues and municipal road segments. Municipal lines were included when at least one vertex was inside the City boundary; this is not strict clipping of every segment to the boundary.

## Nine priority sites

1. **RICHMOND ST / CHILVER RD**: The official photograph shows a marked crossing, while four nearby OSM nodes are tagged unmarked/no. Way 1395959062 forms a closed loop around multiple road arms. Identify the photographed arm and split the way if appropriate; do not retag the entire loop. The photograph date is unknown.

2. **BANWELL RD / MULBERRY DR**: The official photograph shows a pedestrian crossover with amber warning flashers; nearby OSM data uses crossing=traffic_signals. Verify whether there are actual pedestrian red/green signals. A push button or amber flasher alone does not establish a signal-controlled crossing.

3. **RHODES DR / ELECTRICITY DR**: An official site photograph shows a marked pedestrian crossover. Screening found only an unmarked crossing node about 62 metres away, outside the target road. Verify the exact crossing position and whether an existing footway already represents it without crossing tags.

4. **MATCHETT RD / TITCOMBE RD**: The City lists a pedestrian crossover here. No highway=crossing node was found within 85 metres of the review anchor, and a local main-API map was retrieved. Footways, exact location and current construction status still need review.

5. **LITTLE RIVER BLVD / CORA GREENWOOD DR**: The City lists a pedestrian crossover, while nearby OSM crossing nodes are tagged unmarked. Verify the same road arm and the installation date before proposing a tag change.

6. **PILLETTE RD / MILLOY ST**: The City lists a pedestrian crossover, while nearby nodes are tagged unmarked. This is an attribute-review candidate: verify each road arm individually rather than marking the whole intersection.

7. **City of Windsor Aquatic Centre**: Municipal GIS and the current City facility page both list charging facilities. The local OSM main-API map, including nodes, ways and relations, did not contain amenity=charging_station at the site. This is a candidate for a small pilot, subject to exact coordinates, station grouping, current conditions and source-licence review. The two City publications are one publisher, not independent field observations.

8. **City of Windsor Garage 2**: Municipal GIS and the current City facility page both list charging facilities. The local OSM main-API map, including nodes, ways and relations, did not contain amenity=charging_station at the site. This is a candidate for a small pilot, subject to exact coordinates, station grouping, current conditions and source-licence review. The two City publications are one publisher, not independent field observations.

9. **Carpri Pizzeria Community Centre**: Municipal GIS and the current City facility page both list charging facilities. The local OSM main-API map, including nodes, ways and relations, did not contain amenity=charging_station at the site. This is a candidate for a small pilot, subject to exact coordinates, station grouping, current conditions and source-licence review. The two City publications are one publisher, not independent field observations.

The source inventory spells Capri as "Carpri"; the original source value is retained for traceability. A construction notice for Wyandotte/Marentette supports a project, but an estimated completion date does not prove completion. Crossings near Freedom/Park were not assumed to represent the target PXO. Jefferson/Coronation was not reliably located and was not substituted with Coronation Street. The Sunset university facility reference and Riverside/Coventry Gardens also remain unresolved rather than receiving invented coordinates.

## Possible small pilots

| Category | Municipal rows | OSM within 35 m | Ambiguous 35–150 m | No match within 150 m |
|---|---:|---:|---:|---:|
| Bicycle parking | 29 | 11 | 2 | 16 |
| EV charging | 80 | 0 | 2 | 78 |
| Park washrooms | 42 | 9 | 1 | 32 |

These are candidate gaps, not counts of new features to upload. Matching considered OSM nodes and ways, with distance zero inside a matching polygon. The citywide pass did not comprehensively match relations, nonstandard tagging or facilities represented only through attributes. The 13 local main-API map checks also included relations. Distance thresholds only triage candidates; they do not establish identity.

The Aquatic Centre, Garage 2 and Capri charging sites are a suggested small pilot after verification. The 80 municipal EV rows contain **six coordinate-collision groups involving 13 records**. Different names can share a location; some rows may represent separate devices at one station, while others may be inaccurate. Do not create one OSM station per source row. Current access, network, connectors, capacity and fees need site-specific evidence. City information describes event-attendee restrictions at WFCU, so public access, 24/7 access or free parking cannot be assumed for every site.

Four unmatched washroom rows explicitly say Closed (Centennial, Great Western–Hatch Gardens, Mill Street and Optimist Memorial). They are flagged against addition as open toilets. Centennial's note mentions closure in 2015. The present building and use need checking. The City current-projects page also records facility changes. OSM already contains 305 bicycle-parking objects in the city, compared with 29 municipal rows; the smaller municipal table must not overwrite existing contributions.

## Coverage and method

Twelve complete municipal layers were retrieved: boundary (1), crossing guards (58), sidewalks (6,771), road centrelines (6,307), bicycle parking (29), EV chargers (80), bicycle lanes (1,319), park washrooms (42), active-transportation projects (1,447), road projects (833), sidewalk projects (567), and heritage sites (1,058). These are API layer counts; some lines extend beyond the City.

Detailed spatial/attribute screening covered crossings, the three POI categories and road speed limits. Sidewalks, bicycle lanes and heritage received inventory/field review only, **not complete segment/building conflation**. Road matching used normalized street names, a nearby candidate within 12 m, and endpoint/midpoint distance checks within 15 m. Thresholds and resulting categories are in summary.json. Such proximity does not prove the two datasets represent the same carriageway or effective speed zone.

Active-transportation projects: 1,344 Complete, 56 In Progress/Planned, 47 Remove. Road projects: 678 Complete, 155 In Progress/Planned. Sidewalk projects: 470 Complete, 97 In Progress/Planned (including two spelling variants). Planned geometry must not become existing infrastructure without completion evidence. Fifty-seven crossing-guard rows refer to 2022–2023 and one to 2023–2024; 57 of 58 have an OSM crossing within 40 m. A guard location does not establish a marked PXO. Planning drawings, future land uses, design speeds and Listed heritage status must not be substituted for current facilities, posted speed limits or Designated protection status.

Evidence includes municipal GIS, facility pages, site photographs, construction/planning documents, OSM snapshots and main-API reads. ENWIN's operator announcement and Hackforge's local mapping material provide additional context. City GIS, City webpages and City photos share one publisher; they are not independent field observations. ENWIN's announcement cannot validate all 80 municipal charger rows. No comprehensive recent street imagery or ground survey was performed. The Cabana Road traffic study distinguishes posted and design speeds, but its conclusions cannot be extrapolated beyond the study area.

## Source permission and next steps

The [City terms](https://opendata.citywindsor.ca/Documents/OpenDataTermsofUse.pdf), [OSM Canada source table](https://wiki.openstreetmap.org/wiki/Canada#Ontario), [Contributors attribution](https://wiki.openstreetmap.org/wiki/Contributors#Windsor) and [OSMF Canadian local-variant guidance](https://osmfoundation.org/wiki/OGL_Canada_and_local_variants) require reconciliation. The current guidance permits certain local-variant differences, including specified records definitions, with documented analysis and notification to the Licensing Working Group. This audit has not completed that determination for Windsor's full wording, including its non-public-records exclusion. This is an unresolved compatibility question, not a conclusion that the data is unusable. Existing local permission or a prior review could resolve it.

Please help identify any existing Windsor permission, import/conflation plan or relevant community discussion. Apply the [Import Guidelines](https://wiki.openstreetmap.org/wiki/Import/Guidelines) and [Automated Edits code of conduct](https://wiki.openstreetmap.org/wiki/Automated_Edits_code_of_conduct) where applicable. Review current field conditions and exact road arms for crossings; verify the three EV sites before preparing a small OSM edit file. Immediately before any edit, retrieve current OSM objects/versions, preserve topology and other contributors' tags, validate in an editor, and record changeset IDs. No public community consultation or LWG determination is claimed by this package.

## Attribution

OSM data: © OpenStreetMap contributors, available under the Open Database Licence (ODbL), https://www.openstreetmap.org/copyright. Contains information licensed under the Open Government Licence – The Corporation of the City of Windsor. This analysis is not endorsed by the City, OSM Foundation or Hackforge. Source URLs and retrieval dates are retained in the accompanying files.
