"use strict";

// ⊗jsPrStGGC Guess_the_cell_game

let block = document.querySelector('.cell'); // обертка где находится инфо и игра
let divt = block.querySelector('.cell__table'); // обертка для таблицы
let start = block.querySelector('.cell__start'); // кнопка запуска игры
let restart = block.querySelector('.cell__restart'); // кнопка перезапуска игры
let info = block.querySelector('.cell__info'); // подсказки
let count = block.querySelector('.cell__count'); // счетчик для выбранных ячеек
let timer = block.querySelector('.cell__timer'); // время отведенное для игры

let timerId; // переменная для запуска и остановки таймера

let arrTableNum = [10, 10]; // массив с двумя числами (строки tr и ячейки td)

setTable(arrTableNum); 

function setTable(arr) { // установить таблицу при обновлении страницы

   let table = document.createElement('table');

   for (let i = 0; i < arr[0]; i++) {
      let tr = document.createElement('tr');
      for (let k = 0; k < arr[1]; k++) {
         let td = document.createElement('td');
         td.classList.add('cell__td');
         tr.appendChild(td);
      }
      table.appendChild(tr);
   }
   divt.appendChild(table);
}

start.addEventListener('click', getTds); // обработчик для запуска игры

function getTds() { // запускаем игру
   setTimer(); // установка таймера
   
   let trs = divt.querySelectorAll('tr');
   let tds = divt.querySelectorAll('td');
   info.textContent = `Вы запустили игру. Успейте угадать ячейки пока не закончится время.`;
   count.classList.add('cell__count--active');

   let countSpan = count.firstElementChild;
   countSpan.textContent = trs.length;

   let arr = []; // массив для выборки нужных ячеек
   
   for (let i = 0; i < tds.length; i++) {
      tds[i].classList.remove('cell__td--green'); // удалить класс модификатор
      tds[i].classList.remove('cell__td--red'); // удалить класс модификатор
      // tds[i].textContent = i;
      arr.push(i);
   }
   let arrRandom = shuffle(arr).slice(0, trs.length); // массив выбранных рандомно ячеек

   getIncludes(arrRandom, tds, countSpan); // проверка ячеек

   this.removeEventListener('click', getTds);
   restart.addEventListener('click', removeGame);
}

function getIncludes(arrRandom, tds, k) {
   // console.log(arrRandom); // посмотреть в консоли выбранные ячейки

   for (let i = 0; i < tds.length; i++) {
      tds[i].addEventListener('click', function func() {

         if (Number(k.textContent) !== 0) {
         
            if (arrRandom.includes(i)) {
               k.textContent = Number(k.textContent) - 1;
               this.classList.add('cell__td--green');
               this.removeEventListener('click', func);

               if (Number(k.textContent == 0)) {
                  clearInterval(timerId); // остановить таймер
                  info.textContent = 'Поздравляем! Вы выиграли! Хотите сыграть занова? Нажмите кнопку "Начать игру".';
                  restart.removeEventListener('click', removeGame);
                  start.addEventListener('click', getTds);
               }

            } else {
               this.classList.add('cell__td--red');
               this.removeEventListener('click', func);
            }
         } else {
            this.removeEventListener('click', func);
         }
      });
   }
}

function removeGame() { // остановить игру для перезапуска
   clearInterval(timerId); // остановить таймер
   info.textContent = `Вы отменили игру. Хотите сыграть занова? Нажмите кнопку "Начать игру"`;
   count.classList.remove('cell__count--active');
   timer.textContent = '00:00';

   divt.firstElementChild.remove(); // удаляем таблицу

   setTable(arrTableNum); // создаем новую таблицу

   start.addEventListener('click', getTds);
   this.removeEventListener('click', removeGame);
}

function shuffle(arr) { // перемешать массив
   let res = [];
   while (arr.length > 0) {
      let random = getRandomInt(0, arr.length - 1);
      let elem = arr.splice(random, 1)[0];
      res.push(elem);
   }
   return res;
}

function getRandomInt(min, max) { // рандом
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

function setTimer() { // установка таймера
   let min = 2;
   let sec = 59;

   timerId = setInterval(function() {
      timer.textContent = `${setZero(min)}:${setZero(sec)}`;

      if (min == 0 && sec == 0) {
         clearInterval(timerId);

         info.textContent = 'Время закончилось, Вы проиграли. Хотите сыграть занова? Нажмите кнопку "Начать игру"';
         count.classList.remove('cell__count--active');
         timer.textContent = '00:00';

         divt.firstElementChild.remove(); // удаляем таблицу
         setTable(arrTableNum); // создаем таблицу

         start.addEventListener('click', getTds);
         restart.removeEventListener('click', removeGame);
      }
      if (sec == 0) {
         sec = 59;
         min--;
      }
      sec--;
   }, 1000);

   function setZero(num) { // добавить 0
      if (num <= 9) {
         return '0' + num;
      } else {
         return num;
      }
   }
}

