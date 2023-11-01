document.addEventListener('DOMContentLoaded', () => {
  const startInterviewBtn = document.getElementById('startInterview');
  const resultDiv = document.getElementById('result');

  startInterviewBtn.addEventListener('click', async () => {
    try {
      const res = await fetch('http://20.163.15.91:3000/interview', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await res.json();
      resultDiv.innerHTML = `Interview Results: ${data.interviewData}`;
    } catch (error) {
      resultDiv.innerHTML = 'An error occurred. Please try again.';
    }
  });
});
