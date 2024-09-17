// Fetch study plan data
let studyPlan;
fetch('studyPlan.json')
    .then(response => response.json())
    .then(data => {
        studyPlan = data;
        initializeApp();
    });

function initializeApp() {
    const dateDisplay = document.getElementById('dateDisplay');
    const prevDayBtn = document.getElementById('prevDay');
    const nextDayBtn = document.getElementById('nextDay');
    const content = document.getElementById('content');

    let currentDayIndex = getCurrentDayIndex();

    function renderDay(index) {
        if (index < 0 || index >= studyPlan.length) {
            content.innerHTML = '<p>No study plan for this day.</p>';
            dateDisplay.textContent = 'N/A';
            return;
        }

        const dayPlan = studyPlan[index];
        dateDisplay.textContent = dayPlan.date;
        content.innerHTML = '';

        dayPlan.sections.forEach(section => {
            const sectionDiv = document.createElement('div');
            sectionDiv.classList.add('section');

            const h2 = document.createElement('h2');
            h2.textContent = section.title;
            sectionDiv.appendChild(h2);

            const ul = document.createElement('ul');
            section.items.forEach(item => {
                const li = document.createElement('li');
                if (item.link) {
                    const a = document.createElement('a');
                    a.href = item.link;
                    a.target = '_blank';
                    a.textContent = item.text;
                    li.appendChild(a);
                } else {
                    li.textContent = item.text;
                }
                ul.appendChild(li);
            });
            sectionDiv.appendChild(ul);
            content.appendChild(sectionDiv);
        });
    }

    function getCurrentDayIndex() {
        const today = new Date();
        const startDate = new Date(studyPlan[0].date);
        const diffTime = today - startDate;
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        return diffDays >= 0 && diffDays < studyPlan.length ? diffDays : 0;
    }

    prevDayBtn.addEventListener('click', () => {
        if (currentDayIndex > 0) {
            currentDayIndex--;
            renderDay(currentDayIndex);
        }
    });

    nextDayBtn.addEventListener('click', () => {
        if (currentDayIndex < studyPlan.length - 1) {
            currentDayIndex++;
            renderDay(currentDayIndex);
        }
    });

    renderDay(currentDayIndex);
}