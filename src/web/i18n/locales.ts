import type { LocalePack } from './types';

export const englishLocale: LocalePack = {
  code: 'en',
  name: 'English',
  messages: {},
};

export const russianLocale: LocalePack = {
  code: 'ru',
  name: 'Русский',
  messages: {
    Config: 'Конфиг',
    World: 'Мир',
    Types: 'Типы',
    Initial: 'Старт',
    Exchange: 'Поделиться',

    'Randomize types config': 'Рандомизация типов',
    Summary: 'Сводка',
    'Edit types config': 'Правка типов',
    'Genetic search': 'Генетический поиск',

    Pause: 'Пауза',
    Resume: 'Продолжить',
    Clear: 'Очистить',
    Refill: 'Заполнить',
    Randomize: 'Случайно',
    Edit: 'Правка',
    Default: 'По умолчанию',
    'Add type': 'Добавить',
    'Advanced settings': 'Дополнительные настройки',
    'Are you sure?': 'Вы уверены?',
    'Are you sure to remove type?': 'Удалить этот тип?',
    'Import error: {0}': 'Ошибка импорта: {0}',

    'Physic Model': 'Модель физики',
    Spring: 'Пружина',
    Link: 'Связь',
    Bounce: 'Отскок',
    'Max Interaction Radius': 'Макс. радиус взаимодействия',
    'Maximum radius at which unlinked particles can interact.':
      'Максимальный радиус, на котором несвязанные частицы могут взаимодействовать.',
    'Max Link Radius': 'Макс. длина связи',
    'Maximum link length (can be increased by Links Distance Factor parameters).':
      'Максимальная длина связи (может увеличиваться параметрами фактора длины).',
    'Maximum link length (scaled by Link Length of the bonded types).':
      'Максимальная длина связи (масштабируется длиной связи связанных типов).',
    'Max Force Value': 'Макс. сила',
    'Maximum force value of each individual interaction.':
      'Максимальное значение силы каждого отдельного взаимодействия.',
    'Gravity Multiplier': 'Множитель гравитации',
    'Parameter by which the force of gravity is multiplied.':
      'Параметр, на который умножается сила гравитации.',
    'World Gravity': 'Гравитация мира',
    'Constant downward acceleration (positive Y). 0 disables it. Scaled by Speed.':
      'Постоянное ускорение вниз (положительный Y). 0 отключает. Масштабируется скоростью.',
    'Link Force Multiplier': 'Множитель силы связи',
    'Parameter by which the link elastic force is multiplied.':
      'Параметр, на который умножается упругая сила связи.',
    'Bounce Force Multiplier': 'Множитель отскока',
    'Parameter by which the collision rebound force is multiplied.':
      'Параметр, на который умножается сила отскока при столкновении.',
    'Bounds Force Multiplier': 'Множитель границ',
    'Parameter by which the force of repulsion from the boundaries of space is multiplied.':
      'Параметр, на который умножается сила отталкивания от границ пространства.',
    'Inertial Multiplier': 'Множитель инерции',
    'Parameter by which the particle speed is multiplied after each iteration.':
      'Параметр, на который умножается скорость частицы после каждой итерации.',
    'Speed Parameter': 'Параметр скорости',
    'The speed parameter by which all simulation forces are multiplied.':
      'Параметр скорости, на который умножаются все силы симуляции.',
    'Playback Speed': 'Скорость воспроизведения',
    'Number of simulation iterations per rendering step.':
      'Число итераций симуляции на один кадр отрисовки.',
    'Temperature Multiplier': 'Множитель температуры',
    'Parameter responsible for the temperature of the environment.':
      'Параметр, отвечающий за температуру среды.',
    'Decay Split Velocity': 'Скорость разлёта при распаде',
    'Relative velocity of fragments when a particle decays into two.':
      'Относительная скорость осколков, когда частица распадается на две.',
    Bounds: 'Границы',
    'Boundaries of the maximum position of particles in space.':
      'Границы максимального положения частиц в пространстве.',
    min: 'мин',
    max: 'макс',
    median: 'медиана',
    step: 'шаг',
    share: 'доля',
    'Share of values that deviate from median. 1 = fully random, 0 = all median.':
      'Доля значений, отклоняющихся от медианы. 1 = полностью случайно, 0 = все равны медиане.',
    'Show atoms': 'Показывать частицы',
    'Show links': 'Показывать связи',
    'Show bounds': 'Показывать границы',

    Actions: 'Действия',
    'Type names, colors, clone and remove.':
      'Имена и цвета типов, клонирование и удаление.',
    'Names / Colors / Actions': 'Имена / цвета / действия',
    'Edit type names and colors. Use ⋯ under a type to clone or remove it.':
      'Имена и цвета типов. Через ⋯ под типом можно клонировать или удалить его.',
    'Link Gravity': 'Гравитация связи',
    'Gravity coefficient matrix for linked particles shows whether a particle of one type will attract or repel a particle of another type in the case when they are linked to each other, and with what force.':
      'Матрица коэффициентов гравитации для связанных частиц показывает, будет ли частица одного типа притягивать или отталкивать частицу другого типа, если они связаны, и с какой силой.',
    'Connection limit map shows the maximum number of links for particles of each type.':
      'Карта лимита связей показывает максимальное число связей для частиц каждого типа.',
    'Connection limit matrix shows the maximum number of connections that particles of each type can have with particles of different types.':
      'Матрица лимита связей показывает, сколько связей частицы каждого типа могут иметь с частицами других типов.',
    'The connection weight matrix shows the connection weights between each pair of types in the left type link limit.':
      'Матрица весов связей показывает вес связи каждой пары типов в лимите связей слева.',
    'Links Distance Factor': 'Фактор длины связей',
    'Links Elastic Factor': 'Фактор упругости связей',
    'Tensor of influence on neighbors links shows how particles of each type affect the maximum length of links of neighboring particles of different types with particles of specific types.':
      'Тензор влияния на связи соседей показывает, как частицы каждого типа влияют на максимальную длину связей соседних частиц разных типов с частицами конкретных типов.',
    'Tensor of influence on neighbors links shows how particles of each type affect the elastic force of links of neighboring particles of different types with particles of specific types.':
      'Тензор влияния на связи соседей показывает, как частицы каждого типа влияют на упругость связей соседних частиц разных типов с частицами конкретных типов.',
    'Experimental feature. A + B ➔ C means that when the particle of type A connects to a particle of type B, then the particle of type B changes its type to C.':
      'Экспериментально. A + B ➔ C значит: когда частица типа A связывается с частицей типа B, частица B меняет тип на C.',
    Genetic: 'Генетика',
    'Defines the rules for calculating forces.': 'Задаёт правила расчёта сил.',
    'Initial Frequencies': 'Начальные частоты',
    'Ratio of the number of particles that will be generated on refill.':
      'Доля частиц каждого типа при заполнении мира.',
    Radius: 'Радиус',
    'Radius of each type of particles.': 'Радиус частиц каждого типа.',
    Mass: 'Масса',
    'Inertial mass of each type. Used for force→acceleration (a = F / m). Legacy configs default to Radius³.':
      'Инертная масса типа. Используется для сила→ускорение (a = F / m). В старых конфигах по умолчанию Radius³.',
    Gravity: 'Гравитация',
    'Gravity coefficient matrix for unlinked particles shows whether a particle of one type will attract or repel a particle of another type in the case when they are not linked to each other, and with what force.':
      'Матрица коэффициентов гравитации для несвязанных частиц показывает, будет ли частица одного типа притягивать или отталкивать частицу другого типа, если они не связаны, и с какой силой.',
    'Link Bias': 'Смещение связи',
    'Constant radial force along a bond. Positive attracts, negative repels. Shifts effective bond length against the spring.':
      'Постоянная радиальная сила вдоль связи. Плюс притягивает, минус отталкивает. Сдвигает эффективную длину связи относительно пружины.',
    Links: 'Связи',
    'Type Links': 'Лимиты связей по типам',
    'Maximum total bond order (valence) for this type. Used valence is the sum of orders of all bonds on the atom.':
      'Максимальный суммарный порядок связей (валентность) этого типа. Использованная валентность — сумма порядков всех связей атома.',
    'Type Link Weights': 'Веса связей типов',
    'Nominal bond order for each type pair (prefer integers 1, 2, …). Actual order is min(weight, free valence on both sides). Max partners of that type is derived as floor(Links / weight). Link preference = Bond Preference × order.':
      'Номинальный порядок связи для каждой пары типов (лучше целые 1, 2, …). Фактический порядок — min(вес, свободная валентность с обеих сторон). Максимум партнёров типа: floor(Links / вес). Предпочтение связи = предпочтение × порядок.',
    'Bond Preference': 'Предпочтение связей',
    'Preference per unit of bond order. Effective link preference is this value × order. When valence is full, a new bond can replace the weakest existing bond if it has a strictly higher preference.':
      'Предпочтение на единицу порядка связи. Эффективное предпочтение = это значение × порядок. Если валентность заполнена, новая связь может заменить самую слабую, если её предпочтение строго выше.',
    'Link Length': 'Длина связи',
    'Preferred link length multiplier for this type. For a bond A–B the length is the average of both types.':
      'Множитель предпочтительной длины связи для типа. Для связи A–B длина — среднее обоих типов.',
    'Link Stiffness': 'Жёсткость связи',
    'Link stiffness multiplier for this type. For a bond A–B the stiffness is the average of both types.':
      'Множитель жёсткости связи для типа. Для связи A–B жёсткость — среднее обоих типов.',
    'Bond Preference Factor': 'Фактор предпочтения связей',
    'Tabs choose the agent type. The matrix multiplies Bond Preference of A–B while that agent is bonded to A or B. Values >1 catalyze, <1 inhibit, 0 blocks the swap path. Default 1 = no effect.':
      'Вкладки выбирают тип агента. Матрица умножает предпочтение связи A–B, пока агент связан с A или B. Значения >1 катализируют, <1 ингибируют, 0 блокирует замену. По умолчанию 1 — без эффекта.',
    'Link Strength Factor': 'Фактор прочности связей',
    'Tabs choose the agent type. Multiplies link stiffness and break radius of A–B while that agent is bonded to A or B. Values <1 weaken (easier to break), >1 strengthen. Default 1 = no effect.':
      'Вкладки выбирают тип агента. Умножает жёсткость и радиус разрыва связи A–B, пока агент связан с A или B. Значения <1 ослабляют, >1 усиливают. По умолчанию 1 — без эффекта.',
    'Agent (bonded catalyst / inhibitor)': 'Агент (связанный катализатор / ингибитор)',
    'While the selected agent is bonded to A or B, multiply preference of bond A ⟷ B.':
      'Пока выбранный агент связан с A или B, умножает предпочтение связи A ⟷ B.',
    'Agent (bonded strength modifier)': 'Агент (модификатор прочности связи)',
    'While the selected agent is bonded to A or B, multiply strength of bond A ⟷ B.':
      'Пока выбранный агент связан с A или B, умножает прочность связи A ⟷ B.',
    'Bond A ⟷ B': 'Связь A ⟷ B',
    Agent: 'Агент',
    Symmetric: 'Симметрично',
    'Make matrix symmetric': 'Сделать матрицу симметричной',
    'Ignore self type': 'Игнорировать свой тип',
    'Transformations on link creation': 'Трансформации при создании связи',
    'Experimental feature. A ↻ B ➔ C means that when A connects to B, A changes type to C. A + B ➔ C merges A and B into C on contact (radii overlap).':
      'Экспериментально. A ↻ B ➔ C: при связи A с B тип A становится C. A + B ➔ C: A и B сливаются в C при контакте (перекрытие радиусов).',
    Decay: 'Распад',
    'A ⏳ T ➔ B — particle A becomes B with half-life T (ticks). A ⏳ T ➔ B + C — splits into B and C. A ⏳ T ➔ ∅ + ∅ — particle disappears. Use ∅ as C for type change only. ⛓ types stabilize A: it does not decay while linked to at least one of them.':
      'A ⏳ T ➔ B — частица A становится B с периодом полураспада T (тики). A ⏳ T ➔ B + C — делится на B и C. A ⏳ T ➔ ∅ + ∅ — исчезает. ∅ как C — только смена типа. Типы ⛓ стабилизируют A: нет распада, пока есть связь хотя бы с одним из них.',
    'Add rule': 'Добавить правило',
    Remove: 'Удалить',
    Clone: 'Клонировать',
    'Change {0} color': 'Цвет {0}',
    'Type {0} name': 'Имя типа {0}',
    'Type actions': 'Действия типа',

    'Export and import world and types config using files.':
      'Экспорт и импорт конфигурации мира и типов через файлы.',
    'Import config': 'Импорт конфига',
    'Export config': 'Экспорт конфига',
    'Config modification': 'Изменение конфига',
    'Modify types config by adding types from another config.':
      'Добавить типы из другого конфига.',
    'Add types from config': 'Добавить типы из конфига',
    State: 'Состояние',
    'Export and import atoms and links state using files.':
      'Экспорт и импорт состояния частиц и связей через файлы.',
    'Import state': 'Импорт состояния',
    'Export state': 'Экспорт состояния',
    'Copy configuration share link': 'Копировать ссылку на конфиг',
    '[ COPIED ] Click another time to shorten!': '[ СКОПИРОВАНО ] Нажмите ещё раз, чтобы сократить!',

    'Initial Params': 'Начальные параметры',
    'Atoms Count': 'Число частиц',
    'Min Position': 'Мин. положение',
    'Max Position': 'Макс. положение',
    'Sync with world config bounds': 'Синхронизировать с границами мира',

    'Types Count': 'Число типов',
    'Count of particle types.': 'Количество типов частиц.',
    Frequencies: 'Частоты',
    'Inertial mass of each type (a = F / m).': 'Инертная масса типа (a = F / m).',
    'Constant radial force along bonded pairs. Positive attracts, negative repels.':
      'Постоянная радиальная сила вдоль связанных пар. Плюс притягивает, минус отталкивает.',
    'Links Count': 'Число связей',
    'Maximum total bond order (valence) per type. Used valence is the sum of bond orders on the atom.':
      'Максимальный суммарный порядок связей (валентность) типа. Использованная валентность — сумма порядков связей на атоме.',
    'Types Link Weights': 'Веса связей типов',
    'Nominal bond order per type pair. Max partners of that type = floor(Links / weight). Preference = Bond Preference × order.':
      'Номинальный порядок связи для пары типов. Максимум партнёров = floor(Links / вес). Предпочтение = предпочтение × порядок.',
    'Preference per unit of bond order. Effective preference is this × order.':
      'Предпочтение на единицу порядка связи. Эффективное предпочтение = это × порядок.',
    'Per-agent multipliers for bond A⟷B while the agent is bonded to A or B. >1 catalyzes, <1 inhibits.':
      'Множители агента для связи A⟷B, пока агент связан с A или B. >1 катализ, <1 ингибирование.',
    'Per-agent multipliers for stiffness and break radius of A⟷B while the agent is bonded to A or B. <1 weakens, >1 strengthens.':
      'Множители агента для жёсткости и радиуса разрыва A⟷B, пока агент связан с A или B. <1 ослабляет, >1 усиливает.',
    'Per-type link length multiplier. Pair length is the average of both types.':
      'Множитель длины связи типа. Длина пары — среднее обоих типов.',
    'Per-type link stiffness multiplier. Pair stiffness is the average of both types.':
      'Множитель жёсткости связи типа. Жёсткость пары — среднее обоих типов.',
    'Change only crossed submatrices': 'Менять только пересечённые подматрицы',
    'Apply changes only to the upper right and lower left quadrants of a matrix divided by a specified number of types.':
      'Применять изменения только к правому верхнему и левому нижнему квадрантам матрицы, разделённой заданным числом типов.',
    'Cross position': 'Позиция сечения',
    'Force refill': 'Принудительно заполнить',
    'Randomize and Refill': 'Случайно и заполнить',
    'Randomize colors': 'Случайные цвета',
    Snippets: 'Сниппеты',
    'Input snippet name': 'Имя сниппета',
    Save: 'Сохранить',
    Apply: 'Применить',

    'Config item to edit': 'Параметр для правки',
    'Operation {0}': 'Операция {0}',
    'Right argument': 'Правый аргумент',
    Append: 'Добавить',
    UNARY: 'Унарная',
    BINARY: 'Бинарная',
    ZEROS: 'Нули',
    CONST: 'Константа',
    REV: 'Обратить',
    NEG: 'Отрицание',
    ABS: 'Модуль',
    ROUND: 'Округлить',
    LOG: 'Логарифм',
    ADD: 'Сложить',
    SUB: 'Вычесть',
    MUL: 'Умножить',
    DIV: 'Разделить',
    MIN: 'Минимум',
    MAX: 'Максимум',
    MINMAX: 'Ограничить',
    REPLACE_FROM: 'Взять справа',
    value: 'значение',
    precision: 'точность',
    'Link Factor Distance': 'Фактор длины связей',
    'Link Factor Elastic': 'Фактор упругости связей',

    Start: 'Старт',
    Stop: 'Стоп',
    'Genomes handled: {0} / {1}': 'Обработано геномов: {0} / {1}',
    '(stopping...)': '(остановка...)',
    Generation: 'Поколение',
    'Stagnation counter': 'Счётчик стагнации',
    'Average genome age': 'Средний возраст генома',
    'Best genome ID': 'ID лучшего генома',
    'Best genome origin': 'Происхождение лучшего генома',
    'Best genome score': 'Оценка лучшего генома',
    'Second genome score': 'Оценка второго генома',
    'Average population score': 'Средняя оценка популяции',
    'Median population score': 'Медианная оценка популяции',
    'Population fitness': 'Приспособленность популяции',
    'Best fitness history': 'История лучшей приспособленности',
    'Mean fitness history': 'История средней приспособленности',
    'Mean age history': 'История среднего возраста',
    'Macro config': 'Макропараметры',
    'Params config': 'Параметры',
    'Weights config': 'Веса',
    'Population size': 'Размер популяции',
    'Survival rate': 'Доля выживших',
    'Crossover rate': 'Доля скрещивания',
    'Add current types config to population': 'Добавить текущий конфиг типов в популяцию',
    'Randomize start population': 'Случайная стартовая популяция',
    'Min compound size': 'Мин. размер соединения',
    'Min unique types count': 'Мин. число уникальных типов',
    'Min polymer size': 'Мин. размер полимера',
    'Min polymer confidence score': 'Мин. уверенность полимера',
    'Monomer candidate vertexes count bounds': 'Границы числа вершин кандидата мономера',
    'Polymer candidate vertexes count bounds': 'Границы числа вершин кандидата полимера',
    'Weight of clusters count': 'Вес числа кластеров',
    'Weight of average cluster size': 'Вес среднего размера кластера',
    'Weight of max cluster size': 'Вес макс. размера кластера',
    'Weight of relative filtered compounds count': 'Вес доли отфильтрованных соединений',
    'Weight of relative clustered compounds count': 'Вес доли кластеризованных соединений',
    'Weight of relative clustered atoms count': 'Вес доли кластеризованных атомов',
    'Weight of average atoms count in clustered compound': 'Вес среднего числа атомов в кластеризованном соединении',
    'Weight of max atoms count in clustered compound': 'Вес макс. числа атомов в кластеризованном соединении',
    'Weight of links count in clustered compound': 'Вес числа связей в кластеризованном соединении',
    'Weight of unique types count in clustered compound': 'Вес числа уникальных типов в кластеризованном соединении',
    'Weight of symmetry grade of clustered compounds': 'Вес симметрии кластеризованных соединений',
    'Weight of compounds radii in clusters': 'Вес радиусов соединений в кластерах',
    'Weight of compounds speeds in clusters': 'Вес скоростей соединений в кластерах',
    'Weight of relative compounded atoms count': 'Вес доли атомов в соединениях',
    'Weight of average links weight': 'Вес среднего веса связей',
    'Weight of new created links per step weight': 'Вес новых связей за шаг',
    'Weight of max polymer size': 'Вес макс. размера полимера',
    'Weight of average monomer vertexes count': 'Вес среднего числа вершин мономера',
    'Weight of average monomer unique types count': 'Вес среднего числа уникальных типов мономера',
    'Weight of average polymer vertexes count': 'Вес среднего числа вершин полимера',
    'Weight of average polymer size': 'Вес среднего размера полимера',
    'Weight of average polymer confidence score': 'Вес средней уверенности полимера',
    crossover: 'скрещивание',
    mutation: 'мутация',
    random: 'случайно',
    initial: 'начальный',

    Molecules: 'Молекулы',
    'Count bonded groups by chemical-like formulas from type names (Hill order: C, H, then A–Z). Free atoms are included as single-letter formulas.':
      'Подсчёт связанных групп по химико-подобным формулам из имён типов (порядок Хилла: C, H, затем A–Z). Свободные атомы входят как однобуквенные формулы.',
    Now: 'Сейчас',
    'Copy JSON': 'Копировать JSON',
    'Snapshot at step {0}': 'Снимок на шаге {0}',
    'Simulation not ready': 'Симуляция не готова',
    'JSON copied': 'JSON скопирован',
    Formula: 'Формула',
    Count: 'Число',
    Atoms: 'Атомы',
    'Mol %': 'Мол. %',
    'Atom %': 'Атом %',
    'Molecules: {0},': 'Молекулы: {0},',
    'free atoms: {0},': 'свободные атомы: {0},',
    'total atoms: {0}': 'всего атомов: {0}',
    Energy: 'Энергия',
    'Reset baseline E₀': 'Сбросить базу E₀',
    'Mean Mode': 'Режим среднего',
    'Total Energy': 'Полная энергия',
    'Kinetic / Potential': 'Кинетическая / потенциальная',
    FPS: 'FPS',
    'Atoms Mean Speed': 'Средняя скорость атомов',
    'Atoms Types Count': 'Число атомов по типам',
    'Atoms Type Mean Speed': 'Средняя скорость по типам',
    'Atoms Type Links Count': 'Число связей по типам атомов',
    'Atoms Type Links Mean Count': 'Среднее число связей по типам атомов',
    'New links / Deleted links': 'Новые связи / удалённые связи',
    'New links': 'Новые связи',
    'Deleted links': 'Удалённые связи',
    'New links / Deleted links Mean': 'Новые / удалённые связи (среднее)',
    'Links Types Created': 'Созданные связи по типам',
    'Links Types Deleted': 'Удалённые связи по типам',
    'Links Types Created Mean': 'Созданные связи по типам (среднее)',
    'Links Types Deleted Mean': 'Удалённые связи по типам (среднее)',
    'Transformations Count': 'Число трансформаций',
    'Transformations Mean Count': 'Среднее число трансформаций',
    'Transformations Type From Count': 'Трансформации: исходный тип',
    'Transformations Type To Count': 'Трансформации: целевой тип',
    'Transformations Type From Mean Count': 'Трансформации: исходный тип (среднее)',
    'Transformations Type To Mean Count': 'Трансформации: целевой тип (среднее)',

    'Hookean bonds, soft overlap bounce, 1/r² gravity.':
      'Пружинные связи, мягкий отскок при перекрытии, гравитация 1/r².',
    'acceleration (added to velocity)': 'ускорение (прибавляется к скорости)',
    'distance between the pair': 'расстояние между частицами',
    'type Mass (legacy Radius³)': 'масса типа (в старых конфигах — куб радиуса)',
    'type Radius': 'радиус типа',
    'rest length': 'длина покоя',
    'Gravity of the unlinked pair': 'гравитация несвязанной пары',
    'Link Bias of the bonded pair': 'смещение связи связанной пары',
    'overlap past the bound': 'выход за границу',
    'the two particle types': 'два типа частиц',
  },
};

export const builtInLocales: LocalePack[] = [englishLocale, russianLocale];
