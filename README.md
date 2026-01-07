# Line AI Chatbot 生活智慧小幫手 - 你的鏈鋸人 Chainsaw Man

![Next.js](https://img.shields.io/badge/Next.js-16.0-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green)
![LINE API](https://img.shields.io/badge/LINE-Messaging_API-00C300)
![Gemini](https://img.shields.io/badge/AI-Google_Gemini-8E75B2)

------------------------------------------------------------------------

#  🔗 快速查看：
*  Line Link : https://lin.ee/bsv1TCv
*  Line ID : @467vmfum
*  Vercel 後台顯示 : https://wp1141-eight-brown.vercel.app

------------------------------------------------------------------------


# 📖 專案簡介

這是一個整合 **LINE Messaging API** 與 **Google Gemini AI** 的智慧聊天機器人系統。專案目標是打造一位名為「生活小幫手」的 AI 助理，能透過 LINE 與使用者進行自然對話，提供生活建議、情感支持與實用資訊。

系統採用 **Webhook** 架構接收訊息，透過 **Gemini LLM** 生成結構化回應（包含標題、摘要、建議事項），並以 **LINE Flex Message** 與 **Quick Reply** 呈現豐富的互動介面。所有對話紀錄皆持久化儲存於 **MongoDB**，並提供一個 Web 管理後台供管理員檢視。

------------------------------------------------------------------------

# ✨ 核心功能

### 🤖 AI 智慧對話
*   **角色設定**：「生活小幫手」，語氣溫暖、實用導向。
*   **上下文記憶**：系統會讀取該使用者的歷史對話，讓 AI 理解前後文，提供連貫回應。
*   **結構化回應**：AI 輸出不再只是純文字，而是包含標題、重點摘要、條列式建議的精美排版。
*   **互動式引導**：AI 會根據回應內容，自動生成 **Quick Reply (快捷按鍵)**，引導使用者進行下一步互動。

### 📨 LINE 整合
*   **Webhook 處理**：即時接收 LINE 文字訊息事件。
*   **簽章驗證**：嚴格驗證 `x-line-signature`，確保安全性。
*   **Flex Message**：將 AI 的結構化回應轉換為 LINE 的卡片式訊息，提升閱讀體驗。
*   **錯誤降級**：當 AI 服務異常時，自動降級為基礎錯誤提示，確保不「已讀不回」。

### 📊 資料管理與後台
*   **MongoDB 儲存**：完整保存使用者 ID、對話內容、時間戳與平台資訊。
*   **管理後台**：
    *   即時即時監控所有進行中的對話。
    *   查看詳細對話歷史。
    *   支援搜尋與篩選功能（依狀態、關鍵字）。
   
------------------------------------------------------------------------

# 🛠️ 技術架構

*   **Framework**: Next.js 15+ (App Router)
*   **Language**: TypeScript
*   **Database**: MongoDB Atlas (Mongoose ODM)
*   **AI Model**: Google Gemini (`gemini-2.5-flash`)
*   **Messaging**: LINE Messaging API SDK
*   **Styling**: Tailwind CSS
*   **Deployment**: Vercel

------------------------------------------------------------------------

# 🚀 快速開始

### 1. 環境變數設定

在專案根目錄建立 `.env.local` 檔案，並填入以下變數：

```bash
# LINE Bot 設定
LINE_CHANNEL_ACCESS_TOKEN="你的 Channel Access Token"
LINE_CHANNEL_SECRET="你的 Channel Secret"

# MongoDB 設定
MONGODB_URI="mongodb+srv://<username>:<password>@cluster.mongodb.net/linechatbot?retryWrites=true&w=majority"

# Gemini AI 設定
GEMINI_API_KEY="你的 Google Gemini API Key"
LLM_MODEL_NAME="gemini-2.5-flash"
```

### 2. 安裝依賴

```bash
npm install
```

### 3. 啟動本地開發伺服器

```bash
npm run dev
```

伺服器將運行於 `http://localhost:3000`。

### 4. 本地測試 Webhook (使用 ngrok)

由於 LINE 需要公開的 HTTPS URL，本地開發時建議使用 ngrok：

```bash
ngrok http 3000
```

將 ngrok 產生的 URL (例如 `https://xxxx.ngrok-free.app/api/webhook`) 填入 LINE Developers Console 的 Webhook URL 欄位。


------------------------------------------------------------------------


# 📂 專案結構

```
src/
├── app/
│   ├── api/
│   │   ├── webhook/         # LINE Webhook 入口點
│   │   └── conversations/   # 管理後台 API
│   └── page.tsx             # 管理後台 UI
├── lib/
│   ├── clients/             # 外部服務客戶端 (LINE, Gemini)
│   ├── db/                  # 資料庫連線與 Model Schema
│   ├── repositories/        # 資料存取層 (DAO)
│   └── services/            # 核心業務邏輯 (ChatService)
└── ...
```

------------------------------------------------------------------------


# 🔗 API 端點說明

### `POST /api/webhook`
*   **用途**：接收 LINE 平台發送的 Webhook 事件。
*   **安全性**：驗證 `x-line-signature` 表頭。
*   **處理流程**：驗證 -> 儲存使用者訊息 -> 呼叫 Gemini -> 儲存 AI 回應 -> 回覆 LINE 訊息。

### `GET /api/conversations`
*   **用途**：獲取對話列表（管理後台用）。
*   **參數**：
    *   `status`: `active` | `closed` (篩選狀態)
    *   `search`: 搜尋關鍵字 (Topic 或 UserID)

### `GET /api/conversations/[id]`
*   **用途**：獲取單一對話的完整歷史訊息。

------------------------------------------------------------------------

# 📝 開發者注意事項

1.  **LINE Auto-reply**：請務必在 LINE Official Account Manager 中**關閉**「自動回應訊息」，否則 Webhook 不會生效。
2.  **Vercel Deployment**：部署到 Vercel 時，請確保在 Project Settings 中設定所有環境變數。
3.  **MongoDB Connection**：請確保 MongoDB Atlas 的 Network Access 允許 Vercel 的 IP (或是設定為 `0.0.0.0/0`)。
