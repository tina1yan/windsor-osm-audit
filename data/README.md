# Source data snapshots

Authoritative citywide analysis snapshot: 27 October 2026 (America/Toronto), OSM base timestamp 2026-10-28T03:27:02Z.

- snapshot-2026-10-27/city/: all twelve municipal layers, metadata, source manifest, exact Overpass query and losslessly compressed full OSM response.
- snapshot-2026-10-27/live/: thirteen local main-API map responses and the 255-object version check, with retrieval metadata.
- ../archive/: exploratory subsets and superseded OSM results; excluded from final counts.

The OSM gzip expands to osm.json. tools/replay-snapshot.mjs expands it automatically into ignored local work space. Source geometries, feature IDs and comparison values are retained. Municipal created_user, last_edited_user and OWNER fields are removed throughout public datasets and embedded review data because they are unnecessary for this audit. These are therefore privacy-filtered redistributions, not byte-identical municipal originals. Original OSM contributor metadata is public OSM data and is retained under ODbL.

Attribution and separate source terms: ../DATA-LICENSES.md. Input metadata timestamps describe retrieval, not a promise of current field conditions.
