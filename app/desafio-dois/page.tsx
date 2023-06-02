'use client';

import { useState } from 'react';

function Page() {
	const defaultBoard = [
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	];

	const [board, setBoard] = useState<number[][]>(defaultBoard);
	const [gameState, setGameState] = useState<string>('idle');
	const [gameId, setGameId] = useState<any>(undefined);

	function handleClick(rowNumber: number, columnNumber: number, data: number) {
		let newBoard = board.slice(0);
		newBoard[rowNumber][columnNumber] = 1;

		setBoard(newBoard);
	}

	function runGame() {
		console.log('RUN');
	}

	if (gameState == 'run') {
		if (gameId == undefined) {
			const id = setInterval(runGame, 1000);
			setGameId(id);
		}
	} else {
		if (gameId != undefined) {
			console.log('CLEART');
			clearInterval(gameId);
			setGameId(undefined);
		}
	}

	return (
		<div className='flex flex-col items-center gap-12 p-8'>
			<h1 className='text-4xl'>Jogo da vida</h1>
			<div className='grid grid-cols-10'>
				{board.map((row, rowNumber) =>
					row.map((data, columnNumber) => (
						<div
							key={`${rowNumber}${columnNumber}`}
							onClick={() => {
								handleClick(rowNumber, columnNumber, data);
							}}
							className={`h-6 w-6 border-[0.5px] cursor-pointer border-white ${data == 1 ? 'bg-white' : ''}`}
						/>
					))
				)}
			</div>
			<button onClick={() => setGameState('pause')}>RUN</button>
		</div>
	);
}

export default Page;
