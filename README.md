# Line AI Chatbot 生活智慧小幫手 - 你的鏈鋸人 Chainsaw Man

**Line AI Chatbot - Your Life Assistant**

![Next.js](https://img.shields.io/badge/Next.js-16.0-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green)
![LINE API](https://img.shields.io/badge/LINE-Messaging_API-00C300)
![Gemini](https://img.shields.io/badge/AI-Google_Gemini-8E75B2)

------------------------------------------------------------------------

# 🔗 快速查看 / Quick Links

*  Line Link : https://lin.ee/bsv1TCv
*  Line ID : @467vmfum
*  Vercel 後台顯示 : https://wp1141-eight-brown.vercel.app

------------------------------------------------------------------------

# 📖 專案簡介 / Project Introduction

這是一個整合 **LINE Messaging API** 與 **Google Gemini AI** 的智慧聊天機器人系統。專案目標是打造一位名為「生活小幫手」的 AI 助理，能透過 LINE 與使用者進行自然對話，提供生活建議、情感支持與實用資訊。

系統採用 **Webhook** 架構接收訊息，透過 **Gemini LLM** 生成結構化回應（包含標題、摘要、建議事項），並以 **LINE Flex Message** 與 **Quick Reply** 呈現豐富的互動介面。所有對話紀錄皆持久化儲存於 **MongoDB**，並提供一個 Web 管理後台供管理員檢視。

**English:** This is an intelligent chatbot system that integrates **LINE Messaging API** with **Google Gemini AI**. The project aims to create an AI assistant named "Life Assistant" that can engage in natural conversations with users through LINE, providing life advice, emotional support, and practical information.

The system uses a **Webhook** architecture to receive messages, generates structured responses (including titles, summaries, and suggestions) through **Gemini LLM**, and presents rich interactive interfaces using **LINE Flex Message** and **Quick Reply**. All conversation records are persistently stored in **MongoDB**, and a web management dashboard is provided for administrators to view.

------------------------------------------------------------------------

# ✨ 核心功能 / Core Features

### 🤖 AI 智慧對話 / AI Intelligent Conversation

*   **角色設定**：「生活小幫手」，語氣溫暖、實用導向。
    **English:** **Character Setting**: "Life Assistant" with a warm tone and practical orientation.

*   **上下文記憶**：系統會讀取該使用者的歷史對話，讓 AI 理解前後文，提供連貫回應。
    **English:** **Context Memory**: The system reads the user's conversation history, allowing the AI to understand context and provide coherent responses.

*   **結構化回應**：AI 輸出不再只是純文字，而是包含標題、重點摘要、條列式建議的精美排版。
    **English:** **Structured Responses**: AI output is no longer just plain text, but includes beautifully formatted titles, key summaries, and bullet-point suggestions.

*   **互動式引導**：AI 會根據回應內容，自動生成 **Quick Reply (快捷按鍵)**，引導使用者進行下一步互動。
    **English:** **Interactive Guidance**: The AI automatically generates **Quick Reply** buttons based on response content to guide users for the next interaction.

### 📨 LINE 整合 / LINE Integration

*   **Webhook 處理**：即時接收 LINE 文字訊息事件。
    **English:** **Webhook Processing**: Real-time reception of LINE text message events.

*   **簽章驗證**：嚴格驗證 `x-line-signature`，確保安全性。
    **English:** **Signature Verification**: Strict verification of `x-line-signature` to ensure security.

*   **Flex Message**：將 AI 的結構化回應轉換為 LINE 的卡片式訊息，提升閱讀體驗。
    **English:** **Flex Message**: Converts AI's structured responses into LINE card-style messages to enhance reading experience.

*   **錯誤降級**：當 AI 服務異常時，自動降級為基礎錯誤提示，確保不「已讀不回」。
    **English:** **Error Degradation**: When AI service is abnormal, automatically degrades to basic error prompts to ensure no "read but no reply" situations.

### 📊 資料管理與後台 / Data Management & Dashboard

*   **MongoDB 儲存**：完整保存使用者 ID、對話內容、時間戳與平台資訊。
    **English:** **MongoDB Storage**: Complete storage of user IDs, conversation content, timestamps, and platform information.

*   **管理後台**：
    *   即時監控所有進行中的對話。
    *   查看詳細對話歷史。
    *   支援搜尋與篩選功能（依狀態、關鍵字）。
    
    **English:** **Management Dashboard**:
    *   Real-time monitoring of all ongoing conversations.
    *   View detailed conversation history.
    *   Support search and filter functions (by status, keywords).

------------------------------------------------------------------------

# 🛠️ 技術架構 / Tech Stack

*   **Framework**: Next.js 15+ (App Router)
*   **Language**: TypeScript
*   **Database**: MongoDB Atlas (Mongoose ODM)
*   **AI Model**: Google Gemini (`gemini-2.5-flash`)
*   **Messaging**: LINE Messaging API SDK
*   **Styling**: Tailwind CSS
*   **Deployment**: Vercel

------------------------------------------------------------------------

# 🚀 快速開始 / Quick Start

### 1. 環境變數設定 / Environment Variables Setup

在專案根目錄建立 `.env.local` 檔案，並填入以下變數：

**English:** Create a `.env.local` file in the project root directory and fill in the following variables:

```bash
# LINE Bot 設定 / LINE Bot Configuration
LINE_CHANNEL_ACCESS_TOKEN="你的 Channel Access Token"
LINE_CHANNEL_SECRET="你的 Channel Secret"

# MongoDB 設定 / MongoDB Configuration
MONGODB_URI="mongodb+srv://<username>:<password>@cluster.mongodb.net/linechatbot?retryWrites=true&w=majority"

# Gemini AI 設定 / Gemini AI Configuration
GEMINI_API_KEY="你的 Google Gemini API Key"
LLM_MODEL_NAME="gemini-2.5-flash"
```

### 2. 安裝依賴 / Install Dependencies

```bash
npm install
```

### 3. 啟動本地開發伺服器 / Start Local Development Server

```bash
npm run dev
```

伺服器將運行於 `http://localhost:3000`。

**English:** The server will run at `http://localhost:3000`.

### 4. 本地測試 Webhook (使用 ngrok) / Local Webhook Testing (Using ngrok)

由於 LINE 需要公開的 HTTPS URL，本地開發時建議使用 ngrok：

**English:** Since LINE requires a public HTTPS URL, it is recommended to use ngrok for local development:

```bash
ngrok http 3000
```

將 ngrok 產生的 URL (例如 `https://xxxx.ngrok-free.app/api/webhook`) 填入 LINE Developers Console 的 Webhook URL 欄位。

**English:** Fill in the URL generated by ngrok (e.g., `https://xxxx.ngrok-free.app/api/webhook`) into the Webhook URL field in LINE Developers Console.

------------------------------------------------------------------------

# 📂 專案結構 / Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── webhook/         # LINE Webhook 入口點 / LINE Webhook Entry Point
│   │   └── conversations/   # 管理後台 API / Management Dashboard API
│   └── page.tsx             # 管理後台 UI / Management Dashboard UI
├── lib/
│   ├── clients/             # 外部服務客戶端 (LINE, Gemini) / External Service Clients (LINE, Gemini)
│   ├── db/                  # 資料庫連線與 Model Schema / Database Connection & Model Schema
│   ├── repositories/        # 資料存取層 (DAO) / Data Access Layer (DAO)
│   └── services/            # 核心業務邏輯 (ChatService) / Core Business Logic (ChatService)
└── ...
```

------------------------------------------------------------------------

# 🔗 API 端點說明 / API Endpoints

### `POST /api/webhook`

*   **用途**：接收 LINE 平台發送的 Webhook 事件。
    **English:** **Purpose**: Receives Webhook events sent by the LINE platform.

*   **安全性**：驗證 `x-line-signature` 表頭。
    **English:** **Security**: Verifies the `x-line-signature` header.

*   **處理流程**：驗證 -> 儲存使用者訊息 -> 呼叫 Gemini -> 儲存 AI 回應 -> 回覆 LINE 訊息。
    **English:** **Process Flow**: Verify -> Save user message -> Call Gemini -> Save AI response -> Reply LINE message.

### `GET /api/conversations`

*   **用途**：獲取對話列表（管理後台用）。
    **English:** **Purpose**: Get conversation list (for management dashboard).

*   **參數**：
    **English:** **Parameters**:
    *   `status`: `active` | `closed` (篩選狀態 / Filter by status)
    *   `search`: 搜尋關鍵字 (Topic 或 UserID) / Search keyword (Topic or UserID)

### `GET /api/conversations/[id]`

*   **用途**：獲取單一對話的完整歷史訊息。
    **English:** **Purpose**: Get complete message history for a single conversation.

------------------------------------------------------------------------

# 📝 開發者注意事項 / Developer Notes

1.  **LINE Auto-reply**：請務必在 LINE Official Account Manager 中**關閉**「自動回應訊息」，否則 Webhook 不會生效。
    **English:** **LINE Auto-reply**: Please make sure to **disable** "Auto-reply messages" in LINE Official Account Manager, otherwise the Webhook will not work.

2.  **Vercel Deployment**：部署到 Vercel 時，請確保在 Project Settings 中設定所有環境變數。
    **English:** **Vercel Deployment**: When deploying to Vercel, make sure to set all environment variables in Project Settings.

3.  **MongoDB Connection**：請確保 MongoDB Atlas 的 Network Access 允許 Vercel 的 IP (或是設定為 `0.0.0.0/0`)。
    **English:** **MongoDB Connection**: Make sure MongoDB Atlas Network Access allows Vercel's IP (or set to `0.0.0.0/0`).
