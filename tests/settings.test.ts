import { Plugin } from 'obsidian';
import { ObsidianNoteApiSettings, DEFAULT_SETTINGS, loadSettings, saveSettings } from '../src/settings';

describe('Settings', () => {
  let plugin: Plugin;

  beforeEach(() => {
    // Mock Plugin instance
    plugin = {
      loadData: jest.fn(),
      saveData: jest.fn(),
    } as unknown as Plugin;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should load settings with defaults', async () => {
    (plugin.loadData as jest.Mock).mockResolvedValue({});

    const settings = await loadSettings(plugin);

    expect(plugin.loadData).toHaveBeenCalled();
    expect(settings).toEqual(DEFAULT_SETTINGS);
  });

  test('should load settings and override defaults', async () => {
    const customSettings: Partial<ObsidianNoteApiSettings> = { port: 8080 };
    (plugin.loadData as jest.Mock).mockResolvedValue(customSettings);

    const settings = await loadSettings(plugin);

    expect(plugin.loadData).toHaveBeenCalled();
    expect(settings).toEqual({ ...DEFAULT_SETTINGS, ...customSettings });
  });

  test('should save settings', async () => {
    const settings: ObsidianNoteApiSettings = { port: 8080, languages: [] };

    await saveSettings(plugin, settings);

    expect(plugin.saveData).toHaveBeenCalledWith(settings);
  });
});
