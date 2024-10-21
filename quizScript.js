const quizContainer = document.getElementById('quizContainer');
const start = document.getElementById('start');
const nextButton = document.getElementById('nextBtn');
const submitBtn = document.getElementById('submitBtn');
const url = 'https://jsonplaceholder.typicode.com/posts';
const TIMEOUT_DURATION = 20000;

let currentQuestionIndex;
let questions = [];
let answers = [];
let timer;

submitBtn.addEventListener("click", () => {
    const userID = document.getElementById('userID').value;
    currentQuestionIndex = (userID * 10) - 10; // Kullanıcı ID'sine göre başlangıç
    start.style.display = "none";
    dataFetch();
});

function dataFetch() {
    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('API\'den veri alınamadı');
            }
            return response.json();
        })
        .then(data => {
            // Kullanıcı ID'sine göre soruları filtrele
            questions = data.slice(currentQuestionIndex, currentQuestionIndex + 10); // 10 soru al
            showQuestion(0); // İlk soruyu göster
        })
        .catch(error => console.error('Hata:', error));
}

function determine() {
    currentQuestionIndex++;
    if (currentQuestionIndex % 10 === 0 || currentQuestionIndex === questions.length) {
        showResults();
    } else {
        showQuestion(currentQuestionIndex % 10); // Soru dizisinin içinde kal
    }
}

function passQuestion() {
    determine();
    clearTimeout(timer);
}

nextButton.addEventListener('click', passQuestion);

function showQuestion(questionIndex) {
    clearTimeout(timer);
    const question = questions[questionIndex];
    const questionElement = document.createElement('div');
    questionElement.innerHTML = `
        <h2>Soru ${questionIndex + 1}:</h2>
        <p>${question.title}</p>
    `;
    
    const answerOptions = parseAnswers(question.body);
    answerOptions.forEach((answer, index) => {
        const radioButton = document.createElement('input');
        radioButton.setAttribute('type', 'radio');
        radioButton.setAttribute('name', 'answer');
        radioButton.setAttribute('value', answer);
        const label = document.createElement('label');
        label.textContent = `${String.fromCharCode(65 + index)}: ${answer}`; // A, B, C, D
        questionElement.appendChild(radioButton);
        questionElement.appendChild(label);
        questionElement.appendChild(document.createElement('br')); // Satır sonu ekle
    });
    
    quizContainer.innerHTML = '';
    quizContainer.appendChild(questionElement);
    
    const radioButtons = document.querySelectorAll('input[type="radio"]');
    radioButtons.forEach(radioButton => {
        radioButton.disabled = true;
    });

    // İlk timeout: radioButtons'u 10 saniye sonra aktif hale getirir
    setTimeout(() => {
        radioButtons.forEach(radioButton => {
            radioButton.disabled = false;
        });
        console.log('Radio buttons aktifleştirildi.');

        // İkinci timeout: TIMEOUT_DURATION sonunda passQuestion fonksiyonunu çağırır
        timer = setTimeout(passQuestion, 20000);
        console.log('timer başlatıldı');
    }, 10000); // 10 saniye

}

function parseAnswers(answers) {
    return answers.split('\n');
}

function showResults() {
    const resultContainer = document.createElement('div');
    resultContainer.innerHTML = '<h2>Sonuçlar</h2>';
    questions.forEach((question, index) => {
        resultContainer.innerHTML += `<p><strong>Soru ${index + 1}:</strong> ${question.title}<br>
                                      <strong>Cevap:</strong> ${answers[index] || 'Cevap verilmedi'}<br>
                                      <strong>Şıklar:</strong> A: ${parseAnswers(question.body)[0]}, B: ${parseAnswers(question.body)[1]}, C: ${parseAnswers(question.body)[2]}, D: ${parseAnswers(question.body)[3]}</p>`;
    });
    quizContainer.innerHTML = '';
    quizContainer.appendChild(resultContainer);
    nextButton.style.display = 'none'; 
}

quizContainer.addEventListener('change', (event) => {
    const selectedAnswer = event.target.value;
    answers[currentQuestionIndex % 10] = selectedAnswer; // Sorunun indeksini mod alarak kaydet
});
