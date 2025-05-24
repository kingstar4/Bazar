// src/types/react-native-background-downloader.d.ts

declare module 'react-native-background-downloader' {
  export interface Dirs {
    documents: string;
    downloads: string;
  }

  export interface DownloadTask {
    begin: (callback: (expectedBytes: number) => void) => DownloadTask;
    progress: (callback: (percent: number) => void) => DownloadTask;
    done: (callback: () => void) => DownloadTask;
    error: (callback: (error: any) => void) => DownloadTask;
  }

  export interface RNBackgroundDownloader {
    directories: {
      dirs: Dirs;
    };
    download: (config: {
      id: string;
      url: string;
      destination: string;
    }) => DownloadTask;
  }

  const RNBackgroundDownloader: RNBackgroundDownloader;
  export default RNBackgroundDownloader;
};