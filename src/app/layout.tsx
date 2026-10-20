import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = { title:"Đại Việt — The Isle cộng đồng", description:"Cổng cộng đồng Đại Việt — thông tin máy chủ và tiện ích người chơi." };
export default function RootLayout({children}:{children:React.ReactNode}) { return <html lang="vi"><body>{children}</body></html>; }
