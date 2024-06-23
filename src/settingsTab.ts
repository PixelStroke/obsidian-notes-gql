import { App, PluginSettingTab, Setting, Notice } from 'obsidian';
import ObsidianNoteApi from './main';

export class ObsidianNoteApiSettingTab extends PluginSettingTab {
  plugin: ObsidianNoteApi;

  constructor(app: App, plugin: ObsidianNoteApi) {
    super(app, plugin);
    this.plugin = plugin;
  }

  display(): void {
    const { containerEl } = this;

    containerEl.empty();

    containerEl.createEl('h2', { text: 'Obsidian Note API Settings' });

    new Setting(containerEl)
      .setName('Server Port')
      .setDesc('The port on which the API server will run.')
      .addText(text => text
        .setPlaceholder('Enter port number')
        .setValue(this.plugin.settings.port.toString())
        .onChange(async (value) => {
          const port = parseInt(value);
          if (isNaN(port) || port <= 0) {
            // Notify the user if the entered port is invalid
            new Notice('Invalid port number. Defaulting to 7075.');
            this.plugin.settings.port = 7075;
          } else {
            this.plugin.settings.port = port;
          }
          await this.plugin.saveSettings();
        }));

    // Add the Restart Server button
    new Setting(containerEl)
      .setName('Restart Server')
      .setDesc('Restart the GraphQL server.')
      .addButton(button => button
        .setButtonText('Restart')
        .setCta()
        .onClick(async () => {
          await this.plugin.restartServer();
          new Notice('GraphQL server restarted.');
        }));
  }
}
