# Australian Marketing faculty reverse-check audit — 2026-10-23

Batch: `faculty-au-a-2026-10-23`. Evidence checked on **2026-10-23**. The four assigned Go8 institutions were fixed before examining degrees or employment outcomes. This batch covers Marketing; the root research batch separately documents Economics IO faculty.

The batch adds **105 current receiving-faculty observations**, with **67 identified doctoral institutions**, **16 explicit doctoral award years**, and **23 dated career fragments for 16 people**. Three linked public CVs were read. These are receiving-faculty observations, not additional placement-cohort members. No person was linked to a placement solely by name.

All four department-wide roster checks remain **partial**. Source-table reconciliation, doctoral biography completeness, and career-history completeness are separate claims. Every unknown doctoral year remains null; a first job is never inferred from a current appointment.

| Official Marketing source scope | Included research ranks | Primary / merged source entries reconciled | Separate entries | Doctoral institution known | Award year known | People with dated fragments | Fragments |
|---|---:|---:|---:|---:|---:|---:|---:|
| University of Melbourne | 23 | 37 | 14 | 17 | 1 | 0 | 0 |
| Monash University | 38 | 59 | 21 | 21 | 7 | 8 | 9 |
| University of Sydney | 18 | 56 | 38 | 11 | 2 | 3 | 3 |
| University of New South Wales | 26 | 32 | 6 | 18 | 6 | 5 | 11 |

## Scope, exclusions and unresolved directory differences

