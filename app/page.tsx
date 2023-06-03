type ChallengesCard = {
	challengeNumber: string;
	challengeTitle: string;
	challengeDescription: string;
	challengeLink: string;
};

export default function Home() {
	return (
		<main className='flex flex-col justify-center items-center gap-16 p-12'>
			<div className='flex text-6xl gap-2 font-bold'>
				<p>{'<'}</p>
				<div className='flex justify-center'>
					<h1>Hello World</h1>
					<div className='hello origin-bottom-right'>👋</div>
				</div>
				<p>{'>'}</p>
			</div>
			<div className='grid grid-cols-3 grid-rows-1 gap-8'>
				<ChallengesCard
					challengeNumber='1'
					challengeTitle='Conversor de números romanos'
					challengeDescription='Um conversor de números arábicos para romanos e romanos para arábicos.'
					challengeLink='/desafio-um'
				/>
				<ChallengesCard
					challengeNumber='2'
					challengeTitle='Jogo da vida'
					challengeDescription='Um tabuleiro interativo do jogo da vida de Conway com 10x10 células e controle de velocidade em tempo real.'
					challengeLink='/desafio-um'
				/>
				<ChallengesCard
					challengeNumber='3'
					challengeTitle='Divisor de conta de restaurante'
					challengeDescription='Um software feito para calcular comandas de um restaurante com a possibilidade de dividir a comanda por consumo entre clientes de uma mesma mesa.'
					challengeLink='/desafio-um'
				/>
			</div>
		</main>
	);
}

function ChallengesCard({
	challengeNumber,
	challengeTitle,
	challengeDescription,
	challengeLink,
}: ChallengesCard) {
	return (
		<a href={challengeLink} className='p-4 border border-white rounded-sm transition hover:scale-105'>
			<p className='text-2xl font-semibold text-center border-b border-neutral-600 mb-2'>
				~ Desafio {challengeNumber} ~
			</p>
			<p className='text-xl text-center'>{challengeTitle}</p>
			<p>{challengeDescription}</p>
		</a>
	);
}
