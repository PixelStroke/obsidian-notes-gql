export class Plugin {
    app: any;
    manifest: any;
    server?: any;
  
    constructor(app: any, manifest: any) {
      this.app = app;
      this.manifest = manifest;
    }
  
    addSettingTab(tab: any) {}
  }
  
  export class PluginSettingTab {
    constructor(app: any, plugin: any) {}
    display() {}
  }
  
  export class Setting {
    constructor(containerEl: HTMLElement) {}
    setName(name: string) { return this; }
    setDesc(desc: string) { return this; }
    addText(callback: (text: any) => void) { return this; }
    addButton(callback: (button: any) => void) { return this; }
  }
  
  export class Notice {
    constructor(message: string) {
      console.log(message);
    }
  }
  