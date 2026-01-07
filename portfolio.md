# Portfolio

## CHANG CHUN CHIEH 張鈞傑

---

# 網路服務程式設計 【LINE AI Chatbot | Next.js + TypeScript + Gemini LLM 智慧聊天機器人】

---

## 🔗 專案連結 / Project Links

*   **Github:** `https://github.com/cccalan1108/Line_Ai_Chatbot`
    *   [QR Code 位置 - 可在此處插入 GitHub QR Code]

*   **LINE Bot 連結:** `https://lin.ee/bsv1TCv`
    *   **LINE ID:** `@467vmfum`
    *   [QR Code 位置 - 可在此處插入 LINE QR Code]

*   **Vercel 後台顯示:** `https://wp1141-eight-brown.vercel.app`
    *   [QR Code 位置 - 可在此處插入 Vercel QR Code]

---

## 📖 專案背景 / Project Background

自主開發一款整合 **LINE Messaging API** 與 **Google Gemini AI** 的智慧聊天機器人系統。專案目標是打造一位名為「生活小幫手（鏈鋸人 Chainsaw Man）」的 AI 助理，能透過 LINE 與使用者進行自然對話，提供生活建議、情感支持與實用資訊。

系統採用 **Webhook 事件驅動架構**接收訊息，透過 **Gemini LLM** 生成結構化 JSON 回應（包含標題、摘要、建議事項），並以 **LINE Flex Message** 與 **Button Template** 呈現豐富的互動介面。所有對話紀錄皆持久化儲存於 **MongoDB Atlas**，並提供一個 Web 管理後台供管理員即時監控與檢視。

**English:** Independently developed an intelligent chatbot system that integrates **LINE Messaging API** with **Google Gemini AI**. The project aims to create an AI assistant named "Life Assistant (Chainsaw Man)" that can engage in natural conversations with users through LINE, providing life advice, emotional support, and practical information.

The system uses a **Webhook event-driven architecture** to receive messages, generates structured JSON responses (including titles, summaries, and suggestions) through **Gemini LLM**, and presents rich interactive interfaces using **LINE Flex Message** and **Button Template**. All conversation records are persistently stored in **MongoDB Atlas**, and a web management dashboard is provided for administrators to monitor and view in real-time.

---

## 🛠️ 技術設計 / Technical Design

### 後端架構 / Backend Architecture

*   **框架選擇 (Framework):** 使用 Next.js 15+ App Router 作為全端框架，整合 API Routes 處理 Webhook 請求與管理後台 API。
    **English:** **Framework Selection:** Uses Next.js 15+ App Router as a full-stack framework, integrating API Routes to handle Webhook requests and management dashboard APIs.

*   **型別安全 (Type Safety):** 採用 TypeScript 5.0 確保程式碼型別安全，定義完整的介面與型別定義（IMessage、Conversation Model）。
    **English:** **Type Safety:** Adopts TypeScript 5.0 to ensure code type safety, defining complete interfaces and type definitions (IMessage, Conversation Model).

*   **分層架構 (Layered Architecture):** 實作 Repository Pattern 與 Service Layer，將資料存取、業務邏輯與外部服務整合分離，提升程式碼可維護性。
    **English:** **Layered Architecture:** Implements Repository Pattern and Service Layer, separating data access, business logic, and external service integration to improve code maintainability.

### AI 整合與 Prompt 工程 / AI Integration & Prompt Engineering

*   **LLM 模型 (LLM Model):** 串接 Google Gemini 2.5 Flash 模型，平衡回應速度與品質。
    **English:** **LLM Model:** Integrates Google Gemini 2.5 Flash model, balancing response speed and quality.

*   **結構化輸出 (Structured Output):** 設計 System Prompt 強制 AI 回傳 JSON 格式，包含 `title`、`summary`、`advice[]`、`closing`、`quickReplies[]`、`buttonTemplate` 等欄位，確保回應格式一致。
    **English:** **Structured Output:** Designs System Prompt to force AI to return JSON format, including fields such as `title`, `summary`, `advice[]`, `closing`, `quickReplies[]`, `buttonTemplate`, ensuring consistent response format.

