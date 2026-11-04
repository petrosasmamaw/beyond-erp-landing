import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export type DealStage = "PROSPECT" | "CONTACTED" | "PROPOSAL" | "NEGOTIATION" | "WON" | "LOST";

export interface Deal {
  id: string;
  title: string;
  company: string;
  contactPerson: string;
  phone: string;
  valueETB: number;
  stage: DealStage;
  sectorId: string;
  notes?: string;
  expectedCloseDate: string;
  createdAt: string;
}

export interface DealInteraction {
  id: string;
  dealId: string;
  date: string;
  type: "call" | "email" | "meeting" | "proposal";
  summary: string;
}

export interface CrmState {
  deals: Deal[];
  interactions: DealInteraction[];
  filterSectorId: string | null;
}

const INITIAL_DEALS: Deal[] = [
  {
    id: "deal-1",
    title: "Hospital EMR & Lab Equipment Supply",
    company: "Tikur Anbessa Specialized Hospital",
    contactPerson: "Dr. Biruk Tadesse",
    phone: "+251 911 234 567",
    valueETB: 850000,
    stage: "NEGOTIATION",
    sectorId: "healthcare",
    notes: "Tender evaluation complete; negotiating final maintenance SLA and training schedule.",
    expectedCloseDate: "2026-11-20",
    createdAt: "2026-10-15T09:00:00Z",
  },
  {
    id: "deal-2",
    title: "Mercato Wholesale Multi-Branch POS Integration",
    company: "Al-Baraka General Trading PLC",
    contactPerson: "Ato Mohammed Nur",
    phone: "+251 922 456 789",
    valueETB: 320000,
    stage: "PROPOSAL",
    sectorId: "retail-trading",
    notes: "Sent proposal for 8 POS lanes with Telebirr and CBE Birr instant QR integration.",
    expectedCloseDate: "2026-11-15",
    createdAt: "2026-10-20T10:30:00Z",
  },
  {
    id: "deal-3",
    title: "Oromia Specialty Coffee Export Outgrower Contract",
    company: "Bonga Coffee Growers Cooperative",
    contactPerson: "W/ro Aster Worku",
    phone: "+251 933 678 901",
    valueETB: 1450000,
    stage: "WON",
    sectorId: "agriculture",
    notes: "Contract signed! 120 Metric Tons of Grade 1 Yirgacheffe coffee beans.",
    expectedCloseDate: "2026-11-01",
    createdAt: "2026-09-10T08:15:00Z",
  },
  {
    id: "deal-4",
    title: "Bole Mixed-Use Building BOQ Steel & Cement",
    company: "Flintstone Engineering PLC",
    contactPerson: "Eng. Tsegaye Kebede",
    phone: "+251 911 890 123",
    valueETB: 2800000,
    stage: "CONTACTED",
    sectorId: "construction",
    notes: "Introductory meeting held; reviewing architectural drawings and BOQ schedule.",
    expectedCloseDate: "2026-12-05",
    createdAt: "2026-10-28T14:00:00Z",
  },
  {
    id: "deal-5",
    title: "Hawassa Garment Export ERP Implementation",
    company: "Indochine Apparel Ethiopia",
    contactPerson: "Mr. Chen / Tigist Mulugeta",
    phone: "+251 944 112 233",
    valueETB: 980000,
    stage: "PROSPECT",
    sectorId: "manufacturing",
    notes: "Initial inquiry received via trade exhibition; requesting demo for BOM costing.",
    expectedCloseDate: "2026-12-15",
    createdAt: "2026-11-01T11:45:00Z",
  },
  {
    id: "deal-6",
    title: "Addis Ababa Luxury Hotel Property PMS Overhaul",
    company: "Skylight Suites & Resort",
    contactPerson: "Yordanos Bekele",
    phone: "+251 912 345 678",
    valueETB: 640000,
    stage: "NEGOTIATION",
    sectorId: "hospitality",
    notes: "Final stage discussions on room service POS and Telebirr cashier integration.",
    expectedCloseDate: "2026-11-18",
    createdAt: "2026-10-05T16:20:00Z",
  },
  {
    id: "deal-7",
    title: "Djibouti Corridor Heavy Truck GPS & Fuel Sensors",
    company: "Trans-Africa Transport Freight",
    contactPerson: "Captain Hailu Desta",
    phone: "+251 911 556 677",
    valueETB: 720000,
    stage: "PROPOSAL",
    sectorId: "transport-logistics",
    notes: "Submitted quote for fleet management hardware and automated trip waybill software.",
    expectedCloseDate: "2026-11-25",
    createdAt: "2026-10-18T13:10:00Z",
  },
];

const INITIAL_INTERACTIONS: DealInteraction[] = [
  {
    id: "int-1",
    dealId: "deal-1",
    date: "2026-11-02",
    type: "meeting",
    summary: "Met with Medical Director and IT lead. Approved draft ERCA medical exemption flow.",
  },
  {
    id: "int-2",
    dealId: "deal-2",
    date: "2026-11-03",
    type: "call",
    summary: "Reviewed Telebirr QR speed requirements during peak Mercato Friday trading hours.",
  },
  {
    id: "int-3",
    dealId: "deal-3",
    date: "2026-11-01",
    type: "proposal",
    summary: "Final agreement counter-signed. 20% advance received via CBE Birr transfer.",
  },
];

const initialState: CrmState = {
  deals: INITIAL_DEALS,
  interactions: INITIAL_INTERACTIONS,
  filterSectorId: null,
};

export const crmSlice = createSlice({
  name: "crm",
  initialState,
  reducers: {
    addDeal: (state, action: PayloadAction<Omit<Deal, "id" | "createdAt">>) => {
      const newDeal: Deal = {
        ...action.payload,
        id: `deal-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`,
        createdAt: new Date().toISOString(),
      };
      state.deals.unshift(newDeal);
    },
    updateDealStage: (
      state,
      action: PayloadAction<{ id: string; stage: DealStage }>
    ) => {
      const deal = state.deals.find((d) => d.id === action.payload.id);
      if (deal) {
        deal.stage = action.payload.stage;
      }
    },
    updateDeal: (state, action: PayloadAction<Partial<Deal> & { id: string }>) => {
      const idx = state.deals.findIndex((d) => d.id === action.payload.id);
      if (idx !== -1) {
        state.deals[idx] = { ...state.deals[idx], ...action.payload };
      }
    },
    deleteDeal: (state, action: PayloadAction<string>) => {
      state.deals = state.deals.filter((d) => d.id !== action.payload);
      state.interactions = state.interactions.filter((i) => i.dealId !== action.payload);
    },
    addInteraction: (
      state,
      action: PayloadAction<Omit<DealInteraction, "id">>
    ) => {
      const newInt: DealInteraction = {
        ...action.payload,
        id: `int-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`,
      };
      state.interactions.unshift(newInt);
    },
    setFilterSectorId: (state, action: PayloadAction<string | null>) => {
      state.filterSectorId = action.payload;
    },
  },
});

export const {
  addDeal,
  updateDealStage,
  updateDeal,
  deleteDeal,
  addInteraction,
  setFilterSectorId,
} = crmSlice.actions;

export default crmSlice.reducer;

