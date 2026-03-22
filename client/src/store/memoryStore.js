import { create } from 'zustand'

const useMemoryStore = create((set) => ({
  memories: [],
  setMemories: (memories) => set({ memories }),
  addMemory: (memory) => set((state) => ({ memories: [...state.memories, memory] })),
  updateMemory: (id, updates) => set((state) => ({
    memories: state.memories.map(m => m._id === id ? { ...m, ...updates } : m)
  })),
  deleteMemory: (id) => set((state) => ({
    memories: state.memories.filter(m => m._id !== id)
  }))
}))

export default useMemoryStore