*   **上下文記憶 (Context Memory):** 實作對話歷史管理機制，每次請求時提取該使用者的完整對話紀錄，組合 System Prompt 與歷史訊息後傳送給 Gemini，讓 AI 理解前後文並提供連貫回應。
    **English:** **Context Memory:** Implements conversation history management mechanism, extracting the user's complete conversation history on each request, combining System Prompt with historical messages before sending to Gemini, allowing AI to understand context and provide coherent responses.

*   **角色設定 (Character Setting):** 設計「鏈鋸人 Chainsaw Man」角色，使用熱血、直率、實用的語氣，並在 Prompt 中明確定義角色特質與回應風格。
    **English:** **Character Setting:** Designs "Chainsaw Man" character, using passionate, straightforward, and practical tone, and clearly defines character traits and response style in the Prompt.

### 資料管理與持久化 / Data Management & Persistence

*   **資料庫設計 (Database Design):** 使用 MongoDB Atlas 雲端資料庫，透過 Mongoose ODM 定義 Conversation Schema，包含 `userId`、`messages[]`、`status`、`createdAt`、`updatedAt` 等欄位。
    **English:** **Database Design:** Uses MongoDB Atlas cloud database, defines Conversation Schema through Mongoose ODM, including fields such as `userId`, `messages[]`, `status`, `createdAt`, `updatedAt`.

*   **對話管理 (Conversation Management):** 實作 `findOrCreateActiveConversation()` 方法，自動為每個使用者建立或取得進行中的對話，支援對話重置功能（使用者輸入「重置」可清除歷史）。
    **English:** **Conversation Management:** Implements `findOrCreateActiveConversation()` method, automatically creating or retrieving ongoing conversations for each user, supporting conversation reset functionality (users can input "重置" to clear history).

*   **訊息儲存 (Message Storage):** 每次使用者訊息與 AI 回應皆即時存入 MongoDB，確保對話紀錄完整保存，供管理後台查詢與分析。
    **English:** **Message Storage:** Each user message and AI response is stored in MongoDB in real-time, ensuring complete conversation records for management dashboard queries and analysis.

### LINE 整合與使用者體驗 / LINE Integration & User Experience

*   **Webhook 安全性 (Webhook Security):** 實作 `x-line-signature` 簽章驗證，使用 `@line/bot-sdk` 的 `validateSignature()` 確保請求來源合法性，防止偽造請求。
    **English:** **Webhook Security:** Implements `x-line-signature` signature verification, using `@line/bot-sdk`'s `validateSignature()` to ensure request source legitimacy and prevent forged requests.

*   **Flex Message 設計 (Flex Message Design):** 將 AI 生成的 JSON 結構化回應轉換為 LINE Flex Message，包含標題、摘要、條列式建議與結尾，使用卡片式排版提升閱讀體驗。
    **English:** **Flex Message Design:** Converts AI-generated JSON structured responses into LINE Flex Messages, including titles, summaries, bullet-point suggestions, and closing, using card-style layout to enhance reading experience.

*   **互動式按鈕 (Interactive Buttons):** 實作 Button Template 機制，根據 AI 回應自動生成 1-4 個快捷按鈕，引導使用者進行下一步互動，提升使用者參與度。
    **English:** **Interactive Buttons:** Implements Button Template mechanism, automatically generating 1-4 quick buttons based on AI responses to guide users for next interaction, improving user engagement.

*   **錯誤處理與降級 (Error Handling & Degradation):** 實作 Graceful Degradation 機制，當 Gemini API 超時、配額用盡或服務異常時，自動回覆友善的錯誤提示訊息，避免使用者空等或「已讀不回」。
    **English:** **Error Handling & Degradation:** Implements Graceful Degradation mechanism, automatically replying with friendly error messages when Gemini API times out, quota is exceeded, or service is abnormal, avoiding user waiting or "read but no reply" situations.

### 管理後台 / Management Dashboard

