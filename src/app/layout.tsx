// src/app/layout.tsx
import './globals.css'; // <- 最关键的就是这一行！
import React from 'react';

export const metadata = {
  title: "付昱淋 | 个人网页",
  description: "独立开发与数字空间",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh">
      <body>{children}</body>
    </html>
  );
}