import { Plugin } from 'obsidian';

export interface ObsidianNoteApiSettings {
  port: number;
  languages: string[];
}

// Add more default settings here if implementing new features
export const DEFAULT_SETTINGS: ObsidianNoteApiSettings = {
  port: 7075,
  languages: [],
};

/**
 * Loads the settings from the plugin data.
 * @param plugin 
 * @returns 
 */
export async function loadSettings(plugin: Plugin): Promise<ObsidianNoteApiSettings> {
  const loadedData = await plugin.loadData();
  return Object.assign({}, DEFAULT_SETTINGS, loadedData);
}

/**
 * Saves the settings to the plugin data.
 * @param plugin 
 * @param settings 
 */
export async function saveSettings(plugin: Plugin, settings: ObsidianNoteApiSettings): Promise<void> {
  await plugin.saveData(settings);
}