*   **即時監控 (Real-time Monitoring):** 提供 Web 管理後台，管理者可即時查看所有進行中的對話列表，包含使用者 ID、對話狀態、最後更新時間等資訊。
    **English:** **Real-time Monitoring:** Provides web management dashboard, allowing administrators to view all ongoing conversation lists in real-time, including user IDs, conversation status, last update time, etc.

*   **對話歷史查詢 (Conversation History Query):** 支援查看單一對話的完整歷史訊息，包含使用者訊息與 AI 回應的時間戳記，方便管理者分析使用者需求與 AI 回應品質。
    **English:** **Conversation History Query:** Supports viewing complete message history of a single conversation, including timestamps of user messages and AI responses, facilitating administrators to analyze user needs and AI response quality.

*   **搜尋與篩選 (Search & Filter):** 實作搜尋功能（依關鍵字搜尋 Topic 或 UserID）與狀態篩選（`active` / `closed`），提升管理效率。
    **English:** **Search & Filter:** Implements search functionality (search by keyword for Topic or UserID) and status filtering (`active` / `closed`), improving management efficiency.

---

## 🔄 系統流程 / System Flow

```
1. User Input (使用者輸入)
   ↓
2. LINE Platform → Webhook POST /api/webhook
   ↓
3. Signature Validation (驗證 x-line-signature)
   ↓
4. MongoDB Connection (連接資料庫)
   ↓
5. ChatService.handleEvent()
   ├─ 5.1. findOrCreateActiveConversation(userId)
   ├─ 5.2. addMessage(conversationId, userMessage)
   ├─ 5.3. getConversationHistory(userId)
   ├─ 5.4. GeminiClient.generateResponse(history, SYSTEM_PROMPT)
   │   └─ 組合 System Prompt + 歷史訊息 → 呼叫 Gemini API
   ├─ 5.5. JSON.parse(aiResponse) → 解析結構化回應
   ├─ 5.6. 轉換為 Flex Message + Button Template
   ├─ 5.7. addMessage(conversationId, aiMessage)
   └─ 5.8. LineClient.replyMessage(replyToken, messages)
   ↓
6. LINE Platform → 使用者收到回應
```

**流程說明 / Flow Description:**

1.  **使用者輸入訊息** → LINE 平台發送 Webhook 事件到 `/api/webhook`
2.  **簽章驗證** → 驗證 `x-line-signature` 確保請求合法性
3.  **資料庫連線** → 連接 MongoDB Atlas
4.  **對話管理** → 取得或建立該使用者的進行中對話
5.  **儲存使用者訊息** → 將使用者訊息存入 MongoDB
6.  **提取歷史對話** → 讀取該使用者的完整對話歷史
7.  **AI 處理** → 組合 System Prompt 與歷史訊息，呼叫 Gemini API 生成回應
8.  **解析結構化回應** → 將 AI 回傳的 JSON 解析為 Flex Message 與 Button Template
9.  **儲存 AI 回應** → 將 AI 回應存入 MongoDB
10. **回覆使用者** → 透過 LINE Messaging API 發送 Flex Message 與 Button Template 給使用者

**English Flow Description:**

1.  **User Input** → LINE platform sends Webhook event to `/api/webhook`
2.  **Signature Validation** → Verify `x-line-signature` to ensure request legitimacy
3.  **Database Connection** → Connect to MongoDB Atlas
4.  **Conversation Management** → Get or create ongoing conversation for the user
5.  **Store User Message** → Save user message to MongoDB
6.  **Extract History** → Read user's complete conversation history
7.  **AI Processing** → Combine System Prompt with history, call Gemini API to generate response
8.  **Parse Structured Response** → Parse AI's JSON response into Flex Message and Button Template
9.  **Store AI Response** → Save AI response to MongoDB
10. **Reply to User** → Send Flex Message and Button Template to user via LINE Messaging API

---

## 📂 專案架構 / Project Architecture

