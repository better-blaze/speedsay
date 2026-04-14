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

// 1. 문제 셋 만들기 (8개 셔플 + 랜덤 2개 추가 후 다시 셔플)
function prepareQuiz() {
    let base = [...imageFiles];
    // 배열 섞기 (Fisher-Yates 셔플 알고리즘)
    for (let i = base.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [base[i], base[j]] = [base[j], base[i]];
    }
    
    // 추가 문제 2개 랜덤 선택 (중복 허용)
    let extra = [];
    for(let i=0; i<2; i++) {
        extra.push(imageFiles[Math.floor(Math.random() * imageFiles.length)]);
    }
    
    // 합치고 다시 최종 셔플
    quizSet = [...base, ...extra];
    for (let i = quizSet.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [quizSet[i], quizSet[j]] = [quizSet[j], quizSet[i]];
    }
}

// 2. 카운트다운 및 시작
startBtn.addEventListener('click', () => {
    startBtn.style.display = 'none';
    prepareQuiz();
    
    let count = 3;
    countdownEl.innerText = count;
    countdownEl.style.display = 'block'; // 카운트다운 보이게
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
    
    // 내부적으로 시간 기록 시작 (화면 표시 안 함)
    startTime = Date.now();
    
    showQuestion();
}

function showQuestion() {
    if (currentQuestion < totalQuestions) {
        // 이미지 경로 설정 (HTML과 같은 폴더에 있다고 가정)
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

// 4. 종료 (극적 연출)
function endGame() {
    // 게임 영역 청소
    gameImg.style.display = 'none';
    nextBtn.style.display = 'none';
    qNumEl.innerText = "게임 완료!";
    
    // 걸린 시간 계산 (초 단위)
    const finalTime = (Date.now() - startTime) / 1000;
    
    // 결과 화면 표시
    resultScreen.style.display = 'block';
    // 시간을 소수점 둘째 자리까지 크게 표시
    finalTimeEl.innerText = `${finalTime.toFixed(2)}s`;
}
/* ... 기존 코드 생략 ... */

// 3. 게임 시작 함수 내부에 추가하거나 하단에 독립적으로 추가
function startGame() {
    gameImg.style.display = 'block';
    nextBtn.style.display = 'inline-block';
    
    startTime = Date.now();
    showQuestion();
}

// [수정/추가] 엔터키 이벤트 리스너
window.addEventListener('keydown', (event) => {
    // 1. 엔터키(Enter)가 눌렸는지 확인
    if (event.key === 'Enter') {
        
        // 2. 게임 시작 전이라면 (시작 버튼이 보이는 상태) 게임 시작
        if (startBtn.style.display !== 'none') {
            startBtn.click();
        } 
        // 3. 게임 중이라면 (Next 버튼이 보이는 상태) 다음 문제로
        else if (nextBtn.style.display !== 'none') {
            currentQuestion++;
            showQuestion();
        }
    }
});

/* ... showQuestion, endGame 함수 등 기존 코드 ... */
