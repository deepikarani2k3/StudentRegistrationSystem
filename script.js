//Select all req. DOM elements
const form = document.getElementById('studentForm');
const nameInput = document.getElementById('name');
const idInput = document.getElementById('studentId');
const emailInput = document.getElementById('email');
const contactInput = document.getElementById('contact');
const tableBody = document.getElementById('studentTableBody');
const notification = document.getElementById('notification');

// Sorting controls
const sortBySelect = document.getElementById('sortBy');
const sortAscBtn = document.getElementById('sortAsc');
const sortDescBtn = document.getElementById('sortDesc');

let students = JSON.parse(localStorage.getItem('students')) || [];

//notification msgs
function showNotification(msg) {
    notification.textContent = msg;
    notification.style.display = 'block';
    setTimeout(() => notification.style.display = 'none', 3000);
}

//Render table
function renderTable() {
    tableBody.innerHTML = '';
    students.forEach((student, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
      <td>${student.id}</td>
      <td>${student.name}</td>
      <td>${student.email}</td>
      <td>${student.contact}</td>
      <td class="actions">
        <i class="fa-solid fa-pen-to-square" title="Edit Student" onclick="editStudent(${index})"></i>
        <i class="fa-solid fa-trash" title="Delete Student" onclick="deleteStudent(${index})"></i>
      </td>
    `;
        tableBody.appendChild(row);
    });
}

// Validate inputs
function validateInputs() {
    const nameRegex = /^[A-Za-z ]+$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const contactRegex = /^[0-9]{10,15}$/;

    if (!nameRegex.test(nameInput.value)) {
        showNotification('Name must contain only letters');
        return false;
    }
    if (isNaN(idInput.value) || idInput.value.trim() === '') {
        showNotification('ID must be a number');
        return false;
    }
    // Unique Student ID check
    if (students.some(stu => stu.id === idInput.value.trim())) {
        showNotification('Student ID must be unique');
        return false;
    }
    if (!emailRegex.test(emailInput.value)) {
        showNotification('Invalid email format');
        return false;
    }
    if (!contactRegex.test(contactInput.value)) {
        showNotification('Contact must be 10–15 digits only');
        return false;
    }
    return true;
}

// Add new student
form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!validateInputs()) return;

    const student = {
        name: nameInput.value.trim(),
        id: idInput.value.trim(),
        email: emailInput.value.trim(),
        contact: contactInput.value.trim()
    };

    students.push(student);
    localStorage.setItem('students', JSON.stringify(students));
    renderTable();
    showNotification('Student added successfully!');
    form.reset();
});

// Edit student
window.editStudent = function (index) {
    const student = students[index];
    nameInput.value = student.name;
    idInput.value = student.id;
    emailInput.value = student.email;
    contactInput.value = student.contact;
    students.splice(index, 1);
    localStorage.setItem('students', JSON.stringify(students));
    renderTable();
    showNotification('Edit the details and resubmit');
}

// Delete student
window.deleteStudent = function (index) {
    students.splice(index, 1);
    localStorage.setItem('students', JSON.stringify(students));
    renderTable();
    showNotification('Student deleted successfully!');
}

// Sorting
function sortStudents(order) {
    const sortBy = sortBySelect.value;
    students.sort((a, b) => {
        if (sortBy === 'id') {
            return order === 'asc'
                ? a.id.localeCompare(b.id, undefined, { numeric: true })
                : b.id.localeCompare(a.id, undefined, { numeric: true });
        } else if (sortBy === 'name') {
            return order === 'asc'
                ? a.name.localeCompare(b.name)
                : b.name.localeCompare(a.name);
        }
    });
    localStorage.setItem('students', JSON.stringify(students));
    renderTable();
}

sortAscBtn.addEventListener('click', () => sortStudents('asc'));
sortDescBtn.addEventListener('click', () => sortStudents('desc'));
renderTable();
