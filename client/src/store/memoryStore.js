import { create } from 'zustand'

const EMPTY_FOLDERS = () => ({
  my_pov: { text: '', comment: '', photos: [] },
  peeps: { text: '', comment: '', photos: [] },
  moments: { text: '', comment: '', photos: [] },
  triptrip: { text: '', comment: '', photos: [] },
  mood: { text: '', comment: '', photos: [] },
  challenges: { text: '', comment: '', photos: [] },
})

const useMemoryStore = create((set) => ({
  // active wraps keyed by year
  wraps: {
    2024: EMPTY_FOLDERS(),
    2023: EMPTY_FOLDERS(),
    2022: EMPTY_FOLDERS(),
    2021: EMPTY_FOLDERS(),
  },

  // deleted wraps: [{ year, folders, deletedAt }]
  deletedWraps: [],

  updateFolder: (year, name, data) =>
    set((state) => ({
      wraps: {
        ...state.wraps,
        [year]: { ...state.wraps[year], [name]: data },
      },
    })),

  renameFolder: (year, oldName, newName) =>
    set((state) => {
      const yearFolders = { ...state.wraps[year] }
      if (!yearFolders[oldName] || oldName === newName) return state
      yearFolders[newName] = yearFolders[oldName]
      delete yearFolders[oldName]
      return { wraps: { ...state.wraps, [year]: yearFolders } }
    }),

  deleteWrap: (year) =>
    set((state) => {
      const folders = state.wraps[year]
      const remaining = { ...state.wraps }
      delete remaining[year]
      return {
        wraps: remaining,
        deletedWraps: [
          { year, folders, deletedAt: new Date().toISOString() },
          ...state.deletedWraps,
        ],
      }
    }),

  restoreWrap: (year) =>
    set((state) => {
      const entry = state.deletedWraps.find((d) => d.year === year)
      if (!entry) return state
      return {
        wraps: { ...state.wraps, [year]: entry.folders },
        deletedWraps: state.deletedWraps.filter((d) => d.year !== year),
      }
    }),

  permanentlyDelete: (year) =>
    set((state) => ({
      deletedWraps: state.deletedWraps.filter((d) => d.year !== year),
    })),
}))

export default useMemoryStore
