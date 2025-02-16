import { PartialState, SetState } from "zustand/vanilla";
import { ipcRenderer } from "electron";
import { EmusakEmulatorsKind, LS_KEYS } from "../../types";
import { IEmulatorConfig } from "./emulatorConfig.action";

export interface ITitleBar {
  version: string,
  getVersionAction: () => PartialState<ITitleBar>;
  closeEmuSAKAction: () => never;
  maximizeEmuSAKAction: () => void;
  minimizeEmuSAKAction: () => void;
  currentEmu: EmusakEmulatorsKind;
}

const createTitleBarSlice = (set: SetState<ITitleBar & IEmulatorConfig>) => ({
  version: '',
  currentEmu: (localStorage.getItem(LS_KEYS.TAB) || 'ryu') as EmusakEmulatorsKind,
  getVersionAction: async () => {
    const version = await ipcRenderer.invoke('get-app-version');
    return set({ version });
  },
  closeEmuSAKAction: async () => {
    await ipcRenderer.invoke('title-bar-action', 'close');
  },
  minimizeEmuSAKAction: async () => {
    await ipcRenderer.invoke('title-bar-action', 'minimize');
  },
  maximizeEmuSAKAction: async () => {
    await ipcRenderer.invoke('title-bar-action', 'maximize');
  },
  switchEmuAction: (currentEmu: EmusakEmulatorsKind) => {
    localStorage.setItem(LS_KEYS.TAB, currentEmu);
    return set({ currentEmu, selectedConfig: null });
  }
});

export default createTitleBarSlice;
