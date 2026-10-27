/*
 * The Market Better team, as shown on /team.
 *
 * Photos: one portrait per person, resized to 800x1000 into public/team. The
 * sources were a folder of up to three images each; every pick is the studio
 * frame on a neutral background rather than a square avatar on a coloured
 * one, so the grid reads as one set. The source PNGs are not in this repo.
 *
 * Roles come from two places. Mike's and Anna's are from the Show's existing
 * "The Team" page on marketbetter.xyz. The other sixteen are from Joseph's
 * internal role table (2026-10-27), which assigns people to roles rather than
 * the other way round, so several share a title — four A/V Editors, three
 * Content Strategists, two of most of the rest.
 *
 * Titles are spelled as that table spells them ("A/V Editor", "Graphic
 * Designer"), not as the shorter companion list does ("Editor", "Graphic
 * Design").
 *
 * Two things in that source are worth knowing before editing this file:
 *
 * - Carol-Lynne is a Content Strategist in the role table but a Producer in
 *   the companion list. The table wins here because it is the one that
 *   defines what each role does. Flagged to Joseph.
 * - The same table lists Anna as Account Manager, which contradicts the
 *   Director of Marketing on the Show's team page. Her title here is
 *   unchanged, since the Show page is the published one. Also flagged.
 *
 * People in that table with no headshot, and so not on this page: Grant,
 * Mari and Osmond, Louis (Anfloy), and an unnamed Social Media Manager. The
 * Show's team page additionally lists Logan Lyles (Lead Host) and Eric West
 * (Director of Sales).
 */
export type TeamMember = {
  slug: string;
  name: string;
  role: string;
};

export const TEAM: TeamMember[] = [
  { slug: "mike-mcgrath", name: "Mike McGrath", role: "Chief Executive Officer" },
  { slug: "anna-mccoy", name: "Anna McCoy", role: "Director of Marketing" },
  { slug: "adriana-gastelum", name: "Adriana Gastelum", role: "Delivery Coordinator" },
  { slug: "alejandra", name: "Alejandra", role: "Business Operations Manager" },
  { slug: "bilal", name: "Bilal", role: "A/V Editor" },
  { slug: "carol-lynne", name: "Carol-Lynne", role: "Content Strategist" },
  { slug: "chris", name: "Chris Jordan", role: "Content Strategist" },
  { slug: "dima", name: "Dima", role: "Outbound Strategist" },
  { slug: "filip", name: "Filip", role: "A/V Editor" },
  { slug: "joseph-clavijo", name: "Joseph Clavijo", role: "AI Tech Specialist" },
  { slug: "luka", name: "Luka", role: "Graphic Designer" },
  { slug: "paty", name: "Paty", role: "Delivery Coordinator" },
  { slug: "quinten", name: "Quinten Johnson", role: "Content Strategist" },
  { slug: "tessa", name: "Tessa", role: "Content Producer" },
  { slug: "valentina", name: "Valentina", role: "Graphic Designer" },
  { slug: "valeria-lopez", name: "Valeria Lopez", role: "A/V Editor" },
  { slug: "valeria-torres", name: "Valeria Torres", role: "Content Producer" },
  { slug: "zeljko", name: "Zeljko", role: "A/V Editor" },
];

export const teamPhoto = (member: TeamMember) => `/team/${member.slug}.jpg`;
