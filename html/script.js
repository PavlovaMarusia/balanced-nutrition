const quizData = [
    {
        question: "А когда с человеком может произойти дрожемент?",
        answers: [
            { text: "Когда он влюбляется", isCorrect: false },
            { text: "Когда он идет шопиться", isCorrect: false },
            { text: "Когда он слышит смешную шутку", isCorrect: false },
            { text: "Когда он боится, пугается", isCorrect: true, explanation: "Лексема «дрожемент» имплицирует состояние крайнего напряжения и страха: «У меня всегда дрожемент в ногах, когда копы подходят»." }
        ]
    },
    {
        question: "Говорят, Антон заовнил всех. Это еще как понимать?",
        answers: [
            { text: "Как так, заовнил? Ну и хамло. Кто с ним теперь дружить-то будет?", isCorrect: false },
            { text: "Антон очень надоедливый и въедливый человек, всех задолбал", isCorrect: false },
            { text: "Молодец, Антон, всех победил!", isCorrect: true, explanation: "Термин «заовнить» заимствован из английского языка, он происходит от слова own и переводится как «победить», «завладеть», «получить»." },
            { text: "Нет ничего плохого в том, что Антон тщательно выбирает себе друзей", isCorrect: false }
        ]
    },
    {
        question: "А фразу «заскамить мамонта» как понимать?",
        answers: [
            { text: "Разозлить кого-то из родителей", isCorrect: false },
            { text: "Увлекаться археологией", isCorrect: false },
            { text: "Развести недотепу на деньги", isCorrect: true, explanation: "Заскамить мамонта — значит обмануть или развести на деньги. Почему мамонта? Потому что мошенники часто выбирают в жертвы пожилых людей (древних, как мамонты), которых легко обвести вокруг пальца." },
            { text: "Оскорбить пожилого человека", isCorrect: false }
        ]
    },
    {
        question: "Кто такие бефефе?",
        answers: [
            { text: "Вши?", isCorrect: false },
            { text: "Милые котики, такие милые, что бефефе", isCorrect: false },
            { text: "Лучшие друзья", isCorrect: true, explanation: "Бефефе — это лучшие друзья. Этакая аббревиатура от английского выражения best friends forever." },
            { text: "Люди, которые не держат слово", isCorrect: false }
        ]
    },
    {
        question: "Что из перечисленного можно назвать крашем, если ты чиллишь в компании и вдруг залипаешь на кого-то?",
        answers: [
            { text: "Человек, который тебе очень нравится и вызывает симпатию.", isCorrect: true, explanation: "«Краш» — это объект симпатии; «чиллить» — расслабляться, отдыхать; «залипать» — засматриваться или задумываться." },
            { text: "Тот, на кого приятно смотреть и хочется общаться.", isCorrect: true, explanation: "«Краш» — это объект симпатии; «чиллить» — расслабляться, отдыхать; «залипать» — засматриваться или задумываться." },
            { text: "Твоя сильно накрашенная подруга, которая переоценила свой макияж.", isCorrect: false },
            { text: "Трэш в более мягкой интерпретации.", isCorrect: false }
        ]
    }
];


let currentQuestionIndex = 0;
let correctAnswersCount = 0;
let isAnswered = false;

const container  = document.getElementById('quiz-container');
const endMessage = document.getElementById('end-message');
const stats = document.getElementById('stats');


function shuffle(array) {
    let currentIndex = array.length, randomIndex;
    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
    }
    return array;
}


shuffle(quizData);
quizData.forEach(q => shuffle(q.answers));

console.log(quizData);

