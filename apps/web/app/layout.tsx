import './globals.css'
import { Inter } from 'next/font/google'
import Navigation from '@/components/Navigation'
import { Providers } from './providers'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
    title: 'PropMubi Trust OS',
    description: 'Real Estate Transaction Operating System',
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en">
            <body className={inter.className}>
                <Providers>
                    <Navigation />
                    {children}
                </Providers>
            </body>
        </html>
    )
}
