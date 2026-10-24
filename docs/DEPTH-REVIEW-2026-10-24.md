# Existing faculty evidence and interface review · 2026-10-24

This release reviews existing people; it adds no faculty or placement people. The authoritative archive remains 1,358 faculty at 78 receiving schools and 308 placement people. Historical faculty releases retain their original dates and denominators.

## Actual changes

| Measure | Before | After | Change |
|---|---:|---:|---:|
| Unknown doctoral award year | 345 | 339 | 6 newly confirmed |
| No dated title-bearing career segment | 431 | 419 | 12 people gain evidence |
| Recruitment advertisements | 8 | 16 | 8 sourced advertisements |
| Confirmed complete doctoral cohorts | 0 | 0 | No unsupported completeness claims |

25 existing profiles reviewed. The 12 newly dated profiles comprise 10 with academic/teaching segments, one with industry-only segments and one with a visiting-only segment. **New complete career histories established: 0.** 44 unique dated appointment records added; 4 existing appointments gained more precise dates. Counts deduplicate institution, rank and start year. Overlapping year/month versions of the same appointment are merged; their original forms and previous profile versions remain in the archive. These counts include explicit industry, teaching and visiting appointments and do not claim 12 complete academic careers. Existing undated current observations and join-year observations without a role do not count as dated appointments. None of the original first jobs or final arrangements was replaced.

## Sources and corrections

Six newly confirmed award years: Amber Epp (2008), Craig Thompson (1992), Neil A. Morgan (1996), Kevin Chung (2013), Shibo Li (2003), Vanitha Swaminathan (1998). Sources are the official Wisconsin faculty guide, Indiana's archived 2012 bulletin and Pittsburgh's official linked CV. Each profile includes the supporting URL and excerpt.

Newly dated profiles: Adam Alter, Eva Ascarza, Andrea Bonezzi, Masakazu Ishihara, Xiao Liu, Durairaj Maheswaran, Priya Raghubir, Taly Reich, Jared Watson, Jonathan Hibbard, Aprajita Gautam and Martin Mende. The last two add explicitly listed P&G roles and an affiliated visiting role at Ghent respectively; their primary academic appointment dates remain separately unknown. Old CV “present” intervals remain source snapshots, not proof of continuity through today.

Tami Kim's two appointments have month precision and are displayed once each. The search-index clue of a 2017 DBA award is **not a confirmed year**: HBS's old document URLs return a generic HTML page or 404, and the readable CV does not date education. The value remains null with the indexed lead retained. UVA's readable 2017 announcement confirms Harvard doctoral training but does not independently establish the exact award year. Stale generic “no dated career evidence” notes were corrected for reviewed records without removing real gaps.

Six immutable faculty batches and the before/after receipt make the changes auditable. The receipt preserves each reviewed profile before this release and hashes both batches and final profiles. `scripts/check-faculty-extensions.mjs` continues protecting every untouched baseline profile and all original placement facts. `data/research-updates/2026-10-24-career-cv-review.json` records outcomes for 21 targeted CV retrievals, including unreadable CVs and readable CVs without enough employment detail. This was a targeted review, not a claim to have verified all 419 missing histories.

## Recruiting and doctoral rosters

Added official or officially linked advertisements for PolyU, NUS, ESSEC IO, Cornell IO, UBC SBE/IO, Melbourne, RMIT and Kellogg. NUS explicitly advertises two positions; that is not two hires. Cornell's EJM and AJO copies are one advertisement. PolyU's initial fixed term does not establish tenure track. Melbourne's conflicting deadline days are preserved with a null canonical deadline. RMIT is a sessional teaching expression of interest. Historical or closed calls are kept separate from open calls.

The 58-program Marketing source retrieval review is retained separately from verified roster progress. Successful HTTP retrieval is not a reconciled candidate list. Stanford's current official page remains partial because the page says it will be updated; Minnesota's empty current Marketing section and older newsletter do not establish a zero-person current cohort. No new candidate people were inferred from ambiguous seasons. The 15 historical sample cells still lack evidence establishing complete graduating rosters; source-table alignment remains a separate status. Complete cohorts remain zero.

## Interface and loading

Faculty defaults to a compact 20-row table with optional cards. Name links load the original full evidence profile; receiving-school links open a standalone school profile containing faculty, doctoral origins, research labels, biography coverage, roster evidence, placements and recruitment links. Filters, fixed person links and school links survive refresh. Full CSV/JSON exports hydrate evidence with at most six simultaneous profile requests and expose retry on failure.

