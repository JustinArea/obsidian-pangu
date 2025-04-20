## Obsidian Pangu Plugin

一个 Obsidian 插件，旨在实现：当中文内容之间存在英文、数字、转义反引号、英文括号等符号时，中文内容和符号之间添加空格。

```diff
- 大多数人在20到30岁就已经过完自己的一生；一过了这个年龄段，他们就变成自己的影子。
+ 大多数人在 20 到 30 岁就已经过完自己的一生；一过了这个年龄段，他们就变成自己的影子。
```

## 手动安装

Download zip archive from [GitHub releases page](https://github.com/natumsol/obsidian-pangu/releases).
Extract the archive into `<vault>/.obsidian/plugins`.

Alternatively, using bash:

```bash
OBSIDIAN_VAULT_DIR=/path/to/your/obsidian/vault
mkdir -p $OBSIDIAN_VAULT_DIR/.obsidian/plugins
unzip ~/Downloads/obsidian-pangu_v1.1.0.zip -d $OBSIDIAN_VAULT_DIR/.obsidian/plugins
```

TODO
- [ ] 转义反引号
- [ ] 英文括号

### Thanks

感谢原作者 [Natumsol](https://github.com/Natumsol) 和 [Lvhaoyu](https://github.com/Lvhaoyu}。
Thanks to [pangu.vim](https://github.com/hotoo/pangu.vim), [writing4cn](https://marketplace.visualstudio.com/items?itemName=twocucao.writing4cn) and [pangu-markdown-vscode ](https://github.com/zhuyuanxiang/pangu-markdown-vscode)
