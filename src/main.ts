import { Plugin } from 'obsidian';
import { DEFAULT_SETTINGS, ObsidianNoteApiSettings, loadSettings, saveSettings } from './settings';
import { ObsidianNoteApiSettingTab } from './settingsTab';
import { startHttpServer } from './server';

export default class ObsidianNoteApi extends Plugin {
  settings: ObsidianNoteApiSettings = DEFAULT_SETTINGS;
  server: any;

  async onload() {
    this.settings = await loadSettings(this);
    this.addSettingTab(new ObsidianNoteApiSettingTab(this.app, this));
    await this.startHttpServer();
  }

  onunload() {
    if (this.server) {
      this.server.close();
    }
  }

  async saveSettings() {
    await saveSettings(this, this.settings);
  }

  async startHttpServer() {
    if (this.server) {
      this.server.close();
    }
    await startHttpServer(this, this.settings);
  }

  async restartServer() {
    await this.startHttpServer();
  }
}
