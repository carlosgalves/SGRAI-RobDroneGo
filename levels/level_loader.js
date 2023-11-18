function displaySelectors(building, floor, n_floors) {
    document.write(`
        <div id="building-container">
            <table class="views">
                <tr>
                    <td>
                        Building
                        <select id="building">
                            <option value="A" ${building === 'A' ? 'selected' : ''}>A</option>
                            <option value="B" ${building === 'B' ? 'selected' : ''}>B</option>
                            <option value="C" ${building === 'C' ? 'selected' : ''}>C</option>
                            <option value="D" ${building === 'D' ? 'selected' : ''}>D</option>
                        </select>
                    </td>
                    <td>
                        Floor
                        <select id="floor">
                            ${generateFloorOptions(floor, n_floors)}
                        </select>
                    </td>
                    <td>
                        <button type="button" onclick="goToBuilding()">Go</button>
                    </td>
                </tr>
            </table>
        </div>
    `);
}

function generateFloorOptions(selectedFloor, n_floors) {
    let options = '';

    for (let i = 1; i <= n_floors; i++) {
        options += `<option value="f${i}" ${selectedFloor === `f${i}` ? 'selected' : ''}>${i}</option>`;
    }
    return options;
}

function goToBuilding() {
    let floor = document.getElementById("floor").value;
    let building = document.getElementById("building").value;

    switch (building) {
        case "A":
            switch (floor) {
                case "f1":
                    window.location.href = 'Building_A_floor_1.html'; break;
                case "f2":
                    window.location.href = 'Building_A_floor_2.html'; break;
                default:
                    alert("Select a valid floor option");
            }
            break;

        case "B":
            switch (floor) {
                case "f1":
                    window.location.href = 'Building_B_floor_1.html'; break;
                case "f2":
                    window.location.href = 'Building_B_floor_2.html'; break;
                case "f3":
                    window.location.href = 'Building_B_floor_3.html'; break;
                default:
                    alert("Select a valid floor option");
            }
            break;

        case "C":
            switch (floor) {
                case "f1":
                    window.location.href = 'Building_C_floor_1.html'; break;
                case "f2":
                    window.location.href = 'Building_C_floor_2.html'; break;
                case "f3":
                    window.location.href = 'Building_C_floor_3.html'; break;
                case "f4":
                    window.location.href = 'Building_C_floor_4.html'; break;
                default:
                    alert("Select a valid floor option");
            }
            break;

        case "D":
            switch (floor) {
                case "f1":
                    window.location.href = 'Building_D_floor_1.html'; break;
                case "f2":
                    window.location.href = 'Building_D_floor_2.html'; break;
                case "f3":
                    window.location.href = 'Building_D_floor_3.html'; break;
                default:
                    alert("Select a valid floor option");
            }
            break;

        default:
            alert("Select a valid building option");
    }
}