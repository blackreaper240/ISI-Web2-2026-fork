import TeamsService from '../../../services/teams.service.js';
import TeamRequest from '../../../models/request/team.request.js';

const service = new TeamsService();
const tbody = document.getElementById('teamsBody');

let editingId = null; // guarda el ID cuando estamos editando

// Renderiza filas en la tabla
function renderTeams(teams) {
    if (!teams || teams.length === 0) {
        tbody.innerHTML = `<tr><td colspan="5">No se encontraron equipos.</td></tr>`;
        return;
    }

    tbody.innerHTML = teams.map(team => `
        <tr>
            <td>${team.id}</td>
            <td>${team.name}</td>
            <td>${team.description}</td>
            <td>${team.memberCount}</td>
            <td>
                <button class="btn-edit" onclick="editTeam(${team.id}, '${team.name}', '${team.description}')">Editar</button>
                <button class="btn-delete" onclick="deleteTeam(${team.id})">Eliminar</button>
            </td>
        </tr>
    `).join('');
}

// GET /teams → todos
export async function loadAll() {
    tbody.innerHTML = `<tr><td colspan="5">Cargando...</td></tr>`;
    const teams = await service.get();
    renderTeams(teams);
}

// GET /teams/:id → uno por ID
export async function searchById() {
    const id = document.getElementById('searchId').value;
    if (!id) return loadAll();

    const team = await service.getById(id);
    if (!team) {
        tbody.innerHTML = `<tr><td colspan="5">No se encontró el equipo con ID ${id}.</td></tr>`;
        return;
    }
    renderTeams([team]);
}

// POST /teams → crear | PUT /teams/:id → editar
export async function saveTeam() {
    const name = document.getElementById('inputName').value.trim();
    const description = document.getElementById('inputDescription').value.trim();

    if (!name || !description) {
        alert('Por favor completa todos los campos.');
        return;
    }

    const request = new TeamRequest(name, description);

    if (editingId) {
        // PUT - editar
        await service.update(editingId, request);
        cancelEdit();
    } else {
        // POST - crear
        await service.create(request);
        document.getElementById('inputName').value = '';
        document.getElementById('inputDescription').value = '';
    }

    loadAll();
}

// Prepara el formulario para editar
export function editTeam(id, name, description) {
    editingId = id;
    document.getElementById('formTitle').textContent = `Editando equipo #${id}`;
    document.getElementById('inputName').value = name;
    document.getElementById('inputDescription').value = description;
}

// Cancela la edición
export function cancelEdit() {
    editingId = null;
    document.getElementById('formTitle').textContent = 'Crear equipo';
    document.getElementById('inputName').value = '';
    document.getElementById('inputDescription').value = '';
}

// DELETE /teams/:id → eliminar
export async function deleteTeam(id) {
    const confirmar = confirm(`¿Seguro que deseas eliminar el equipo #${id}?`);
    if (!confirmar) return;

    await service.delete(id);
    loadAll();
}

// Exponer funciones al HTML
window.loadAll = loadAll;
window.searchById = searchById;
window.saveTeam = saveTeam;
window.editTeam = editTeam;
window.cancelEdit = cancelEdit;
window.deleteTeam = deleteTeam;

// Cargar todos al iniciar
loadAll();