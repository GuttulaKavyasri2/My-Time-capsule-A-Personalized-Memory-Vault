let isDark = false;

function toggleTheme() {
  document.body.classList.toggle('dark-theme');
  isDark = !isDark;
  document.getElementById('themeSwitcher').textContent = isDark ? '☀️ Light Mode' : '🌙 Dark Mode';
}

function showSection(section) {
  document.getElementById('add-section').style.display = section === 'add' ? 'block' : 'none';
  document.getElementById('view-section').style.display = section === 'view' ? 'block' : 'none';
  if (section === 'view') loadMemories();
}

document.getElementById('memoryForm').addEventListener('submit', function(e) {
  e.preventDefault();

  const title = document.getElementById('title').value;
  const description = document.getElementById('description').value;
  const category = document.getElementById('category').value;
  const unlockDate = document.getElementById('unlockDate').value;

  const memory = {
    id: Date.now(),
    title,
    description,
    category,
    unlockDate,
    createdAt: new Date().toISOString()
  };

  let memories = JSON.parse(localStorage.getItem('memories') || '[]');
  memories.push(memory);
  localStorage.setItem('memories', JSON.stringify(memories));

  alert("Memory saved!");
  this.reset();
});

function loadMemories() {
  const container = document.getElementById('memoriesContainer');
  const filter = document.getElementById('filterCategory').value.toLowerCase();
  container.innerHTML = "";

  const today = new Date().toISOString().split('T')[0];
  const memories = JSON.parse(localStorage.getItem('memories') || '[]');

  const filtered = filter ? memories.filter(m => m.category.toLowerCase().includes(filter)) : memories;

  if (filtered.length === 0) {
    container.innerHTML = "<p>No memories found.</p>";
    return;
  }

  filtered.forEach(mem => {
    const isUnlocked = mem.unlockDate <= today;
    const daysLeft = Math.ceil((new Date(mem.unlockDate) - new Date(today)) / (1000 * 60 * 60 * 24));

    const div = document.createElement('div');
    div.className = 'memory-card';
    if (!isUnlocked) div.classList.add('locked');

    div.innerHTML = `
      <h3>${mem.title}</h3>
      <p><strong>Category:</strong> ${mem.category}</p>
      <p><strong>Unlock Date:</strong> ${mem.unlockDate}</p>
      ${isUnlocked ? `<p>${mem.description}</p>` : `<p>🔒 Locked. ${daysLeft} day(s) left.</p>`}
      <button onclick="deleteMemory(${mem.id})">🗑️ Delete</button>
    `;

    container.appendChild(div);
  });
}

function deleteMemory(id) {
  if (!confirm("Are you sure you want to delete this memory?")) return;
  let memories = JSON.parse(localStorage.getItem('memories') || '[]');
  memories = memories.filter(m => m.id !== id);
  localStorage.setItem('memories', JSON.stringify(memories));
  loadMemories();
}
