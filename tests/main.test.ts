import ObsidianNoteApi from '../src/main';
import { App, PluginManifest } from 'obsidian';

// Mock dependencies
jest.mock('../src/settings', () => ({
  loadSettings: jest.fn().mockResolvedValue({ port: 7075 }),
  saveSettings: jest.fn(),
}));
jest.mock('../src/settingsTab');
jest.mock('../src/server', () => ({
  startHttpServer: jest.fn(),
}));

describe('ObsidianNoteApi', () => {
  let plugin: ObsidianNoteApi;
  let app: App;
  let manifest: PluginManifest;

  beforeEach(() => {
    app = {} as App;
    manifest = {} as PluginManifest;
    plugin = new ObsidianNoteApi(app, manifest);
  });

  test('should load settings on load', async () => {
    expect.assertions(1);

    await plugin.onload();
    expect(plugin.settings).toEqual({ port: 7075 });
  });

  test('should add setting tab on load', async () => {
    expect.assertions(1);

    const addSettingTabSpy = jest.spyOn(plugin, 'addSettingTab');

    await plugin.onload();
    expect(addSettingTabSpy).toHaveBeenCalledTimes(1);
  });

  test('should start HTTP server on load', async () => {
    expect.assertions(1);

    const startHttpServer = require('../src/server').startHttpServer;

    await plugin.onload();
    expect(startHttpServer).toHaveBeenCalledWith(plugin, { port: 7075 });
  });

  test('should close server on unload', async () => {
    expect.assertions(1);
    
    plugin.server = {
      close: jest.fn(),
    };

    plugin.onunload();
    expect(plugin.server.close).toHaveBeenCalledTimes(1);
  });

  test('should save settings', async () => {
    expect.assertions(1);

    const saveSettings = require('../src/settings').saveSettings;
    plugin.settings = { port: 7075, languages: [] };

    await plugin.saveSettings();
    expect(saveSettings).toHaveBeenCalledWith(plugin, { port: 7075, languages: [] });
  });

  test('should restart server', async () => {
    expect.assertions(2);

    const startHttpServer = require('../src/server').startHttpServer;
    const closeSpy = jest.fn();

    plugin.server = { close: closeSpy };
    plugin.settings = { port: 7075, languages: [] };

    await plugin.restartServer();
    expect(closeSpy).toHaveBeenCalledTimes(1);
    expect(startHttpServer).toHaveBeenCalledWith(plugin, { port: 7075, languages: []  });
  });
});
