# Existing faculty evidence review · 2026-10-25

This release starts from commit `1e5f34b1178f9ccc167b0bb04b1c2accce2d53fa`: 1,358 faculty, 419 without any dated title-bearing career segment and 339 without a confirmed doctoral award year. No faculty or placement person is added. The original 308 placement records and their first/final-job facts remain unchanged.

## Actual reviewed changes

| Measure | Before | After | Actual change |
|---|---:|---:|---:|
| Profiles without a dated career segment | 419 | 396 | 23 gain dated academic/teaching evidence |
| Unknown doctoral award years | 339 | 331 | 8 newly confirmed |
| Newly established complete career histories | — | 0 | No completeness inference |
| Faculty people | 1,358 | 1,358 | No new people |

24 existing profiles have manually reviewed fields imported. There are 100 newly sourced unique dated appointments, not 100 new people or newly created jobs; zero date-only refinements. The 23 newly dated profiles all have at least one academic/teaching segment. Industry, visiting and postdoctoral records are separately typed within these histories. No person is classified as having a complete career, and no chronology is extended beyond the source evidence. These are changes from the immediately preceding release, not cumulative additions from earlier rounds.

## Search scope and remaining limitations

The first retrieval pass covers the fixed set of all 419 missing-history profiles: 347 registered individual pages returned content for review, 36 URLs were unavailable and 36 people had no registered individual homepage. Retrieval is **not manual verification**. Only the 24 profiles in the ledger below have reviewed fields imported in this release. Others retain existing facts and unknowns; the source-pass audit explicitly marks them `not_manually_verified_in_this_release`.

Official/officially linked CVs were sought first, including Word CVs linked by USC, Wisconsin and UNC, Harvard's CV archive, NYU's historical seminar archive, Tsinghua's CVs and Berkeley's linked personal CV. Linked public document storage remains traceable to the official profile. Unavailable PDF endpoints, access failures and the difference between retrieved text and a reviewed fact are retained in [the source-pass audit](../data/research-updates/2026-10-25-faculty-source-pass.json). Raw retrievals and byte snapshots are local ignored files; published facts include source URLs, excerpts, field references, observation dates and hashes where bytes were retrieved.

Remaining gaps include 396 people with no dated title-bearing segment and 331 doctoral award years. Some readable CVs omit appointment dates; current titles, joining after a PhD, publication dates and teaching a course do not fill those dates. No individual homepage is registered for 36 initial profiles. Failed or blocked URLs retain their previous evidence. This is not a claim to have exhaustively established the careers of all 419 people. Complete doctoral cohorts remain zero; this faculty review does not change cohort denominators.

## Evidence distinctions and conflicts

- Julian De Freitas's CV gives both a 2021–2025 teaching summary and a July 1, 2021–present appointment. One Assistant Professor appointment is kept with day precision; no second job or inferred 2025 termination is created.
- Wang Haizhong's official page lists overlapping Assistant Professor (1996–1998) and Associate Professor (1996–2003) at the same institution. The conflicting source statements remain distinct and flagged. They do not establish an exact promotion date or complete path.
- Sarah Moshary's current Haas page lists an Associate Professor appointment from May 2026 alongside an open Assistant Professor line. The 2024 CV remains a historical snapshot. The independently stated Associate title and start are recorded, and no Assistant end date is guessed. The current title correction has exact field evidence and passes the reviewed baseline checks.
- Hal Hershfield's CV has concurrent Marketing/Psychology appointments and a named chair. The imported chronology focuses on the dated Marketing sequence plus the explicitly combined postdoc/visiting appointment; simultaneous titles are not counted as extra sequential Marketing moves.
- Tülin Erdem's August 2005 CV supports historical Berkeley ranks. The official NYU biography independently dates the NYU professorship from July 2006. The historical Berkeley “present” is not extended into later NYU employment.
- Amelie Burgess's 2018 education date refers to honours, while the PhD row is undated: her award year stays unknown. Ivy Chu Dang's 2020 joining statement does not date her earlier Marketing PhD or turn prior Physics candidacy into a completed degree.
- Jan-Benedict Steenkamp's 1989 earned PhD is distinct from the explicitly honorary 2010 doctorate. Overlapping KU Leuven/Wageningen roles are retained without assuming exclusive or sequential appointments.
- Word/PDF source version dates are stated where identifiable (including dated filenames/link labels); an old CV's “present” is only its source snapshot. Newly reviewed open snapshots display the recorded source version in the timeline.

Resolved generic gap notes are removed only where the new evidence actually supplies that field. Earlier conflicts remain. Doctoral subjects and institutions are linked to their own education excerpts; David Jaud’s 2014–2018 study range stays provisional, while Amelie Burgess’s PhD year remains unknown. Rosie Thuy Pham-Henderson’s explicit January 2024 tenure-track statement also supports her current start year and tenure field.

## Preservation and validation

Two immutable reviewed import batches have full-archive SHA preconditions. The new receipt preserves each of the 24 profiles before this release and hashes final profiles and both batches. Release receipt chains verify that a later review begins from the preceding reviewed version. Untouched profiles, historical releases, stable IDs, original placement facts and the original receiving scope remain protected. The 2026-10-24 report is frozen and retains its old totals; the website selects the newest dated receipt/report.

67 tests passed, including two new release regression tests covering the 419-person denominator, unknown dates, semantic deduplication, historical totals, source conflicts, honorary degrees and unchanged placement associations. The six release data checks also pass. CI/Pages and live verification are checked separately before final delivery.

## Computed per-person ledger

