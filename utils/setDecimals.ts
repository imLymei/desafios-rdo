export default function setDecimals(number: number, decimals: number) {
	if (number == 0) return 0;

	const tens = Math.pow(10, decimals);

	return formatDecimal(Math.round(number * tens) / tens);
}

function formatDecimal(number: number) {
	const rest = Math.round((number % 1) * 100);

	if (rest == 0) {
		return `${number}.00`;
	}
	if (rest % 10 == 0) {
		return `${number}0`;
	}

	return number;
}
