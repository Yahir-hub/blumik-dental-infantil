import type { Metadata } from 'next';
import './globals.css';
import { Header, Footer } from './shared';
export const metadata: Metadata = { title: 'Blümik · Odontopediatría de Alto Nivel', icons: { icon: '/assets/simbolo.png' }, description: 'Odontopediatra en León Guanajuato para bebés, niños y adolescentes.' };
export default function RootLayout({children}:Readonly<{children:React.ReactNode}>) {return <html lang="es"><body><Header/>{children}<Footer/></body></html>}

