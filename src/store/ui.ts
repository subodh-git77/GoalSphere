import { create } from 'zustand';
type UIState={sidebar:boolean; toggle:()=>void};
export const useUI=create<UIState>((set)=>({sidebar:true,toggle:()=>set(s=>({sidebar:!s.sidebar}))}));
