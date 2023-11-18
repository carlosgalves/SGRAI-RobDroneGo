function goToBuilding() {
    let floor = document.getElementById("floor").value;
    let building = document.getElementById("building").value;
    console.log("floor = " + floor);
    console.log("building = " + building);

    switch (building) {
        case "edA":
            switch (floor) {
                case "f1":
                    window.location.href = 'BuildingA_1Floor.html';
                    break;

                case "f2":
                    window.location.href = 'BuildingA_2Floor.html';
                    break;

                case "f3":
                    alert("Building A doesn't have a third floor");
                    break;

                case "f4":
                    alert("Building A doesn't have a fourth floor");
                    break;

                default:
                    alert("Select a valid floor option");
                    break;
            }
            break;

        case "edB":
            switch (floor) {
                case "f1":
                    window.location.href = 'BuildingB_1Floor.html';
                    break;

                case "f2":
                    window.location.href = 'BuildingB_2Floor.html';
                    break;

                case "f3":
                    window.location.href = 'BuildingB_3Floor.html';
                    break;

                case "f4":
                    alert("Building B doesn't have a fourth floor");
                    break;

                default:
                    alert("Select a valid floor option");
                    break;
            }
            break;

        case "edC":
            switch (floor) {
                case "f1":
                    window.location.href = 'BuildingC_1Floor.html';
                    break;

                case "f2":
                    window.location.href = 'BuildingC_2Floor.html';
                    break;

                case "f3":
                    window.location.href = 'BuildingC_3Floor.html';
                    break;

                case "f4":
                    window.location.href = 'BuildingC_4Floor.html';
                    break;

                default:
                    alert("Select a valid floor option");
                    break;
            }
            break;

        case "edD":
            switch (floor) {
                case "f1":
                    window.location.href = 'BuildingD_1Floor.html';
                    break;

                case "f2":
                    window.location.href = 'BuildingD_2Floor.html';
                    break;

                case "f3":
                    window.location.href = 'BuildingD_3Floor.html';
                    break;

                case "f4":
                    alert("Building D doesn't have a fourth floor");
                    break;

                default:
                    alert("Select a valid floor option");
                    break;
            }
            break;

        default:
            alert("Select a valid building option");
            break;
    }

}
