let currentEquipId = null;

document.getElementById('searchBtn').addEventListener('click', handleSearch);

document.getElementById('deleteBtn').addEventListener('click', handleDelete);

function handleSearch() {

    const equipId = document.getElementById('equipId').value.trim();

    if (!equipId) {

        alert('Vui lòng nhập mã thiết bị.');

        return;
    }

    fetch(`/api/equipment/check/${equipId}`)

    .then(response => {

        if (response.status === 404) {

            throw new Error('Không tìm thấy thiết bị.');
        }

        if (!response.ok) {

            throw new Error('Lỗi tìm kiếm thiết bị.');
        }

        return response.json();
    })

    .then(data => {

        currentEquipId = data.equipId;

        renderEquipment(data);
    })

    .catch(error => {

        alert(error.message);
    });
}

function renderEquipment(item) {

    const tbody = document.getElementById('resultBody');

    tbody.innerHTML = '';

    const row = tbody.insertRow();

    row.insertCell(0).textContent = item.equipId || '';
    row.insertCell(1).textContent = item.equipName || '';
    row.insertCell(2).textContent = item.origin || '';
    row.insertCell(3).textContent = item.dateOfReceipt || '';
    row.insertCell(4).textContent = item.userId || '';
}

function handleDelete() {

    if (!currentEquipId) {

        alert('Vui lòng tìm thiết bị trước.');

        return;
    }

    const confirmDelete = confirm(
        `Bạn có chắc muốn xóa thiết bị '${currentEquipId}' không?`
    );

    if (!confirmDelete) {

        return;
    }

    fetch(`/api/equipment/delete/${currentEquipId}`, {

        method: 'DELETE'
    })

    .then(response => {

        return response.text().then(message => {

            if (!response.ok) {

                throw new Error(message);
            }

            return message;
        });
    })

    .then(message => {

        alert(message);

        document.getElementById('resultBody').innerHTML = '';

        document.getElementById('equipId').value = '';

        currentEquipId = null;
    })

    .catch(error => {

        alert(error.message);
    });
}