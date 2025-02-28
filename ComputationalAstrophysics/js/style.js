document.addEventListener("DOMContentLoaded", function() {
	const allCM = [...document.querySelectorAll('.CM')];

	allCM.forEach((cm) => {
		const allWords = cm.innerText.split(' ').map((word) => {
			word = word.split('');
			if (word.length > 0) {
				word[0] = `<span class="big">${word[0].charAt(0)}</span>${word[0].slice(1)}`;
			}
			return word.join('');
		});
		cm.innerHTML = allWords.join(' '); // 更新 HTML
	});
});
