/*
 * The Market Better team, as shown on /team.
 *
 * Photos: one portrait per person, resized to 800x1000 into public/team. The
 * sources were a folder of up to three images each; every pick is the studio
 * frame on a neutral background rather than a square avatar on a coloured
 * one, so the grid reads as one set. The source PNGs are not in this repo.
 *
 * Roles: only two are confirmed — Mike's and Anna's, both taken from the
 * Show's existing "The Team" page on marketbetter.xyz. Nothing in the repo or
 * on the live properties records the other sixteen, so those render name-only
 * rather than as a guess. Fill them in here and the page picks them up — no
 * other file needs touching.
 *
 * (The Show's team page also lists Logan Lyles, Lead Host, and Eric West,
 * Director of Sales. Neither had a headshot in the source folder, so neither
 * is here.)
 */
export type TeamMember = {
  slug: string;
  name: string;
  role: string;
};

export const TEAM: TeamMember[] = [
  { slug: "mike-mcgrath", name: "Mike McGrath", role: "Chief Executive Officer" },
  { slug: "anna-mccoy", name: "Anna McCoy", role: "Director of Marketing" },
  { slug: "adriana-gastelum", name: "Adriana Gastelum", role: "" },
  { slug: "alejandra", name: "Alejandra", role: "" },
  { slug: "bilal", name: "Bilal", role: "" },
  { slug: "carol-lynne", name: "Carol-Lynne", role: "" },
  { slug: "chris", name: "Chris", role: "" },
  { slug: "dima", name: "Dima", role: "" },
  { slug: "filip", name: "Filip", role: "" },
  { slug: "joseph-clavijo", name: "Joseph Clavijo", role: "" },
  { slug: "luka", name: "Luka", role: "" },
  { slug: "paty", name: "Paty", role: "" },
  { slug: "quinten", name: "Quinten", role: "" },
  { slug: "tessa", name: "Tessa", role: "" },
  { slug: "valentina", name: "Valentina", role: "" },
  { slug: "valeria-lopez", name: "Valeria Lopez", role: "" },
  { slug: "valeria-torres", name: "Valeria Torres", role: "" },
  { slug: "zeljko", name: "Zeljko", role: "" },
];

export const teamPhoto = (member: TeamMember) => `/team/${member.slug}.jpg`;
