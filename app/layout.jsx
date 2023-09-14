import './globals.scss';
import { Rajdhani } from 'next/font/google';

//  Components
import Header from './components/header';

const orbitron = Rajdhani({
  subsets: ['latin'],
  weight: ['400', '700']
});

export const metadata = {
  title: 'Open Global News',
  description: 'An open global news-gathering resource.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={orbitron.className}>
        {<Header />}
        {children}
      </body>
    </html>
  );
};
