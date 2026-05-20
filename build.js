
const fs = require('fs');
const path = require('path');

// Dummy Talk Data
const talksData = [
  {
    "id": "talk-1",
    "title": "The Future of AI in Cloud Computing",
    "speakers": ["Dr. Anya Sharma"],
    "category": ["Artificial Intelligence", "Cloud Computing"],
    "duration": 60,
    "description": "Explore the convergence of AI and cloud technologies, and what it means for the next decade of innovation."
  },
  {
    "id": "talk-2",
    "title": "Mastering Modern JavaScript Frameworks",
    "speakers": ["Ben Carter", "Chloe Davis"],
    "category": ["Web Development", "JavaScript"],
    "duration": 60,
    "description": "A comprehensive guide to popular JavaScript frameworks and best practices for building scalable web applications."
  },
  {
    "id": "talk-3",
    "title": "DevOps Practices for Microservices",
    "speakers": ["Eve Foster"],
    "category": ["DevOps", "Cloud Computing"],
    "duration": 60,
    "description": "Learn how to implement effective DevOps strategies for deploying and managing microservices architectures."
  },
  {
    "id": "talk-4",
    "speakers": ["Grace Hall"],
    "category": ["Cybersecurity", "Web Development"],
    "duration": 60,
    "description": "Essential secure coding principles and common vulnerabilities to protect your web applications from attacks."
  },
  {
    "id": "talk-5",
    "title": "Data Visualization with D3.js",
    "speakers": ["Ivan Jones"],
    "category": ["Data Science", "Front-end"],
    "duration": 60,
    "description": "Unlock the power of D3.js to create stunning and interactive data visualizations for complex datasets."
  },
  {
    "id": "talk-6",
    "title": "Quantum Computing: Beyond the Hype",
    "speakers": ["Dr. Kelly Lee"],
    "category": ["Quantum Computing", "Future Tech"],
    "duration": 60,
    "description": "A realistic look at the current state and future potential of quantum computing, demystifying the buzzwords."
  }
];

// Schedule Generation Logic
const generateSchedule = (talks, startTime, lunchBreakDurationMinutes, transitionDurationMinutes) => {
  const schedule = [];
  let currentTime = new Date(`2026-05-20T${startTime}:00`); // Use a dummy date for time calculations

  const addMinutes = (date, minutes) => new Date(date.getTime() + minutes * 60000);

  talks.forEach((talk, index) => {
    schedule.push({
      type: 'talk', // Explicitly add type for talks
      ...talk,
      startTime: currentTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }),
      endTime: addMinutes(currentTime, talk.duration).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })
    });
    currentTime = addMinutes(currentTime, talk.duration);

    if (index < talks.length - 1) { // Add transition between talks
      schedule.push({
        type: 'transition',
        startTime: currentTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }),
        endTime: addMinutes(currentTime, transitionDurationMinutes).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }),
        duration: transitionDurationMinutes
      });
      currentTime = addMinutes(currentTime, transitionDurationMinutes);
    }
  });

  // Insert lunch break after the 3rd talk
  const lunchBreakItem = {
    type: 'lunch',
    startTime: '', // Will be calculated after insertion
    endTime: '',   // Will be calculated after insertion
    duration: lunchBreakDurationMinutes
  };

  // Find the index of the 3rd talk
  let talkCounter = 0;
  let insertionIndex = -1;
  for (let i = 0; i < schedule.length; i++) {
    if (schedule[i].type === 'talk') {
      talkCounter++;
      if (talkCounter === 3) {
        insertionIndex = i + 1; // Insert after the 3rd talk
        break;
      }
    }
  }

  if (insertionIndex !== -1) {
    schedule.splice(insertionIndex, 0, lunchBreakItem);
  } else {
    // Fallback if less than 3 talks, insert before any transition or at end
    schedule.splice(Math.floor(schedule.length / 2), 0, lunchBreakItem);
  }


  // Recalculate all times after lunch break insertion
  let recalculatedTime = new Date(`2026-05-20T${startTime}:00`);

  for (let i = 0; i < schedule.length; i++) {
    const item = schedule[i];
    item.startTime = recalculatedTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
    item.endTime = addMinutes(recalculatedTime, item.duration).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
    recalculatedTime = addMinutes(recalculatedTime, item.duration);
  }

  return schedule;
};

const eventStartTime = "10:00";
const lunchBreakDuration = 60; // minutes
const transitionDuration = 10; // minutes

const fullSchedule = generateSchedule(talksData, eventStartTime, lunchBreakDuration, transitionDuration);

