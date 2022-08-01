# bink插件

- 启用插件

- 通过 Engine/Binaries/ThirdParty/Bink 

  转换所需要的视频文件为.bk2。

  ~~（一般选好文件一直点bink就可以）~~

- 禁用除BinkMedia插件之外的所有Movie Players插件

- 使用bink播放视频

  - 开场视频

    projecting>Movies

  - 非开场视频

    - 创建BinkMediaPlayer资产~~（在Miscellaneous下）~~

      并这是Source>File or URL

    - 选中BinkMediaPlayer资产右键创建Media Texture~~（纹理）~~

    - 选中MediaTexture资产右键创建 Meterial~~（材质）~~

      - 纹理使用
        - UMG中，添加image widget