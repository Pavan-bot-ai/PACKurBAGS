// Admin Dashboard JavaScript
let adminToken = localStorage.getItem('adminToken');
let currentTab = 'overview';

// Check authentication on load
document.addEventListener('DOMContentLoaded', function() {
    if (adminToken) {
        verifyAdminToken();
    } else {
        showLoginModal();
    }
});

function showLoginModal() {
    document.getElementById('loginModal').classList.remove('hidden');
    document.getElementById('dashboard').classList.add('hidden');
}

function hideLoginModal() {
    document.getElementById('loginModal').classList.add('hidden');
    document.getElementById('dashboard').classList.remove('hidden');
}

async function login(event) {
    event.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    try {
        const response = await fetch('/api/admin/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();
        
        if (response.ok) {
            adminToken = data.token;
            localStorage.setItem('adminToken', adminToken);
            hideLoginModal();
            loadDashboard();
        } else {
            alert('Invalid credentials. Use admin@packyourbags.com / admin123');
        }
    } catch (error) {
        console.error('Login error:', error);
        alert('Login failed. Please try again.');
    }
}

async function verifyAdminToken() {
    try {
        const response = await fetch('/api/admin/verify', {
            headers: {
                'Authorization': `Bearer ${adminToken}`
            }
        });

        if (response.ok) {
            hideLoginModal();
            loadDashboard();
        } else {
            localStorage.removeItem('adminToken');
            showLoginModal();
        }
    } catch (error) {
        localStorage.removeItem('adminToken');
        showLoginModal();
    }
}

function logout() {
    localStorage.removeItem('adminToken');
    adminToken = null;
    showLoginModal();
}

function showTab(tabName) {
    // Hide all tabs
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.add('hidden');
    });
    
    // Remove active class from all buttons
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.className = 'tab-btn px-6 py-3 font-semibold text-gray-600 hover:text-blue-600 transition';
    });
    
    // Show selected tab
    document.getElementById(tabName).classList.remove('hidden');
    
    // Add active class to clicked button
    event.target.className = 'tab-btn px-6 py-3 font-semibold border-b-2 border-blue-500 text-blue-600';
    
    currentTab = tabName;
    loadTabData(tabName);
}

async function loadDashboard() {
    loadTabData('overview');
}

async function loadTabData(tabName) {
    switch(tabName) {
        case 'overview':
            await loadOverviewData();
            break;
        case 'users':
            await loadUsersData();
            break;
        case 'bookings':
            await loadBookingsData();
            break;
        case 'revenue':
            await loadRevenueData();
            break;
        case 'database':
            await loadDatabaseData();
            break;
    }
}

async function loadOverviewData() {
    try {
        const [stats, activity] = await Promise.all([
            fetch('/api/admin/stats', { headers: { 'Authorization': `Bearer ${adminToken}` } }),
            fetch('/api/admin/activity', { headers: { 'Authorization': `Bearer ${adminToken}` } })
        ]);

        const statsData = await stats.json();
        const activityData = await activity.json();

        // Update statistics
        document.getElementById('totalUsers').textContent = statsData.totalUsers || 0;
        document.getElementById('totalGuides').textContent = statsData.totalGuides || 0;
        document.getElementById('totalBookings').textContent = statsData.totalBookings || 0;
        document.getElementById('totalRevenue').textContent = `$${statsData.totalRevenue || 0}`;

        // Load charts
        loadUserGrowthChart();
        loadRevenueChart();

        // Load recent activity
        loadRecentActivity(activityData);
    } catch (error) {
        console.error('Error loading overview data:', error);
    }
}

async function loadUsersData() {
    try {
        const response = await fetch('/api/admin/users', {
            headers: { 'Authorization': `Bearer ${adminToken}` }
        });
        const users = await response.json();
        window.allUsers = users; // Store for filtering
        displayUsers(users);
    } catch (error) {
        console.error('Error loading users data:', error);
    }
}