```
Line_Ai_Chatbot/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── webhook/
│   │   │   │   └── route.ts          # Webhook 處理入口
│   │   │   └── conversations/
│   │   │       ├── route.ts          # 對話列表 API
│   │   │       └── [id]/
│   │   │           └── route.ts      # 單一對話詳情 API
│   │   ├── page.tsx                  # 管理後台 UI
│   │   ├── layout.tsx                # 根布局
│   │   └── globals.css               # 全域樣式
│   ├── lib/
│   │   ├── clients/
│   │   │   ├── line.client.ts        # LINE Messaging API 客戶端
│   │   │   └── gemini.client.ts      # Google Gemini API 客戶端
│   │   ├── db/
│   │   │   ├── mongodb.ts            # MongoDB 連線
│   │   │   └── conversation.model.ts # Conversation Schema
│   │   ├── repositories/
│   │   │   └── conversation.repository.ts  # 資料存取層
│   │   └── services/
│   │       └── chat.service.ts      # 核心業務邏輯
│   ├── types/                        # TypeScript 型別定義
│   └── utils/                        # 工具函數
├── public/                           # 靜態資源
├── package.json                      # 專案依賴
├── tsconfig.json                     # TypeScript 設定
├── next.config.ts                    # Next.js 設定
└── README.md                         # 專案說明文件
```

---

## 🎯 核心技術亮點 / Key Technical Highlights

1.  **事件驅動架構 (Event-Driven Architecture):** 採用 Webhook 非同步處理，支援多事件並行處理，提升系統吞吐量。
    **English:** **Event-Driven Architecture:** Uses Webhook asynchronous processing, supports parallel processing of multiple events, improving system throughput.

2.  **結構化 AI 輸出 (Structured AI Output):** 透過精心設計的 System Prompt 強制 AI 回傳 JSON，確保回應格式一致，便於轉換為 LINE 訊息格式。
    **English:** **Structured AI Output:** Forces AI to return JSON through carefully designed System Prompt, ensuring consistent response format, facilitating conversion to LINE message format.

3.  **上下文記憶機制 (Context Memory Mechanism):** 實作完整的對話歷史管理，讓 AI 能夠理解前後文，提供連貫且個人化的回應。
    **English:** **Context Memory Mechanism:** Implements complete conversation history management, allowing AI to understand context and provide coherent and personalized responses.

4.  **錯誤降級策略 (Error Degradation Strategy):** 實作多層錯誤處理機制，確保即使 AI 服務異常，使用者仍能收到友善的錯誤提示，不會「已讀不回」。
    **English:** **Error Degradation Strategy:** Implements multi-layer error handling mechanism, ensuring users receive friendly error messages even when AI service is abnormal, avoiding "read but no reply" situations.

5.  **分層架構設計 (Layered Architecture Design):** 採用 Repository Pattern 與 Service Layer，將資料存取、業務邏輯與外部服務整合分離，提升程式碼可維護性與可測試性。
    **English:** **Layered Architecture Design:** Adopts Repository Pattern and Service Layer, separating data access, business logic, and external service integration, improving code maintainability and testability.

---

## 🚀 部署與環境 / Deployment & Environment

*   **部署平台 (Deployment Platform):** Vercel
*   **資料庫 (Database):** MongoDB Atlas (雲端)
*   **環境變數 (Environment Variables):**
    *   `LINE_CHANNEL_ACCESS_TOKEN`
    *   `LINE_CHANNEL_SECRET`
    *   `MONGODB_URI`
    *   `GEMINI_API_KEY`
    *   `LLM_MODEL_NAME`

---

## 📊 專案成果 / Project Results

*   ✅ 成功整合 LINE Messaging API 與 Google Gemini AI
*   ✅ 實作完整的對話歷史管理與上下文記憶
*   ✅ 提供結構化 AI 回應與互動式按鈕引導
*   ✅ 建置 Web 管理後台供即時監控與查詢
*   ✅ 實作錯誤處理與降級機制，確保使用者體驗
*   ✅ 部署至 Vercel，提供 24/7 穩定服務

**English:**
*   ✅ Successfully integrated LINE Messaging API with Google Gemini AI
*   ✅ Implemented complete conversation history management and context memory
*   ✅ Provided structured AI responses and interactive button guidance
*   ✅ Built web management dashboard for real-time monitoring and queries
*   ✅ Implemented error handling and degradation mechanism, ensuring user experience
*   ✅ Deployed to Vercel, providing 24/7 stable service

