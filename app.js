(function() {
    "use strict";

    let employees = [];
    let editingId = null;
    let searchTerm = '';

    const form = document.getElementById('employeeForm');
    const nameInput = document.getElementById('empName');
    const emailInput = document.getElementById('empEmail');
    const deptInput = document.getElementById('empDept');
    const submitBtn = document.getElementById('submitBtn');
    const cancelBtn = document.getElementById('cancelEditBtn');
    const formMode = document.getElementById('formMode');
    const formError = document.getElementById('formError');
    const formSuccess = document.getElementById('formSuccess');
    const successMessage = document.getElementById('successMessage');
    const tbody = document.getElementById('employeeTableBody');
    const emptyMsg = document.getElementById('emptyMessage');
    const totalEl = document.getElementById('totalEmployees');
    const deptCountEl = document.getElementById('deptCount');
    const searchInput = document.getElementById('searchInput');
    const clearSearchBtn = document.getElementById('clearSearchBtn');
    const resultCount = document.getElementById('resultCount');

    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            tabBtns.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));
            this.classList.add('active');
            const tabId = this.dataset.tab;
            document.getElementById(`tab-${tabId}`).classList.add('active');
            if (tabId === 'view') {
                render();
            }
        });
    });

    function generateId() {
        return Date.now() + '-' + Math.random().toString(36).substr(2, 6);
    }

    function isValidEmail(email) {
        return /^[^\s@]+@gmail\.com$/i.test(email);
    }

    function isEmailDuplicate(email, excludeId = null) {
        return employees.some(emp => 
            emp.email.toLowerCase() === email.toLowerCase() && 
            emp.id !== excludeId
        );
    }

    function escapeHtml(text) {
        if (!text) return '';
        const map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' };
        return text.replace(/[&<>"']/g, function(m) { return map[m]; });
    }

    function showSuccess(msg) {
        successMessage.textContent = msg || 'Employee added successfully!';
        formSuccess.style.display = 'flex';
        setTimeout(() => {
            formSuccess.style.display = 'none';
        }, 3000);
    }

    function loadFromStorage() {
        try {
            const stored = localStorage.getItem('empData');
            if (stored) {
                employees = JSON.parse(stored);
                if (!Array.isArray(employees)) employees = [];
            } else {
                employees = [];
            }
        } catch (_) {
            employees = [];
        }
        employees = employees.filter(e => e && typeof e === 'object').map(e => ({
            id: e.id || generateId(),
            name: e.name || 'Unknown',
            email: e.email || 'no@email.com',
            department: e.department || 'General'
        }));
    }

    function saveToStorage() {
        localStorage.setItem('empData', JSON.stringify(employees));
    }

    function updateStats() {
        const total = employees.length;
        totalEl.textContent = total;
        const depts = new Set(employees.map(e => e.department.trim().toLowerCase()));
        deptCountEl.textContent = depts.size;
    }

    function render() {
        const term = searchTerm.trim().toLowerCase();
        let filtered = employees;
        if (term) {
            filtered = employees.filter(emp =>
                emp.name.toLowerCase().includes(term) ||
                emp.department.toLowerCase().includes(term)
            );
        }

        filtered.sort((a, b) => a.name.localeCompare(b.name));

        tbody.innerHTML = '';

        if (filtered.length === 0) {
            emptyMsg.style.display = 'block';
            resultCount.textContent = '0 employees';
        } else {
            emptyMsg.style.display = 'none';
            resultCount.textContent = `${filtered.length} employee${filtered.length > 1 ? 's' : ''}`;
            filtered.forEach((emp, index) => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>${index + 1}</td>
                    <td><strong>${escapeHtml(emp.name)}</strong></td>
                    <td>${escapeHtml(emp.email)}</td>
                    <td><span class="dept-badge">${escapeHtml(emp.department)}</span></td>
                    <td style="text-align:center;">
                        <div class="actions-cell">
                            <button class="btn btn-outline btn-sm edit-btn" data-id="${emp.id}">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="btn btn-danger btn-sm delete-btn" data-id="${emp.id}">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </td>
                `;
                tbody.appendChild(tr);
            });

            tbody.querySelectorAll('.edit-btn').forEach(btn => {
                btn.addEventListener('click', function() {
                    const id = this.dataset.id;
                    const emp = employees.find(e => e.id === id);
                    if (emp) {
                        document.querySelector('[data-tab="add"]').click();
                        startEdit(emp);
                    }
                });
            });
            tbody.querySelectorAll('.delete-btn').forEach(btn => {
                btn.addEventListener('click', function() {
                    const id = this.dataset.id;
                    if (confirm('Delete this employee record?')) {
                        deleteEmployee(id);
                    }
                });
            });
        }

        updateStats();
        if (editingId) {
            const editing = employees.find(e => e.id === editingId);
            if (!editing) cancelEdit();
        }
    }

    function addEmployee(name, email, department) {
        const newEmp = {
            id: generateId(),
            name: name.trim(),
            email: email.trim(),
            department: department.trim()
        };
        employees.push(newEmp);
        saveToStorage();
        clearForm();
        showSuccess(`Employee "${newEmp.name}" added successfully!`);
        render();
    }

    function updateEmployee(id, name, email, department) {
        const idx = employees.findIndex(e => e.id === id);
        if (idx === -1) return false;
        const oldName = employees[idx].name;
        employees[idx] = {
            ...employees[idx],
            name: name.trim(),
            email: email.trim(),
            department: department.trim()
        };
        saveToStorage();
        clearForm();
        showSuccess(`Employee "${oldName}" updated successfully!`);
        render();
        return true;
    }

    function deleteEmployee(id) {
        const emp = employees.find(e => e.id === id);
        employees = employees.filter(e => e.id !== id);
        saveToStorage();
        if (editingId === id) cancelEdit();
        render();
        if (emp) {
            showSuccess(`Employee "${emp.name}" deleted successfully!`);
        }
    }

    function clearForm() {
        nameInput.value = '';
        emailInput.value = '';
        deptInput.value = '';
        formError.textContent = '';
        formError.style.display = 'none';
        editingId = null;
        submitBtn.innerHTML = '<i class="fas fa-save"></i> Add Employee';
        formMode.textContent = 'Add new';
        cancelBtn.style.display = 'none';
        [nameInput, emailInput, deptInput].forEach(i => {
            i.classList.remove('error');
            i.style.borderColor = '';
        });
    }

    function startEdit(emp) {
        editingId = emp.id;
        nameInput.value = emp.name;
        emailInput.value = emp.email;
        deptInput.value = emp.department;
        submitBtn.innerHTML = '<i class="fas fa-pen"></i> Update Employee';
        formMode.textContent = `Editing: ${emp.name}`;
        cancelBtn.style.display = 'inline-flex';
        formError.textContent = '';
        formError.style.display = 'none';
        [nameInput, emailInput, deptInput].forEach(i => {
            i.classList.remove('error');
            i.style.borderColor = '';
        });
        document.querySelector('.card').scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    function cancelEdit() {
        clearForm();
        render();
    }

    function validateForm(name, email, department) {
        let isValid = true;
        formError.textContent = '';
        formError.style.display = 'none';

        if (!name || name.trim().length < 2) {
            formError.textContent = 'Name is required (minimum 2 characters).';
            nameInput.classList.add('error');
            isValid = false;
        } else {
            const trimmedName = name.trim();
            const firstChar = trimmedName.charAt(0);
            
            if (!/^[A-Za-z]/.test(firstChar)) {
                formError.textContent = 'Name must start with a letter (not a number or special character).';
                nameInput.classList.add('error');
                isValid = false;
            } 
            else if (!/^[A-Za-z\s\-']+$/.test(trimmedName)) {
                formError.textContent = 'Name can only contain letters, spaces, hyphens, and apostrophes.';
                nameInput.classList.add('error');
                isValid = false;
            } 
            else {
                nameInput.classList.remove('error');
            }
        }

        if (!email || !isValidEmail(email)) {
            if (!formError.textContent) {
                formError.textContent = 'Email must be a valid @gmail.com address (e.g., username@gmail.com).';
            }
            emailInput.classList.add('error');
            isValid = false;
        } else {
            emailInput.classList.remove('error');
        }

        if (!department || department.trim().length < 1 || department === 'Select Department' || department === '') {
            if (!formError.textContent) formError.textContent = 'Please select a department.';
            deptInput.classList.add('error');
            isValid = false;
        } else {
            deptInput.classList.remove('error');
        }

        if (email && isValidEmail(email) && isEmailDuplicate(email, editingId)) {
            formError.textContent = 'Email must be unique. This email already exists.';
            emailInput.classList.add('error');
            isValid = false;
        }

        if (!isValid) {
            formError.style.display = 'block';
            return false;
        }

        formError.style.display = 'none';
        return true;
    }

    function handleSubmit(e) {
        e.preventDefault();
        
        const name = nameInput.value;
        const email = emailInput.value;
        const department = deptInput.value;

        if (!validateForm(name, email, department)) return;

        if (editingId) {
            const success = updateEmployee(editingId, name, email, department);
            if (success) {
                render();
                document.querySelector('[data-tab="view"]').click();
            }
        } else {
            addEmployee(name, email, department);
            document.querySelector('[data-tab="view"]').click();
        }
    }

    function updateSearch() {
        searchTerm = searchInput.value;
        render();
    }

    function init() {
        loadFromStorage();
        render();
        clearForm();

        form.addEventListener('submit', handleSubmit);
        cancelBtn.addEventListener('click', cancelEdit);
        searchInput.addEventListener('input', updateSearch);
        clearSearchBtn.addEventListener('click', function() {
            searchInput.value = '';
            updateSearch();
        });

        if (employees.length === 0) {
            document.querySelector('[data-tab="add"]').click();
        } else {
            document.querySelector('[data-tab="view"]').click();
        }
    }

    init();
})();