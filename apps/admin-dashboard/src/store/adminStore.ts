import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { Bar, Event, Campaign, User, AdminStats } from '../types';

interface AdminState {
  // Data state
  bars: {
    items: Bar[];
    loading: boolean;
    error: string | null;
  };
  events: {
    items: Event[];
    loading: boolean;
    error: string | null;
  };
  campaigns: {
    items: Campaign[];
    loading: boolean;
    error: string | null;
  };
  users: {
    items: User[];
    loading: boolean;
    error: string | null;
  };
  stats: {
    data: AdminStats | null;
    loading: boolean;
    error: string | null;
  };

  // UI state
  ui: {
    selectedBarId: number | null;
    selectedEventId: number | null;
    selectedCampaignId: number | null;
    selectedUserId: string | null;
    showCreateModal: boolean;
    showEditModal: boolean;
    showDeleteModal: boolean;
  };

  // Actions
  // Bar actions
  setBars: (bars: Bar[]) => void;
  setBarsLoading: (loading: boolean) => void;
  setBarsError: (error: string | null) => void;
  addBar: (bar: Bar) => void;
  updateBar: (id: number, bar: Partial<Bar>) => void;
  deleteBar: (id: number) => void;

  // Event actions
  setEvents: (events: Event[]) => void;
  setEventsLoading: (loading: boolean) => void;
  setEventsError: (error: string | null) => void;
  addEvent: (event: Event) => void;
  updateEvent: (id: number, event: Partial<Event>) => void;
  deleteEvent: (id: number) => void;

  // Campaign actions
  setCampaigns: (campaigns: Campaign[]) => void;
  setCampaignsLoading: (loading: boolean) => void;
  setCampaignsError: (error: string | null) => void;
  addCampaign: (campaign: Campaign) => void;
  updateCampaign: (id: number, campaign: Partial<Campaign>) => void;
  deleteCampaign: (id: number) => void;

  // User actions
  setUsers: (users: User[]) => void;
  setUsersLoading: (loading: boolean) => void;
  setUsersError: (error: string | null) => void;
  updateUser: (id: string, user: Partial<User>) => void;
  deleteUser: (id: string) => void;

  // Stats actions
  setStats: (stats: AdminStats) => void;
  setStatsLoading: (loading: boolean) => void;
  setStatsError: (error: string | null) => void;

  // UI actions
  setSelectedBar: (id: number | null) => void;
  setSelectedEvent: (id: number | null) => void;
  setSelectedCampaign: (id: number | null) => void;
  setSelectedUser: (id: string | null) => void;
  setShowCreateModal: (show: boolean) => void;
  setShowEditModal: (show: boolean) => void;
  setShowDeleteModal: (show: boolean) => void;
}

export const useAdminStore = create<AdminState>()(
  immer((set, get) => ({
    // Initial state
    bars: {
      items: [],
      loading: false,
      error: null,
    },
    events: {
      items: [],
      loading: false,
      error: null,
    },
    campaigns: {
      items: [],
      loading: false,
      error: null,
    },
    users: {
      items: [],
      loading: false,
      error: null,
    },
    stats: {
      data: null,
      loading: false,
      error: null,
    },
    ui: {
      selectedBarId: null,
      selectedEventId: null,
      selectedCampaignId: null,
      selectedUserId: null,
      showCreateModal: false,
      showEditModal: false,
      showDeleteModal: false,
    },

    // Bar actions
    setBars: (bars) => set((state) => {
      state.bars.items = bars;
      state.bars.loading = false;
      state.bars.error = null;
    }),
    setBarsLoading: (loading) => set((state) => {
      state.bars.loading = loading;
    }),
    setBarsError: (error) => set((state) => {
      state.bars.error = error;
      state.bars.loading = false;
    }),
    addBar: (bar) => set((state) => {
      state.bars.items.push(bar);
    }),
    updateBar: (id, bar) => set((state) => {
      const index = state.bars.items.findIndex(b => b.id === id);
      if (index !== -1) {
        state.bars.items[index] = { ...state.bars.items[index], ...bar };
      }
    }),
    deleteBar: (id) => set((state) => {
      state.bars.items = state.bars.items.filter(b => b.id !== id);
    }),

    // Event actions
    setEvents: (events) => set((state) => {
      state.events.items = events;
      state.events.loading = false;
      state.events.error = null;
    }),
    setEventsLoading: (loading) => set((state) => {
      state.events.loading = loading;
    }),
    setEventsError: (error) => set((state) => {
      state.events.error = error;
      state.events.loading = false;
    }),
    addEvent: (event) => set((state) => {
      state.events.items.push(event);
    }),
    updateEvent: (id, event) => set((state) => {
      const index = state.events.items.findIndex(e => e.id === id);
      if (index !== -1) {
        state.events.items[index] = { ...state.events.items[index], ...event };
      }
    }),
    deleteEvent: (id) => set((state) => {
      state.events.items = state.events.items.filter(e => e.id !== id);
    }),

    // Campaign actions
    setCampaigns: (campaigns) => set((state) => {
      state.campaigns.items = campaigns;
      state.campaigns.loading = false;
      state.campaigns.error = null;
    }),
    setCampaignsLoading: (loading) => set((state) => {
      state.campaigns.loading = loading;
    }),
    setCampaignsError: (error) => set((state) => {
      state.campaigns.error = error;
      state.campaigns.loading = false;
    }),
    addCampaign: (campaign) => set((state) => {
      state.campaigns.items.push(campaign);
    }),
    updateCampaign: (id, campaign) => set((state) => {
      const index = state.campaigns.items.findIndex(c => c.id === id);
      if (index !== -1) {
        state.campaigns.items[index] = { ...state.campaigns.items[index], ...campaign };
      }
    }),
    deleteCampaign: (id) => set((state) => {
      state.campaigns.items = state.campaigns.items.filter(c => c.id !== id);
    }),

    // User actions
    setUsers: (users) => set((state) => {
      state.users.items = users;
      state.users.loading = false;
      state.users.error = null;
    }),
    setUsersLoading: (loading) => set((state) => {
      state.users.loading = loading;
    }),
    setUsersError: (error) => set((state) => {
      state.users.error = error;
      state.users.loading = false;
    }),
    updateUser: (id, user) => set((state) => {
      const index = state.users.items.findIndex(u => u.id === id);
      if (index !== -1) {
        state.users.items[index] = { ...state.users.items[index], ...user };
      }
    }),
    deleteUser: (id) => set((state) => {
      state.users.items = state.users.items.filter(u => u.id !== id);
    }),

    // Stats actions
    setStats: (stats) => set((state) => {
      state.stats.data = stats;
      state.stats.loading = false;
      state.stats.error = null;
    }),
    setStatsLoading: (loading) => set((state) => {
      state.stats.loading = loading;
    }),
    setStatsError: (error) => set((state) => {
      state.stats.error = error;
      state.stats.loading = false;
    }),

    // UI actions
    setSelectedBar: (id) => set((state) => {
      state.ui.selectedBarId = id;
    }),
    setSelectedEvent: (id) => set((state) => {
      state.ui.selectedEventId = id;
    }),
    setSelectedCampaign: (id) => set((state) => {
      state.ui.selectedCampaignId = id;
    }),
    setSelectedUser: (id) => set((state) => {
      state.ui.selectedUserId = id;
    }),
    setShowCreateModal: (show) => set((state) => {
      state.ui.showCreateModal = show;
    }),
    setShowEditModal: (show) => set((state) => {
      state.ui.showEditModal = show;
    }),
    setShowDeleteModal: (show) => set((state) => {
      state.ui.showDeleteModal = show;
    }),
  }))
);
