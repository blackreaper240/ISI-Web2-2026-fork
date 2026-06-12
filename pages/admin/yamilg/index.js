import TeamsService from '../../../services/teams.service.js';
import TeamRequest from '../../../models/request/team.request.js';

const service = new TeamsService();

const tbody = document.getElementById('teamsBody');
const teamForm = document.getElementById('teamForm');
const formTitle = document.getElementById('formTitle');
const searchId = document.getElementById('searchId');
const cancelBtn = document.getElementById('cancelBtn');
const searchBtn = document.getElementById('searchBtn');
const loadAllBtn = document.getElementById('loadAllBtn');

let editingId = null;

function renderTeams(teams) {
    if (!teams || teams.length === 0) {
        tbody.innerHTML = `<tr><td colspan="5">No se encontraron equipos.</td></tr>`;
        return;
    }

    tbody.innerHTML = '';

    teams.forEach(team => {
        const tr = document.createElement('tr');

        tr.innerHTML = `
            <td>${team.id}</td>
            <td>${team.name}</td>
            <td>${team.description}</td>
            <td>${team.memberCount}</td>
            <td>
                <button class="btn-edit" data-id="${team.id}" data-name="${team.name}" data-description="${team.description}">Editar</button>
                <button class="btn-delete" data-id="${team.id}">Eliminar</button>
            </td>
        `;

        tbody.appendChild(tr);
    });

    
    tbody.querySelectorAll('.btn-edit').forEach(btn => {
        btn.addEventListener('click', () => {
            editingId = btn.dataset.id;
            formTitle.textContent = `Editando equipo #${editingId}`;
            teamForm.name.value = btn.dataset.name;
            teamForm.description.value = btn.dataset.description;
        });
    });

    tbody.querySelectorAll('.btn-delete').forEach(btn => {
        btn.addEventListener('click', async () => {
            const id = btn.dataset.id;
            const confirmar = confirm(`¿Seguro que deseas eliminar el equipo #${id}?`);
            if (!confirmar) return;
            await service.delete(id);
            await loadAll();
        });
    });
}

async function loadAll() {
    tbody.innerHTML = `<tr><td colspan="5">Cargando...</td></tr>`;
    const teams = await service.get();
    renderTeams(teams);
}

function resetForm() {
    editingId = null;
    formTitle.textContent = 'Crear equipo';
    teamForm.reset();
}


teamForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const formData = new FormData(teamForm);
    const name = formData.get('name').trim();
    const description = formData.get('description').trim();

    if (!name || !description) {
        alert('Por favor completa todos los campos.');
        return;
    }

    const request = new TeamRequest(name, description);

    if (editingId) {
        await service.update(editingId, request);
    } else {
        await service.create(request);
    }

    resetForm();
    await loadAll();
});


cancelBtn.addEventListener('click', () => {
    resetForm();
});

// buscar por id
searchBtn.addEventListener('click', async () => {
    const id = searchId.value.trim();
    if (!id) {
        await loadAll();
        return;
    }

    const team = await service.getById(id);
    if (!team) {
        tbody.innerHTML = `<tr><td colspan="5">No se encontró el equipo con ID ${id}.</td></tr>`;
        return;
    }

    renderTeams([team]);
});


loadAllBtn.addEventListener('click', async () => {
    searchId.value = '';
    await loadAll();
});


loadAll();