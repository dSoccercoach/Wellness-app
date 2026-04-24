let selectedPlayer = null

let csvRows = []

const metrics = [
    "Wellness",
    "Fatigue",
    "Soreness",
    "Stress",
    "Mood",
    "Sleep"
]

function createPlayers() {

    let container = document.getElementById("players")

    for (let i = 1; i <= 18; i++) {

        let btn = document.createElement("button")

        btn.innerText = i

        btn.onclick = () => {

            selectedPlayer = i

            document.querySelectorAll("#players button").forEach(b =>
                b.classList.remove("selected")
            )

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

    alert("Saved")

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
        "date",
        "player",
        "wellness",
        "fatigue",
        "soreness",
        "stress",
        "mood",
        "sleep"
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

createPlayers()
createSliders()
