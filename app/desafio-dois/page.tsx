'use client';

import React, { useRef, useState } from 'react';
import { BiPause, BiPlay } from 'react-icons/bi';

type toChangeType = {
	row: number;
	column: number;
	value: number;
};

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
	const speed = useRef<number>(1000);

	function handleClick(rowNumber: number, columnNumber: number, data: number) {
		let newBoard = board.slice(0);
		if (newBoard[rowNumber][columnNumber] == 1) newBoard[rowNumber][columnNumber] = 0;
		else newBoard[rowNumber][columnNumber] = 1;

		setBoard(newBoard);
	}

	function handleGameStateChange() {
		setGameState((data) => {
			if (data == 'paused') return 'run';
			else return 'paused';
		});
	}

	function handleSpeedChange(event: React.ChangeEvent<HTMLSelectElement>) {
		speed.current = parseInt(event.target.value);
		if (gameState == 'run') {
			clearInterval(gameId);
			setGameId(undefined);

			const id = setInterval(runGame, speed.current);
			setGameId(id);
		}
	}

	function runGame() {
		// vizinhos == 3 -> nova célula
		// vizinhos < 2  -> célula morre *
		// vizinhos > 3 -> célula morre *
		// vizinhos == 2 ou 3 -> célula continua *

		let newBoard = board.slice(0);

		let toChange: toChangeType[] = [];

		newBoard.map((row, rowIndex) =>
			row.map((data, columnIndex) => {
				let neighbors = 0;

				let hasTop = false;
				let hasLeft = false;
				let hasBottom = false;
				let hasRight = false;

				if (columnIndex > 0) {
					hasLeft = true;
				}
				if (columnIndex < row.length - 1) {
					hasRight = true;
				}
				if (rowIndex > 0) {
					hasTop = true;
				}
				if (rowIndex < newBoard.length - 1) {
					hasBottom = true;
				}

				// Horizontal
				if (hasLeft && board[rowIndex][columnIndex - 1] == 1) neighbors++;
				if (hasRight && board[rowIndex][columnIndex + 1] == 1) neighbors++;

				// Vertical
				if (hasTop && board[rowIndex - 1][columnIndex] == 1) neighbors++;
				if (hasBottom && board[rowIndex + 1][columnIndex] == 1) neighbors++;

				// Diagonal
				if (hasTop && hasLeft && board[rowIndex - 1][columnIndex - 1] == 1) neighbors++;
				if (hasTop && hasRight && board[rowIndex - 1][columnIndex + 1] == 1) neighbors++;
				if (hasBottom && hasLeft && board[rowIndex + 1][columnIndex - 1] == 1) neighbors++;
				if (hasBottom && hasRight && board[rowIndex + 1][columnIndex + 1] == 1) neighbors++;

				if (board[rowIndex][columnIndex] == 1) {
					if (neighbors < 2 || neighbors > 3) {
						toChange.push({ row: rowIndex, column: columnIndex, value: 0 });
					}
				} else {
					if (neighbors == 3) {
						toChange.push({ row: rowIndex, column: columnIndex, value: 1 });
					}
				}
			})
		);

		toChange.forEach((data) => {
			newBoard[data.row][data.column] = data.value;
		});

		setBoard(newBoard);
	}

	if (gameState == 'run') {
		if (gameId == undefined) {
			const id = setInterval(runGame, speed.current);
			setGameId(id);
		}
	} else {
		if (gameId != undefined) {
			console.log('CLEAR');
			clearInterval(gameId);
			setGameId(undefined);
		}
	}

	return (
		<div className='flex flex-col items-center gap-12 p-8'>
			<h1 className='text-4xl'>Jogo da vida</h1>
			<div className='grid grid-cols-11 text-center'>
				<p></p>
				<p>0</p>
				<p>1</p>
				<p>2</p>
				<p>3</p>
				<p>4</p>
				<p>5</p>
				<p>6</p>
				<p>7</p>
				<p>8</p>
				<p>9</p>
				{board.map((row, rowNumber) => (
					<>
						<p key={rowNumber}>{rowNumber}</p>
						{row.map((data, columnNumber) => (
							<div
								key={`${rowNumber}${columnNumber}`}
								onClick={() => {
									handleClick(rowNumber, columnNumber, data);
								}}
								className={`h-6 w-6 border-[0.5px] cursor-pointer border-white ${
									data == 1 ? 'bg-white' : ''
								}`}
							/>
						))}
					</>
				))}
			</div>
			<div className='flex flex-col'>
				<button
					className='flex justify-center items-center gap-2 px-2 border border-b-0 border-white rounded-t-xl hover:bg-white/10'
					onClick={handleGameStateChange}>
					{gameState == 'run' ? (
						<>
							<p>PAUSE</p>
							<BiPause />
						</>
					) : (
						<>
							<p>RUN</p>
							<BiPlay />
						</>
					)}
				</button>
				<select
					onChange={handleSpeedChange}
					className='flex justify-center items-center gap-2 px-2 border border-t-[0.5px] border-white bg-transparent hover:bg-white/10 outline-none'>
					<option value={1000} className='bg-black'>
						1X
					</option>
					<option value={500} className='bg-black'>
						2X
					</option>
					<option value={200} className='bg-black'>
						5X
					</option>
					<option value={100} className='bg-black'>
						10X
					</option>
					<option value={50} className='bg-black'>
						20X
					</option>
				</select>
			</div>
		</div>
	);
}

export default Page;
