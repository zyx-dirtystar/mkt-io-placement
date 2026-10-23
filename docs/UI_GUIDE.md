# English interface · 1.1.1

Current release: 2026-10-23. The original 1.1.0 English redesign is retained. Version 1.1.1 adds researched Macao and Australian receiving-side faculty data, with individually dated evidence; original doctoral placement scope and historical reports remain preserved.

## Start with a question

| Question | Page | Collection and boundary |
| --- | --- | --- |
| Where did PhD graduates go? | `#directory` | Placement records; choose first job or final market arrangement. Unverified final arrangements use a labelled first-job fallback. |
| Who is on this season’s market? | `#current` | Recorded market-season participants, including known outcomes in that season. |
| Who works at a receiving institution? | `#faculty` | Separate faculty collection. Search People or switch to School coverage. Faculty records do not enter placement denominators. |
| Who is hiring? | `#jobs` | Sourced advertisements, including historical calls. Advertisements, declared openings and hires are separate. |
| How do programs compare? | `#compare` | Choose 2–5 programs and one consistent year basis. Missing data and incomplete cohorts remain visible. |
| Where do people move? | `#flows` | Program / research / receiving-institution flows, with person-level table alternatives. |
| What evidence is missing? | `#quality` | Field gaps, roster audit cells, conflicts and release history. |
| Is a whole cohort covered? | `#coverage` | Roster reconciliation and cohort completeness are independent. |
| What do the numbers mean? | `#method` | English definitions of dates, outcomes, denominators and evidence. |

## Searching and sharing

Placements start with four controls: archive window, PhD institution, placement definition and destination region. More filters contains explicit year axes, complete-cohort eligibility, tenure evidence and research labels. An explicit year basis replaces the archive window; the recent archive is not a single graduating cohort.

Faculty People starts with appointment region, receiving school, research track and PhD award year. More filters includes appointment group, degree-year group, doctoral scope, career evidence and field gaps. Active advanced filters are disclosed. Twenty profiles are shown per page; exports contain the full filtered set.

Filters remain in the URL. Copy the address or use Copy link in the placement directory. Individual records have permanent links; existing Chinese-era hash routes, raw taxonomy filter values and faculty coverage links remain valid.

CSV and JSON exports retain evidence, dates, unknown states and selected definitions. CSV text is quoted and spreadsheet formulas are neutralized. Original source wording is preserved even though interface and column labels are English.

## Layout and access

Desktop navigation groups Explore, Analyze and Understand the data. Mobile uses a Menu button with expanded state; Escape closes the menu. Keyboard focus styles, a skip link, labelled filters and native evidence disclosures are available. Wide comparison and flow tables scroll within their panel. Faculty coverage uses stacked school rows on mobile.

The home page reports placement records, faculty profiles, advertisements and confirmed complete cohorts separately. Counts are computed from loaded data. A zero complete-cohort count remains visible rather than being replaced by source-list reconciliation.

Original quotations, factual notes, names, official titles and some program names retain their source language. The interface identifies source wording and original evidence explicitly.

## Verification

All existing data and logic checks run unchanged in substance. CSV assertions now use English headers; they continue checking tenure unknowns, provisional classifications, first-job dates and formula protection. The new home test checks actual collection sizes and the separate complete-cohort denominator. Browser verification covers the home page, restored placement search, person evidence, faculty People / School coverage, comparison, flows, jobs, coverage, quality, methodology and the mobile menu.

## Added receiving regions

Choose Macao or Australia under Appointment region. School coverage now has seven geographic cards and 78 targets: the original 67 plus three Macao and eight Go8 institutions. The legacy “overseas” filter retains its original 58-school definition; “Macao & Australia” isolates the new 11. Chinese school aliases and standard abbreviations work in search. Selection rules, appointment groups, named exclusions, inaccessible sources and unresolved field conflicts are available in school and person details. Economics IO supplements are labelled separately from Marketing rosters. A reconciled scoped directory still does not establish complete biographies or a doctoral cohort. CSV/JSON exports retain school IDs, scope versions and field provenance.
