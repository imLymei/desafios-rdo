import Link from 'next/link';

function Footer() {
	return (
		<div className='absolute bottom-0 w-screen flex justify-end p-2 border-t border-neutral-600'>
			<Link href={'https://lymei.art'} target='_blank' className='text-neutral-800 text-center'>
				Felipe Cardoso © 2023
			</Link>
		</div>
	);
}

export default Footer;
