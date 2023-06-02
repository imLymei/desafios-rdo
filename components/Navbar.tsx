import Image from 'next/image';
import Link from 'next/link';
import { AiFillGithub, AiFillLinkedin } from 'react-icons/ai';

function Navbar() {
	return (
		<nav className='h-12 grid grid-cols-3 items-center px-8 border-b border-neutral-800'>
			<Link href={'/'} className='px-4 py-2 w-fit hover:text-slate-400 transition'>
				HOME
			</Link>

			<div className='flex justify-center gap-4'>
				<Link href={'/desafio-um'} className='px-4 py-2 hover:text-slate-400 transition'>
					Desafio Um
				</Link>
				<Link href={'/desafio-dois'} className='px-4 py-2 hover:text-slate-400 transition'>
					Desafio Dois
				</Link>
				<Link href={'/desafio-tres'} className='px-4 py-2 hover:text-slate-400 transition'>
					Desafio Três
				</Link>
			</div>
			<div className='flex justify-end items-center gap-4'>
				<Link
					href={'https://github.com/imLymei/'}
					className='hover:text-slate-400 transition'
					target='_blank'>
					<AiFillGithub size={20} />
				</Link>
				<Link
					href={'https://github.com/imLymei/'}
					className='hover:text-slate-400 transition'
					target='_blank'>
					<AiFillLinkedin size={20} />
				</Link>
			</div>
		</nav>
	);
}

export default Navbar;
