"use client";

import { Suspense } from "react";
import Chat from "@modules/chat/views/Chat";

export default function ChatPage() {
  return (
    <Suspense fallback={<div>Đang tải...</div>}>
      <Chat />
    </Suspense>
  );
}
