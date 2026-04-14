# 中華民國人口數

這個專案是一個使用 `Vite + React + TypeScript` 建立的前端專案，提供中華民國人口數首頁展示，並已補上本機開發、正式 build、GitHub Pages 部署與 GitHub Actions 自動同步流程。

線上網站：

```text
https://lloyd3126.github.io/zhonghua-minguo-population/
```

說明：GitHub repository slug 仍需使用 ASCII，因此目前 repository 名稱採用 `zhonghua-minguo-population`，頁面標題與內容維持繁體中文的「中華民國人口數」。

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
- 排程時間：每日台灣時間約 10:15
- 有資料變更時，會自動更新 `public/data/`、commit 回 repository，並重新 build 後發佈到 `gh-pages` branch
- 若手動執行 workflow，就算資料沒有變動，也會重新 build 並部署目前版本
- workflow 使用 `actions/checkout@v6` 與 `actions/setup-node@v6`，搭配 Node.js 24 執行環境

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
2. 確認 repository 名稱是 `zhonghua-minguo-population`。
3. 執行 `npm run deploy`，會先自動 build，再把 `dist/` 發佈到 `gh-pages` branch。
4. 到 GitHub repository 的 `Settings > Pages`。
5. 將來源設成 `Deploy from a branch`，branch 選 `gh-pages`，資料夾選 `/(root)`。

如果已啟用 `Sync Population Data` workflow，之後每日同步到新資料時也會自動重新部署，不需要再手動執行 `npm run deploy`。

## 已驗證的部署狀態

- `main` 本地 `npm run build` 產出的 `dist/index.html`、`dist/assets/index-BosvEu0P.css`、`dist/assets/index-C1H4IZBK.js` 已和 `gh-pages` 分支及公開站點內容比對一致
- 公開站點目前由 `gh-pages` branch 提供，Pages 設定來源為 `gh-pages` 的 `/(root)`
- 公開站點也可直接讀到 `data/latest-summary.json` 與 `data/monthly-summary.json`

如果之後 GitHub repository 名稱改了，記得同步更新 [vite.config.ts](/Users/chenchungnien/code/tw-population-countdown/vite.config.ts) 裡的 `base` 設定。
