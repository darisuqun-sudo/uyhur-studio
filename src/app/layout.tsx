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
  title: {
    default: 'ئاقىل سەھنە — سۈنئىي ئىدراك سۇپىسى (Aqil Hub)',
    template: '%s | ئاقىل سەھنە (Aqil Hub)',
  },
  description:
    'ئۇيغۇرچە ۋە كۆپ تىللىق زامانىۋى سۈنئىي ئىدراك سۇپىسى: ئەقلىي تەرجىمە، رەسىم ھاسىللاش، ئاۋاز ئوقۇش (TTS)، سۆزدىن تېكىستكە (STT)، ھۆججەت تونۇش (OCR)، ئەقلىي يېزىقچىلىق، سېتىش ماركېتىنگى ۋە ئادەمسىز كىنولۇق مەھسۇلات ئىلانلىرى.',
  keywords: [
    'ئۇيغۇرچە سۈنئىي ئىدراك',
    'Uyghur AI',
    'OpenRouter',
    'Gemini 3.8 Flash',
    'AI Translation',
    'Uyghur OCR',
    'Text to Speech',
    'Aqil Hub',
    'ئاقىل سەھنە',
  ],
  authors: [{ name: 'Aqil AI Hub Team' }],
  creator: 'Aqil Hub',
  openGraph: {
    title: 'ئاقىل سەھنە — سۈنئىي ئىدراك سۇپىسى (Aqil Hub)',
    description:
      'OpenRouter ۋە Google Gemini 3.8 Flash بىرلەشتۈرۈلگەن كەسپىي ئۇيغۇرچە ۋە كۆپ تىللىق سۈنئىي ئىدراك ئىجادىيەت سۇپىسى.',
    url: 'https://aqil-hub.com',
    siteName: 'Aqil Hub',
    locale: 'ug_CN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ئاقىل سەھنە — سۈنئىي ئىدراك سۇپىسى (Aqil Hub)',
    description:
      'OpenRouter ۋە Google Gemini 3.8 Flash بىرلەشتۈرۈلگەن كەسپىي ئۇيغۇرچە ۋە كۆپ تىللىق سۈنئىي ئىدراك ئىجادىيەت سۇپىسى.',
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
