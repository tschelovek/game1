document.addEventListener('DOMContentLoaded', function () {

	// --== Переменные, используемые в разных функциях
	let timerId;
	const GAME_FIELD_BODY = document.querySelector('.field-body');
	const PLAY_AGAIN_BTN = document.querySelector('.btn-again');

	// --== Инициализируем игру
	(function () {
		const START_BTN = document.querySelector('#start');
		const BACK_BTN = document.querySelector('.btn-back');
		const INTRO = document.querySelector('.intro');
		const GAME_FIELD = document.querySelector('.field');

		START_BTN.addEventListener('click', () => {
			generateField(setTimer);
			INTRO.classList.add('hide');
			GAME_FIELD.classList.remove('hide');
			setTimer();
		});

		BACK_BTN.addEventListener('click', () => {
			GAME_FIELD_BODY.innerHTML = '';
			INTRO.classList.remove('hide');
			GAME_FIELD.classList.add('hide');
			clearInterval(timerId);
		});
	})();

	// --== Таймер
	function setTimer() {
		const TIMER = document.querySelector('.timer');

		if (timerId !== undefined) clearInterval(timerId);
		TIMER.textContent = '60';
		timerId = setInterval(function stopGame() {
			TIMER.innerText = parseInt(TIMER.textContent) - 1;
			if (TIMER.textContent == 0) {
				let cardsOnField = document.querySelectorAll('.card');
				clearInterval(timerId);
				PLAY_AGAIN_BTN.classList.remove('hide');
				setTimeout("alert('Вы проиграли!')", 200)
				for (let card of cardsOnField) {
					card.classList.add('guessed');
				}
			}
		}, 1000);
	}

	// --== Создаём поле
	function generateField(setTimer) {
		const WIDTH_INPUT = document.querySelector('#width-select');
		const HEIGHT_INPUT = document.querySelector('#height-select');
		let width;
		let height;

		(HEIGHT_INPUT.value % 2 === 0 && HEIGHT_INPUT.value <= 10 && HEIGHT_INPUT.value.length > 0) ? height = HEIGHT_INPUT.value : height = 4;
		for (let h = height; h > 0; h--) {
			let row = document.createElement('div');
			row.classList.add('row');
			(WIDTH_INPUT.value % 2 === 0 && WIDTH_INPUT.value <= 10 && HEIGHT_INPUT.value.length > 0) ? width = WIDTH_INPUT.value : width = 4;
			for (let w = width; w > 0; w--) {
				let card = document.createElement('div');
				card.classList.add('card');
				row.append(card);
			}
			GAME_FIELD_BODY.append(row);
		}
		WIDTH_INPUT.value = '';
		HEIGHT_INPUT.value = '';

		let cardsOnField = document.querySelectorAll('.card');

		fillField(width, height, cardsOnField);

		for (let card of cardsOnField) {
			card.addEventListener('click', function () {
				card.classList.add('open');
				chekOverlap(cardsOnField);
			})
		}

		PLAY_AGAIN_BTN.addEventListener('click', () => {
			for (let card of cardsOnField) {
				card.classList.remove('guessed');
				card.innerText = "";
			}
			fillField(width, height, cardsOnField);
			PLAY_AGAIN_BTN.classList.add('hide');
			setTimer();
		})
	}

	// --== Заполняем поле числами
	function fillField(width, height, cardsOnField) {
		let fieldSize = width * height;
		let numbers = generateCardNumbers(fieldSize);
		for (let card of cardsOnField) {
			card.textContent = numbers.shift();
		}
	}

	// --== Создаём массив согласно условиям задачи (по два числа от от одного до половины количества карточек)
	function generateCardNumbers(fieldSize) {
		let cardsArr = [];
		let cards = fieldSize / 2;
		while (cards > 0) {
			cardsArr.push(cards);
			cardsArr.push(cards);
			cards--;
		}
		return shuffle(cardsArr);
	}

	// --== Тасуем числа на основе алгоритма Фишера-Йетса
	function shuffle(arr) {
		let j;
		let temp;
		for (let i = arr.length - 1; i > 0; i--) {
			j = Math.floor(Math.random() * (i + 1));
			temp = arr[j];
			arr[j] = arr[i];
			arr[i] = temp;
		}
		return arr;
	}

	// --== Проверка совпадений
	function chekOverlap(cardsOnField) {
		let openedCards = document.querySelectorAll('.open');

		if (openedCards.length > 1) {
			setTimeout(function openForAHalfSecond() {
				openedCards[0].classList.remove('open')
				openedCards[1].classList.remove('open')
			}, 500)
			if (openedCards[0].textContent === openedCards[1].textContent) {
				openedCards[0].classList.add('guessed');
				openedCards[1].classList.add('guessed');
			}
		}

		let guessedCards = document.querySelectorAll('.guessed');
		if (guessedCards.length === cardsOnField.length) {
			setTimeout("alert('Вы выиграли!')", 200)
			PLAY_AGAIN_BTN.classList.remove('hide');
			clearInterval(timerId)
		}
	}
})
