import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "..");
const registry = JSON.parse(await readFile(path.join(rootDir, "sources.json"), "utf8"));
const sourceBaseUrl = Object.fromEntries(
  registry.sources.map((source) => [source.id, String(source.base_url).replace(/\/+$/, "")])
);

function sourceUrl(siteId, route) {
  return `${sourceBaseUrl[siteId]}${route}`;
}

const additions = {
  "grimaldi-group": [
    {
      id: "gri-006",
      title: "Grimaldi Customer Advisory - Possible Hull Substitution Protocol for WAX Service",
      url: sourceUrl("grimaldi-group", "/advisories/wax-hull-substitution-protocol-april-2026"),
      published: "2026-03-29",
      updated: "2026-03-29",
      source: "Grimaldi Group",
      source_type: "operations_advisory",
      tags: ["grimaldi", "wax", "hull-substitution", "great-cotonou", "great-tema", "customer-advisory"],
      summary: "Grimaldi outlines how customers will be notified if a WAX service hull substitution becomes operationally necessary. Bookings remain valid and cargo routing does not change, but ETA windows may shift by 24-72 hours.",
      body: "Hull Substitution Protocol Advisory - West Africa Express. Grimaldi Lines advises customers that the WAX service may occasionally require a late operational vessel substitution when engineering readiness, berth sequencing, or intermediate-port timing changes materially affect the published rotation. If a substitution is made, customer bookings remain valid and cargo discharge port remains unchanged unless explicitly restated. WHAT CHANGES FOR CUSTOMERS: The vessel name on the booking confirmation may be updated. AIS tracking should follow the newly assigned hull once Grimaldi confirms the substitution. ETA can shift by 24-72 hours depending on where in the voyage the change occurs. WHAT DOES NOT CHANGE: Freight terms, destination port, cargo booking reference, and local agent point of contact remain unchanged. CURRENT GUIDANCE FOR LATE-MARCH CUSTOMERS: GREAT COTONOU remains the active lead hull for the present WAX rotation, with GREAT TEMA maintained in hot-standby readiness. Customers should monitor direct carrier notices rather than infer a confirmed substitution from third-party tracking alone."
    },
    {
      id: "gri-007",
      title: "Apapa Arrival Planning Note - Downstream Delay Risk After ETA Revision",
      url: sourceUrl("grimaldi-group", "/advisories/apapa-arrival-planning-after-eta-slip"),
      published: "2026-03-29",
      updated: "2026-03-29",
      source: "Grimaldi Group",
      source_type: "planning_notice",
      tags: ["apapa", "eta-slip", "planning", "customs-agent", "trucking", "downstream"],
      summary: "Following recent ETA revisions into Lagos, Grimaldi advises importers not to lock customs examination, trucking, or warehouse appointments to the raw carrier ETA without berth confirmation.",
      body: "Arrival Planning Note - Lagos Import Deliveries. Grimaldi Lines reminds Nigeria-bound customers that a declared ETA into Lagos is not the same as a berth-confirmed discharge window. Under current March-April congestion conditions at Apapa, the gap between vessel arrival and discharge start can still run 3-5 days even when the vessel reaches Lagos approaches on schedule. CUSTOMER PLANNING GUIDANCE: Do not lock customs broker examination bookings, truck dispatch, or warehouse receiving appointments to the raw arrival date alone. Use berth confirmation or local-agent advice before finalising paid downstream slots. PRACTICAL RULE: If the carrier ETA slips by more than 24 hours, assume downstream appointments may need to shift by 2-4 days once anchorage and inspection effects are included. This advisory is intended to reduce avoidable rebooking costs for importers whose cargo is already correctly documented but operationally early for collection."
    }
  ],
  "nigeria-port-watch": [
    {
      id: "npw-006",
      title: "Wharf Road Flooding Advisory - Truck Access Risk for Early April Lagos Collections",
      url: sourceUrl("nigeria-port-watch", "/advisories/wharf-road-flooding-early-april-2026"),
      published: "2026-03-29",
      updated: "2026-03-29",
      source: "Nigeria Port Watch",
      source_type: "road_access_advisory",
      tags: ["wharf-road", "flooding", "truck-access", "apapa", "mile-2", "road-disruption"],
      summary: "Heavy pre-monsoon showers are increasing flood risk on Wharf Road and Mile 2 approaches. Importers planning early-April vehicle collection should expect truck-access volatility even after berth confirmation.",
      body: "Road Access Advisory - Lagos Port Corridor. Nigeria Port Watch reports elevated flooding risk on Wharf Road, Ijora approaches, and the Mile 2 corridor following repeated pre-monsoon rainfall in the last seven days. While terminal gate operations remain open, truck approach times are becoming more variable, especially during early morning rainfall events. WHY THIS MATTERS: Even when a ro-ro vessel has berthed and begun discharge, importers may still lose 12-24 hours if truck entry slots are missed because access roads are partially waterlogged. OPERATOR GUIDANCE: Book collection windows outside peak rain periods, keep truckers on flexible dispatch, and avoid assuming that berth confirmation equals same-day pickup readiness. Nigeria Port Watch expects this access risk to intensify from 2-8 April if the current rainfall pattern persists."
    },
    {
      id: "npw-007",
      title: "Pilot and Tug Queue Alert - Simultaneous Early-April Arrivals to Stress Lagos Berthing",
      url: sourceUrl("nigeria-port-watch", "/bulletins/pilot-tug-queue-early-april-2026"),
      published: "2026-03-30",
      updated: "2026-03-30",
      source: "Nigeria Port Watch",
      source_type: "operations_bulletin",
      tags: ["pilot", "tugboat", "berthing", "lagos", "april-2026", "arrival-queue"],
      summary: "Nigeria Port Watch warns that clustered vessel arrivals in the 2-5 April window may temporarily extend pilot and tug assignment times, adding another operational delay layer beyond anchorage waiting.",
      body: "Operations Bulletin - Pilot and Tug Assignment Pressure. Nigeria Port Watch advises importers and port agents to expect tighter pilot and tugboat availability in Lagos from 2 to 5 April 2026 due to clustered inbound arrivals across ro-ro, container, and tanker traffic. WHY THIS IS IMPORTANT: A vessel can reach Lagos approaches on time and still lose additional hours or a full day before final berthing movements begin if pilot boarding or tug allocation is deferred. CURRENT RISK PROFILE: GREAT COTONOU and GREAT ABIDJAN are both projected to arrive during a dense arrival window. Three container vessels and one tanker are also expected in the same period. EXPECTED IMPACT: Add 12-24 hours of operational uncertainty on top of the normal anchorage queue estimate where pilot and tug assignments are contested. This does not guarantee an extra day of delay, but it is a meaningful source of berth-window slippage during clustered arrival periods."
    }
  ],
  "naija-customs-guide": [
    {
      id: "ncg-006",
      title: "Pre-Arrival Readiness Checklist - What to Finish 10 Days Before Your Vessel Berths",
      url: sourceUrl("naija-customs-guide", "/checklists/pre-arrival-readiness-10-days-before-berth"),
      published: "2026-03-29",
      updated: "2026-03-29",
      source: "Naija Customs Guide",
      source_type: "readiness_checklist",
      tags: ["pre-arrival", "checklist", "paar", "form-m", "berth-planning", "readiness"],
      summary: "A practical importer checklist for the 10-day window before expected berth. Covers Form M, BL, PAAR, customs duty payment, clearing agent readiness, and truck planning.",
      body: "Pre-Arrival Readiness Checklist - 10 Days Before Berth. Many Lagos clearance delays happen because importers wait for berth confirmation before finishing paperwork. That is usually too late. If your shipment is within roughly 10 days of expected berth, complete the following immediately. 1. Confirm Form M has been approved by the bank and matches the consignee details exactly. 2. Confirm Bill of Lading copy has been received and all VIN, year, make, and consignee details align with Form M and SON documentation. 3. Verify PAAR has already been submitted to the bank or NCS-facing desk; do not wait until the vessel reaches anchorage. 4. Confirm customs clearing agent has the full document pack and terminal of discharge. 5. Confirm customs duty funding is available so payment can be made as soon as assessment is issued. 6. Prepare truck dispatch planning, but keep collection dates flexible until berth and discharge timing are clearer. RULE OF THUMB: treat the predicted berth window, not the raw carrier ETA, as the operational countdown for paperwork readiness."
    },
    {
      id: "ncg-007",
      title: "PAAR Timing Reality Check - Why Starting After Anchorage Usually Costs Money",
      url: sourceUrl("naija-customs-guide", "/guides/paar-timing-after-anchorage-costs-money"),
      published: "2026-03-30",
      updated: "2026-03-30",
      source: "Naija Customs Guide",
      source_type: "customs_guide",
      tags: ["paar", "anchorage", "demurrage", "timing", "clearance-risk", "lagos"],
      summary: "Naija Customs Guide explains why waiting until a vessel reaches Lagos anchorage before pushing PAAR processing often compresses the free-day window and increases demurrage exposure.",
      body: "PAAR Timing Reality Check. Importers sometimes assume they can wait until their vessel is visibly near Lagos before pushing PAAR processing. In practice, that is one of the easiest ways to compress the free-day window and create avoidable storage cost. WHY: Once a vessel hits anchorage, the remaining timeline can move quickly if berth allocation clears sooner than expected. If PAAR is still pending at that point, customs duty payment, examination scheduling, and vehicle release all queue behind it. PRACTICAL EFFECT: A shipment that appears to have 5 free days left can lose most of that margin if PAAR issuance lags by even 48-72 hours after berth. BEST PRACTICE: Start PAAR processing while the vessel is still in ocean transit, ideally no later than 7-10 business days before expected berth. If your vessel is already at anchorage and PAAR is not yet issued, treat the shipment as elevated clearance risk and escalate with your bank or customs representative immediately."
    }
  ],
  "apapa-tin-can-terminal": [
    {
      id: "att-006",
      title: "Terminal Holiday Concession Notice - One-Day Storage Grace for Easter 2026 Collections",
      url: sourceUrl("apapa-tin-can-terminal", "/notices/easter-2026-storage-grace"),
      published: "2026-03-30",
      updated: "2026-03-30",
      source: "Apapa Tin Can Terminal",
      source_type: "terminal_notice",
      tags: ["easter", "storage-grace", "free-days", "terminal-notice", "tin-can", "apapa"],
      summary: "Apapa Tin Can Terminal announces a one-day operational storage grace for vehicle collections impacted directly by reduced Easter processing capacity on 18-21 April 2026, subject to documentary conditions.",
      body: "Terminal Holiday Concession Notice - Easter 2026. Apapa Tin Can Terminal advises importers and clearing agents that a one-day operational storage grace may be applied for qualifying vehicle consignments directly affected by reduced Easter processing activity between 18 and 21 April 2026. IMPORTANT LIMITS: This is not an automatic blanket waiver. The concession applies only where the importer can show that customs processing or terminal access was delayed by the holiday operating schedule after the consignment had already completed the core documentary steps required for release. DOCUMENTS EXPECTED: evidence of PAAR issuance, duty payment, terminal release request, and a documented collection attempt or processing queue dated within the holiday window. WHY THIS MATTERS: For importers operating near the end of their free-day period, even a one-day grace can materially reduce storage exposure. Terminal users should coordinate with their agents early and preserve documentary evidence if a holiday-related processing bottleneck occurs."
    }
  ],
  "corridor-briefing": [
    {
      id: "cb-006",
      title: "ETA Impact Playbook - What to Rebook When Lagos Arrival Slips by 48 Hours",
      url: sourceUrl("corridor-briefing", "/playbooks/eta-impact-lagos-arrival-slip-48-hours"),
      published: "2026-03-30",
      updated: "2026-03-30",
      source: "Corridor Briefing",
      source_type: "operations_playbook",
      tags: ["eta-impact", "rebooking", "lagos", "customs-agent", "truck-planning", "operations"],
      summary: "Corridor Briefing outlines what importers should re-check when a Lagos-bound vessel slips by 24-72 hours: customs appointments, truck dispatch, warehouse slots, and cash timing for duties.",
      body: "ETA Impact Playbook - Operational Steps After a Slip. Importers often ask what a revised ETA actually changes. The answer is usually not just the date on the vessel card. A 48-hour slip into Lagos can ripple into customs scheduling, truck readiness, warehouse staffing, and cash timing for duties. WHAT TO RE-CHECK FIRST: 1. Customs broker availability and any pre-booked examination expectation. 2. Truck dispatch windows if you were planning collection close to berth. 3. Warehouse receiving slots or final-customer delivery promises. 4. Whether the shift pushes the berth window into a holiday, weekend, or known congestion spike. 5. Whether PAAR or duty funding is still on track relative to the new timeline. ANALYST VIEW: The highest-cost mistakes usually happen when importers treat an ETA revision as informational rather than operational. If the berth estimate also moves, every downstream commitment should be reviewed the same day."
    }
  ]
};

for (const [siteId, siteArticles] of Object.entries(additions)) {
  const filePath = path.join(rootDir, siteId, "public", "search-index.json");
  const current = JSON.parse(await readFile(filePath, "utf8"));
  const existingIds = new Set(current.map((article) => article.id));
  const merged = current.concat(siteArticles.filter((article) => !existingIds.has(article.id)));
  await writeFile(filePath, JSON.stringify(merged, null, 2) + "\n", "utf8");
}

console.log("Added first-pass content-gap articles to fake web site indexes.");
