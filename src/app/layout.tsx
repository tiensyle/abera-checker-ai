import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Cosmetic Content Checker AI - Thẩm định nội dung quảng cáo mỹ phẩm',
  description: 'Hệ thống đối chiếu hồ sơ công bố và kiểm tra tuân thủ quảng cáo mỹ phẩm theo quy định Việt Nam',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <body className="min-h-screen font-sans antialiased bg-slate-50 text-slate-900 selection:bg-blue-500 selection:text-white">
        {children}
      </body>
    </html>
  );
}