| Existing faculty | Award year before → after | Unique dated appointments added | Date refinements |
|---|---|---:|---:|
| Kim Corfman | 1985 → 1985 | 4 | 0 |
| Geeta Menon | 1991 → 1991 | 12 | 0 |
| SUN Yacheng | 2008 → 2008 | 2 | 0 |
| Joseph Priester | Unknown → 1994 | 5 | 0 |
| Sha Yang | Unknown → 2000 | 5 | 0 |
| Craig Thompson | 1992 → 1992 | 3 | 0 |
| Neil A. Morgan | 1996 → 1996 | 9 | 0 |
| Yingjie Zhang | 2018 → 2018 | 3 | 0 |
| Julian De Freitas | 2021 → 2021 | 2 | 0 |
| Hal Hershfield | 2009 → 2009 | 5 | 0 |
| Olivia Natan | Unknown → 2021 | 1 | 0 |
| Sarah Moshary | Unknown → 2015 | 5 | 0 |
| Yuichiro Kamada | Unknown → Unknown | 4 | 0 |
| Andreawan Honora | 2022 → 2022 | 1 | 0 |
| Rosie Thuy Pham-Henderson | 2022 → 2022 | 1 | 0 |
| David Jaud | Unknown → Unknown | 7 | 0 |
| Amelie Burgess | Unknown → Unknown | 3 | 0 |
| Ivy Chu Dang | Unknown → Unknown | 1 | 0 |
| WU Jintao | Unknown → 2003 | 5 | 0 |
| Wang Haizhong | Unknown → Unknown | 7 | 0 |
| 叶军 | Unknown → 2006 | 2 | 0 |
| John Dawes | Unknown → 1999 | 0 | 0 |
| Tülin Erdem | 1993 → 1993 | 4 | 0 |
| Jan-Benedict Steenkamp | Unknown → 1989 | 9 | 0 |

Newly confirmed doctoral award years: Joseph Priester (1994), Sha Yang (2000), Olivia Natan (2021), Sarah Moshary (2015), WU Jintao (2003), 叶军 (2006), John Dawes (1999), Jan-Benedict Steenkamp (1989).

## Reviewed profile sources

- Kim Corfman: [1](https://pages.stern.nyu.edu/~kcorfman/Vita%202-07.pdf)
- Geeta Menon: [1](https://www.stern.nyu.edu/faculty/static/cv/cv_gm7_20260112.pdf)
- SUN Yacheng: [1](https://www.sem.tsinghua.edu.cn/__local/A/CB/DD/91CFF0CFCBA2DE4F957A0CE07BB_4B74C518_9DB18.pdf)
- Joseph Priester: [1](https://uscmarshallweb.s3-us-west-2.amazonaws.com/assets/uploads/s1/cv/priester_vita_january_2020-1.docx)
- Sha Yang: [1](https://uscmarshallweb.s3-us-west-2.amazonaws.com/assets/uploads/s1/cv/cv_-_sha_yang_2022_-_post-1.docx)
- Craig Thompson: [1](https://d2w1q8smhohfza.cloudfront.net/jcthomps/pci/Thompson_CV_Jan_2023-1.docx)
- Neil A. Morgan: [1](https://d2w1q8smhohfza.cloudfront.net/namorgan/pci/NAM%20-%20Vita%20(Wisc)-1.docx)
- Yingjie Zhang: [1](https://drive.google.com/file/d/1yci4ibWP3l-2POsPJoVnPR0-YGue1DI1/view?usp=drive_link)
- Julian De Freitas: [1](https://www.hbs.edu/faculty/Profile%20Files/De%20Freitas_Julian_CV_cce6a548-fd2f-4f2e-8a4d-de24e8828b5b.pdf)
- Hal Hershfield: [1](https://www.anderson.ucla.edu/sites/default/files/document/2021-08/HHershfield_CV_08192021.pdf)
- Olivia Natan: [1](https://haas.berkeley.edu/faculty/olivia-natan/) · [2](https://news.berkeley.edu/2021/11/09/meet-our-new-faculty-olivia-natan-business/)
- Sarah Moshary: [1](https://www.dropbox.com/scl/fi/l3iy5n75bcl26t1hgid9r/Moshary_CV_2024.pdf?rlkey=it0mhn1pfptahoky0psnairxl&e=1&st=id4ex9xw&dl=0) · [2](https://haas.berkeley.edu/faculty/sarah-moshary/)
- Yuichiro Kamada: [1](https://haas.berkeley.edu/faculty/kamada-yuichiro/)
- Andreawan Honora: [1](https://research-repository.uwa.edu.au/en/persons/andreawan-honora/)
- Rosie Thuy Pham-Henderson: [1](https://research-repository.uwa.edu.au/en/persons/thuy-pham/)
- David Jaud: [1](https://researchers.adelaide.edu.au/profile/david.jaud)
- Amelie Burgess: [1](https://researchers.adelaide.edu.au/profile/amelie.burgess)
- Ivy Chu Dang: [1](https://ivydang.weebly.com)
- WU Jintao: [1](https://bus.sysu.edu.cn/en/teacher/8963)
- Wang Haizhong: [1](https://bus.sysu.edu.cn/en/teacher/WangHaizhong)
- 叶军: [1](https://smr.xmu.edu.cn/TeacherWeb/Teacher_Details_2022.aspx?User_ID=513)
- John Dawes: [1](https://researchers.adelaide.edu.au/profile/john.dawes)
- Tülin Erdem: [1](https://www.stern.nyu.edu/faculty/bio/tulin-erdem) · [2](https://pages.stern.nyu.edu/~mkt/Seminar%20Series/TulinErdemcv05.pdf)
- Jan-Benedict Steenkamp: [1](https://www.kenan-flagler.unc.edu/wp-content/uploads/1970/01/Vita-Jan-Benedict-Steenkamp.docx)
