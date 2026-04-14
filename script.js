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
    currentQuestion = 0;
    let base = [...imageFiles];
    
    // 1. 기본 8개 이미지 셔플
    for (let i = base.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [base[i], base[j]] = [base[j], base[i]];
    }
    
    // 2. 추가 문제 2개 선택 (전체에서 랜덤)
// 2. 추가 문제 2개 선택 (중복을 최소화하기 위해 base에서 2개를 가져옴)
    // 이미 섞인 base 배열의 앞 2개를 가져오면 무조건 서로 다른 2개가 추가됩니다.
    let extra = [base[0], base[1]];
    for(let i=0; i<2; i++) {
        extra.push(imageFiles[Math.floor(Math.random() * imageFiles.length)]);
    }
    
    // 3. 합치기
    let combined = [...base, ...extra];
    
    // 4. 절대 중복 금지 셔플 (중요 로직)
    // 배열을 섞으면서 이전 항목과 현재 항목이 같으면 다시 섞거나 자리를 바꿉니다.
    for (let i = 0; i < combined.length; i++) {
        // 무작위 인덱스 j 선택
        let j = Math.floor(Math.random() * combined.length);
        
        // 교체했을 때 '앞 항목' 혹은 '뒷 항목'과 같아지지 않을 때만 교체
        // i가 0일 때는 앞 항목이 없으므로 통과
        if (i > 0 && combined[j] === combined[i - 1]) continue;
        
        [combined[i], combined[j]] = [combined[j], combined[i]];
    }

    // 5. 최종 확인용 안전장치 (한 번 더 검사)
    for (let i = 1; i < combined.length; i++) {
        if (combined[i] === combined[i - 1]) {
            // 만약 연속된 게 발견되면 맨 마지막 항목과 교체 (그래도 같으면 그 다음 항목과 교체)
            let nextIndex = (i + 1) % combined.length;
            [combined[i], combined[nextIndex]] = [combined[combined.length - 1], combined[i]];
        }
    }
    
    quizSet = combined;
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
