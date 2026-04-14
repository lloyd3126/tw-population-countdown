# Taiwan Population Countdown

這個專案是一個使用 `Vite + React + TypeScript` 建立的前端專案，已補上本機開發、正式 build 與 GitHub Pages 部署所需設定。

## 專案結構

```text
.
├── .agents/
├── public/
├── src/
│   ├── app/
│   ├── components/
│   ├── features/
│   │   └── population/
│   │       ├── hooks/
│   │       └── utils/
│   └── styles/
├── index.html
├── package.json
├── tsconfig.json
└── vite.config.ts
```

各資料夾用途：

- `src/app`: App shell 與頁面組裝入口
- `src/components`: 可重用 React UI 元件
- `src/features/population`: 與人口倒數功能直接相關的 hooks、常數與工具函式
- `src/styles`: 全域樣式與版面配置
- `public`: 靜態資源

## 需要執行的指令

安裝依賴：

```bash
npm install
```

啟動本機開發環境：

```bash
npm run dev
```

產出生產版本：

```bash
npm run build
```

本機預覽 build 結果：

```bash
npm run preview
```

部署到 GitHub Pages：

```bash
npm run deploy
```

同步戶政司月人口摘要資料：

```bash
npm run sync:population
```

GitHub Actions 也可自動執行同步：

- workflow 名稱：`Sync Population Data`
- 觸發方式：手動執行或每日定時檢查
- 有資料變更時，會自動更新 `public/data/` 並 commit 回 repository

## Build 輸出位置

`npm run build` 之後，產物會輸出到：

```text
dist/
```

戶政司月摘要 JSON 會輸出到：

```text
public/data/
```

## GitHub Pages 部署方式

這個專案已安裝 `gh-pages`，並在 `package.json` 內加入部署腳本。

部署步驟：

1. 先將專案推到 GitHub repository。
2. 確認 repository 名稱是 `tw-population-countdown`。
3. 執行 `npm run deploy`，會先自動 build，再把 `dist/` 發佈到 `gh-pages` branch。
4. 到 GitHub repository 的 `Settings > Pages`。
5. 將來源設成 `Deploy from a branch`，branch 選 `gh-pages`，資料夾選 `/(root)`。

如果之後 GitHub repository 名稱改了，記得同步更新 [vite.config.ts](/Users/chenchungnien/code/tw-population-countdown/vite.config.ts) 裡的 `base` 設定。
