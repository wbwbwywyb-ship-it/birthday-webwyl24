
# 🎂 24岁生日 WebGL 互动感官网页

一个基于 Three.js 和 MediaPipe 手势识别的互动网页应用。

## 🛠 如何使用 GitHub 上传代码 (小白指南)

如果你想通过 Cloudflare 或 Zeabur 部署，请按以下步骤操作：

1. **注册账号**：前往 [GitHub.com](https://github.com/) 注册。
2. **新建仓库**：点击右上角 `+` -> `New repository` -> 填入项目名 `my-birthday-webgl` -> 点击 `Create`。
3. **上传文件**：
   - 在新仓库页面点击 `uploading an existing file`。
   - 将本项目文件夹内的所有文件（`index.html`, `App.tsx`, `store.ts` 等）直接拖入网页。
   - 点击最下方的绿按钮 `Commit changes`。
4. **去部署**：前往 [Zeabur](https://zeabur.com/) 或 [Cloudflare Pages](https://dash.cloudflare.com/)，连接你刚创建的这个 GitHub 仓库即可。

## 🎮 互动指令
- **OPEN PALM (五指张开)**: 
  - 在“蛋糕形态”下：触发**爆炸效果**。
  - 在“星云形态”下：使星云**快速旋转**以便浏览照片。
- **CLOSED FIST (用力握拳)**: 
  - 在“星云形态”下：触发**引力收缩**，变回蛋糕。
- **点击照片**: 相机会自动对焦到该照片。
- **添加记忆**: 点击右下角按钮上传本地照片。

## ✨ 技术细节
- **智能适配**: 照片墙会自动检测你的照片是横版还是竖版。如果是横版照片，拍立得相框会自动旋转 90 度。
- **粒子系统**: 5000 个动态粒子，根据状态在圆台体（蛋糕）和环形带（星云）之间丝滑切换。
- **视觉特效**: 包含 Bloom（辉光）、Vignette（晕影）和 Noise（胶片噪声）后期效果。

## ⚠️ 隐私说明
本应用的手势识别完全在**浏览器本地**运行，不会上传任何视频流到服务器，请放心使用。
