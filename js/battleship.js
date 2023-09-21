
let model = {
  boardSize: 7,
  numShips: 3, //кол-во кораблей в игре
  shipLength: 3, //длина кораблей
  shipsSunk: 0, //инициализируется значением 0 в нчале игры. Содержит текущее значение потопленных кораблей.
  
  //ships приваивается массив с тремя объектами кораблей
  ships: [
    { locations: ["0", "0", "0"], hits: ["", "", ""] },
    { locations: ["0", "0", "0"], hits: ["", "", ""] },
    { locations: ["0", "0", "0"], hits: ["", "", ""] }
  ],
  
  //метод подучает координаты выстрела         
  fire: function(guess) {
    for(let i = 0; i < this.numShips; i++) { //перебираем массив ships
      let ship = this.ships[i]; //получение объекта корабля
      /* locations = ship.locations; //получение массива клеток занимаемых корбалём
      let index = locations.indexOf(guess); //если координаты присутствуют в массиве locations, значит выстрел попал */
      let index = ship.locations.indexOf(guess);
      if(index >=0) {
        ship.hits[index] = "hit"; //ставим отметку в массиве hits по тому же индексу
        view.displayHit(guess); //оповещаем представление о том, что в клетке guess следует вывести маркер попадания
        view.displayMessage("Попал!");
        if(this.isSunk(ship)) { //если корабль потоплен
          view.displayMessage("Ты потопил мой корабль!");
          this.shipsSunk++; //добавить к счётчику потопленых кораблей.
        }
        return true;
      }
    }
    view.displayMessage(guess); //повещаем представление о том, что в клетке guess следует вывести маркер промаха
    view.displayMessage("Ты промахнулся.");
    view.displayMiss(guess);
    return false;
  },
  
  //метод получает объект корабля и возвращает true, если корабль потоплен
  isSunk: function(ship) { //получаем объект корабля
    for(let i = 0; i < this.shipLength; i++) { //проверяем помечены ли все его клетки маркером попадания
      if(ship.hits[i] !== "hit") {
        return false;
      }
    }
    return true;
  },

  //метод добавляется объект модели
  generateShipLocations: function() {
   let location;
   for(let i = 0; i < this.numShips; i++) { //генерируем набор позиций
     do {
       locations = this.generateShip(); // проверяем перекрытие
     } while (this.colision(locations));
     this.ships[i].locations = locations; // полученные позиции сохраняются в свойстве locations объекта корабля в массиве model.ships
   }
  },

  //метод добавляется объект модели
  generateShip: function() {
    let direction = Math.floor(Math.random() * 2); //получаем число в диапозоне от 0 до 2, не включая 2
    let row, col;
    if(direction === 1) {
      //создаём горизонтальный корбаль
      row = Math.floor(Math.random() * this.boardSize);
      col = Math.floor(Math.random() * (this.boardSize - this.shipLength));
    } else {
      //создаём вертикальный корбаль
      row = Math.floor(Math.random() * (this.boardSize - this.shipLength));
      col = Math.floor(Math.random() * this.boardSize);
    }
    let newShipLocations = []; //пустой массив нового корабля. Последовательно добавляются элементы
    for(let i = 0; i < this.shipLength; i++) { //до количества позиций в корабле (у нас 3)
      if(direction === 1) {
        newShipLocations.push(row + "" + (col + i));
      } else {
        newShipLocations.push((row + i) + "" + col)
      }
    }
    return newShipLocations //после генерации всех позиций вернуть массив
  },

  colision: function(locations) { //массив позиций нового корабля для игрового поля
    for (let i = 1; i < this.numShips; i++) { //для каждого корабля уже находящегося на поле
      let ship = model.ships[i];
      for (let j = 0; j < locations.length; j++) { //проверить встречается ли какая-то из позиций массива locations нового корабля в массиве существующего корабля
        if (ship.locations.indexOf(locations[j]) >= 0) { //метод проверят позицию в массиве, если >=0, то клетка занята, возвращаем true
          return true;
        }
      }
    }
    return false; // перекрытия отсутствуют. Всё хорошо
  } 
};

let view = { //объект представления. получает строковое сообщение и выводит в области сообщений
  displayMessage: function(msg) { //метод получает аргумент - сообщение
    let messageArea = document.getElementById("messageArea"); //получние элемента из страницы
    messageArea.innerHTML = msg; //обновляем текст элемента messageArea
  },
  
  displayHit: function(location) {
    let cell = document.getElementById(location); //идентификатор клетки, созданный пользователем координатами, для присвоения класса hit/miss
    cell.setAttribute("class", "hit"); //элементу назначается класс hit
  },

  displayMiss: function(location) {
    let cell = document.getElementById(location);
    cell.setAttribute("class", "miss");
  } 
};

let controller = {
  guesses: 0,
  processGuess: function(guess) {
    let location = parseGuess(guess);
    if(location) {
      this.guesses++; //счётчик выстрелов, добавляющий +1
      let hit = model.fire(location); //передача комбинации строки и столбца методу fire
      if (hit && model.shipsSunk === model.numShips) { //если выстер попал в цель, а кол-во потопленных кораблей равно кол-ву кораблей в игре
        view.displayMessage("Ты потопил все мои коробали за " + this.guesses + " ходов")
      }
    }
  }
}

function parseGuess(guess) { //данные введённые пользователем
  let alphabet = ["A", "B", "C", "D", "E", "F", "G"]; // массив заполняется всеми действительными буквами в координатах
  if(guess === null || guess.length !==2) { //если данные null или их длинна отлична от двух
    alert("Упс, пожалуйста введите букву и цифру на доске.");
  } else {
    let firstChar = guess.charAt(0); //извлекаем первый символ строки
    let row = alphabet.indexOf(firstChar); //при помощи метода indefOf получаем цифру в диапозоне 0-6, соответсвующую букве
    let column = guess.charAt(1); //код получения второго символа (столбец игрового поля)
    if(isNaN(row) || isNaN(column)) {
      alert("Упс, это значение не на доске.");
    } else if (row < 0 || row >= model.boardSize || column < 0 || column >= model.boardSize) { //проверка цифры в значении от нуля до размера поля
      alert("Упс, это значение не на доске.");
    } else {
      return row + column;
    }
  }
  return null;
 }

 function init() {
  let fireButton = document.getElementById("fireButton"); //получаем ссылку на кнопку Огонь
  fireButton.onclick = handleFireButton //назначаем обработчик события по нажатию
  let guessInput = document.getElementById("guessInput");
  guessInput.onkeypress = handleKeyPress; //обработчик события нажатия клавиш в поле input
  model.generateShipLocations(); //вызов метода генерирующего позиции кораблей
 }

 function handleFireButton() {
  let guessInput = document.getElementById("guessInput"); //получаем ссылку на элемент формы по идентификатору guessInput
  let guess = guessInput.value; //извлекаем данные введённые пользователем
  controller.processGuess(guess); //передача координат выстрела контроллеру
  guessInput.value = ""; //очищаем содержание input
 }

 function handleKeyPress(e) { //обработчик нажатия клавиш в поле input. Передаёт информацию о нажатой клавише
  let fireButton = document.getElementById("fireButton");
  if(e.keyCode === 13) { //если нажата клавиша enter
    fireButton.click(); // нажать кнопку fireButton
    return false;
  }
 }


 window.onload = init; //выполнить init при полной загрузке страницы