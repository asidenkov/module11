// элементы в DOM можно получить при помощи функции querySelector
const fruitsList = document.querySelector('.fruits__list'); // список карточек
const shuffleButton = document.querySelector('.shuffle__btn'); // кнопка перемешивания
const filterButton = document.querySelector('.filter__btn'); // кнопка фильтрации
const sortKindLabel = document.querySelector('.sort__kind'); // поле с названием сортировки
const sortTimeLabel = document.querySelector('.sort__time'); // поле с временем сортировки
const sortChangeButton = document.querySelector('.sort__change__btn'); // кнопка смены сортировки
const sortActionButton = document.querySelector('.sort__action__btn'); // кнопка сортировки
const kindInput = document.querySelector('.kind__input'); // поле с названием вида
const colorInput = document.querySelector('.color__input'); // поле с названием цвета
const weightInput = document.querySelector('.weight__input'); // поле с весом
const addActionButton = document.querySelector('.add__action__btn'); // кнопка добавления

// список фруктов в JSON формате
let fruitsJSON = `[ 
  {"kind": "Мангустин", "color": "фиолетовый", "weight": 13},
  {"kind": "Дуриан", "color": "зеленый", "weight": 35},
  {"kind": "Личи", "color": "розово-красный", "weight": 17},
  {"kind": "Карамбола", "color": "желтый", "weight": 28},
  {"kind": "Тамаринд", "color": "светло-коричневый", "weight": 22}
]`;

// преобразование JSON в объект JavaScript
let fruits = JSON.parse(fruitsJSON);

/*** ОТОБРАЖЕНИЕ ***/

// отрисовка карточек
const display = (fruitsArray) => {
  fruitsList.innerHTML = ''; // очищаем список
  fruitsArray.forEach((fruit, index) => {
    const listItem = document.createElement('li');
    listItem.className = 'fruit__item';
    listItem.innerHTML = `
      <div>Index: ${index}</div>
      <div>Kind: ${fruit.kind}</div>
      <div>Color: ${fruit.color}</div>
      <div>Weight: ${fruit.weight}</div>
    `;
    fruitsList.appendChild(listItem);
  });
};

// первая отрисовка карточек
display(fruits);

/*** ПЕРЕМЕШИВАНИЕ ***/

// генерация случайного числа в заданном диапазоне
const getRandomInt = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// перемешивание массива
const shuffleFruits = () => {
  const original = [...fruits]; // сохраняем копию массива для проверки
  let result = [];

  while (fruits.length > 0) {
    const randomIndex = getRandomInt(0, fruits.length - 1);
    result.push(fruits.splice(randomIndex, 1)[0]);
  }

  fruits = result;

  // Проверяем, изменился ли порядок элементов
  const isOrderChanged = JSON.stringify(fruits) !== JSON.stringify(original);
  if (!isOrderChanged) {
    alert('Перемешивание не удалось. Попробуйте еще раз.');
  }
};

shuffleButton.addEventListener('click', () => {
  shuffleFruits();
  display(fruits);
});

/*** ФИЛЬТРАЦИЯ ***/

// Получаем элементы из DOM
const minWeightInput = document.querySelector('.minweight__input'); // поле для минимального веса
const maxWeightInput = document.querySelector('.maxweight__input'); // поле для максимального веса

// фильтрация массива
const filterFruits = () => {
  // Получаем значения из полей ввода
  const minWeight = parseInt(minWeightInput.value, 10) || 0; // Минимальный вес
  const maxWeight = parseInt(maxWeightInput.value, 10) || Infinity; // Максимальный вес

  // Логируем полученные значения для проверки
  console.log(`minWeight: ${minWeight}, maxWeight: ${maxWeight}`);

  // Фильтруем массив фруктов по весу
  const filteredFruits = fruits.filter((fruit) => {
    console.log(`Checking fruit: ${fruit.kind}, weight: ${fruit.weight}`);
    return fruit.weight >= minWeight && fruit.weight <= maxWeight;
  });


  // Отображаем отфильтрованные фрукты
  display(filteredFruits);
};

filterButton.addEventListener('click', () => {
  filterFruits(); // Запускаем фильтрацию при клике на кнопку
});



/*** СОРТИРОВКА ***/

let sortKind = 'bubbleSort'; // инициализация состояния вида сортировки
let sortTime = '-'; // инициализация состояния времени сортировки

const comparationColor = (a, b) => {
  if (a.color < b.color) return -1;
  if (a.color > b.color) return 1;
  return 0;
};

const sortAPI = {
  bubbleSort(arr, comparation) {
    let len = arr.length;
    for (let i = 0; i < len - 1; i++) {
      for (let j = 0; j < len - 1 - i; j++) {
        if (comparation(arr[j], arr[j + 1]) > 0) {
          let temp = arr[j];
          arr[j] = arr[j + 1];
          arr[j + 1] = temp;
        }
      }
    }
  },

  quickSort(arr, comparation) {
    if (arr.length <= 1) return arr;
    let pivot = arr[arr.length - 1];
    let left = [];
    let right = [];

    for (let i = 0; i < arr.length - 1; i++) {
      if (comparation(arr[i], pivot) < 0) left.push(arr[i]);
      else right.push(arr[i]);
    }

    return [...this.quickSort(left, comparation), pivot, ...this.quickSort(right, comparation)];
  },

  // выполняет сортировку и производит замер времени
  startSort(sort, arr, comparation) {
    const start = new Date().getTime();
    sort(arr, comparation);
    const end = new Date().getTime();
    sortTime = `${end - start} ms`;
  },
};

// инициализация полей
sortKindLabel.textContent = sortKind;
sortTimeLabel.textContent = sortTime;

sortChangeButton.addEventListener('click', () => {
  sortKind = (sortKind === 'bubbleSort') ? 'quickSort' : 'bubbleSort';
  sortKindLabel.textContent = sortKind;
});

sortActionButton.addEventListener('click', () => {
  sortTimeLabel.textContent = 'sorting...';
  const sort = sortAPI[sortKind];
  sortAPI.startSort(sort, fruits, comparationColor);
  display(fruits);
  sortTimeLabel.textContent = sortTime;
});

/*** ДОБАВИТЬ ФРУКТ ***/


addActionButton.addEventListener('click', () => {
  // Получаем значения из полей ввода
  const kindValue = kindInput.value.trim(); // убираем лишние пробелы
  const colorValue = colorInput.value.trim();
  const weightValue = parseInt(weightInput.value, 10);

  // Проверяем, чтобы все поля были заполнены
  if (!kindValue || !colorValue || isNaN(weightValue) || weightValue <= 0) {
    // Если хотя бы одно поле пустое или вес невалидный (не число или <= 0), показываем alert
    alert('Пожалуйста, заполните все поля корректно.');
    return; // прерываем выполнение функции
  }

  // Если все поля корректны, создаем новый фрукт
  const newFruit = {
    kind: kindValue,
    color: colorValue,
    weight: weightValue
  };

  // Добавляем новый фрукт в массив
  fruits.push(newFruit);

  // Отображаем обновленный список фруктов
  display(fruits);
});