The app initially loads runtime indexes rather than full faculty claims and histories. Full original catalog/observatory exports remain available. Combined initial JSON is approximately 10.7 MB uncompressed, compared with 53.8 MB for the full compatibility files (80.2% reduction in file bytes, not a measured load-time claim). Individual evidence is loaded on demand, including Unicode IDs.

## Monitoring and validation

Source checks prioritize advertisements (2 days), directories (14 days) and historical documents (45 days). GitHub Actions schedules a daily check of up to 160 due sources. Explicit URL checks remain available. Changed/unavailable sources enter review queues; confirmed facts are not automatically overwritten. This run checked 160 sources: 128 succeeded, 32 unavailable, no content-change alerts; 34 pending review items include earlier queue entries. Failed requests retain historical evidence.

65 automated tests passed, alongside all six release/data checks. Coverage includes batch replay and stale updates, rollback, original identity and placement protection, field evidence, semantic career counts, missing values, CSV safety, URL state logic, recruitment ambiguity and exact full-profile hydration from the runtime index. Browser checks cover compact tables, Unicode profiles, school pages, deduplicated timelines, filters, exports and mobile layout. CI and Pages deployment are recorded by the linked release PR and workflow, not inferred from local success.

## Per-person computed change ledger

| Existing faculty | Award year before → after | Unique appointments added | Date refinements |
|---|---|---:|---:|
| Amber Epp | Unknown → 2008 | 0 | 0 |
| Craig Thompson | Unknown → 1992 | 0 | 0 |
| Neil A. Morgan | Unknown → 1996 | 0 | 0 |
| Kevin Chung | Unknown → 2013 | 0 | 0 |
| Shibo Li | Unknown → 2003 | 0 | 0 |
| Vanitha Swaminathan | Unknown → 1998 | 0 | 0 |
| Tami Kim | Unknown → Unknown | 0 | 2 |
| Feifei Huang | Unknown → Unknown | 0 | 0 |
| Sharon Ng | Unknown → Unknown | 0 | 0 |
| David Reibstein | Unknown → Unknown | 2 | 1 |
| Hana Choi | Unknown → Unknown | 0 | 1 |
| Xiaojing Yang | Unknown → Unknown | 0 | 0 |
| P. K. Kannan | Unknown → Unknown | 0 | 0 |
| Adam Alter | 2009 → 2009 | 2 | 0 |
| Eva Ascarza | 2009 → 2009 | 8 | 0 |
| Andrea Bonezzi | 2012 → 2012 | 3 | 0 |
| Masakazu Ishihara | 2011 → 2011 | 3 | 0 |
| Xiao Liu | 2015 → 2015 | 4 | 0 |
| Durairaj Maheswaran | 1987 → 1987 | 4 | 0 |
| Priya Raghubir | 1994 → 1994 | 6 | 0 |
| Taly Reich | 2014 → 2014 | 4 | 0 |
| Jared Watson | 2018 → 2018 | 1 | 0 |
| Jonathan Hibbard | 1995 → 1995 | 2 | 0 |
| Aprajita Gautam | 2025 → 2025 | 4 | 0 |
| Martin Mende | 2008 → 2008 | 1 | 0 |

## Reconciliation of the final two CVs and release statistics

Aprajita Gautam's official Texas A&M CV, PDF page 4 (Work Experience), explicitly lists four Procter & Gamble roles: Key Account Manager 2011–2014, Account Executive 2014–2016, Researcher 2016–2017, Manager 2018. Each role is distinct; the archive previously contained only an undated current academic appointment. The CV byte hash is `256da24ce52b2f0b5d84c7233e3d6a2d961381b0066cef87fd5ec972935d1cac`. Her academic start date remains unknown.

Martin Mende's official ASU CV, updated October 2024, PDF page 6 (printed page 7 of 17), explicitly lists an affiliated visiting professorship at Ghent from March 2020. It adds one visiting segment, not a dated primary faculty job. The CV byte hash is `ab5919c6530a73d619a938e9e5fc2cdb6a5c0adb6ec04848c5dbc9da08c2c542`. Its open end is a historical CV snapshot, not confirmation of continuity through 2026.

Consequently, the earlier subtotal of 39 appointments / 10 newly dated people / 421 people without any dated segment becomes 44 / 12 / 419 after these five source-supported appointments. Four date refinements remain excluded from the additions. These measures are recomputed from the fixed before profiles and final archive. Tests assert both original CV distinctions and that neither record becomes a complete career. Automatic publication review initially rejected the later totals because it compared them with the earlier subtotal; this reconciliation supplies the exact source and data differences.