function displayUsers(users) {
    const tbody = document.getElementById('usersTableBody');
    tbody.innerHTML = users.map(user => `
        <tr class="border-b hover:bg-gray-50">
            <td class="py-3">${user.id}</td>
            <td class="py-3">${user.name || user.username || 'N/A'}</td>
            <td class="py-3">${user.email || 'N/A'}</td>
            <td class="py-3">
                <span class="px-2 py-1 rounded-full text-xs ${user.role === 'guide' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}">
                    ${user.role || 'user'}
                </span>
            </td>
            <td class="py-3">
                <span class="px-2 py-1 rounded-full text-xs ${getStatusColor(user.status || 'active')}">
                    ${user.status || 'active'}
                </span>
            </td>
            <td class="py-3">${new Date(user.createdAt || Date.now()).toLocaleDateString()}</td>
            <td class="py-3">
                <div class="flex space-x-2">
                    <button onclick="editUser(${user.id})" class="px-3 py-1 bg-blue-500 text-white rounded text-xs hover:bg-blue-600 transition">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button onclick="showSuspendModal(${user.id})" class="px-3 py-1 bg-yellow-500 text-white rounded text-xs hover:bg-yellow-600 transition">
                        <i class="fas fa-ban"></i>
                    </button>
                    <button onclick="deleteUser(${user.id})" class="px-3 py-1 bg-red-500 text-white rounded text-xs hover:bg-red-600 transition">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
}

function filterUsers(role) {
    const users = window.allUsers || [];
    let filteredUsers = users;
    
    if (role !== 'all') {
        filteredUsers = users.filter(user => user.role === role);
    }
    
    displayUsers(filteredUsers);
    
    // Update button states
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('bg-blue-500', 'text-white');
        btn.classList.add('bg-gray-300', 'text-gray-700');
    });
    
    const clickedButton = event.target;
    clickedButton.classList.remove('bg-gray-300', 'text-gray-700');
    clickedButton.classList.add('bg-blue-500', 'text-white');
}

async function loadBookingsData() {
    try {
        const response = await fetch('/api/admin/bookings', {
            headers: { 'Authorization': `Bearer ${adminToken}` }
        });
        const bookings = await response.json();
        
        // Update booking statistics with actual status values
        const pending = bookings.filter(b => b.status === 'pending' || b.paymentStatus === 'pending').length;
        const confirmed = bookings.filter(b => b.status === 'confirmed' || b.status === 'accepted' || b.paymentStatus === 'successful').length;
        const completed = bookings.filter(b => b.status === 'completed').length;
        
        document.getElementById('pendingBookings').textContent = pending;
        document.getElementById('confirmedBookings').textContent = confirmed;
        document.getElementById('completedBookings').textContent = completed;
        
        const tbody = document.getElementById('bookingsTableBody');
        tbody.innerHTML = bookings.map(booking => `
            <tr class="border-b hover:bg-gray-50">
                <td class="py-3">
                    <div class="flex flex-col">
                        <span class="font-medium">#${booking.id}</span>
                        <span class="text-xs text-gray-500 uppercase">${booking.type}</span>
                    </div>
                </td>
                <td class="py-3">${booking.userName || 'N/A'}</td>
                <td class="py-3">${booking.guideName || 'N/A'}</td>
                <td class="py-3">
                    <div class="flex flex-col">
                        <span class="font-medium">${booking.destination}</span>
                        ${booking.duration ? `<span class="text-xs text-gray-500">${booking.duration}</span>` : ''}
                    </div>
                </td>
                <td class="py-3">${booking.date}</td>
                <td class="py-3">
                    <div class="flex flex-col gap-1">
                        <span class="px-2 py-1 rounded-full text-xs ${getStatusColor(booking.status)}">
                            ${booking.status}
                        </span>
                        ${booking.paymentStatus ? `<span class="px-2 py-1 rounded-full text-xs ${getPaymentStatusColor(booking.paymentStatus)}">
                            ${booking.paymentStatus}
                        </span>` : ''}
                    </div>
                </td>
                <td class="py-3">
                    <div class="flex flex-col">
                        <span class="font-medium">$${(booking.totalAmount || 0).toFixed(2)}</span>
                        ${booking.paymentMethod ? `<span class="text-xs text-gray-500">${booking.paymentMethod}</span>` : ''}
                    </div>
                </td>
            </tr>
        `).join('');
    } catch (error) {
        console.error('Error loading bookings data:', error);
    }
}

async function loadRevenueData() {
    try {
        const response = await fetch('/api/admin/revenue', {
            headers: { 'Authorization': `Bearer ${adminToken}` }
        });
        const revenueData = await response.json();
        
        loadRevenueByServiceChart(revenueData);
        loadMonthlyRevenueChart(revenueData);
        loadRevenueBreakdown(revenueData);
    } catch (error) {
        console.error('Error loading revenue data:', error);
    }
}

async function loadDatabaseData() {
    try {
        const response = await fetch('/api/admin/database/tables', {
            headers: { 'Authorization': `Bearer ${adminToken}` }
        });
        const tables = await response.json();
        
        const container = document.getElementById('databaseTables');
        container.innerHTML = tables.map(table => `
            <div class="flex justify-between items-center p-3 border rounded-lg">
                <span class="font-mono text-sm">${table.table_name}</span>
                <button onclick="viewTable('${table.table_name}')" class="text-blue-600 hover:text-blue-800">
                    <i class="fas fa-table mr-1"></i>View
                </button>
            </div>
        `).join('');
    } catch (error) {
        console.error('Error loading database data:', error);
    }
}

function loadUserGrowthChart() {
    const ctx = document.getElementById('userGrowthChart').getContext('2d');
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            datasets: [{
                label: 'New Users',
                data: [12, 19, 15, 25, 32, 28],
                borderColor: 'rgb(59, 130, 246)',
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                tension: 0.4,
                borderWidth: 2,
                pointRadius: 3
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: { 
                    beginAtZero: true,
                    grid: { display: false },
                    ticks: { font: { size: 10 } }
                },
                x: {
                    grid: { display: false },
                    ticks: { font: { size: 10 } }
                }
            }
        }
    });
}

function loadRevenueChart() {
    const ctx = document.getElementById('revenueChart').getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            datasets: [{
                label: 'Revenue ($)',
                data: [1200, 1900, 1500, 2500, 3200, 2800],
                backgroundColor: 'rgba(16, 185, 129, 0.8)',
                borderColor: 'rgb(16, 185, 129)',
                borderWidth: 1,
                borderRadius: 4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: { 
                    beginAtZero: true,
                    grid: { display: false },
                    ticks: { font: { size: 10 } }
                },
                x: {
                    grid: { display: false },
                    ticks: { font: { size: 10 } }
                }
            }
        }
    });
}

function loadRevenueByServiceChart(data) {
    const ctx = document.getElementById('revenueByServiceChart').getContext('2d');
    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Guide Services', 'Hotel Bookings', 'Transportation', 'Tours'],
            datasets: [{
                data: [45, 25, 20, 10],
                backgroundColor: [
                    '#3B82F6',
                    '#10B981',
                    '#F59E0B',
                    '#EF4444'
                ],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        font: { size: 10 },
                        padding: 10,
                        usePointStyle: true
                    }
                }
            },
            cutout: '60%'
        }
    });
}

function loadMonthlyRevenueChart(data) {
    const ctx = document.getElementById('monthlyRevenueChart').getContext('2d');
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            datasets: [{
                label: 'Monthly Revenue',
                data: [5000, 7500, 6200, 8900, 11200, 9800],
                borderColor: 'rgb(168, 85, 247)',
                backgroundColor: 'rgba(168, 85, 247, 0.1)',
                tension: 0.4,
                borderWidth: 2,
                pointRadius: 3,
                fill: true
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: { 
                    beginAtZero: true,
                    grid: { display: false },
                    ticks: { font: { size: 10 } }
                },
                x: {
                    grid: { display: false },
                    ticks: { font: { size: 10 } }
                }
            }
        }
    });
}

function loadRecentActivity(activities) {
    const container = document.getElementById('recentActivity');
    container.innerHTML = activities.slice(0, 10).map(activity => `
        <div class="flex items-center space-x-3 p-3 border-l-4 border-blue-500 bg-blue-50 rounded">
            <i class="fas ${getActivityIcon(activity.type)} text-blue-600"></i>
            <div>
                <p class="text-sm font-medium">${activity.message}</p>
                <p class="text-xs text-gray-500">${formatTime(activity.timestamp)}</p>
            </div>
        </div>
    `).join('');
}

function loadRevenueBreakdown(data) {
    const container = document.getElementById('revenueBreakdown');
    const breakdown = [
        { title: 'Guide Services', amount: 45000, percentage: 45, color: 'blue' },
        { title: 'Hotel Bookings', amount: 25000, percentage: 25, color: 'green' },
        { title: 'Transportation', amount: 20000, percentage: 20, color: 'yellow' }
    ];
    
    container.innerHTML = breakdown.map(item => `
        <div class="p-4 border rounded-lg">
            <h4 class="font-semibold text-${item.color}-600">${item.title}</h4>
            <p class="text-2xl font-bold">$${item.amount.toLocaleString()}</p>
            <p class="text-sm text-gray-600">${item.percentage}% of total</p>
        </div>
    `).join('');
}

async function executeSqlQuery() {
    const query = document.getElementById('sqlQuery').value.trim();
    if (!query) {
        alert('Please enter a SQL query');
        return;
    }

    try {
        const response = await fetch('/api/admin/database/query', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${adminToken}`
            },
            body: JSON.stringify({ query })
        });

        const result = await response.json();
        
        document.getElementById('queryResults').classList.remove('hidden');
        document.getElementById('queryOutput').textContent = JSON.stringify(result, null, 2);
    } catch (error) {
        console.error('Query execution error:', error);
        document.getElementById('queryResults').classList.remove('hidden');
        document.getElementById('queryOutput').textContent = 'Error: ' + error.message;
    }
}

