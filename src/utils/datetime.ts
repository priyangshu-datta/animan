export function prettyPrintDateDifference(date1: number | string |Date | undefined, date2: Date | number | string | undefined) {
	if (date1 === undefined || date2 === undefined) return undefined
	if (typeof date1 === 'number' || typeof date1 === 'string') { 
		if (isNaN(+new Date(date1))) {
			return undefined
		} else { 
			date1 = new Date(date1)
		}
	}

	if (typeof date2 === 'number' || typeof date2 === 'string') { 
		if (isNaN(+new Date(date2))) {
			return undefined
		} else { 
			date2 = new Date(date2)
		}
	}

	let dateDiffMS = Math.abs(date1.getTime() - date2.getTime());

	const diffInDays = Math.floor(dateDiffMS / (1000 * 60 * 60 * 24));
	const diffInHours = Math.floor((dateDiffMS % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
	const diffInMinutes = Math.floor((dateDiffMS % (1000 * 60 * 60)) / (1000 * 60));
	const diffInSeconds = Math.floor((dateDiffMS % (1000 * 60)) / 1000);

	let result = '';
	if (diffInDays > 0) {
		result += `${diffInDays} day${diffInDays > 1 ? 's' : ''} `;
	}
	if (diffInHours > 0) {
		result += `${diffInHours} hour${diffInHours > 1 ? 's' : ''} `;
	}
	if (diffInMinutes > 0) {
		result += `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} `;
	}
	if (diffInSeconds > 0) {
		result += `${diffInSeconds} second${diffInSeconds > 1 ? 's' : ''}`;
	}

	return result;
}

export function getTimeStamp(date: number | undefined) {
	if (date === undefined) return undefined;

	let dateDiff = (date - new Date().getTimezoneOffset() * 60) * 1000;

	return new Date(dateDiff).toISOString();
}
