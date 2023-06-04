import Navbar from '@/components/Navbar';
import './globals.css';
import { Inter } from 'next/font/google';
import Footer from '@/components/Footer';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
	title: 'Desafios RDO',
	description: 'Felipe Cardoso Brito da Silveira - lymeicontato@gmail.com',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang='en'>
			<body className={`relative min-h-screen pb-4 bg-black text-white ${inter.className}`}>
				<Navbar />
				{children}
				<Footer />
			</body>
		</html>
	);
}
