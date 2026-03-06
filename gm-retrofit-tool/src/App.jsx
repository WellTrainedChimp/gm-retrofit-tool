import { useState } from "react";

// ─── Design tokens ────────────────────────────────────────────────────────────
const C = {
  navy:"#0B1F3A", navyMid:"#152D4F", navyLt:"#1E3F6B",
  teal:"#00897B", tealLt:"#00BFA5", tealPale:"#E0F2F1", tealDeep:"#00695C",
  border:"#E2E8F0", bg:"#F7F9FC", white:"#FFFFFF",
  text:"#0F172A", textMid:"#334155", textSub:"#64748B", slateL:"#94A3B8",
};

const PRIORITY_META = {
  recommended:{ label:"Recommended", bg:"#E0F2F1", color:"#00695C", border:"#80CBC4" },
  suitable:   { label:"Suitable",    bg:"#EFF6FF", color:"#1D4ED8", border:"#BFDBFE" },
  consider:   { label:"Consider",    bg:"#FFFBEB", color:"#B45309", border:"#FDE68A" },
  limited:    { label:"Limited Fit", bg:"#FFF1F2", color:"#BE123C", border:"#FECDD3" },
};

const CAT_META = {
  fabric:          { label:"Fabric First",      color:"#7C3AED" },
  energy:          { label:"Energy Generation", color:"#D97706" },
  heatGeneration:  { label:"Heat Generation",   color:"#DC2626" },
  heatDelivery:    { label:"Heat Delivery — Wet Systems",     color:"#00897B" },
  heatDeliveryElec:{ label:"Heat Delivery — Electric Systems",color:"#0EA5E9" },
};

