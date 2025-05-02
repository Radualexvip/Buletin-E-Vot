const electionDate = new Date('2025-05-04T00:00:00+03:00'); // EEST timezone

// Timer function for index.html
function updateCountdown() {
    const countdownElement = document.getElementById('countdown');
    if (!countdownElement) return; // Skip if not on index.html

    const now = new Date();
    const timeLeft = electionDate - now;

    if (timeLeft <= 0) {
        countdownElement.innerHTML = '<span class="message show">Votul a început!</span>';
        return;
    }

    const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

    document.getElementById('days').textContent = days;
    document.getElementById('hours').textContent = hours;
    document.getElementById('minutes').textContent = minutes;
    document.getElementById('seconds').textContent = seconds;
}

setInterval(updateCountdown, 1000);

// Verification function for index.html
function verifyIdentity() {
    const idPhoto = document.getElementById('id-photo').files[0];
    const idSeries = document.getElementById('id-series').value.trim();
    const message = document.getElementById('verification-message');

    if (!idPhoto || !idSeries) {
        message.textContent = 'Te rugăm să încarci poza buletinului și să introduci seria.';
        message.classList.add('show');
        return;
    }

    // Simulated verification
    if (idSeries.match(/^[A-Z]{2}\d{6}$/)) {
        localStorage.setItem('isVerified', 'true');
        message.textContent = 'Verificare reușită! Vei fi redirecționat către pagina de vot.';
        message.style.color = '#00ff88';
        message.classList.add('show');
        setTimeout(() => {
            window.location.href = 'vote.html';
        }, 1500);
    } else {
        message.textContent = 'Seria buletinului este invalidă. Format: 2 litere + 6 cifre (ex: AB123456).';
        message.classList.add('show');
    }
}

// Voting logic for vote.html
function setupVotingPage() {
    const voteForm = document.getElementById('vote-form');
    if (!voteForm) return; // Skip if not on vote.html

    const isVerified = localStorage.getItem('isVerified');
    const hasVoted = localStorage.getItem('hasVoted');
    const message = document.getElementById('vote-message');

    if (!isVerified) {
        message.textContent = 'Trebuie să te verifici mai întâi!';
        message.classList.add('show');
        voteForm.querySelector('button').disabled = true;
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1500);
        return;
    }

    if (hasVoted) {
        const votedCandidate = localStorage.getItem('votedCandidate');
        message.textContent = `Ai votat deja pentru ${votedCandidate}! Votul nu poate fi modificat.`;
        message.style.color = '#00ff88';
        message.classList.add('show');
        voteForm.querySelector('button').disabled = true;
        return;
    }

    voteForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const selectedCandidate = document.querySelector('input[name="candidate"]:checked');
        if (!selectedCandidate) {
            message.textContent = 'Te rugăm să selectezi un candidat.';
            message.classList.add('show');
            return;
        }

        // Store vote
        localStorage.setItem('hasVoted', 'true');
        localStorage.setItem('votedCandidate', selectedCandidate.value);

        message.textContent = `Votul tău pentru ${selectedCandidate.value} a fost înregistrat!`;
        message.style.color = '#00ff88';
        message.classList.add('show');
        voteForm.querySelector('button').disabled = true;
    });
}

// Run appropriate setup based on page
window.onload = function() {
    updateCountdown();
    setupVotingPage();
};