async function viewTable(tableName) {
    const query = `SELECT * FROM ${tableName} LIMIT 100`;
    document.getElementById('sqlQuery').value = query;
    await executeSqlQuery();
}

function filterUsers(role) {
    // Update filter button styles
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.className = 'filter-btn px-4 py-2 bg-gray-300 text-gray-700 rounded-lg text-sm';
    });
    event.target.className = 'filter-btn px-4 py-2 bg-blue-500 text-white rounded-lg text-sm';
    
    // Filter table rows
    const rows = document.querySelectorAll('#usersTableBody tr');
    rows.forEach(row => {
        const roleCell = row.cells[2].textContent.trim().toLowerCase();
        if (role === 'all' || roleCell === role) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });
}

function viewUser(userId) {
    alert(`View user details for ID: ${userId}`);
}

// User Management Functions
function showAddUserModal() {
    document.getElementById('userModalTitle').textContent = 'Add New User';
    document.getElementById('userId').value = '';
    document.getElementById('userForm').reset();
    document.getElementById('passwordField').style.display = 'block';
    document.getElementById('userPassword').required = true;
    document.getElementById('userModal').classList.remove('hidden');
}

function hideUserModal() {
    document.getElementById('userModal').classList.add('hidden');
}

function editUser(userId) {
    // Fetch user data and populate the edit form
    fetch(`/api/admin/users/${userId}`, {
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        }
    })
    .then(response => response.json())
    .then(user => {
        document.getElementById('userModalTitle').textContent = 'Edit User';
        document.getElementById('userId').value = userId;
        document.getElementById('userUsername').value = user.username || user.name || '';
        document.getElementById('userEmail').value = user.email || '';
        document.getElementById('userRole').value = user.role || 'user';
        document.getElementById('userStatus').value = user.status || 'active';
        document.getElementById('userPassword').value = '';
        document.getElementById('userPassword').required = false;
        document.getElementById('userModal').classList.remove('hidden');
    })
    .catch(error => {
        console.error('Error fetching user:', error);
        alert('Error loading user data');
    });
}

