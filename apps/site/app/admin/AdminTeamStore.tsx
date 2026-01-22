"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type TeamMember = {
  id: string;
  name: string;
  title: string;
  location?: string;
  bio: string[];
  imageUrl?: string;
  isFounder?: boolean;
  order: number;
};

type AdminTeamContextValue = {
  items: TeamMember[];
  upsertTeamMember: (member: TeamMember) => void;
  removeTeamMember: (id: string) => void;
  resetToBaseline: () => void;
};

const STORAGE_KEY = "era_admin_team_members_v1";

const SEED_TEAM_MEMBERS: TeamMember[] = [
  {
    id: "edward-cox",
    name: "Edward Cox",
    title: "Founding Partner",
    isFounder: true,
    order: 1,
    bio: [
      "Ed formerly served as a Senior Policy Advisor in the United States Senate, and later as a government-affairs professional in the private sector, with a focus and expertise in geospatial, infrastructure, energy, natural resources, environmental, and agricultural policy.",
      "Prior to his time on Capitol Hill, Ed served as the campaign director for Senator Orrin G. Hatch. After helping re-elect the senator in 2012, he joined the legislative staff in Washington, D.C., as a senior policy advisor. During his time in the Senate, he wrote and helped pass several legislative priorities, including a large-scale federal land and mineral exchange of over 100,000 acres in the State of Utah. Additionally, on behalf of Senator Hatch, Ed organized a bipartisan team and worked with a wide range of relevant stakeholders to draft the Geospatial Data Act, which was signed into law in 2018.",
      "Ed has also previously worked as a political consultant and managed the campaigns of various candidates at the municipal and state level, as well as a member of Congressman Chris Cannon's re-election campaign. With extensive experience working with various departments and agencies of both Democratic and Republican Administrations, Ed values his ability to identify stakeholder needs while also pursuing a comprehensive policy agenda",
      "A graduate of the University of Utah, Ed holds a B.S. in Economics. He served as the State Chairman for Utah's Federation of College Republicans and later as the College Republican National Committee's Regional Political Director. Ed is an Eagle Scout and practiced as a small-engine mechanic, having worked for his family's small business. Originally from St. George, Utah, and after living in Washington, D.C. for a decade, he now resides in Denver, Colorado with his wife Karen, daughter Emery, and sons Everett and Ellis.",
    ],
    imageUrl: "/team/edwardcox.jpg",
  },
  {
    id: "romel-nicholas",
    name: "Romel Nicholas",
    title: "Managing Partner",
    isFounder: true,
    order: 2,
    imageUrl: "/team/romelnicholas.jpg",
    bio: [
      "Romel possesses expertise in energy, natural resources, environmental, GIS/geospatial, agriculture, and transportation policy. Prior to founding his own practice, he served as a senior policy advisor to two U.S. Senators on matters under the jurisdiction of the Commerce, Energy & Natural Resources, and Environment & Public Works Committees, among others. Romel first served under Senator Orrin Hatch (R-UT) from 2014 until his retirement and subsequently worked for his home-state senator, Senator Pat Toomey (R-PA), in a similar role. He served as Chair of the Senate GIS Working Group during his time with both senators.",
      "Over the course of his time in the Senate, Romel conducted drafting, guided introduction, and/or oversaw the passage of over 21 pieces of original legislation (7 bills/provisions passed into law); most notably, he helped author, negotiate, and pass into law two major pieces of legislation that enjoyed robust bipartisan support: The Geospatial Data Act (GDA) and the Emery County Public Lands Act (ECPLA).",
      "Romel graduated from the University of Notre Dame with a degree in Program of Liberal Studies. Outside of work, he draws and paints amateur hand-made cartography, is an avid baseball (and fantasy baseball) fan, and volunteers for the National Flag Foundation on veterans affairs projects. Originally from Pittsburgh, he now resides in Washington, DC, where he has lived since 2014.",
    ],
  },
  {
    id: "lonald-wishom",
    name: "Lonald Wishom",
    title: "Director, Business Development",
    order: 3,
    imageUrl: "/team/lonaldwishom.png",
    bio: [
      "Lonald Wishom, with his extensive experience as a staff member in the United States Senate, Customer Success Manager at Salesforce, now significantly contributes as the Director of Business Development at ERA Government Affairs.",
      "During his time in the Senate, Lonald deepened his understanding of the governmental landscape, laying a solid foundation for his subsequent endeavors. Transitioning to the technology sector, he employed his skills at Salesforce as a Customer Success Manager. In this role, he adeptly managed the Strategic Banking Portfolio, honing his capacity for maintaining and nurturing high-value customer relationships.",
      "Now, at ERA Government Affairs, Lonald skillfully guides the business development efforts. Drawing on his extensive knowledge and experience from both government and business sectors, he excels in building and maintaining client relationships, focusing particularly on client development.",
      "A proud alumnus of Weber State University with a B.S. in Political Science and Government, Lonald went on to acquire an MBA from Columbia Business School. He maintains ties with Columbia as the Co-Chair of the Young Alumni Board, reflecting his commitment to fostering community connections. Originating from Antioch, California, Lonald's diverse experiences uniquely equip him for continued success in his current role.",
    ],
  },
  {
    id: "danny-scales",
    name: "Danny Scales",
    title: "Director, Legislative Research",
    order: 4,
    bio: [],
  },
];

