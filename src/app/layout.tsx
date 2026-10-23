import type { Metadata } from "next";
import DaiVietNavbar from "@/components/navigation/DaiVietNavbar";
import DonateTicker from "@/components/layout/DonateTicker";
import "./globals.css";
export const metadata: Metadata = { title:"Đại Việt — The Isle cộng đồng", description:"Cổng cộng đồng Đại Việt — thông tin máy chủ và tiện ích người chơi.", icons:{icon:"/icon.svg"} };
export default function RootLayout({children}:{children:React.ReactNode}) { return <html lang="vi"><body><DaiVietNavbar /><DonateTicker />{children}</body></html>; }
