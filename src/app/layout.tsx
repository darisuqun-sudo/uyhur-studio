import type { Metadata, Viewport } from 'next';
import './globals.css';
import { SettingsProvider } from '../context/SettingsContext';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#020617' },
  ],
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL('https://uyhur-studio.vercel.app'),
  title: {
    default: 'ئاقىللار مۇنبىرى — ئىزدەن سۈنئىي ئىدراك سۇپىسى',
    template: '%s | ئاقىللار مۇنبىرى (Izden AI)',
  },
  description:
    'ئاقىللار مۇنبىرى (ئىزدەن سۈنئىي ئىدراك سۇپىسى) — ئۇيغۇرچە ۋە كۆپ تىللىق ئەقلىي ئىقتىدارلار: كەسپىي تەرجىمە، سۈپەتلىك رەسىم ئىجادىيىتى، ئاۋاز ئوقۇش (TTS)، سۆزدىن تېكىستكە (STT)، ھۆججەت تونۇش (OCR) ۋە ئەقلىي يېزىقچىلىق.',
  keywords: [
    'ئاقىللار مۇنبىرى',
    'ئىزدەن',
    'ئىزدەن سۈنئىي ئىدراك',
    'Aqillar Munbiri',
    'Izden AI',
    'ئۇيغۇرچە سۈنئىي ئىدراك',
    'Uyghur AI',
    'OpenRouter',
    'Gemini 3.8 Flash',
    'AI Translation',
    'Uyghur OCR',
    'Text to Speech',
  ],
  authors: [{ name: 'ئاقىللار مۇنبىرى ئەترىتى' }],
  creator: 'ئاقىللار مۇنبىرى',
  icons: {
    icon: '/logo.png',
    apple: '/logo.png',
  },
  openGraph: {
    title: 'ئاقىللار مۇنبىرى — ئىزدەن سۈنئىي ئىدراك سۇپىسى',
    description:
      'OpenRouter ۋە Google Gemini 3.8 Flash بىرلەشتۈرۈلگەن كەسپىي ئۇيغۇرچە ۋە كۆپ تىللىق ئەقلىي ئىقتىدار مۇنبىرى.',
    url: 'https://uyhur-studio.vercel.app',
    siteName: 'ئاقىللار مۇنبىرى',
    locale: 'ug_CN',
    type: 'website',
    images: [{ url: '/logo.png', width: 512, height: 512, alt: 'ئاقىللار مۇنبىرى لوگوسى' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ئاقىللار مۇنبىرى — ئىزدەن سۈنئىي ئىدراك سۇپىسى',
    description:
      'OpenRouter ۋە Google Gemini 3.8 Flash بىرلەشتۈرۈلگەن كەسپىي ئۇيغۇرچە ۋە كۆپ تىللىق ئەقلىي ئىقتىدار مۇنبىرى.',
    images: ['/logo.png'],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ug" dir="rtl" className="dark" suppressHydrationWarning>
      <body className="bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col min-h-screen antialiased selection:bg-blue-500/20 selection:text-blue-500 font-uyghur">
        <SettingsProvider>
          <Navbar />
          <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col">
            {children}
          </main>
          <Footer />
        </SettingsProvider>
      </body>
    </html>
  );
}
