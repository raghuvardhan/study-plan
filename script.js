// Dummy data and real data
const plans = {
    "studyPlan": "studyPlan.json",
    "dummyPlan": "dummyPlan.json"
};

// Fetch the plan data and initialize app
let currentPlan = "studyPlan";
let studyPlan, currentDayIndex = 0;
let checkedTasks = {};

function fetchPlanData(plan) {
    return fetch(plans[plan])
        .then(response => response.json())
        .then(data => {
            studyPlan = data;
            initializeApp();
        });
}

// Initialize the app
function initializeApp() {
    renderMenu();
    renderDay(currentDayIndex);
    document.getElementById('prevDay').addEventListener('click', prevDay);
    document.getElementById('nextDay').addEventListener('click', nextDay);
    document.getElementById('addTaskBtn').addEventListener('click', showAddTaskForm);
    document.getElementById('submitTask').addEventListener('click', addTask);
}

// Render menu with progress percentage
function renderMenu() {
    const menu = document.getElementById('planMenu');
    menu.innerHTML = '';
    for (let plan in plans) {
        const menuItem = document.createElement('li');
        const link = document.createElement('a');
        link.href = '#';
        link.textContent = plan.charAt(0).toUpperCase() + plan.slice(1);
        link.addEventListener('click', () => switchPlan(plan));
        menuItem.appendChild(link);
        menu.appendChild(menuItem);
    }
}

// Switch between plans
function switchPlan(plan) {
    currentPlan = plan;
    fetchPlanData(plan);
}

function renderDay(index) {

    if (index < 0 || index >= studyPlan.length) {
        content.innerHTML = '<p>No study plan for this day.</p>';
        dateDisplay.textContent = 'N/A';
        return;
    }

    const dayPlan = studyPlan[index];
    const content = document.getElementById('content');
    const dateDisplay = document.getElementById('dateDisplay');
    dateDisplay.textContent = dayPlan.date;
    content.innerHTML = '';

    dayPlan.sections.forEach(section => {
        const sectionDiv = document.createElement('div');
        sectionDiv.classList.add('section');

        const h2 = document.createElement('h2');
        h2.textContent = section.title;
        sectionDiv.appendChild(h2);

        const ul = document.createElement('ul');
        section.items.forEach((item, i) => {
            const li = document.createElement('li');
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.checked = checkedTasks[dayPlan.date] && checkedTasks[dayPlan.date][section.title] && checkedTasks[dayPlan.date][section.title][i] || false;
            checkbox.addEventListener('change', () => toggleTaskCompletion(dayPlan.date, section.title, i, checkbox.checked));
            li.appendChild(checkbox);

            if (item.link) {
                const a = document.createElement('a');
                a.href = item.link;
                a.target = '_blank';
                a.textContent = item.text;
                li.appendChild(a);
            } else {
                li.appendChild(document.createTextNode(item.text));
            }
            ul.appendChild(li);
        });
        sectionDiv.appendChild(ul);
        content.appendChild(sectionDiv);
    });

    updateProgress(dayPlan.date);
}

// Toggle task completion and save it
function toggleTaskCompletion(date, section, index, completed) {
    if (!checkedTasks[date]) checkedTasks[date] = {};
    if (!checkedTasks[date][section]) checkedTasks[date][section] = [];
    checkedTasks[date][section][index] = completed;
    updateProgress(date);
}

// Update progress bar
function updateProgress(date) {
    const dayPlan = studyPlan.find(plan => plan.date === date);
    const totalTasks = dayPlan.sections.reduce((acc, section) => acc + section.items.length, 0);
    const completedTasks = dayPlan.sections.reduce((acc, section) => acc + section.items.filter((_, i) => checkedTasks[date] && checkedTasks[date][section.title] && checkedTasks[date][section.title][i]).length, 0);

    const progressPercent = Math.floor((completedTasks / totalTasks) * 100);
    document.getElementById('progressPercent').textContent = progressPercent;
    document.getElementById('progress').style.width = progressPercent + '%';
}

// Add task form toggle
function showAddTaskForm() {
    const form = document.getElementById('addTaskForm');
    form.classList.toggle('hidden');
}

// Add new task to the plan
function addTask() {
    const title = document.getElementById('taskTitle').value;
    const link = document.getElementById('taskLink').value;
    const section = document.getElementById('taskSection').value;

    const newTask = { text: title };
    if (link) newTask.link = link;

    const dayPlan = studyPlan[currentDayIndex];
    const sectionToUpdate = dayPlan.sections.find(sec => sec.title.toLowerCase() === section);

    if (sectionToUpdate) {
        sectionToUpdate.items.push(newTask);
    } else {
        dayPlan.sections.push({ title: section.charAt(0).toUpperCase() + section.slice(1), items: [newTask] });
    }

    renderDay(currentDayIndex);
}

// Navigate to previous and next days
function prevDay() {
    if (currentDayIndex > 0) {
        currentDayIndex--;
        renderDay(currentDayIndex);
    }
}

function nextDay() {
    if (currentDayIndex < studyPlan.length - 1) {
        currentDayIndex++;
        renderDay(currentDayIndex);
    }
}

// Initialize with default study plan
fetchPlanData(currentPlan);