// Inline CSS
const inlineCss = `
  body {
    font-family: Arial, sans-serif;
    margin: 0;
    padding: 20px;
    background-color: #f4f4f4;
    color: #333;
  }
  .container {
    max-width: 960px;
    margin: 0 auto;
    background-color: #fff;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  }
  h1, h2 {
    color: #0056b3;
  }
  .schedule-item {
    background-color: #e9ecef;
    border: 1px solid #ddd;
    margin-bottom: 15px;
    padding: 15px;
    border-radius: 5px;
  }
  .schedule-item.talk {
    background-color: #f8f9fa;
    border-color: #cce5ff;
  }
  .schedule-item.lunch {
    background-color: #ffeeba;
    border-color: #ffeeba;
    font-weight: bold;
    color: #856404;
  }
  .schedule-item.transition {
    background-color: #f0f0f0;
    border-color: #ced4da;
    color: #6c757d;
    font-style: italic;
  }
  .talk-title {
    font-size: 1.2em;
    margin-bottom: 5px;
    color: #0056b3;
  }
  .talk-speakers {
    font-size: 0.9em;
    color: #666;
    margin-bottom: 5px;
  }
  .talk-category {
    font-size: 0.8em;
    color: #007bff;
    background-color: #e0f0ff;
    padding: 3px 8px;
    border-radius: 12px;
    display: inline-block;
    margin-right: 5px;
    margin-bottom: 5px;
  }
  .talk-description {
    font-size: 0.9em;
    line-height: 1.5;
  }
  .time-slot {
    font-weight: bold;
    color: #343a40;
    margin-bottom: 10px;
    display: block;
  }
  .search-container {
    margin-bottom: 20px;
    padding: 15px;
    background-color: #e9ecef;
    border-radius: 5px;
    display: flex;
    gap: 10px;
    align-items: center;
  }
  .search-container input[type="text"] {
    flex-grow: 1;
    padding: 8px;
    border: 1px solid #ced4da;
    border-radius: 4px;
    font-size: 1em;
  }
  .search-container button {
    padding: 8px 15px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 1em;
  }
  .search-container button.search-button {
    background-color: #007bff;
    color: white;
  }
  .search-container button.search-button:hover {
    background-color: #0056b3;
  }
  .search-container button.clear-button {
    background-color: #6c757d;
    color: white;
  }
  .search-container button.clear-button:hover {
    background-color: #545b62;
  }
  .hidden {
    display: none;
  }
`;

// Inline JavaScript - now a plain string with escaped template literal syntax
const inlineJs = `
  const talksData = ${JSON.stringify(talksData)};
  const fullSchedule = ${JSON.stringify(fullSchedule)};

  document.addEventListener('DOMContentLoaded', () => {
    const scheduleContainer = document.getElementById('schedule-list');
    const searchInput = document.getElementById('category-search');
    const searchButton = document.getElementById('search-button');
    const clearButton = document.getElementById('clear-button');

    function renderSchedule(data) {
      scheduleContainer.innerHTML = ''; // Clear previous schedule
      data.forEach(item => {
        let html = '';
        if (item.type === 'talk') {
          html = \`
            <div class="schedule-item talk" data-categories="\${item.category.join(',')}">
              <span class="time-slot">\${item.startTime} - \${item.endTime}</span>
              <h3 class="talk-title">\${item.title}</h3>
              <p class="talk-speakers">Speakers: \${item.speakers.join(', ')}</p>
              <div class="talk-categories">
                \${item.category.map(cat => \`<span class="talk-category">\${cat}</span>\`).join('')}
              </div>
              <p class="talk-description">\${item.description}</p>
            </div>
          \`;
        } else if (item.type === 'lunch') {
          html = \`
            <div class="schedule-item lunch">
              <span class="time-slot">\${item.startTime} - \${item.endTime}</span>
              <h2>Lunch Break (\${item.duration} minutes)</h2>
            </div>
          \`;
        } else if (item.type === 'transition') {
          html = \`
            <div class="schedule-item transition">
              <span class="time-slot">\${item.startTime} - \${item.endTime}</span>
              <p>Transition (\${item.duration} minutes)</p>
            </div>
          \`;
        }
        scheduleContainer.innerHTML += html;
      });
    }

    function filterTalks() {
      const searchTerm = searchInput.value.trim();
      const talkElements = document.querySelectorAll('.schedule-item.talk');

      talkElements.forEach(talkElement => {
        const categoriesAttr = talkElement.getAttribute('data-categories');
        const categories = categoriesAttr ? categoriesAttr.split(',').map(cat => cat.trim()) : [];

        if (!searchTerm) {
          talkElement.classList.remove('hidden');
          return;
        }

        // Exact match logic
        const match = categories.some(category => category === searchTerm);

        if (match) {
          talkElement.classList.remove('hidden');
        } else {
          talkElement.classList.add('hidden');
        }
      });
    }

    searchButton.addEventListener('click', filterTalks);
    clearButton.addEventListener('click', () => {
      searchInput.value = '';
      filterTalks();
    });

    // Initial render
    renderSchedule(fullSchedule);
  });
`;

// HTML Template
const htmlTemplate = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Technical Talks Event Schedule</title>
  <style>
    ${inlineCss}
  </style>
</head>
<body>
  <div class="container">
    <h1>Technical Talks Event Schedule</h1>

    <div class="search-container">
      <input type="text" id="category-search" placeholder="Search by exact category (e.g., Web Development)">
      <button id="search-button" class="search-button">Search</button>
      <button id="clear-button" class="clear-button">Clear</button>
    </div>

    <div id="schedule-list">
      <!-- Schedule items will be rendered here by JavaScript -->
    </div>
  </div>

  <script>
    ${inlineJs}
  </script>
</body>
</html>
`;

// Write the HTML file
const outputPath = path.join(__dirname, 'index.html');
fs.writeFileSync(outputPath, htmlTemplate, 'utf8');

console.log(`Successfully generated ${outputPath}`);

