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

// Список фруктов в JSON формате
let fruitsJSON = `[ 
  {"kind": "Мангустин", "color": "фиолетовый", "weight": 13},
  {"kind": "Дуриан", "color": "зеленый", "weight": 35},
  {"kind": "Личи", "color": "розово-красный", "weight": 17},
  {"kind": "Карамбола", "color": "желтый", "weight": 28},
  {"kind": "Тамаринд", "color": "светло-коричневый", "weight": 22}
]`;

// Преобразование JSON в объект JavaScript
let fruits = JSON.parse(fruitsJSON);

// Сопоставление цвета с классом
const colorClassMap = {
  "фиолетовый": "fruit_violet",
  "зеленый": "fruit_green",
  "розово-красный": "fruit_carmazin",
  "желтый": "fruit_yellow",
  "светло-коричневый": "fruit_lightbrown"
};


/*** ОТОБРАЖЕНИЕ ***/

// Функция для отрисовки карточек
const display = (fruitsArray) => {
  fruitsList.innerHTML = ''; // Очищаем список
  fruitsArray.forEach((fruit, index) => {
    // Создаём li элемент
    const listItem = document.createElement('li');
    listItem.className = `fruit__item ${colorClassMap[fruit.color] || ''}`; // Добавляем класс для цвета

    // Наполняем li содержимым
    listItem.innerHTML = `
      <div class="fruit__info">
        <div>index: ${index}</div>
        <div>kind: ${fruit.kind}</div>
        <div>color: ${fruit.color}</div>
        <div>weight (кг): ${fruit.weight}</div>
      </div>
    `;

    // Добавляем li в ul
    fruitsList.appendChild(listItem);
  });
};

// Первая отрисовка карточек
display(fruits);


/*** ПЕРЕМЕШИВАНИЕ ***/

// генерация случайного числа в заданном диапазоне
const getRandomInt = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// перемешивание массива
const shuffleFruits = (array) => {
  const result = [...array]; // копируем массив для перемешивания
  let shuffled = [];

  while (result.length > 0) {
    const randomIndex = getRandomInt(0, result.length - 1);
    shuffled.push(result.splice(randomIndex, 1)[0]);
  }

  return shuffled;
};

// обработка события клика на кнопку "Перемешать"
shuffleButton.addEventListener('click', () => {
  const fruitsToDisplay = filterFruits(); // берем отфильтрованные или оригинальные фрукты
  const shuffledFruits = shuffleFruits(fruitsToDisplay); // перемешиваем

  // проверка, совпадает ли перемешанный массив с исходным
  if (JSON.stringify(fruitsToDisplay) === JSON.stringify(shuffledFruits)) {
    alert('Перемешивание не дало результата! Попробуйте снова.'); // выводим предупреждение
  } else {
    display(shuffledFruits); // отображаем перемешанные фрукты
  }
});


/*** ФИЛЬТРАЦИЯ ***/

// Получаем элементы из DOM
const minWeightInput = document.querySelector('.minweight__input'); // поле для минимального веса
const maxWeightInput = document.querySelector('.maxweight__input'); // поле для максимального веса

let filteredFruits = []; // массив для хранения отфильтрованных фруктов

// фильтрация массива
const filterFruits = () => {
  // Получаем значения из полей ввода
  const minWeight = parseInt(minWeightInput.value, 10) || 0; // Минимальный вес
  const maxWeight = parseInt(maxWeightInput.value, 10) || Infinity; // Максимальный вес

  // Логируем полученные значения для проверки
  console.log(`minWeight: ${minWeight}, maxWeight: ${maxWeight}`);

  // Фильтруем массив фруктов по весу
  filteredFruits = fruits.filter((fruit) => {
    console.log(`Checking fruit: ${fruit.kind}, weight: ${fruit.weight}`);
    return fruit.weight >= minWeight && fruit.weight <= maxWeight;
  });

  return filteredFruits; // возвращаем отфильтрованный массив
};

filterButton.addEventListener('click', () => {
  filterFruits(); // Запускаем фильтрацию при клике на кнопку
  display(filteredFruits);
});


/*** СОРТИРОВКА ***/

// функция для сравнения цветов
const comparationColor = (a, b) => {
  const colorPriority = {
    "фиолетовый": 1,
    "зеленый": 2,
    "розово-красный": 3,
    "желтый": 4,
    "светло-коричневый": 5
  };

  return colorPriority[a.color] - colorPriority[b.color];
};

// Реализация алгоритма быстрой сортировки вне объекта
function quickSort(arr, comparation) {
  if (arr.length <= 1) return arr;
  let pivot = arr[arr.length - 1];
  let left = [];
  let right = [];

  for (let i = 0; i < arr.length - 1; i++) {
    if (comparation(arr[i], pivot) < 0) left.push(arr[i]);
    else right.push(arr[i]);
  }

  return [...quickSort(left, comparation), pivot, ...quickSort(right, comparation)];
}

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

  // выполняет сортировку и производит замер времени
  startSort(sort, arr, comparation) {
    const start = new Date().getTime();
    sort(arr, comparation);
    const end = new Date().getTime();
    sortTime = `${end - start} ms`;
  },
};

let sortKind = 'bubbleSort'; // инициализация состояния вида сортировки
let sortTime = '-'; // инициализация состояния времени сортировки

// инициализация полей
sortKindLabel.textContent = sortKind;
sortTimeLabel.textContent = sortTime;

sortChangeButton.addEventListener('click', () => {
  sortKind = (sortKind === 'bubbleSort') ? 'quickSort' : 'bubbleSort';
  sortKindLabel.textContent = sortKind;
});

sortActionButton.addEventListener('click', () => {
  sortTimeLabel.textContent = 'sorting...';

  // Используем отфильтрованный массив, если фильтрация была применена
  const fruitsToSort = filteredFruits.length > 0 ? filteredFruits : fruits;

  // Используем выбранный алгоритм сортировки
  const sort = sortKind === 'bubbleSort' ? sortAPI.bubbleSort : quickSort;
  sortAPI.startSort(sort, fruitsToSort, comparationColor);

  // Отображаем отсортированные фрукты
  display(fruitsToSort);
  
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
