// 설정
const totalQuestions = 10;
const imageFiles = [
    'image1.jpg', 'image2.jpg', 'image3.jpg', 'image4.jpg',
    'image5.jpg', 'image6.jpg', 'image7.jpg', 'image8.jpg'
];

let currentQuestion = 0;
let startTime;
let quizSet = [];

const startBtn = document.getElementById('start-btn');
const nextBtn = document.getElementById('next-btn');
const gameImg = document.getElementById('game-image');
const countdownEl = document.getElementById('countdown');
const qNumEl = document.getElementById('question-number');
const resultScreen = document.getElementById('result-screen');
const finalTimeEl = document.getElementById('final-time');
const recordListEl = document.getElementById('record-list');

// 1. 문제 셋 만들기
function prepareQuiz() {
    currentQuestion = 0; // 변수 초기화 추가
    let base = [...imageFiles];
    
    // 셔플
    for (let i = base.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [base[i], base[j]] = [base[j], base[i]];
    }
    
    let extra = [];
    for(let i=0; i<2; i++) {
        extra.push(imageFiles[Math.floor(Math.random() * imageFiles.length)]);
    }
    
    quizSet = [...base, ...extra];
    quizSet.sort(() => Math.random() - 0.5);
}

// 2. 시작 버튼 클릭
startBtn.addEventListener('click', () => {
    startBtn.style.display = 'none';
    prepareQuiz();
    
    let count = 3;
    countdownEl.innerText = count;
    countdownEl.style.display = 'block';
    qNumEl.innerText = "준비...";
    
    const countTimer = setInterval(() => {
        count--;
        if (count > 0) {
            countdownEl.innerText = count;
        } else {
            clearInterval(countTimer);
            countdownEl.style.display = 'none';
            startGame();
        }
    }, 1000);
});

// 3. 게임 시작
function startGame() {
    gameImg.style.display = 'block';
    nextBtn.style.display = 'inline-block';
    startTime = Date.now();
    showQuestion();
}

function showQuestion() {
    if (currentQuestion < totalQuestions) {
        gameImg.src = quizSet[currentQuestion]; 
        qNumEl.innerText = `문제: ${currentQuestion + 1} / ${totalQuestions}`;
    } else {
        endGame();
    }
}

nextBtn.addEventListener('click', () => {
    currentQuestion++;
    showQuestion();
});

// 4. 종료 및 기록 저장
function endGame() {
    gameImg.style.display = 'none';
    nextBtn.style.display = 'none';
    qNumEl.innerText = "게임 완료!";
    
    const finalTime = (Date.now() - startTime) / 1000;
    resultScreen.style.display = 'block';
    finalTimeEl.innerText = `${finalTime.toFixed(2)}s`;

    saveAndShowRecords(finalTime);
}

function saveAndShowRecords(currentTime) {
    let records = JSON.parse(localStorage.getItem('webGameRecords')) || [];

    if (currentTime <= 10) {
        records.push(currentTime);
    }

    records.sort((a, b) => a - b);
    localStorage.setItem('webGameRecords', JSON.stringify(records));

    recordListEl.innerHTML = ''; 
    // 상위 5개만 표시
    records.slice(0, 5).forEach((rec, index) => {
        const li = document.createElement('li');
        li.innerHTML = `<span>${index + 1}위</span> <strong>${rec.toFixed(2)}s</strong>`;
        recordListEl.appendChild(li);
    });
}

// 5. 엔터키 제어 (캡처링 모드)
window.focus(); 
window.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        event.preventDefault();

        if (resultScreen.style.display === 'block') {
            location.reload();
        }
        else if (startBtn.style.display !== 'none') {
            startBtn.click();
        } 
        else if (nextBtn.style.display !== 'none') {
            currentQuestion++;
            showQuestion();
        }
    }
}, true);

// 기록 초기화 함수
function clearRanking() {
    if (confirm("저장된 모든 명예의 전당 기록을 삭제할까요?")) {
        localStorage.removeItem('webGameRecords');
        // 기록판 UI 바로 비우기
        const recordListEl = document.getElementById('record-list');
        if (recordListEl) recordListEl.innerHTML = '';
        alert("기록이 초기화되었습니다.");
    }
}
