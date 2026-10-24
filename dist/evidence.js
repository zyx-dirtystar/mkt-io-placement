import {placementOf,placementSummary} from './placement.js?v=1.2.0';

export const TRACK_LABELS={qm:'Quant Mkt',cb:'Consumer Behavior',strategy:'Marketing Strategy',io:'IO',empirical_io:'Empirical IO',theory_io:'Theory IO'};
export const SIGNAL_LABELS={explicit_interest:'Self-reported job-search interest',recruiting_event:'Explicitly identified recruiting event',academic_exchange:'Academic exchange · not job-search evidence'};
export const QUALITY_OPTIONS={all:'All verification statuses',research_missing:'Marketing area unclassified',provisional:'Provisional research classification',outcome_missing:'First job / career path unverified',year_missing:'First job recorded · year unverified',role_missing:'Employer recorded · job type unverified'};
export function provisionalTracks(r){return r.research_inference?.status==='provisional'?r.research_inference.tracks||[]:[]}
export function effectiveTracks(r,mode='standard'){const archived=[...new Set([...r.tracks,...(r.research?.tracks||[])])];return mode==='include_provisional'?[...new Set([...archived,...provisionalTracks(r)])]:archived}
export function researchMissing(r){return r.tracks.includes('marketing')&&!r.tracks.some(t=>['qm','cb','strategy'].includes(t))}
export function qualityMatches(r,key='all'){
  if(key==='research_missing')return researchMissing(r);
  if(key==='provisional')return provisionalTracks(r).length>0;
  if(key==='outcome_missing')return r.status==='outcome_unknown';
  if(key==='year_missing')return r.status==='placed'&&!r.placement_year;
  if(key==='role_missing')return !!r.destination&&placementOf(r,'first').category==='unknown';
  return true;
}
export function gapSummary(rs){return Object.fromEntries(Object.keys(QUALITY_OPTIONS).map(key=>[key,rs.filter(r=>qualityMatches(r,key)).length]))}

// Scenarios describe the selected, already collected sample. They do not impute a person.
export function outcomeScenario(rs,basis='final',share=0.5){
  if(!Number.isFinite(share)||share<0||share>1)throw new Error('Scenario share must be between 0 and 1');
  const s=placementSummary(rs,basis),n=s.known+s.unknown;
  return {...s,denominator:n,assumption:share,lower:n?s.faculty/n:null,upper:n?(s.faculty+s.unknown)/n:null,scenario:n?(s.faculty+share*s.unknown)/n:null};
}
export function regionalSignals(r,region='CN'){
  return (r.regional_signals||[]).filter(s=>(region==='CN_HK'?['CN','HK'].includes(s.region):s.region===region)&&SIGNAL_LABELS[s.kind]&&s.evidence&&s.source_url&&s.observed_date);
}
export function regionalPlacement(r,region='CN',basis='final'){
  const p=placementOf(r,basis);
  return !!p.destination&&(region==='CN_HK'?['CN','HK'].includes(p.destination_region):p.destination_region===region);
}
export function regionalMatches(r,region='CN',kind='placement',basis='final'){
  const signals=regionalSignals(r,region);
  if(kind==='placement')return regionalPlacement(r,region,basis);
  if(kind==='faculty')return regionalPlacement(r,region,basis)&&placementOf(r,basis).category==='tt';
  if(kind==='interest')return signals.some(s=>s.kind==='explicit_interest');
  if(kind==='recruiting')return signals.some(s=>s.kind==='recruiting_event');
  if(kind==='exchange')return signals.some(s=>s.kind==='academic_exchange');
  if(kind==='any')return regionalPlacement(r,region,basis)||signals.some(s=>['explicit_interest','recruiting_event'].includes(s.kind));
  return false;
}
export function regionalSummary(rs,region='CN',basis='final'){
  return Object.fromEntries(['placement','faculty','interest','recruiting','exchange','any'].map(key=>[key,rs.filter(r=>regionalMatches(r,region,key,basis)).length]));
}