// ─── SVG Icons ────────────────────────────────────────────────────────────────
const Ic = ({ p, size=16, color="currentColor", sw=1.75 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" style={{flexShrink:0}}>
    <path d={p}/>
  </svg>
);
const I = {
  home:     "M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z",
  wall:     "M3 3h18v4H3zM3 10h18v4H3zM3 17h18v4H3z",
  window:   "M3 3h18v18H3zM12 3v18M3 12h18",
  floor:    "M3 17h18M7 17V7M17 17V7M12 17V7",
  draught:  "M3 12h18M3 8c2-1 4 1 6 0s4-1 6 0",
  solar:    "M12 2v2M12 20v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M2 12h2M20 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42M12 6a6 6 0 100 12A6 6 0 0012 6z",
  battery:  "M15 7H2a1 1 0 00-1 1v8a1 1 0 001 1h13a1 1 0 001-1V8a1 1 0 00-1-1zM22 11v2",
  bolt:     "M13 2L3 14h9l-1 8 10-12h-9l1-8z",
  pump:     "M12 2a10 10 0 100 20A10 10 0 0012 2zM8 12h8M12 8v8",
  flame:    "M12 2c0 0-4 4-4 8a4 4 0 008 0c0-4-4-8-4-8z",
  storage:  "M2 3h20v6H2zM2 15h20v6H2zM12 9v6",
  skirting: "M2 19h20v2H2zM4 14v5M8 14v5M12 14v5M16 14v5M20 14v5M3 14h18",
  skirtingE:"M2 19h20v2H2zM4 14v5M8 14v5M12 14v5M16 14v5M20 14v5M3 14h18M6 12l2-4 2 4 2-4 2 4",
  add2rad:  "M4 5h16M4 19h16M6 5v14M10 5v14M14 5v14M18 5v14M4 12h16M20 9l2 2-2 2",
  easyclean:"M4 5h16M4 19h16M6 5v14M14 5v14M18 5v14M4 12h16M7 2l2 2-2 2M17 2l2 2-2 2",
  coving:   "M3 5c0 0 4-3 9-3s9 3 9 3v2H3zM3 7h18v14H3z",
  radiator: "M4 5h16M4 19h16M6 5v14M10 5v14M14 5v14M18 5v14M4 12h16",
  ufh:      "M3 6c3 0 3 3 6 3s3-3 6-3 3 3 6 3M3 12c3 0 3 3 6 3s3-3 6-3 3 3 6 3",
  fancoil:  "M12 22V12M12 12C7 12 3 9 3 6a9 9 0 0118 0c0 3-4 6-9 6z",
  panel:    "M2 6h20v12H2zM6 6v12M12 6v12M18 6v12",
  ir:       "M3 12h1M8 12h1M19 12h1M14 12h1M12 2v1M12 8v1M12 19v1M12 14v1",
  plinth:   "M2 16h20v4H2zM6 8h12v8H6zM9 8V6h6v2",
  check:    "M20 6L9 17l-5-5",
  chevR:    "M9 18l6-6-6-6",
  chevL:    "M15 18l-6-6 6-6",
  info:     "M12 2a10 10 0 100 20A10 10 0 0012 2zm0 9v5m0-8v.01",
  sparkle:  "M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z",
  refresh:  "M3 12a9 9 0 109-9M3 3v6h6",
  warning:  "M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0zM12 9v4m0 4h.01",
  health:   "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z",
};

// ─── Measures data ─────────────────────────────────────────────────────────────
const MEASURES = {
  fabric: [
    { id:"loft",      icon:"home",    label:"Loft Insulation",
      condition:(s)=>s.hasOwnRoof,  priority:()=>"recommended",
      note:()=>"Highest ROI of any single fabric measure. Typically £600–700 installed. Should always be first intervention — reduces heat loss before sizing emitters." },
    { id:"cavity",    icon:"wall",    label:"Cavity Wall Insulation",
      condition:(s)=>["detached","semi","terrace","terrace-end","bungalow"].includes(s.houseType), priority:()=>"recommended",
      note:()=>"Verify cavity condition and suitability. Not applicable to pre-1920 solid wall stock. Work with Retrofit Coordinator under PAS 2035." },
    { id:"solidwall", icon:"wall",    label:"Solid Wall Insulation (EWI)",
      condition:()=>true, priority:()=>"consider",
      note:()=>"Required for pre-1920 solid wall and some non-traditional construction. Cost £8–15k — confirm via SHDF pathway. Check planning constraints on terraces and conservation areas." },
    { id:"windows",   icon:"window",  label:"Double / Triple Glazing",
      condition:()=>true, priority:()=>"suitable",
      note:()=>"Upgrade single or poor double glazing as a priority. Triple glazing adds ~10% performance over double at significantly higher cost — only specify where budget allows." },
    { id:"floor",     icon:"floor",   label:"Floor Insulation",
      condition:(s)=>["ground-only","two","three"].includes(s.floors), priority:()=>"consider",
      note:()=>"Suspended timber floors only — solid concrete requires specialist approach. High disruption and cost; only viable alongside other floor-level works." },
    { id:"draught",   icon:"draught", label:"Draught Proofing",
      condition:()=>true, priority:()=>"suitable",
      note:()=>"Low-cost quick win. Particularly effective in older stock with gaps around doors, floor perimeters, and letterboxes. Reduces background heat loss immediately." },
  ],

  energy: [
    { id:"solar",   icon:"solar",   label:"Solar PV",
      condition:(s)=>s.hasOwnRoof, priority:()=>"recommended",
      note:()=>"4kWp system typical for a 3-bed property. Directly offsets heat pump running costs — critical for fuel poverty households. Always specify where own roof available." },
    { id:"battery", icon:"battery", label:"Battery Storage",
      condition:(s)=>s.hasOwnRoof,
      priority:(s)=>s.spaceCritical?"consider":"suitable",
      note:(s)=>s.spaceCritical
        ? "⚑ Space-critical flag raised — confirm battery unit location with RP before specifying. Floor-standing units typically 600×350mm."
        : "10kWh typical. Maximises solar self-consumption and enables off-peak electricity tariff charging. Confirm internal space availability." },
    { id:"ev",      icon:"bolt",    label:"EV Charge Point Ready",
      condition:(s)=>s.hasGarden,  priority:()=>"consider",
      note:()=>"7kW smart charger preferred — enables demand side management. Future-proofing cost is low when done alongside other electrical works." },
  ],

  heatGeneration: [
    { id:"ashp",    icon:"pump",  label:"Air Source Heat Pump",
      condition:(s)=>s.hasOutdoorSpace,
      priority:(s)=>s.hasCylinderSpace?"recommended":"consider",
      note:(s)=>{
        const barriers=[];
        if(!s.hasCylinderSpace) barriers.push("⚑ Cylinder space not confirmed — critical installation barrier for combi replacement");
        if(s.pipework==="10mm") barriers.push("10mm microbore pipework present — ThermaSkirt or Add2Rad resolves this without pipe replacement");
        const base = s.hasCylinderSpace
          ? "Primary low-carbon pathway for this archetype. Runs at 45–55°C vs gas boiler at 70–80°C — emitter sizing is the key design consideration."
          : "Outdoor space confirmed but cylinder location must be resolved before specifying.";
        return base+(barriers.length?"\n"+barriers.join(". ")+".":" Works with all major brands.");
      } },
    { id:"gshp",    icon:"pump",  label:"Ground Source Heat Pump",
      condition:(s)=>s.hasGarden&&s.hasOutdoorSpace, priority:()=>"consider",
      note:()=>"Higher SCOP than ASHP but borehole/ground array adds £10–20k. Most viable for larger detached stock. Confirm ground conditions and land area." },
    { id:"gasretain",icon:"flame",label:"Retain Gas Boiler (Interim — Heat Pump Ready)",
      condition:(s)=>s.currentHeat?.startsWith("gas"), priority:()=>"consider",
      note:()=>"Heat Pump Ready methodology: retain boiler now, replace emitters sized for 45°C flow temperature. When HP is installed, no further emitter work required. ThermaSkirt and Add2Rad both support this pathway explicitly." },
    { id:"storageSH",icon:"storage",label:"Smart Storage Heater Upgrade",
      condition:(s)=>s.currentHeat==="storage-heaters", priority:()=>"suitable",
      note:()=>"Dynamic demand response (e.g. Sunamp, Dimplex Quantum). Lower disruption than installing a full wet system. Consider alongside ThermaSkirt-e for whole-property upgrade without pipework." },
    { id:"district",icon:"pump",  label:"Connect to District Heat Network",
      condition:(s)=>s.currentHeat==="district"||s.houseType==="flat"||s.houseType==="maisonette", priority:()=>"consider",
      note:()=>"Where district network is available or planned, ensure HIU specification is compatible with low-temperature operation and sized for low-flow emitters." },
  ],

  heatDelivery: [
    {
      id:"thermaskirt",
      icon:"skirting",
      label:"ThermaSkirt BM2 / BM3 — Skirting Board Heating (Wet)",
      condition:()=>true,
      priority:(s)=>s.spaceCritical||s.moldDamp?"recommended":"suitable",
      badge:(s)=>s.spaceCritical||s.moldDamp?"PRIORITISED":null,
      specs: "BM2: 114mm H × 20mm deep, 58W/m @ 45°C. BM3: 170mm H × 20mm deep, 83W/m @ 45°C. Connects to 10mm, 15mm or 22mm pipework.",
      note:(s)=>{
        const r=[];
        if(s.spaceCritical) r.push("Space-critical: replaces standard skirting board — zero additional wall space consumed. Eliminates large wall-mounted radiators entirely");
        if(s.moldDamp)      r.push("Mould & damp: radiant heat at perimeter dries wall base and raises surface temperature, directly addressing condensation and mould risk. Healthy Homes Standard (Oct 2025) specifically references this benefit");
        if(s.pipework==="10mm") r.push("10mm microbore: fully compatible — no pipework replacement required (4.1m UK homes affected). Max 15m run per feed on BM3");
        if(s.pipework==="15mm") r.push("15mm pipework: direct connection, no modifications. Max 20–25m run per feed on BM2");
        if(s.currentHeat?.startsWith("gas")||s.targetHeatSource==="ashp") r.push("Heat pump ready: rated to 45°C flow temperature (BSRIA tested). Output retention at low temperature far exceeds radiators — 48% vs 30% at ΔT20");
        if(s.tenantDisruption) r.push("Minimal disruption: no wall chasing, no floor lifting, replaces existing skirting board in occupied properties. 75% disruption reduction in LA trial");
        if(s.accessibility) r.push("Below 43°C surface temperature — eliminates 86% of radiator burn/impact injuries (RoSPA). Used in schools and care homes");
        if(s.moldDamp||s.disrepair) r.push("EasyClean variant available: anti-ligature, seamless hygienic profile, hospital-grade disinfectant resistant — specify for vulnerable occupant settings");
        const intro = r.length?"Prioritised — ":"Suitable for this archetype. ";
        return intro + (r.length ? r.join(". ")+"." : "Runs at heat pump flow temperatures. Distributes output across room perimeter. Less than 1°C temperature variation across room (BSRIA). 10-year manufacturer warranty. 85,000+ installations. UK manufactured, Atherton, Manchester.");
      },
      detail: "BSRIA evidence: <1°C room temperature variation vs up to 5°C for radiators. CE marked to BS EN 442-1. SAP 10.2 uplift of approx. +4 SAP points on typical 3-bed. 10-year warranty. Available through 375+ merchant branches. Factory-to-site delivery available for social housing projects.",
    },
    {
      id:"add2rad",
      icon:"add2rad",
      label:"Add2Rad — Skirting Supplement to Existing Radiators",
      condition:(s)=>s.currentHeat?.startsWith("gas")||s.targetHeatSource==="ashp"||s.targetHeatSource==="gas-retain",
      priority:(s)=>s.targetHeatSource==="ashp"||s.targetHeatSource==="gas-retain"?"recommended":"suitable",
      specs: "Connects in series with existing radiators. BM2/BM3 emitter profile. Typical 4m run adds ~360W per room at 45°C. Cost: £100–150 trade per room.",
      note:(s)=>{
        const r=[];
        r.push("Designed specifically for heat pump retrofits where existing radiators are undersized at low flow temperatures");
        if(s.pipework==="10mm") r.push("Compatible with 10mm microbore — no pipe replacement");
        r.push("Each 1°C reduction in flow temperature boosts heat pump CoP by ~0.02 — lowering flow by 7–12°C saves £200–400/yr in running costs");
        r.push("25–40% cheaper than full radiator replacement. Under 1 hour per room. No floor lifting, no wall chasing");
        if(s.tenantDisruption) r.push("Installs in occupied homes — no decanting required. 3–5 rooms per installer team per day in multi-unit blocks");
        r.push("PAS 2035 and SHDF compliant documentation supplied. Resident comms templates and KPI sheets available");
        return r.join(". ")+".";
      },
      detail: "On a 200-home portfolio, Add2Rad saves £150k–£200k vs radiator upsizing or UFH. No visible branding — can be white-labelled or bundled with heat pump packages. 10-year warranty.",
    },
    {
      id:"easyclean",
      icon:"easyclean",
      label:"ThermaSkirt EasyClean — Hygienic / Anti-Ligature Variant",
      condition:(s)=>s.moldDamp||s.disrepair||s.accessibility||s.houseType==="flat"||s.houseType==="maisonette",
      priority:(s)=>s.moldDamp||s.accessibility?"recommended":"consider",
      specs: "BM2 or BM3 profile with seamless EasyClean capping. Anti-tamper top capping. Anti-microbial powder coating optional. Hospital-grade disinfectant resistant.",
      note:(s)=>{
        const r=[];
        if(s.moldDamp) r.push("Seamless closed design eliminates debris accumulation at wall base — directly addresses mould-associated hygiene risks");
        if(s.accessibility) r.push("Anti-ligature: no exposed pipes, valves, or fixings. Below 43°C surface temperature. Specified in mental health and dementia settings");
        r.push("Hygienic top edge facilitates routine floor mopping without obstruction. Full BMS integration available");
        r.push("NHS Goodmayes Hospital case study: 722m installed. ProCure21+ listed. Meets HBN 00-09 requirements");
        return r.join(". ")+".";
      },
      detail: "Not a separate product — BM2/BM3 with EasyClean capping fitted. Same technical specs and output ratings. Same wet connection system. Additional lead time — contact DiscreteHeat for social housing project pricing.",
    },
    {
      id:"ufh",
      icon:"ufh",
      label:"Underfloor Heating (Wet)",
      condition:()=>true,
      priority:(s)=>s.spaceCritical?"suitable":"consider",
      note:()=>"Optimal at design stage only. Retrofit viable during planned floor replacement — otherwise very high disruption and cost (£8–15k per property). Excellent efficiency at 35–40°C flow temperature. Not suitable for occupied properties without decanting.",
    },
    {
      id:"radiators",
      icon:"radiator",
      label:"Standard Radiators (Oversized for Low Temperature)",
      condition:()=>true,
      priority:(s)=>{
        if(s.spaceCritical&&s.moldDamp) return "limited";
        if(s.spaceCritical||s.moldDamp) return "consider";
        return "suitable";
      },
      note:(s)=>{
        const issues=[];
        if(s.spaceCritical) issues.push("space-critical: heat pump sizing requires radiators 2–3× larger than gas-era equivalents. A 600×600mm bedroom radiator becomes 2000×600mm+ — often physically impossible in smaller rooms");
        if(s.moldDamp)      issues.push("mould/damp: convective air circulation distributes spores around the room. Radiators run below 43°C at heat pump temps — residents report 'cold radiator' complaints even when room temp is correct");
        if(s.pipework==="10mm") issues.push("10mm microbore: oversized radiators require significantly higher flow rates — likely to require full pipework replacement at additional cost");
        const base = issues.length
          ? `Suitability reduced: ${issues.join("; ")}.`
          : "Incumbent solution. Must be oversized for heat pump operation — specify at ≤50°C flow temperature. Ensure hydraulic balancing is designed for reduced flow rates.";
        return base+" NB: Large K3 radiators at heat pump temperatures weigh 95kg+ wet — may require wall reinforcement. Consider ThermaSkirt or Add2Rad as alternative.";
      },
    },
    {
      id:"fancoil",
      icon:"fancoil",
      label:"Fan Coil Units",
      condition:(s)=>s.houseType==="flat"||s.houseType==="maisonette",
      priority:()=>"consider",
      note:()=>"Suitable for flats and maisonettes. Compact and effective at low flow temperatures. Requires ceiling void or accessible service route for pipework. Can also provide cooling in summer.",
    },
    {
      id:"plinth",
      icon:"plinth",
      label:"ThermaSkirt Kitchen Plinth Heating",
      condition:(s)=>s.floorArea==="medium"||s.floorArea==="large"||s.floorArea==="xlarge",
      priority:()=>"consider",
      note:()=>"Colour-matched kitchen plinth heater at 115mm height, installs beneath kitchen units. Particularly effective in open-plan kitchen-diners where cabinetry and glazing eliminate wall space for radiators. Same wet connection system as BM2/BM3.",
    },
  ],

  heatDeliveryElec: [
    {
      id:"thermaskirtE",
      icon:"skirtingE",
      label:"ThermaSkirt-e BMe2 / BMe3 — Electric Skirting Board Heating",
      condition:(s)=>!s.hasOutdoorSpace||s.currentHeat==="storage-heaters"||s.currentHeat==="direct-electric"||s.currentHeat==="none"||s.pipework==="none",
      priority:(s)=>{
        if(s.currentHeat==="storage-heaters"||s.currentHeat==="direct-electric"||s.pipework==="none") return "recommended";
        if(!s.hasOutdoorSpace) return "suitable";
        return "consider";
      },
      badge:(s)=>s.pipework==="none"||s.currentHeat==="direct-electric"?"PRIORITISED":null,
      specs: "BMe2: 114mm H, 50–130W/m depending on cable spec. BMe3: 170mm H, 80–185W/m. Self-regulating cable. No pipework required. Direct 240V connection.",
      note:(s)=>{
        const r=[];
        if(s.pipework==="none"||s.currentHeat==="none") r.push("No existing pipework — ThermaSkirt-e eliminates need for full wet system installation. Dramatically reduces cost and disruption");
        if(s.currentHeat==="storage-heaters") r.push("Direct storage heater replacement with far superior comfort. Storage heaters create heat when it's not needed and are cold by evening — ThermaSkirt-e provides room-by-room on-demand infrared heat");
        if(s.currentHeat==="direct-electric") r.push("Replaces panel heaters and plug-in electric heaters with a fixed, aesthetic, energy-efficient alternative that heats surfaces and thermal mass rather than air");
        if(!s.hasOutdoorSpace) r.push("Where ASHP is not viable due to no outdoor space, ThermaSkirt-e provides a no-pipework electric pathway that is substantially better than panel heaters or infrared ceiling panels");
        if(s.spaceCritical) r.push("Space-critical: profile replaces standard skirting board — same zero wall-space benefit as wet version");
        if(s.moldDamp) r.push("Far-infrared radiation warms wall surface directly, raising surface temperature and reducing condensation risk");
        r.push("Self-regulating heating cable: will not exceed maximum temperature even if covered by furniture. Room-by-room digital thermostat. No transformer or wiring centre required");
        r.push("Cable specs: FS30 (50–65W/m at 40–45°C surface), FS45 (85–95W/m at 50–55°C), FS60 (115–130W/m at 60–70°C) for BMe2");
        return r.join(". ")+".";
      },
      detail: "CE marked to Low Voltage Directive. Tested to EN 60335-2-30. 5-year element warranty. Installation by any competent electrician (BS 7671). Max length 20m (BMe2) / 15m (BMe3) on 13A fuse. Inrush current 1.2A/m at 10°C.",
      comparison: "vs panel heaters: panel heaters heat air (convection) — heat rises and is lost through ventilation. ThermaSkirt-e uses far-infrared to heat surfaces and thermal mass directly, maintaining warmth 2–4× longer after switching off. No visible heating unit on wall. vs storage heaters: no need to pre-charge overnight, no wasted heat in the morning, no cold evenings. Room-by-room control vs whole-house charge.",
    },
    {
      id:"thermacurve",
      icon:"coving",
      label:"ThermaCurve — Electric Heated Coving",
      condition:(s)=>s.houseType==="flat"||s.houseType==="maisonette"||s.spaceCritical,
      priority:()=>"consider",
      specs: "115×115mm coving profile with R102 curve. 170mm effective height equivalent. Max 15m per fuse. Same output as BMe3 (80–185W/m).",
      note:(s)=>{
        const r=[];
        if(s.houseType==="flat"||s.houseType==="maisonette") r.push("Suitable for flats where skirting installation is restricted or floor-level pipework/cabling is impractical");
        if(s.spaceCritical) r.push("Ceiling-level installation leaves floor and wall space completely unobstructed — maximum benefit in space-critical settings");
        r.push("Installs at ceiling/wall junction. Same self-regulating cable technology as ThermaSkirt-e. Same electrical specs and warranty");
        r.push("Can complement skirting-level heating in rooms where skirting alone cannot achieve full heat loss coverage");
        return r.join(". ")+".";
      },
    },
    {
      id:"panelHeaters",
      icon:"panel",
      label:"Electric Panel Heaters (incumbent)",
      condition:()=>true,
      priority:(s)=>{
        if(s.spaceCritical||s.moldDamp) return "limited";
        return "consider";
      },
      note:(s)=>{
        const issues=[];
        if(s.spaceCritical) issues.push("wall-mounted units consume wall space and have restricted placement options");
        if(s.moldDamp) issues.push("convective heat circulates dust and spores; does not raise wall surface temperature to address condensation");
        issues.push("heats air not surfaces — heat lost rapidly through ventilation; high perceived running costs");
        issues.push("no radiant benefit: room cools quickly after switching off");
        return `Incumbent electric solution but significantly inferior to ThermaSkirt-e on comfort and efficiency. Issues: ${issues.join("; ")}. ThermaSkirt-e delivers far-infrared heat that warms surfaces and thermal mass directly, maintaining comfort 2–4× longer per kWh.`;
      },
    },
    {
      id:"irPanels",
      icon:"ir",
      label:"Ceiling / Wall Infrared Panels",
      condition:()=>true,
      priority:(s)=>s.spaceCritical&&!s.hasOutdoorSpace?"consider":"limited",
      note:()=>"Short-wave infrared only heats objects in direct line-of-sight — does not heat room perimeter or wall thermal mass. Effective in small, well-insulated spaces only. High perceived running cost in standard housing stock. Not recommended for fuel poverty households. ThermaSkirt-e far-infrared is a substantially better specification with the same no-pipework benefit.",
    },
  ],
};

const STEPS = ["Property", "Needs & Flags", "Systems", "Results"];

const INIT = {
  houseType:"", floorArea:"", bedrooms:"", floors:"",
  hasOwnRoof:null, hasGarden:null,
  spaceCritical:false, moldDamp:false, fuelPoverty:false,
  disrepair:false, accessibility:false, tenantDisruption:false,
  currentHeat:"", pipework:"", currentEPC:"", targetHeatSource:"",
  hasOutdoorSpace:null, hasCylinderSpace:null,
};

// ─── UI Components ─────────────────────────────────────────────────────────────
const FieldLabel = ({children}) => (
  <div style={{fontSize:11,fontWeight:700,letterSpacing:"0.07em",textTransform:"uppercase",color:C.textSub,marginBottom:6}}>{children}</div>
);

const Select = ({label,value,onChange,options,placeholder=""}) => (
  <div style={{marginBottom:18}}>
    <FieldLabel>{label}</FieldLabel>
    <div style={{position:"relative"}}>
      <select value={value} onChange={e=>onChange(e.target.value)} style={{
        width:"100%",padding:"10px 36px 10px 12px",
        border:`1.5px solid ${value?C.teal:C.border}`,borderRadius:8,
        fontSize:14,color:value?C.text:"#94A3B8",background:C.white,
        outline:"none",appearance:"none",cursor:"pointer",
        transition:"border-color 0.15s",fontFamily:"inherit",
      }}>
        <option value="" disabled>{placeholder||"Select…"}</option>
        {options.map(o=><option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
      <div style={{position:"absolute",right:11,top:"50%",transform:"translateY(-50%)",pointerEvents:"none",color:C.textSub}}>
        <Ic p={I.chevR} size={14}/>
      </div>
    </div>
  </div>
);

const BinaryPill = ({label,value,onChange,yes="Yes",no="No"}) => (
  <div style={{marginBottom:18}}>
    <FieldLabel>{label}</FieldLabel>
    <div style={{display:"flex",gap:8}}>
      {[{v:true,l:yes},{v:false,l:no}].map(({v,l})=>(
        <button key={l} onClick={()=>onChange(v)} style={{
          flex:1,padding:"9px 0",
          border:`1.5px solid ${value===v?C.teal:C.border}`,borderRadius:8,
          background:value===v?C.tealPale:C.white,
          color:value===v?C.tealDeep:C.textSub,
          fontWeight:value===v?700:400,fontSize:13,cursor:"pointer",
          transition:"all 0.15s",fontFamily:"inherit",
        }}>{l}</button>
      ))}
    </div>
  </div>
);

const CheckTile = ({label,sub,checked,onChange}) => (
  <label style={{
    display:"flex",alignItems:"flex-start",gap:11,cursor:"pointer",
    padding:"12px 14px",border:`1.5px solid ${checked?C.teal:C.border}`,
    borderRadius:10,background:checked?C.tealPale:C.white,transition:"all 0.15s",
  }}>
    <div style={{
      width:17,height:17,borderRadius:4,flexShrink:0,marginTop:1,
      border:`2px solid ${checked?C.teal:C.slateL}`,
      background:checked?C.teal:C.white,
      display:"flex",alignItems:"center",justifyContent:"center",transition:"all 0.15s",
    }}>
      {checked&&<Ic p={I.check} size={10} color="#fff" sw={3}/>}
    </div>
    <div>
      <div style={{fontSize:13,fontWeight:600,color:checked?C.tealDeep:C.text}}>{label}</div>
      {sub&&<div style={{fontSize:11,color:C.textSub,marginTop:2,lineHeight:1.4}}>{sub}</div>}
    </div>
    <input type="checkbox" checked={checked} onChange={e=>onChange(e.target.checked)} style={{display:"none"}}/>
  </label>
);

const PillChip = ({level}) => {
  const m=PRIORITY_META[level]||PRIORITY_META.suitable;
  return (
    <span style={{
      display:"inline-flex",alignItems:"center",padding:"2px 9px",borderRadius:20,
      fontSize:10,fontWeight:700,letterSpacing:"0.06em",textTransform:"uppercase",
      background:m.bg,color:m.color,border:`1px solid ${m.border}`,whiteSpace:"nowrap",
    }}>{m.label}</span>
  );
};

const MeasureCard = ({m, state}) => {
  const [expanded, setExpanded] = useState(false);
  const pLevel = typeof m.priority==="function"?m.priority(state):m.priority;
  if(!pLevel) return null;
  if(m.condition&&!m.condition(state)) return null;
  const noteText = m.note?.(state);
  const badge = m.badge?.(state);
  const isRec = pLevel==="recommended";
  const isLim = pLevel==="limited";
  const hasExtra = m.detail||m.specs||m.comparison;

  return (
    <div style={{
      border:`1px solid ${isRec?C.teal:isLim?"#FECDD3":C.border}`,
      borderRadius:10,background:isRec?"#F0FDFB":isLim?"#FFF8F8":C.white,
      marginBottom:8,position:"relative",overflow:"hidden",
    }}>
      {badge&&(
        <div style={{
          position:"absolute",top:0,right:13,
          background:C.teal,color:C.white,
          fontSize:9,fontWeight:800,padding:"2px 8px",
          borderRadius:"0 0 6px 6px",letterSpacing:"0.1em",
        }}>{badge}</div>
      )}
      <div style={{display:"flex",gap:13,padding:"13px 15px"}}>
        <div style={{
          width:34,height:34,borderRadius:8,flexShrink:0,
          background:isRec?C.teal+"18":C.bg,
          display:"flex",alignItems:"center",justifyContent:"center",
          color:isRec?C.teal:isLim?"#BE123C":C.textSub,
        }}>
          <Ic p={I[m.icon]||I.info} size={17}/>
        </div>
        <div style={{flex:1,minWidth:0}}>
          <div style={{display:"flex",alignItems:"flex-start",gap:7,flexWrap:"wrap",marginBottom:noteText?5:0}}>
            <span style={{fontSize:13,fontWeight:700,color:C.text,lineHeight:1.3}}>{m.label}</span>
            <PillChip level={pLevel}/>
          </div>
          {m.specs&&(
            <div style={{fontSize:11,color:C.textSub,fontFamily:"'DM Mono',monospace",marginBottom:5,padding:"3px 8px",background:C.bg,borderRadius:4,display:"inline-block"}}>{m.specs}</div>
          )}
          {noteText&&(
            <p style={{margin:0,fontSize:12,color:isRec?C.tealDeep:isLim?"#9F1239":C.textMid,lineHeight:1.6,whiteSpace:"pre-line"}}>{noteText}</p>
          )}
          {hasExtra&&(
            <button onClick={()=>setExpanded(e=>!e)} style={{
              marginTop:8,display:"flex",alignItems:"center",gap:4,
              background:"none",border:"none",cursor:"pointer",padding:0,
              color:C.teal,fontSize:11,fontWeight:600,fontFamily:"inherit",
            }}>
              <Ic p={expanded?I.chevL:I.chevR} size={12} color={C.teal}/>
              {expanded?"Less detail":"Full specification & comparison"}
            </button>
          )}
        </div>
      </div>
      {expanded&&hasExtra&&(
        <div style={{borderTop:`1px solid ${C.border}`,padding:"12px 15px 14px 62px",background:"#FAFCFF"}}>
          {m.specs&&<div style={{marginBottom:8}}>
            <div style={{fontSize:10,fontWeight:700,letterSpacing:"0.07em",textTransform:"uppercase",color:C.textSub,marginBottom:3}}>Technical Specification</div>
            <p style={{margin:0,fontSize:12,color:C.textMid,lineHeight:1.6,fontFamily:"'DM Mono',monospace"}}>{m.specs}</p>
          </div>}
          {m.detail&&<div style={{marginBottom:m.comparison?8:0}}>
            <div style={{fontSize:10,fontWeight:700,letterSpacing:"0.07em",textTransform:"uppercase",color:C.textSub,marginBottom:3}}>Evidence & Compliance</div>
            <p style={{margin:0,fontSize:12,color:C.textMid,lineHeight:1.6}}>{m.detail}</p>
          </div>}
          {m.comparison&&<div>
            <div style={{fontSize:10,fontWeight:700,letterSpacing:"0.07em",textTransform:"uppercase",color:C.textSub,marginBottom:3}}>Competitor Comparison</div>
            <p style={{margin:0,fontSize:12,color:C.textMid,lineHeight:1.6}}>{m.comparison}</p>
          </div>}
        </div>
      )}
    </div>
  );
};

const Category = ({catKey,state}) => {
  const measures = MEASURES[catKey];
  const visible = measures.filter(m=>{
    if(m.condition&&!m.condition(state)) return false;
    const p=typeof m.priority==="function"?m.priority(state):m.priority;
    return !!p;
  });
  if(!visible.length) return null;
  const meta=CAT_META[catKey];
  return (
    <div style={{marginBottom:22}}>
      <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:12,paddingBottom:10,borderBottom:`1.5px solid ${meta.color}22`}}>
        <div style={{width:3,height:17,background:meta.color,borderRadius:2}}/>
        <span style={{fontSize:12,fontWeight:700,letterSpacing:"0.07em",textTransform:"uppercase",color:meta.color}}>{meta.label}</span>
        <span style={{fontSize:11,color:C.slateL,marginLeft:"auto"}}>{visible.length} measure{visible.length!==1?"s":""}</span>
      </div>
      {visible.map(m=><MeasureCard key={m.id} m={m} state={state}/>)}
    </div>
  );
};

// ─── App ──────────────────────────────────────────────────────────────────────
export default function App() {
  const [step, setStep] = useState(0);
  const [s, setS] = useState(INIT);
  const [aiText, setAiText] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const set = k=>v=>setS(p=>({...p,[k]:v}));

  const archetypeLabel = s.houseType&&s.floorArea&&s.bedrooms
    ? `${({detached:"Detached",semi:"Semi-Detached",terrace:"Mid-Terrace","terrace-end":"End-Terrace",flat:"Flat",maisonette:"Maisonette",bungalow:"Bungalow"}[s.houseType]||s.houseType)} · ${s.bedrooms} bed · ${({small:"<70m²",medium:"70–100m²",large:"100–130m²",xlarge:">130m²"}[s.floorArea]||s.floorArea)}`
    : null;

  const flags=[s.spaceCritical&&"Space Critical",s.moldDamp&&"Mould / Damp",s.fuelPoverty&&"Fuel Poverty",s.disrepair&&"Disrepair",s.accessibility&&"Accessibility",s.tenantDisruption&&"Min. Disruption"].filter(Boolean);

  const canAdvance=[
    ()=>s.houseType&&s.floorArea&&s.bedrooms&&s.hasOwnRoof!==null&&s.hasGarden!==null,
    ()=>true,
    ()=>s.currentHeat&&s.pipework&&s.currentEPC&&s.hasOutdoorSpace!==null&&s.hasCylinderSpace!==null,
    ()=>true,
  ][step]?.();

  const totalMeasures=Object.keys(MEASURES).reduce((acc,cat)=>
    acc+MEASURES[cat].filter(m=>{
      if(m.condition&&!m.condition(s)) return false;
      const p=typeof m.priority==="function"?m.priority(s):m.priority;
      return !!p;
    }).length,0);

  const fetchAI=async()=>{
    setAiLoading(true); setAiText("");
    const prompt=`You are a senior UK retrofit consultant advising Greater Manchester Combined Authority officers under the Warm Homes Plan and PAS 2035.

Property archetype: ${archetypeLabel}
Active flags: ${flags.join(", ")||"none"}
Current heat: ${s.currentHeat||"unknown"}, Pipework: ${s.pipework||"unknown"}, EPC: ${s.currentEPC||"unknown"}
Target heat: ${s.targetHeatSource||"TBD"}, Outdoor HP space: ${s.hasOutdoorSpace?"yes":"no"}, Cylinder space: ${s.hasCylinderSpace?"yes":"no"}
Own roof: ${s.hasOwnRoof?"yes":"no"}, Garden: ${s.hasGarden?"yes":"no"}

Write 4–5 sentences of practical retrofit guidance for this archetype. Cover: (1) primary recommended pathway, (2) any key barriers, (3) heat delivery recommendation — specifically whether ThermaSkirt wet skirting (45°C rated, BSRIA tested, addresses space/mould), ThermaSkirt-e electric skirting (no pipework, far-infrared, superior to panel heaters and storage heaters), or Add2Rad (supplement existing radiators for heat pump retrofit) is most appropriate, with reasoning. Professional tone for a local authority housing officer. Accurate, no waffle.`;
    try {
      const r=await fetch("https://api.anthropic.com/v1/messages",{
        method:"POST",headers:{"Content-Type":"application/json"},
        body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:450,messages:[{role:"user",content:prompt}]}),
      });
      const d=await r.json();
      setAiText(d.content?.map(b=>b.text||"").join("")||"Unable to generate recommendation.");
    } catch{ setAiText("AI service unavailable — please retry."); }
    setAiLoading(false);
  };

  const reset=()=>{setStep(0);setS(INIT);setAiText("");};

  return (
    <div style={{minHeight:"100vh",background:C.bg,fontFamily:"'DM Sans',system-ui,sans-serif"}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,wght@0,400;0,500;0,600;0,700;1,400&family=DM+Mono:wght@400;500&display=swap');
        *{box-sizing:border-box} button,select,input{font-family:inherit}
        @keyframes spin{to{transform:rotate(360deg)}}
      `}</style>

      {/* Header */}
      <div style={{background:C.navy,borderBottom:`3px solid ${C.teal}`}}>
        <div style={{maxWidth:800,margin:"0 auto",padding:"16px 24px",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <div>
            <div style={{fontSize:10,letterSpacing:"0.15em",textTransform:"uppercase",color:C.tealLt,fontWeight:500,marginBottom:3}}>Greater Manchester Combined Authority</div>
            <div style={{fontSize:18,fontWeight:700,color:C.white,letterSpacing:"-0.025em"}}>Retrofit Archetype Tool</div>
          </div>
          <div style={{textAlign:"right"}}>
            {["WARM HOMES PLAN","LOW CARBON INDUSTRY GROUP"].map(t=>(
              <div key={t} style={{fontSize:9,color:C.slateL,letterSpacing:"0.1em",fontFamily:"'DM Mono',monospace",marginBottom:2}}>{t}</div>
            ))}
          </div>
        </div>
        <div style={{maxWidth:800,margin:"0 auto",display:"flex",padding:"0 24px"}}>
          {STEPS.map((label,i)=>{
            const done=i<step,active=i===step;
            return (
              <div key={label} style={{
                flex:1,padding:"9px 4px",textAlign:"center",fontSize:10,
                fontWeight:active?700:400,letterSpacing:"0.05em",textTransform:"uppercase",
                color:done?C.tealLt:active?C.white:C.slateL,
                borderBottom:`2px solid ${done?C.teal:active?"#4DB6AC":"transparent"}`,
                transition:"all 0.2s",
              }}>
                {done?"✓ ":i+1+". "}{label}
              </div>
            );
          })}
        </div>
      </div>

      <div style={{maxWidth:800,margin:"28px auto",padding:"0 16px"}}>

        {/* Step 0 */}
        {step===0&&(
          <div style={{background:C.white,borderRadius:12,padding:28,border:`1px solid ${C.border}`,boxShadow:"0 1px 4px rgba(0,0,0,0.05)"}}>
            <div style={{marginBottom:22}}>
              <div style={{fontSize:17,fontWeight:700,color:C.text,marginBottom:4}}>Property Details</div>
              <div style={{fontSize:13,color:C.textSub}}>Define the physical archetype — these filters drive measure eligibility throughout.</div>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0 22px"}}>
              <Select label="House Type" value={s.houseType} onChange={set("houseType")} placeholder="Select type" options={[
                {value:"detached",label:"Detached"},{value:"semi",label:"Semi-Detached"},
                {value:"terrace",label:"Terraced (Mid)"},{value:"terrace-end",label:"Terraced (End)"},
                {value:"flat",label:"Flat"},{value:"maisonette",label:"Maisonette"},{value:"bungalow",label:"Bungalow"},
              ]}/>
              <Select label="Floor Area" value={s.floorArea} onChange={set("floorArea")} placeholder="Select band" options={[
                {value:"small",label:"Small — <70m²"},{value:"medium",label:"Medium — 70–100m²"},
                {value:"large",label:"Large — 100–130m²"},{value:"xlarge",label:"Extra Large — >130m²"},
              ]}/>
              <Select label="Bedrooms" value={s.bedrooms} onChange={set("bedrooms")} placeholder="Number of bedrooms" options={
                ["1","2","3","4+"].map(n=>({value:n,label:n==="4+"?"4+ Bedrooms":`${n} Bedroom${n==="1"?"":"s"}`}))
              }/>
              <Select label="Number of Floors" value={s.floors} onChange={set("floors")} placeholder="Select" options={[
                {value:"ground-only",label:"Single Storey"},{value:"two",label:"Two Storey"},
                {value:"three",label:"Three Storey"},{value:"multi",label:"Multi-Storey (Flat)"},
              ]}/>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0 22px"}}>
              <BinaryPill label="Has Own / Accessible Roof?" value={s.hasOwnRoof} onChange={set("hasOwnRoof")}/>
              <BinaryPill label="Has Garden or Outdoor Space?" value={s.hasGarden} onChange={set("hasGarden")}/>
            </div>
          </div>
        )}

        {/* Step 1 */}
        {step===1&&(
          <div style={{background:C.white,borderRadius:12,padding:28,border:`1px solid ${C.border}`,boxShadow:"0 1px 4px rgba(0,0,0,0.05)"}}>
            <div style={{marginBottom:20}}>
              <div style={{fontSize:17,fontWeight:700,color:C.text,marginBottom:4}}>Property Needs & Constraints</div>
              <div style={{fontSize:13,color:C.textSub}}>Select all applicable flags. These directly influence solution prioritisation in results.</div>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
              <CheckTile label="Space Critical" sub="Limited room for radiators, cylinder, or plant" checked={s.spaceCritical} onChange={set("spaceCritical")}/>
              <CheckTile label="Mould & Damp" sub="Active concern or historical issue" checked={s.moldDamp} onChange={set("moldDamp")}/>
              <CheckTile label="Fuel Poverty Household" sub="Low-income or at-risk occupant" checked={s.fuelPoverty} onChange={set("fuelPoverty")}/>
              <CheckTile label="Structural Disrepair" sub="Requires pre-retrofit remediation" checked={s.disrepair} onChange={set("disrepair")}/>
              <CheckTile label="Accessibility Requirements" sub="Mobility or burn/impact safety needs" checked={s.accessibility} onChange={set("accessibility")}/>
              <CheckTile label="Minimise Tenant Disruption" sub="Occupied property, limit upheaval" checked={s.tenantDisruption} onChange={set("tenantDisruption")}/>
            </div>
            {(s.spaceCritical||s.moldDamp)&&(
              <div style={{marginTop:18,padding:"12px 16px",background:C.tealPale,border:`1px solid ${C.teal}40`,borderRadius:10,display:"flex",gap:10,alignItems:"flex-start"}}>
                <div style={{color:C.teal,flexShrink:0,marginTop:1}}><Ic p={I.info} size={15}/></div>
                <p style={{margin:0,fontSize:12,color:C.tealDeep,lineHeight:1.6}}>
                  <strong>{[s.spaceCritical&&"Space Critical",s.moldDamp&&"Mould & Damp"].filter(Boolean).join(" + ")} flag{s.spaceCritical&&s.moldDamp?"s":""} active.</strong>{" "}
                  ThermaSkirt wet and ThermaSkirt-e electric variants will be marked <strong>Recommended</strong> in results. Standard radiators and panel heaters downgraded accordingly.
                </p>
              </div>
            )}
          </div>
        )}

        {/* Step 2 */}
        {step===2&&(
          <div style={{background:C.white,borderRadius:12,padding:28,border:`1px solid ${C.border}`,boxShadow:"0 1px 4px rgba(0,0,0,0.05)"}}>
            <div style={{marginBottom:22}}>
              <div style={{fontSize:17,fontWeight:700,color:C.text,marginBottom:4}}>Current & Target Systems</div>
              <div style={{fontSize:13,color:C.textSub}}>Existing infrastructure determines which heat generation and delivery options are viable.</div>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0 22px"}}>
              <Select label="Current Heat Source" value={s.currentHeat} onChange={set("currentHeat")} placeholder="Select" options={[
                {value:"gas-boiler",label:"Gas Boiler (Combi)"},{value:"gas-boiler-system",label:"Gas Boiler (System / Cylinder)"},
                {value:"storage-heaters",label:"Electric Storage Heaters"},{value:"direct-electric",label:"Direct Electric / Panel Heaters"},
                {value:"oil",label:"Oil Boiler"},{value:"district",label:"District / Communal Heating"},{value:"none",label:"No Heating"},
              ]}/>
              <Select label="Existing Pipework" value={s.pipework} onChange={set("pipework")} placeholder="Select" options={[
                {value:"22mm",label:"22mm Copper (standard)"},{value:"15mm",label:"15mm Copper"},
                {value:"10mm",label:"10mm Microbore"},{value:"plastic",label:"Plastic / PEX"},{value:"none",label:"No Pipework"},
              ]}/>
              <Select label="Current EPC Rating" value={s.currentEPC} onChange={set("currentEPC")} placeholder="Select" options={
                ["D","E","F","G"].map(e=>({value:e,label:`EPC ${e}`}))
              }/>
              <Select label="Target Heat Source" value={s.targetHeatSource} onChange={set("targetHeatSource")} placeholder="Proposed (if known)" options={[
                {value:"ashp",label:"Air Source Heat Pump"},{value:"gshp",label:"Ground Source Heat Pump"},
                {value:"gas-retain",label:"Retain Gas (HP-Ready interim)"},{value:"heat-network",label:"Heat Network"},{value:"electric-only",label:"Electric Only (no wet system)"},{value:"unknown",label:"To Be Determined"},
              ]}/>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0 22px"}}>
              <BinaryPill label="Outdoor Space for Heat Pump Unit?" value={s.hasOutdoorSpace} onChange={set("hasOutdoorSpace")}/>
              <BinaryPill label="Space for Hot Water Cylinder?" value={s.hasCylinderSpace} onChange={set("hasCylinderSpace")}/>
            </div>
          </div>
        )}

        {/* Step 3 — Results */}
        {step===3&&(
          <div>
            <div style={{background:C.navy,borderRadius:12,padding:"18px 22px",marginBottom:22,border:`1px solid ${C.navyLt}`}}>
              <div style={{fontSize:10,letterSpacing:"0.1em",color:C.slateL,textTransform:"uppercase",marginBottom:6,fontFamily:"'DM Mono',monospace"}}>Archetype</div>
              <div style={{fontSize:21,fontWeight:700,color:C.white,letterSpacing:"-0.025em",marginBottom:10}}>{archetypeLabel||"—"}</div>
              <div style={{display:"flex",flexWrap:"wrap",gap:6,marginBottom:10}}>
                {flags.map(f=>(
                  <span key={f} style={{padding:"3px 10px",borderRadius:20,background:`${C.teal}20`,border:`1px solid ${C.teal}50`,fontSize:11,color:C.tealLt,fontWeight:600}}>{f}</span>
                ))}
                {s.currentHeat&&<span style={{padding:"3px 10px",borderRadius:20,background:"#FFFFFF0D",border:"1px solid #FFFFFF18",fontSize:11,color:C.slateL}}>{s.currentHeat.replace(/-/g," ")}</span>}
                {s.pipework&&<span style={{padding:"3px 10px",borderRadius:20,background:"#FFFFFF0D",border:"1px solid #FFFFFF18",fontSize:11,color:C.slateL}}>{s.pipework} pipework</span>}
                {s.currentEPC&&<span style={{padding:"3px 10px",borderRadius:20,background:"#FFFFFF0D",border:"1px solid #FFFFFF18",fontSize:11,color:C.slateL}}>EPC {s.currentEPC}</span>}
              </div>
              <div style={{display:"flex",alignItems:"center",gap:7}}>
                <div style={{width:6,height:6,borderRadius:"50%",background:C.teal}}/>
                <span style={{fontSize:12,color:C.tealLt,fontWeight:500,fontFamily:"'DM Mono',monospace"}}>{totalMeasures} measures identified across 5 categories</span>
              </div>
            </div>

            {Object.keys(MEASURES).map(cat=><Category key={cat} catKey={cat} state={s}/>)}

            {/* AI panel */}
            <div style={{background:C.white,borderRadius:12,padding:"20px 22px",border:`1px solid ${C.border}`,boxShadow:"0 1px 4px rgba(0,0,0,0.05)",marginBottom:32}}>
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:14}}>
                <div style={{display:"flex",alignItems:"center",gap:8}}>
                  <div style={{color:C.teal}}><Ic p={I.sparkle} size={15}/></div>
                  <span style={{fontSize:14,fontWeight:700,color:C.text}}>AI Retrofit Recommendation</span>
                  <span style={{fontSize:10,color:C.textSub,background:C.bg,padding:"2px 8px",borderRadius:20,border:`1px solid ${C.border}`,letterSpacing:"0.04em",fontFamily:"'DM Mono',monospace"}}>CLAUDE</span>
                </div>
                <button onClick={fetchAI} disabled={aiLoading} style={{
                  display:"flex",alignItems:"center",gap:6,
                  padding:"8px 16px",border:"none",borderRadius:8,
                  background:aiLoading?C.border:C.navy,color:aiLoading?C.textSub:C.white,
                  fontSize:12,fontWeight:600,cursor:aiLoading?"not-allowed":"pointer",
                  transition:"background 0.15s",letterSpacing:"0.02em",
                }}>
                  <Ic p={aiText?I.refresh:I.sparkle} size={13} color={aiLoading?C.textSub:C.white}/>
                  {aiLoading?"Generating…":aiText?"Regenerate":"Generate"}
                </button>
              </div>
              {aiLoading&&(
                <div style={{display:"flex",alignItems:"center",gap:10,padding:"14px 0",color:C.slateL}}>
                  <div style={{width:15,height:15,border:`2px solid ${C.teal}`,borderTopColor:"transparent",borderRadius:"50%",animation:"spin 0.8s linear infinite"}}/>
                  <span style={{fontSize:12}}>Analysing archetype against GM Warm Homes criteria…</span>
                </div>
              )}
              {aiText&&!aiLoading&&(
                <p style={{margin:0,fontSize:13,color:C.textMid,lineHeight:1.8,borderLeft:`3px solid ${C.teal}`,paddingLeft:14,fontStyle:"italic"}}>{aiText}</p>
              )}
              {!aiText&&!aiLoading&&(
                <p style={{margin:0,fontSize:13,color:C.slateL}}>Generate a plain-English retrofit pathway for this archetype, including specific heat delivery product recommendations aligned to the GM Warm Homes programme and PAS 2035.</p>
              )}
            </div>
          </div>
        )}

        {/* Navigation */}
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",paddingBottom:32}}>
          <button onClick={()=>step===0?reset():setStep(p=>p-1)} style={{
            display:"flex",alignItems:"center",gap:6,
            padding:"10px 20px",border:`1.5px solid ${C.border}`,borderRadius:8,
            background:C.white,color:C.textMid,fontSize:13,fontWeight:600,cursor:"pointer",
          }}>
            <Ic p={step===0?I.refresh:I.chevL} size={14} color={C.textMid}/>
            {step===0?"Reset":"Back"}
          </button>
          {step<STEPS.length-1?(
            <button onClick={()=>setStep(p=>p+1)} disabled={!canAdvance} style={{
              display:"flex",alignItems:"center",gap:6,
              padding:"10px 24px",border:"none",borderRadius:8,
              background:canAdvance?C.teal:C.border,color:canAdvance?C.white:C.textSub,
              fontSize:13,fontWeight:700,cursor:canAdvance?"pointer":"not-allowed",transition:"background 0.15s",
            }}>
              Continue <Ic p={I.chevR} size={14} color={canAdvance?C.white:C.textSub}/>
            </button>
          ):(
            <button onClick={reset} style={{
              display:"flex",alignItems:"center",gap:6,
              padding:"10px 24px",border:"none",borderRadius:8,
              background:C.navy,color:C.white,fontSize:13,fontWeight:700,cursor:"pointer",
            }}>
              <Ic p={I.refresh} size={13} color={C.white}/> New Archetype
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