**Melbourne.** [Official Marketing filter](https://fbe.unimelb.edu.au/about/academic-staff?queries_discipline_query=marketing&queries_tags_query=4895954) has 36 entries: 22 ordinary research ranks, 12 Education Focused, one Postdoctoral Fellow and one Enterprise Fellow. [The unfiltered FBE directory](https://fbe.unimelb.edu.au/about/academic-staff), [CABE directory](https://fbe.unimelb.edu.au/cabe/our-people/cabe-members) and linked [Yilin Tsai profile](https://findanexpert.unimelb.edu.au/profile/1038188) independently identify an additional current Senior Lecturer in Marketing absent from the filter. He is included, giving 23. The filter is fully transcribed but its failure to include him prevents a whole-discipline completeness claim. The separately administered Melbourne Business School directory is outside the FBE scope; no claim that its roster is included. The linked Print Short Profile route provided actual doctoral education for 16 people; print records generally omit years. Direct HTML downloads received Incapsula/403; no HTTP 200 error shell was counted as a readable biography. Four other print links returned cache misses.

**Monash.** [Australian Department of Marketing staff directory](https://www.monash.edu/business/marketing/our-people/staff-directory) was read through its final staff entries and footer: 59 primary entries, 38 ordinary research-rank observations and 21 separate. Caulfield, Clayton and Peninsula are the Australian campus scope. Malaysia and Indonesia are not included because they share a university name. The [secondary Pure department directory](https://research.monash.edu/en/organisations/department-of-marketing/persons/) reports 73 profiles. Official indexed text exposed the first 50, recorded individually in `secondary_directory_observations`; live and page-two requests returned 403/cache miss. Twelve additional non-primary CDP/adjunct/emeritus names are kept separately in `secondary_only_exclusions` with provisional indexed-source status. This unresolved second-page coverage prevents a complete claim. Erica Brady, Nicholas Grigoriou and Paul Murphy have explicit Education Focus categories; Peter Wagstaff’s biography explicitly describes an education-focused appointment. Tej Pochun is Lecturer on the primary page but Assistant Lecturer in Pure, so research membership remains pending. Paolo De Leon and Jack Paget are Research Fellows on the primary page but Practice Lecturers in Pure; both snapshots are preserved and excluded from the ordinary research roster. The first-page Pure categories are marked provisional indexed evidence, never used to create a confirmed doctoral year. Forty linked primary-staff personal pages (including later-separated education-focused roles) were downloaded in full initially, plus Beatriz Pereira and Elham Ghazimatin; the 38 selected research members each have a profile observation.

**Sydney.** The official school is now [School of Business Analytics and Marketing](https://www.sydney.edu.au/business/schools/school-of-business-analytics-and-marketing.html). Its [56-member directory](https://profiles.sydney.edu.au/groups/652445/experts) was paginated using the same public `POST /api/users/membersOfGroup` endpoint as the site, group ID 652445, last-name order, 100 per page; the returned total was 56. Every member’s public individual profile API (`/api/users/{objectId}`) was read, including biography, education and institutional appointments. Eighteen explicit Marketing research appointments were retained, with 38 Analytics/education/casual/honorary/visiting/emeritus or membership-pending observations separated. The merged group does not supply a clean current Marketing membership flag, so its 56 names being reconciled is not a claim that the Marketing discipline itself is complete. Jodie McGann’s Associate Lecturer role and beginning a PhD are reported without claiming an awarded doctorate or establishing the research appointment category. Bernard Conlon’s and Alison Wong’s biographies explicitly teach or locate their appointments in Business Analytics. Margaret Matanda’s current Sydney page contains an internally inconsistent undated “Before joining Monash” history; it is not converted to a dated career.

**UNSW.** The consolidated staff-directory HTML loaded, but its School of Marketing results require the public Funnelback endpoint, which returned 403; `search.unsw.edu.au` additionally failed DNS resolution. Available browser inventory was empty, so no browser success was claimed. The alternative [official research page](https://www.unsw.edu.au/business/our-schools/marketing/our-research) provides 24 unique named people across six overlapping areas, with all 24 personal profiles actually read. Karen Tian’s individual current role is Casual Academic and Daniel Winkler is a Postdoctoral Fellow, so neither is treated as an ordinary research lecturer/professor. Four additional current individual staff pages, Mathew Chylinski, Terrence Chong, Stephan Tseng and Veronica Jiang, were read and retained; their absence from the research-theme page is a documented roster difference. [About us](https://www.unsw.edu.au/business/our-schools/marketing/about-us) separately lists practice professor Nicolas Chu and emeriti Adrian Payne, Paul Patterson and Mark Uncles. Total ordinary research-rank observations are 26, separate observed roles six; no claim that this exhausts the inaccessible dynamic directory. Education-related awards or membership of the Scientia Education Academy do not by themselves prove an Education Focused employment contract. Lecturer and Professor titles do not prove tenure.

## Explicit doctoral years

| Person | Doctoral institution | Field exactly supported | Award year | Basis |
|---|---|---|---:|---|
| Lachlan Deer | University of Zurich | Economics | 2019 | education_awarded_degree |
| Davide Orazi | University of Melbourne | Marketing | 2017 | biographical_awarded_degree_year |
| Jiemiao Chen | Indiana University Bloomington | Marketing | 2011 | explicit_award_date |
| David Lie | University of New South Wales | Marketing | 2019 | explicit_award_date |
| Beatriz Pereira | University of Michigan | Marketing | 2014 | explicit_award_date |
| Bhoomija Ranjan | University of Rochester | Marketing | 2017 | explicit_award_date |
| Stanislav Stakhovych | University of Groningen | Field not stated | 2010 | biographical_awarded_degree_year |
| Moulik Zaveri | RMIT University | Marketing | 2012 | explicit_award_date |
| Amanda Kennedy | University of Newcastle | Marketing | 2021 | biographical_awarded_degree_year |
| Stacey Brennan | Institution not named | Marketing | 2008 | biographical_awarded_degree_year |
| Xingyu Fu | Hong Kong University of Science and Technology | Operations Management | 2024 | education_degree_interval_end_corroborated_by_received_PhD_statement |
| Sophie Fan | Hong Kong Polytechnic University | Marketing | 2019 | biographical_awarded_degree_year |
| Ljubomir Pupovac | University of Technology Sydney | Business Administration | 2019 | biographical_awarded_degree_year |
| Qi Zhao | Pennsylvania State University | Business Administration (Quantitative Marketing) and Operations Research | 2025 | biographical_awarded_degree_year |
| Valentyna Melnyk | Tilburg University | Marketing | 2005 | education_awarded_degree |
| Harald van Heerde | University of Groningen | Economics | 1999 | education_awarded_degree |

Stacey Brennan’s current official biography explicitly gives a Marketing PhD in 2008 but does not name its institution; institution remains null. Xingyu Fu’s official completed education interval ends in June 2024 and is independently phrased on the same profile as “received his PhD”; the interval-end basis is retained explicitly. Gary Gregory’s profile gives “Univ. of Texas, USA” without a campus, so it is not normalised to UT Austin. Sydney abbreviations UOW, W.Syd and MU remain reported text with institution unresolved. Neither dissertation prizes nor first publications supplied a doctoral year.

## Dated career facts and their limits

| Person | Institution | Role / event | Start | End |
|---|---|---|---|---|
| Srinivas Sridharan | University of Queensland | External PhD Supervisor | 2014-12-18 | 2017-01-30 |
| Srinivas Sridharan | Monash University | Professor | 2025-03-03 | Open in source snapshot |
| Davide Orazi | Monash University | Faculty member; joining rank not stated | 2017-01 | Open in source snapshot |
| Peter Danaher | Monash University | Head of the Marketing Department | 2019 | 2021 |
| Tracey Danaher | Monash University | Faculty member; joining rank not stated | 2010 | Open in source snapshot |
| Harmen Oppewal | Monash University | Head of the Department of Marketing | 2012 | 2018 |
| Sudha Mani | Monash University | Faculty member; joining rank not stated | 2017-05 | Open in source snapshot |
| Gerri Spassova | Monash University | Faculty member; joining rank not stated | 2010 | Open in source snapshot |
| Jiemiao Chen | Monash University | Lecturer in Marketing | 2011 | Open in source snapshot |
| John Parker | University of Sydney | Senior Lecturer | 2026-02-09 | Open in source snapshot |
| Kiju Jung | University of Sydney | Faculty member; joining rank not stated | 2014-08 | Open in source snapshot |
| Stacey Brennan | University of Sydney | Head of Discipline (Marketing) | 2022 | 2025 |
| Sophie Fan | University of New South Wales | Lecturer in Marketing | 2025 | Open in source snapshot |
| Sophie Fan | Hong Kong University of Science and Technology | Assistant Professor of Marketing | 2019 | 2025 |
| Jack Cadeaux | University of New South Wales | Lecturer | 1996 | Open in source snapshot |
| Jack Cadeaux | University of New South Wales | Head of the School of Marketing | 2016 | 2021 |
| Liem Viet Ngo | University of New South Wales | Research Coordinator | 2018 | 2019 |
| Liem Viet Ngo | University of New South Wales | Postgraduate Research Coordinator | 2014 | 2017 |
| Liem Viet Ngo | University of New South Wales | Postgraduate Coursework Coordinator | 2010 | 2014 |
| John Roberts | Stanford University | Visiting Professor | 1995 | 2002 |
| John Roberts | London Business School | Professor of Marketing | 2003 | 2014 |
| John Roberts | Australian National University | Professor of Marketing | 2009 | 2013 |
| Mathew Chylinski | University of New South Wales | Associate Professor | 2019-01-01 | Open in source snapshot |

Career fragments include appointments, promotions, academic leadership and an external supervision role, distinguished by event type and job kind. Leadership dates do not supply the person’s first faculty appointment. Leadership/coordination fragments use job kind Other and are not primary appointments. The UQ External PhD Supervisor role additionally has `employment_not_established: true`; it does not establish UQ employment or a faculty job. John Roberts’ overlapping Stanford/London Business School/ANU intervals are retained without assuming exclusive full-time roles. Joining statements with an unspecified joining rank are preserved as “Faculty member; joining rank not stated,” leaving the current-rank start year unknown. All segments have `source_snapshot_only: true`; a historical source saying Present is not automatically extended beyond its observation.

Three linked PDFs were downloaded and text-read in full: Harmen Oppewal (8 pages), Srinivas Sridharan (4 pages), and Linying (Sophie) Fan’s October 2026 CV (5 pages). Their relevant biography/education/employment passages are on page 1. Srinivas’s CV explicitly begins Professor on 2025-03-03, which is the current-rank date, not assumed university entry. Sophie’s CV confirms UNSW Lecturer 2025–Present and HKUST Assistant Professor 2019–2025, with source-as-of 2026-10. No other current-rank start was inferred from an employment prize or publication.

## Identity, evidence and publication controls

Sources retain a checked date, short original quote, actual field-support paths and locator. Direct source-byte hashes are used where downloaded; research-service rendered-text excerpt hashes are explicitly distinguished from source-byte hashes. A profile response with no body is recorded as such, with no empty-body hash represented as a successful biography. Full HTML, API responses and PDF text remain only under the already-gitignored `data/source-snapshots/2026-10-23-au-a/` cache and are not part of the published batch. The batch contains no raw HTML or full CV. No authority JSON, previous batch, application code or import ledger was modified by this subtask.

No cross-host archive identity was merged. Existing placement `pennsylvania-state-university-qi-zhao` is a possible root-review candidate because the new official UNSW profile independently states a Penn State dual-title doctorate in 2025; the old record has no exact personal homepage or CV URL, so this batch deliberately leaves `placement_id` unset. The source-page profile and degree are available for an explicit identity review. No Sophie/Linying Fan archived personal record was found in the existing faculty archive during the read-only check.

## Validation and remaining factual gaps

Actual batch counts: `{"people": 105, "doctoral_institutions_known": 67, "doctoral_award_years_known": 16, "people_with_dated_career_fragments": 16, "dated_career_fragments": 23, "cv_contents_read": 3, "complete_department_rosters": 0}`.

`node scripts/import-faculty-batch.mjs data/research-updates/2026-10-23-faculty-au-a.json` passed in dry-run mode: 105 added, 0 revised, 0 placement links, four checks; `apply: false`. An independent structural review found no unresolvable person/school source-support paths, no known doctoral year lacking a quote containing that year, no career segment without URL/quote, and no school roster/member mismatch. All school completeness flags remain false and completeness evidence null.

Remaining missing doctoral institutions: **38/105**. Missing doctoral award years: **89/105**. People without dated career fragments: **89/105**. These are missing public facts or unread linked-CV contents, not zero outcomes or demonstrated absence of degrees/employment. Each person has field-specific reasons and attempted source URLs. The dates and partial directory states are not advanced by unrelated sources. These 105 people are current receiving-faculty observations and cannot establish historical cohort success rates.

Frozen batch SHA-256: `c7c3f19d4f747bf02c1420b655fc394ec2fef5bd8a1574d02537d4944b5685f1`.

## University of Melbourne — observed roster

Included: Simon Bell, Alex Belli, Liliana Bove, Michal Carrington, Danielle Chmielewski-Raimondo, Brent Coker, Lachlan Deer, Jill Lei, Fang-Chi Lu, Colin McLeod, Kanika Meshram, Amrita Mitra, Erik Mooi, Anish Nagpal, Ben Neville, Gergely Nyilasy, Julie Ozanne, Angela Paladino, Aashish Pandey, Marcus Phipps, Daiane Scaraboto, Peiwen Xie, Yilin Tsai.

Separate: Dennis Alphonsus (teaching); Teagan Altschwager (teaching); Mike Brooke (teaching); David Fiorovanti (teaching); Hafizul Islam (teaching); Peter Matheis (teaching); Eugene Skewes (teaching); Scott Tetley (teaching); Bernadette van Lunenburg (teaching); Jingjing Wang (teaching); Tom Whitford (teaching); Andrew Zur (teaching); Ai Ming Chow (postdoc); Jelena Dodic (practice).

## Monash University — observed roster

Included: Srinivas Sridharan, Dewi Tojib, Satheesh Seenivasan, Davide Orazi, Fiona Newton, Pingping Qiu, Peter Danaher, Tracey Danaher, Jasmina Ilicic, Stephan Ludwig, Felix T. Mavondo, Hean Tat Keh, Harmen Oppewal, Yelena Tsarenko, Yimin Cheng, Angela Cruz, Arun Gopalakrishnan, Sudha Mani, Phyra Sok, Gerri Spassova, Jeff (Jianfeng) Wang, Jiemiao Chen, Shanfei (Sophie) Feng, Elham Ghazimatin, Luke Greenacre, Yongfu He, Junzhao (Jonathan) Ma, David Lie, Bora Min, Beatriz Pereira, Bhoomija Ranjan, Stephen Saunders, Stanislav Stakhovych, Dominic Thomas, Moulik Zaveri, Madhav Arora, Daisy (Yu) Feng, Fei (Katie) Xu.

Separate: Erica Brady (teaching); Nicholas Grigoriou (teaching); Paul Murphy (teaching); Peter Wagstaff (teaching); Tej Pochun (research_membership_pending); Brigette McGuire (practice); Stephanie Atto (practice); Itrat Batool (practice); Glenn Hendriks (practice); Jeanine Chang (teaching); Cameron Huston (teaching); Chadinee Maneesoonthorn (teaching); Suresh Perera (teaching); Alexandra Schall-Riaucour (teaching); Muru Chen (research_appointment); Paolo De Leon (practice); Jack Paget (practice); Natalie Bridges (administrative); Sandra Dickson (administrative); Thomas Carson (administrative); Jessica Reeves (administrative).

## University of Sydney — observed roster

Included: John Parker, Jiang Qian, Amanda Kennedy, Jeaney Yip, Kiju Jung, Margaret Matanda, Catherine Sutton-Brady, Jordan Truong, Steven Lu, Ranjit Voola, Ruud Wetzels, Stacey Brennan, Teresa Davis, Ulku Yuksel, Vicki Andonopoulos, Christina Anthony, Donnel Briley, Ellen Garbarino.

Separate: Junbin Gao (other_discipline); Jeffrey Lim (teaching); Jodie McGann (casual); Jie Yin (other_discipline); Li Chen (other_discipline); Lisa Asher (casual); Marcel Scharth (other_discipline); Minh-Ngoc Tran (other_discipline); Peter Bryant (teaching); Pablo Montero Manso (other_discipline); Peter Radchenko (other_discipline); Qin Fang (other_discipline); Robert Bartels (emeritus); Richard Gerlach (other_discipline); Artem Prokhorov (other_discipline); Boris Choy (other_discipline); Stephen Tierney (teaching); Vince Mitchell (visiting); Andrey Vasnev (other_discipline); Wilson Chen (other_discipline); Alison Wong (other_discipline); Ali Yaseen (other_discipline); Zhongyuan Lyu (other_discipline); Bernard Conlon (other_discipline); Zhengchao Wang (other_discipline); Takuo Matsubara (other_discipline); Bradley Rava (other_discipline); Nikolay Kudrin (other_discipline); Tony Shang (teaching); Chao Wang (other_discipline); Dmytro Matsypura (other_discipline); Daniel Oron (other_discipline); Adam Duhachek (honorary); Erick Li (other_discipline); Eunbin O (teaching); Rosa Taghikhah (other_discipline); Nam Ho-Nguyen (other_discipline); Hanzhao Wang (other_discipline).

## University of New South Wales — observed roster

Included: Xingyu Fu, Sophie Fan, Jack Cadeaux, Jihwan Moon, SunAh Kim, Tania Bucic, Nitika Garg, Jenny (Jiyeon) Lee, Ljubomir Pupovac, Gary Gregory, Hauke Wetzel, Liem Viet Ngo, Junbum Kwon, John Roberts, Songting Dong, Qi Zhao, Ting Yu, Maggie Dong, Valentyna Melnyk, Yu-Ting Lin, Harald van Heerde, Rahul Govind, Mathew Chylinski, Terrence Chong, Stephan Tseng, Veronica Jiang.

Separate: Karen Tian (casual); Daniel Winkler (postdoc); Nicolas Chu (practice); Adrian Payne (emeritus); Paul Patterson (emeritus); Mark Uncles (emeritus).


## Integration identity review (root, 2026-10-23)

The candidate Qi Zhao identity above was subsequently reviewed against both live official pages. [Penn State Marketing placements](https://smeal.psu.edu/academics/doctoral/business-phd/marketing/placements) names Qi Zhao / 2025 / UNSW Sydney. The [UNSW individual profile](https://www.unsw.edu.au/staff/qi-zhao) independently confirms the current Marketing Lecturer and the Penn State dual-title Marketing/Operations Research PhD in 2025. Exact institution, doctoral field, year and receiving school agree. A reviewed mapping in `data/faculty-identities.json` retains existing ID `pennsylvania-state-university-qi-zhao`; no current title, tenure or assumed start year is substituted for the original placement. The frozen research batch itself is unchanged.

The root review also retained Qi Zhao’s explicitly stated research on Generative AI/XR, marketing effectiveness/social inclusion and Bayesian causal modelling as original research text in a separate reviewed follow-up batch. No direction label was forced from methods; the current Lecturer title remains distinct from the original placement’s unknown title/start year.
