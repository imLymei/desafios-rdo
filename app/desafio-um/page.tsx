'use client';

import React, { useState } from 'react';

function Page() {
	const [result, setResult] = useState<string | number>();

	const calculateRoman = (value: string) => {
		let newValue = parseInt(value);

		//                 M  D  C  L  X  V  I
		let romanNumber = [0, 0, 0, 0, 0, 0, 0];
		let romanArray = ['M', 'D', 'C', 'L', 'X', 'V', 'I'];
		let romanString = '';

		romanNumber[0] = Math.floor(newValue / 1000);
		newValue = newValue % 1000;

		romanNumber[1] = Math.floor(newValue / 500);
		newValue = newValue % 500;

		romanNumber[2] = Math.floor(newValue / 100);
		newValue = newValue % 100;

		romanNumber[3] = Math.floor(newValue / 50);
		newValue = newValue % 50;

		romanNumber[4] = Math.floor(newValue / 10);
		newValue = newValue % 10;

		romanNumber[5] = Math.floor(newValue / 5);
		newValue = newValue % 5;

		romanNumber[6] = Math.floor(newValue / 1);
		newValue = newValue % 1;

		romanNumber.map((quantity, index) => {
			const nextNumber = index + 1;
			let initialValue = 0;

			if (romanNumber[nextNumber] > 3) {
				romanString += romanArray[nextNumber];
				if (quantity > 0) {
					romanString += romanArray[index - 1];
					initialValue++;
				} else {
					romanString += romanArray[index];
					initialValue++;
				}
			}
			for (let i = initialValue; i < quantity; i++) {
				if (quantity < 4) {
					romanString += romanArray[index];
				}
			}
		});
		setResult(romanString);
	};

	const calculateArabic = (value: string) => {
		//                 M  D  C  L  X  V  I
		let romanNumber = [0, 0, 0, 0, 0, 0, 0];
		let romanArray = ['M', 'D', 'C', 'L', 'X', 'V', 'I'];
		let arabicArray = [1000, 500, 100, 50, 10, 5, 1];
		let finalValue = 0;

		const newValue = value.toUpperCase().split('');

		newValue.map((letter, index) => {
			const letterIndex = romanArray.indexOf(letter);
			const nextLetterIndex = romanArray.indexOf(newValue[index + 1]);

			if (nextLetterIndex != -1) {
				if (letterIndex <= nextLetterIndex) {
					finalValue += arabicArray[letterIndex];
				} else {
					if (letterIndex - nextLetterIndex <= 2 && letterIndex - nextLetterIndex >= 0) {
						finalValue -= arabicArray[letterIndex];
					} else {
						finalValue = NaN;
					}
				}
			} else {
				finalValue += arabicArray[letterIndex];
			}
		});

		setResult(finalValue);
	};

	const handleCalc = (event: React.ChangeEvent<HTMLFormElement>) => {
		event.preventDefault();

		const isRoman = event.target.translateTo.value == 'roman';
		const value = event.target.number.value;

		try {
			if (isRoman) {
				calculateRoman(value);
			} else {
				calculateArabic(value);
			}
		} catch (err) {
			throw new Error('Algo deu errado');
		}
	};

	return (
		<div className='flex flex-col items-center gap-12 p-8'>
			<h1 className='text-4xl text-center'>Conversor de números romanos</h1>

			<div className='relative w-fit mx-auto '>
				<form
					onSubmit={handleCalc}
					className='relative flex flex-col gap-4 p-4 border border-white rounded-t-sm'>
					<div>
						<p>Número</p>
						<input
							required
							name='number'
							className='outline-none p-1 border border-white rounded-sm bg-black'
							placeholder='XVI ou 16'
						/>
					</div>
					<div className='flex flex-col gap-1'>
						<p className='text-center'>Converter para:</p>
						<div className='flex justify-between'>
							<div className='flex gap-2'>
								<input required value={'roman'} id='roman' type='radio' name='translateTo' />
								<label htmlFor='roman'>Romano</label>
							</div>
							<div className='flex gap-2'>
								<input required value={'arabic'} id='arabic' type='radio' name='translateTo' />
								<label htmlFor='arabic'>Arábico</label>
							</div>
						</div>
					</div>
					<button className='px-4 py-2 border border-white rounded-sm'>Calcular</button>
					<p className='absolute top-2 right-2 flex justify-center items-center text-slate-400 border border-slate-600 rounded-3xl hover:rounded-md transition-all duration-300 w-6 h-6 cursor-pointer peer'>
						?
					</p>
					<div className='absolute scale-0 peer-hover:scale-100 origin-top-left transition top-10 right-8 backdrop-blur-sm bg-black/20 sm:-right-4 translate-x-full p-2 border border-slate-600 text-slate-500 rounded-sm'>
						<p>M = 1000</p>
						<p>D = 500</p>
						<p>C = 100</p>
						<p>L = 50</p>
						<p>X = 10</p>
						<p>V = 5</p>
						<p>I = 1</p>
					</div>
				</form>
				<div className='flex justify-between items-center p-2 border border-t-0 w-full border-white rounded-b-sm'>
					<p>Resultado:</p>
					<p className={typeof result == 'string' ? 'font-serif' : ''}>{result}</p>
				</div>
			</div>
		</div>
	);
}

export default Page;
