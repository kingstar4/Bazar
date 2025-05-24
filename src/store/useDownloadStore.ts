import { create } from 'zustand';
// import RNBackgroundDownloader from 'react-native-background-downloader';

interface DownloadTask {
  id: string;
  pause: () => void;
  resume: () => void;
  stop: () => void;
  begin: (callback: (expectedBytes: number) => void) => DownloadTask;
  progress: (callback: (percent: number) => void) => DownloadTask;
  done: (callback: () => void) => DownloadTask;
  error: (callback: (error: Error) => void) => DownloadTask;
}

interface DownloadState {
  tasks: Record<string, DownloadTask>;
  progress: Record<string, number>;

  addTask: (id: string, task: DownloadTask) => void;
  updateProgress: (id: string, percent: number) => void;
  pauseTask: (id: string) => void;
  resumeTask: (id: string) => void;
  cancelTask: (id: string) => void;
  clearAllDownloads: () => void;
}

export const useDownloadStore = create<DownloadState>((set, get) => ({
  tasks: {},
  progress: {},

  addTask: (id, task) => {
    set((state) => ({
      tasks: { ...state.tasks, [id]: task },
      progress: { ...state.progress, [id]: 0 },
    }));
  },

  updateProgress: (id, percent) => {
    set((state) => ({
      progress: { ...state.progress, [id]: percent },
    }));
  },

  pauseTask: (id) => {
    const task = get().tasks[id];
    task?.pause();
  },

  resumeTask: (id) => {
    const task = get().tasks[id];
    task?.resume();
  },

  cancelTask: (id) => {
    const task = get().tasks[id];
    task?.stop();
  },

  clearAllDownloads: () => {
    set({ tasks: {}, progress: {} });
  },
}));
