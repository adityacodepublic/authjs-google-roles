import {create} from 'zustand';

interface AppState {
  data: any;
  setData: (newData: any) => void;
  clearData: () => void;
}

const useFormState = create<AppState>((set) => ({
  data: null,
  setData: (newData: any) => set({ data: newData }),
  clearData: () => set({ data: null }),
}));

export default useFormState;
