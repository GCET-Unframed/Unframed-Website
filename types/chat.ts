export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export interface BillChatContext {
  title: string;
  summary: string;
  status: string;
  relevanceReason: string;
}

export interface BillChatRequest {
  bill: BillChatContext;
  messages: ChatMessage[];
}

export interface BillChatResponse {
  message: ChatMessage;
}
