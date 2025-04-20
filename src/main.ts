import { App, MarkdownView, Plugin, PluginSettingTab, Setting } from "obsidian";  // 导入Obsidian API中的必要组件
import { DEFAULT_SETTINGS, format, IPanGuSetting } from "./util";  // 导入工具函数、默认设置和类型定义

// Pangu插件类
export default class Pangu extends Plugin {
  settings: IPanGuSetting = DEFAULT_SETTINGS;  // 初始化插件设置，使用默认值

  // 格式化编辑器中的内容
  format(cm: CodeMirror.Editor): void {
    let cursor = cm.getCursor();  // 获取当前编辑器中光标的位置
    let cursorContent = cm.getRange({ ...cursor, ch: 0 }, cursor);  // 获取光标之前的内容
    const { top } = cm.getScrollInfo();  // 保存当前的滚动位置

    cursorContent = format(cursorContent, this.settings);  // 格式化光标之前的内容
    let content = cm.getValue().trim();  // 获取编辑器中的所有内容并去除两端空格
    content = format(content, this.settings);  // 格式化整个文档内容

    cm.setValue(content);  // 将格式化后的内容设置回编辑器
    cm.scrollTo(null, top);  // 恢复滚动位置

    // 保持光标格式化后不变
    const newDocLine = cm.getLine(cursor.line);  // 获取格式化后的行内容
    try {
      cursor = {
        ...cursor,
        ch: newDocLine.indexOf(cursorContent) + cursorContent.length,  // 根据新行的内容调整光标位置
      };
    } catch (error) {}

    cm.setCursor(cursor);  // 设置光标回到新的位置
  }

  // 插件加载时的初始化操作
  async onload() {
    this.addCommand({
      id: "pangu-format",  // 命令ID
      name: "为中英文字符间自动加入空格",  // 命令名称
      callback: () => {
        const activeLeafView =
          this.app.workspace.getActiveViewOfType(MarkdownView);  // 获取当前活动的Markdown视图
        if (activeLeafView) {
          // @ts-ignore
          this.format(activeLeafView?.sourceMode?.cmEditor);  // 格式化活动视图中的内容
        }
      },
      hotkeys: [
        {
          modifiers: ["Mod", "Shift"],  // Mac上的快捷键
          key: "s",
        },
        {
          modifiers: ["Ctrl", "Shift"],  // Windows上的快捷键
          key: "s",
        },
      ],
    });
    await this.loadSettings();  // 加载插件的设置
    this.addSettingTab(new PanguSettingTab(this.app, this));  // 添加设置标签页
  }

  // 插件卸载时的清理操作
  onunload() {
    console.log("unloading plugin");  // 插件卸载时打印日志
  }

  // 从存储中加载插件设置
  async loadSettings() {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());  // 合并默认设置和存储中的设置
  }

  // 将插件设置保存到存储中
  async saveSettings() {
    await this.saveData(this.settings);  // 将当前设置保存到Obsidian的存储中
  }
}

// Pangu设置标签页类，用于管理插件设置界面的显示
class PanguSettingTab extends PluginSettingTab {
  plugin: Pangu;  // 插件实例的引用

  // 构造函数，初始化设置标签页
  constructor(app: App, plugin: Pangu) {
    super(app, plugin);
    this.plugin = plugin;
  }

  // 在设置标签页中显示UI元素
  display(): void {
    let { containerEl } = this;
    containerEl.empty();  // 清空容器元素
    containerEl.createEl("h2", { text: "Pangu 使用说明" });  // 创建一个标题，显示为“Pangu 使用说明”

    // 创建一个“快速开始”设置项，展示快捷键说明
    new Setting(containerEl)
      .setName("快速开始")  // 设置名称
      .setDesc(
        "默认快捷键为:Mac - Command + Shift + S，Windows -  Shift + Ctrl + S。当然，您可以到「设置 - 快捷键」里进行更改。"  // 描述文字，说明默认快捷键
      );

    // 创建一个设置项用于调整缩进宽度
    new Setting(containerEl)
      .setName("缩进宽度")  // 设置名称
      .setDesc("指定格式化时，缩进所占空格数")  // 描述文字，说明调整缩进宽度
      .addDropdown((dropdown) => {
        dropdown
          .addOption("2", "2个空格")  // 提供“2个空格”的选项
          .addOption("4", "4个空格")  // 提供“4个空格”的选项
          .setValue(this.plugin.settings.tabWidth)  // 设置下拉框的默认值为当前设置的值
          .onChange(async (value) => {
            this.plugin.settings.tabWidth = value;  // 更新设置中的缩进宽度
            await this.plugin.saveSettings();  // 保存更新后的设置
          });
      });

    // 创建一个设置项用于控制是否格式化内嵌代码
    new Setting(containerEl)
      .setName("格式化内嵌代码")  // 设置名称
      .setDesc("指定格式化时，是否格式化文档中的内嵌代码")  // 描述文字，说明是否格式化内嵌代码
      .addToggle((toggle) =>
        toggle
          .setValue(this.plugin.settings.embeddedLanguageFormatting)  // 设置切换开关的默认值为当前设置的值
          .onChange(async (value) => {
            this.plugin.settings.embeddedLanguageFormatting = value;  // 更新设置中的内嵌代码格式化选项
            await this.plugin.saveSettings();  // 保存更新后的设置
          })
      );
  }
}