function renderQuestion() {
    if (currentQuestionIndex >= quizData.length) {
        endQuiz();
        return;
    }

    isAnswered = false;
    const qData = quizData[currentQuestionIndex];


    const qBlock = document.createElement('div');
    qBlock.className = 'question-block';
    qBlock.id = `question-${currentQuestionIndex}`;

    const content = document.createElement('div');
    content.className = 'question-content';

    const qText = document.createElement('span');
    qText.className = 'question-text';
    qText.innerText = `${currentQuestionIndex + 1}. ${qData.question}`;

    const marker = document.createElement('span');
    marker.className = 'marker';
    marker.innerHTML = '&nbsp;';

    content.appendChild(qText);
    content.appendChild(marker);
    qBlock.appendChild(content);
    


    const answersRow = document.createElement('div');
    answersRow.className = 'answers-container';

    qData.answers.forEach((ans, index) => {
        const ansBtn = document.createElement('div');
        ansBtn.className = 'answer-btn';
        ansBtn.innerHTML = `
            <div>${ans.text}</div>
            <div class="explanation">${ans.explanation || ''}</div>`;

        ansBtn.addEventListener('click', () =>
            handleAnswer(index, ansBtn, answersRow, marker, qData)
        );
        answersRow.appendChild(ansBtn);
    });

    
    qBlock.appendChild(answersRow);
    container.appendChild(qBlock);
}


function handleAnswer(selectedIndex, selectedBtn, answersRow, marker, qData) {
    if (isAnswered) return;
    isAnswered = true;

    const isCorrect = qData.answers[selectedIndex].isCorrect;
    const allBtns = Array.from(answersRow.children);

    allBtns.forEach(btn => btn.classList.add('disabled'));

    if (isCorrect) {
        correctAnswersCount++;
        
        selectedBtn.classList.add('correct-expanded');

        setTimeout(() => {
            marker.innerText = isCorrect ? '✔' : '✖';
            marker.classList.add(isCorrect ? 'correct' : 'incorrect', 'show');

            const incorrectBtns = allBtns.filter(btn => btn !== selectedBtn);

            incorrectBtns.forEach((btn, index) => {
                setTimeout(() => btn.classList.add('slide-right'), index * 200);
            });

            const slideTime = incorrectBtns.length * 200;

            setTimeout(() => {
                selectedBtn.classList.add('fade-out');

                setTimeout(() => {
                    answersRow.classList.add('answers-hidden');
                    currentQuestionIndex++;
                    renderQuestion();
                }, 300);

            }, slideTime + 500);
        }, 2000);
    } else {
        setTimeout(() => { 
            marker.innerText = '✖';
            marker.classList.add('incorrect', 'show');
        }, 1500);
        setTimeout(() => {
            allBtns.forEach((btn, index) => {
                setTimeout(() => btn.classList.add('slide-right'), index * 200);
            });

            setTimeout(() => {
                answersRow.classList.add('answers-hidden');
                currentQuestionIndex++;
                renderQuestion();
            }, allBtns.length * 200 + 500);
        }, 2000);
    }
}


function endQuiz() {
    endMessage.style.display = 'block';
    stats.style.display = 'block';
    stats.innerText = `Правильных ответов: ${correctAnswersCount} из ${quizData.length}`;

    const allQuestionBlocks = document.querySelectorAll('.question-content');

    allQuestionBlocks.forEach((block, index) => {
        block.classList.add('clickable-end');

        const qData = quizData[index];
        const correctAnswers = qData.answers.filter(a => a.isCorrect);

        const revealContainer = document.createElement('div');
        revealContainer.className = 'revealed-container';

        correctAnswers.forEach(ans => {
            const revealDiv = document.createElement('div');
            revealDiv.className = 'revealed-answer';
            revealDiv.innerHTML = `
                <div>${ans.text}</div>
            `;
            revealContainer.appendChild(revealDiv);
        });

        block.parentNode.appendChild(revealContainer);

        block.addEventListener('click', function onClick() {
            if (revealContainer.style.display === 'flex') return
            document.querySelectorAll('.revealed-container')
                    .forEach(el => el.style.display = 'none');
            revealContainer.style.display = 'flex';
        });
    });
}


renderQuestion();