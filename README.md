# Fast Translate — Hot Reload Edition

[English](README.en.md) · 中文

GNOME Shell 翻译扩展，基于 [tazztone/translate-assistant](https://github.com/tazztone/translate-assistant) 修改。支持选中文本翻译、居中悬浮窗、顶栏翻译面板、系统字号和运行时热更新。

这是社区修改版，与上游项目独立维护。许可证为 MIT；作者与来源见 [CREDITS.md](CREDITS.md)。

## 功能与快捷键

| 操作 | 默认快捷键 | 内容来源 |
| --- | --- | --- |
| 悬浮翻译 | `Super+T` | Linux PRIMARY 主选区中的选中文字 |
| 打开顶栏面板并翻译 | `Alt+T` | 普通剪贴板 |
| 关闭悬浮窗 | `Esc` | — |

选中文字后可直接按 `Super+T`，无需复制。双击 `Ctrl+C` 不会触发翻译。系统或其他扩展可能占用相同按键，可在扩展设置中分别修改。

- 原文和译文独立滚动；内容溢出时自动显示滚动条。
- 顶栏面板使用系统字号；悬浮窗根据桌面的明暗模式选择颜色。
- 使用系统词典 symbolic 图标，可在设置中隐藏顶栏入口。
- 支持 Google Translate 和 DeepL；默认服务为 Google Translate。
- 悬浮翻译优先使用配置的目标语言；服务检测到原文已经是目标语言时，改为翻译成英语。
- 支持自动复制译文、面板自动粘贴和后台翻译模式。

## 环境

已在 Zorin OS / GNOME Shell 46 环境使用。安装元数据继承了上游的 GNOME Shell 45–50 声明；其他版本尚未逐一验证，不代表已完整测试。

需要 GNOME Shell、GJS、libsoup 3、GTK 4 / libadwaita（设置窗口），以及联网访问翻译服务。打包需要 Python 3 与 `glib-compile-schemas`（Ubuntu/Zorin 的 `libglib2.0-bin` 软件包提供）。

## 构建与安装

在仓库根目录执行：

```sh
python3 scripts/build.py
gnome-extensions install --force dist/fast-translate@tazztone.github.io.shell-extension.zip
gnome-extensions enable fast-translate@tazztone.github.io
```

首次安装或替换旧加载器后，Wayland 通常需要注销并重新登录。若 `enable` 提示扩展不存在，先注销再登录，然后重新启用。

本版保留上游 UUID `fast-translate@tazztone.github.io` 和设置 schema，以兼容已有设置；它会替换同 UUID 的上游安装，两者无法并存。替换前请自行备份原扩展。上游扩展商店的后续更新也可能覆盖此版本。

打开设置：

```sh
gnome-extensions prefs fast-translate@tazztone.github.io
```

设置页中可选择服务、目标语言、两个快捷键及“Show Top Panel Icon”。若想显示悬浮窗，请关闭“Floating Translation Background Mode”。

## 选中文本的限制

`Super+T` 通过 GNOME 的 PRIMARY 主选区读取选中文字，使用 `St.ClipboardType.PRIMARY` API。它与按 `Ctrl+C` 使用的普通剪贴板不同。应用必须支持主选区；部分 Wayland 应用、网页组件或 PDF 阅读器可能不提供该数据，主选区也可能保留上次选择。扩展不会自动回退读取普通剪贴板，也不会模拟复制操作。

## 隐私与服务

翻译需要把原文发送给所选服务：Google Translate 使用 `translate.googleapis.com`，DeepL 默认使用 `api-free.deepl.com/v2/translate`。Google 路径是免密钥的非官方接口，可能限流或随时变化；本仓库与 Google、DeepL 均无隶属关系。

DeepL 需要用户自行填写 API 密钥。密钥保存在用户的 GNOME GSettings/dconf 中；这不是专用密码保险库。仓库和安装包不含个人设置或 API 密钥。请勿在 Issue、日志或截图中公开密钥和私人原文。后台通知可能显示原文与译文；可在设置中关闭通知。

## 热更新与开发

`extension.js` 是稳定加载器，按文件名选择最新的 `runtime_YYYYMMDDHHMMSS.js`。当前源码只保留一个已使用的运行时，避免误加载历史版本。

运行时更新需要新增更晚时间戳的文件，并为 `GObject.registerClass` 使用全新的 `GTypeName`。复制到已安装扩展目录后，执行：

```sh
gnome-extensions disable fast-translate@tazztone.github.io
gnome-extensions enable fast-translate@tazztone.github.io
```

修改加载器或其静态导入的模块可能需要注销再登录；失败的同名 ES 模块也会被 Shell 缓存。新增设置键时先运行 `glib-compile-schemas schemas`，必要时注销后重试。

发布及验证说明见 [CONTRIBUTING.md](CONTRIBUTING.md)，版本说明见 [CHANGELOG.md](CHANGELOG.md)。
