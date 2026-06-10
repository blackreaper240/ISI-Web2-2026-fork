import TeamsService from '../../../services/teams.service.js';

const service = new TeamsService();
const tbody = document.getElementById('teamsBody');

function renderTeams(teams) {
    if (!teams || teams.length === 0) {
        tbody.innerHTML = `<tr><td colspan="4">No se encontraron equipos.</td></tr>`;
        return;
    }

    tbody.innerHTML = teams.map(team => `
        <tr>
            <td>${team.id}</td>
            <td>${team.name}</td>
            <td>${team.description}</td>
            <td>${team.memberCount}</td>
        </tr>
    `).join('');
}

// GET /teams → todos
export async function loadAll() {
    tbody.innerHTML = `<tr><td colspan="4">Cargando...</td></tr>`;
    const teams = await service.get();
    renderTeams(teams);
}

// GET /teams/:id → uno por ID
export async function searchById() {
    const id = document.getElementById('searchId').value;
    if (!id) return loadAll();

    tbody.innerHTML = `<tr><td colspan="4">Buscando...</td></tr>`;
    const team = await service.getById(id);

    if (!team) {
        tbody.innerHTML = `<tr><td colspan="4">No se encontró el equipo con ID ${id}.</td></tr>`;
        return;
    }
    renderTeams([team]);
}


window.loadAll = loadAll;
window.searchById = searchById;


loadAll();