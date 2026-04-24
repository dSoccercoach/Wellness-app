let selectedPlayer = null

let csvRows = []

// Load saved data when the app starts
function loadData() {

    let saved = localStorage.getItem("playerFeedbackData")

    if (saved) {
        csvRows = JSON.parse(saved)
        console.log("Loaded", csvRows.length, "rows from storage")
    }
}

// Save data persistently
function saveData() {

    localStorage.setItem(
        "playerFeedbackData",
        JSON.stringify(csvRows)
    )
}


const metrics = [
        "Energy",
        "Intensity",
        "Technical",
        "Tactical",
        "Understanding",
        "Fun"
]

const players_numbers = [
1,2,4,5,6,7,8,9,10,11,12,13,14,16,17,18,19,78]

function createPlayers() {

    let container = document.getElementById("players")

    for (let i = 0; i < players_numbers.length; i++) {

        let btn = document.createElement("button")

        btn.innerText = players_numbers[i]

        btn.onclick = () => {

            selectedPlayer = players_numbers[i]

            document.querySelectorAll("#players button").forEach(b =>
                b.classList.remove("selected")
            )
            document.getElementById("current-player").innerText =
               "Selected Player: " + players_numbers[i];
            btn.classList.add("selected")
        }

        container.appendChild(btn)
    }
}

function createSliders() {

    let container = document.getElementById("sliders")

    metrics.forEach(metric => {

        let div = document.createElement("div")

        div.className = "slider-container"

        div.innerHTML = `
            <label>${metric}: <span id="${metric}-value">5</span></label>
            <input
                type="range"
                min="1"
                max="10"
                value="5"
                id="${metric}"
                oninput="updateValue('${metric}')"
            >
        `

        container.appendChild(div)

    })
}

function updateValue(metric) {

    let value = document.getElementById(metric).value

    document.getElementById(metric + "-value").innerText = value
}

function getCurrentDateTime() {

    let now = new Date()

    return now.toISOString()
}

function submitData() {

    if (!selectedPlayer) {

        alert("Select player")

        return
    }

    let row = []

    row.push(getCurrentDateTime())

    row.push(selectedPlayer)

    metrics.forEach(metric => {

        let value = document.getElementById(metric).value

        row.push(value)
    })

    csvRows.push(row)
    saveData()
    alert("Saved")

    selectedPlayer = null

    document.querySelectorAll("#players button")
    .forEach(b => b.classList.remove("selected"))

    document.getElementById("current-player").innerText =
    "Selected Player: None"

    resetSliders()
}

function resetSliders() {

    metrics.forEach(metric => {

        document.getElementById(metric).value = 5

        document.getElementById(metric + "-value").innerText = 5
    })
}

function downloadCSV() {

    if (csvRows.length === 0) {

        alert("No data yet")

        return
    }

    let header = [
        "Date",
        "Player",
        "Energy",
        "Intensity",
        "Technical",
        "Tactical",
        "Understanding",
        "Fun"
    ]

    let csvContent = header.join(",") + "\n"

    csvRows.forEach(row => {

        csvContent += row.join(",") + "\n"
    })

    let blob = new Blob([csvContent], {
        type: "text/csv"
    })

    let url = window.URL.createObjectURL(blob)

    let a = document.createElement("a")

    a.setAttribute("hidden", "")

    a.setAttribute("href", url)

    a.setAttribute(
        "download",
        "player_feedback.csv"
    )

    document.body.appendChild(a)

    a.click()

    document.body.removeChild(a)
}

function clearData() {

    if (csvRows.length === 0) {

        alert("No data to clear")

        return
    }

    let confirmClear = confirm(
        "Are you sure you want to delete all data?"
    )

    if (confirmClear) {

        csvRows = []
        localStorage.removeItem("playerFeedbackData")
        alert("All data cleared")

    }
}


loadData()
createPlayers()
createSliders()