const AdminTeamContext = createContext<AdminTeamContextValue | null>(null);

function normalizeMember(raw: unknown): TeamMember | null {
  if (!raw || typeof raw !== "object") return null;
  const record = raw as Record<string, unknown>;
  const id = typeof record.id === "string" ? record.id.trim() : "";
  const name = typeof record.name === "string" ? record.name.trim() : "";
  const title = typeof record.title === "string" ? record.title.trim() : "";
  if (!id || !name || !title) return null;

  const location =
    typeof record.location === "string" && record.location.trim()
      ? record.location.trim()
      : undefined;
  const imageUrl =
    typeof record.imageUrl === "string" && record.imageUrl.trim()
      ? record.imageUrl.trim()
      : undefined;
  const isFounder = Boolean(record.isFounder);
  const order = typeof record.order === "number" && Number.isFinite(record.order) ? record.order : 0;

  const bioRaw = Array.isArray(record.bio) ? record.bio : [];
  const bio = bioRaw
    .map((entry) => (typeof entry === "string" ? entry.trim() : ""))
    .filter(Boolean);

  return {
    id,
    name,
    title,
    location,
    imageUrl,
    isFounder,
    order,
    bio,
  };
}

function sortMembers(items: TeamMember[]) {
  return [...items].sort((a, b) => {
    const founderRank = Number(Boolean(b.isFounder)) - Number(Boolean(a.isFounder));
    if (founderRank !== 0) return founderRank;
    if (a.order !== b.order) return a.order - b.order;
    return a.name.localeCompare(b.name);
  });
}

export function AdminTeamProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<TeamMember[]>(() => sortMembers(SEED_TEAM_MEMBERS));

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw) as unknown;
      if (!Array.isArray(parsed)) return;
      const normalized = parsed.map(normalizeMember).filter((v): v is TeamMember => Boolean(v));
      if (normalized.length) setItems(sortMembers(normalized));
    } catch {
      // ignore bad storage
    }
  }, []);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // ignore storage failures
    }
  }, [items]);

  const upsertTeamMember = useCallback((member: TeamMember) => {
    setItems((prev) => {
      const next = prev.filter((item) => item.id !== member.id);
      return sortMembers([...next, member]);
    });
  }, []);

  const removeTeamMember = useCallback((id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const resetToBaseline = useCallback(() => {
    setItems(sortMembers(SEED_TEAM_MEMBERS));
  }, []);

  const value = useMemo(
    () => ({
      items,
      upsertTeamMember,
      removeTeamMember,
      resetToBaseline,
    }),
    [items, upsertTeamMember, removeTeamMember, resetToBaseline],
  );

  return <AdminTeamContext.Provider value={value}>{children}</AdminTeamContext.Provider>;
}

export function useAdminTeamMembers() {
  const ctx = useContext(AdminTeamContext);
  if (!ctx) {
    throw new Error("useAdminTeamMembers must be used within AdminTeamProvider");
  }
  return ctx;
}