async function saveUser(event) {
    event.preventDefault();
    
    const userId = document.getElementById('userId').value;
    const userData = {
        username: document.getElementById('userUsername').value,
        email: document.getElementById('userEmail').value,
        role: document.getElementById('userRole').value,
        status: document.getElementById('userStatus').value
    };
    
    const password = document.getElementById('userPassword').value;
    if (password) {
        userData.password = password;
    }
    
    try {
        const url = userId ? `/api/admin/users/${userId}` : '/api/admin/users';
        const method = userId ? 'PUT' : 'POST';
        
        const response = await fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
            },
            body: JSON.stringify(userData)
        });
        
        if (response.ok) {
            hideUserModal();
            await loadUsersData();
            alert(userId ? 'User updated successfully!' : 'User created successfully!');
        } else {
            const error = await response.json();
            alert('Error: ' + (error.message || 'Failed to save user'));
        }
    } catch (error) {
        console.error('Error saving user:', error);
        alert('Error saving user');
    }
}

function showSuspendModal(userId) {
    document.getElementById('suspendUserId').value = userId;
    document.getElementById('suspendForm').reset();
    
    // Set default dates
    const today = new Date();
    const nextWeek = new Date(today);
    nextWeek.setDate(nextWeek.getDate() + 7);
    
    document.getElementById('suspendFromDate').value = today.toISOString().split('T')[0];
    document.getElementById('suspendToDate').value = nextWeek.toISOString().split('T')[0];
    
    document.getElementById('suspendModal').classList.remove('hidden');
}

