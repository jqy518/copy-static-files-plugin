### webpack插件copy-static-files-plugin
使用webpack中发现经常需要把生成的资源文件拷贝到其他项目中，并且需要改更一些文件的后缀如把`.html`的文件改为`.jsp`等；于是就写了这么个插件，可能适用范围并不广；但却可以减少些手工活，另外也顺便也学习下webpack插件开发。
#### 使用方法：
安装：
```bash
npm instal copy-static-files-plugin

```
使用：
```javascript
const CopyStaticFilesPlugin = require('copy-static-files-plugin');

...
plugins:[
  new CopyStaticFilesPlugin([
    { type:'js', to: 'E:\\testObject\\static' },
    { type:'css', to: 'E:\\testObject\\static' },
    { type:'html', to: 'E:\\testObject\\page',totype:'jsp' }
    ]);
]
...
```
options说明：
>`type`:对应生成资源的后缀；
`to`:要复制到的文件夹;
`totype`：更改后缀(目前jsp会加入特定申明，其他则单纯的复制改变后缀);