function hideSuspendModal() {
    document.getElementById('suspendModal').classList.add('hidden');
}

async function suspendUser(event) {
    event.preventDefault();
    
    const userId = document.getElementById('suspendUserId').value;
    const suspensionData = {
        reason: document.getElementById('suspendReason').value,
        fromDate: document.getElementById('suspendFromDate').value,
        toDate: document.getElementById('suspendToDate').value,
        status: 'suspended'
    };
    
    try {
        const response = await fetch(`/api/admin/users/${userId}/suspend`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
            },
            body: JSON.stringify(suspensionData)
        });
        
        if (response.ok) {
            hideSuspendModal();
            await loadUsersData();
            alert('User suspended successfully!');
        } else {
            const error = await response.json();
            alert('Error: ' + (error.message || 'Failed to suspend user'));
        }
    } catch (error) {
        console.error('Error suspending user:', error);
        alert('Error suspending user');
    }
}

async function deleteUser(userId) {
    if (!confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
        return;
    }
    
    try {
        const response = await fetch(`/api/admin/users/${userId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
            }
        });
        
        if (response.ok) {
            await loadUsersData();
            alert('User deleted successfully!');
        } else {
            const error = await response.json();
            alert('Error: ' + (error.message || 'Failed to delete user'));
        }
    } catch (error) {
        console.error('Error deleting user:', error);
        alert('Error deleting user');
    }
}

function getStatusColor(status) {
    switch(status) {
        case 'active': return 'bg-green-100 text-green-800';
        case 'suspended': return 'bg-red-100 text-red-800';
        case 'inactive': return 'bg-gray-100 text-gray-800';
        case 'pending': return 'bg-yellow-100 text-yellow-800';
        case 'accepted': 
        case 'confirmed': return 'bg-green-100 text-green-800';
        case 'rejected': return 'bg-red-100 text-red-800';
        case 'completed': return 'bg-blue-100 text-blue-800';
        default: return 'bg-gray-100 text-gray-800';
    }
}

function getPaymentStatusColor(status) {
    switch(status) {
        case 'successful': return 'bg-green-100 text-green-800';
        case 'pending': return 'bg-yellow-100 text-yellow-800';
        case 'failed': return 'bg-red-100 text-red-800';
        default: return 'bg-gray-100 text-gray-800';
    }
}

function getActivityIcon(type) {
    switch(type) {
        case 'user_registration': return 'fa-user-plus';
        case 'booking_created': return 'fa-calendar-plus';
        case 'payment_completed': return 'fa-credit-card';
        case 'guide_registration': return 'fa-map-marked-alt';
        default: return 'fa-bell';
    }
}

function formatTime(timestamp) {
    return new Date(timestamp).toLocaleString();
}