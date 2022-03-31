document.addEventListener('DOMContentLoaded', function () {
    checkDB()
})

function checkDB() {
    fetch('http://localhost:3000/magic')
        .then(resp => resp.json())
        .then(data => {
            if (data.length === 0) {
                fetchCards()
            }
            else if (data.length > 0) {
                // refreshData()
                buildCard(data)
            }
        })
}

function fetchCards() {
    const requestSize = Array(750).fill().map((x, i) => i)
    requestSize.forEach((i) => {
        setTimeout(
            fetch(`https://api.magicthegathering.io/v1/cards?page=${i}`)
                .then(response => {
                    if (response.status === 200) {
                        response.json().then(data => createDatabase(data, i))
                    }
                    else {
                        response.json().then(data => catchFailures(data, i))
                    }
                })
            , 1000000)
    })
}

function createDatabase(data, i) {
    data = {
        ...data,
        pageNumber: i
    }
    fetch('http://localhost:3000/magic', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
        .then(response => response.json())
        .then(data => console.log(data))
}


function catchFailures(data, i) {
    data = {
        ...data,
        pageNumber: i
    }
    fetch('http://localhost:3000/failures', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
        .then(response => response.json())
        .then(data => console.log(data))
}

// function refreshData() {
    
// }

function buildCard(element) {
    const startIndex = 0
    const endIndex = 1
    let incrementIndex = 0
    loadCards(startIndex, endIndex, incrementIndex, element)
    submitComment()
}
function loadCards(startIndex, endIndex, incrementIndex, element) {
    pageRight(startIndex, endIndex, incrementIndex, element)
    pageLeft(startIndex, endIndex, incrementIndex, element)
    element.forEach((value, i) => {
        if ((startIndex + incrementIndex <= i) && (endIndex + incrementIndex > i)) {
            const img = document.getElementById('image')
            if (value.image_id !== null) {
                img.src = `imageUrl`
            }
            else {
                img.src = "images/placeholder.jpg"
                const li = document.createElement("li")
                li.innerText = "Artwork is temporarily unavailable."
                document.getElementById("image-list").append(li)
            }
            document.getElementById("image-list").append(img)
            let title = document.getElementById("Artwork")
            title.textContent = value.title
            let artistName = document.getElementById("Artist")
            artistName.textContent = value.artist_title
        }
    }
    )
}
function submitComment() {
    const submitButton = document.getElementById("submit")
    submitButton.addEventListener("click", () => {
        const comment = document.getElementById("comment-area").value
        const p = document.createElement("p")
        p.append(comment)
        document.getElementById("comment-block").append(p)
    })
}

function pageRight(startIndex, endIndex, incrementIndex, element) {
    document.getElementById("Arrow-Right").addEventListener("click", () => {
        incrementIndex += 1
        if (incrementIndex >= element.length) {
            incrementIndex = startIndex
        }
        document.getElementById("comment-block").replaceChildren()
        document.getElementById("comment-area").value = ""
        loadCards(startIndex, endIndex, incrementIndex, element)
    })
    return incrementIndex
}
function pageLeft(startIndex, endIndex, incrementIndex, element) {
    document.getElementById("Arrow-Left").addEventListener("click", () => {
        incrementIndex -= 1
        if (incrementIndex < 0) {
            incrementIndex = element.length - 1
        }
        document.getElementById("comment-block").replaceChildren()
        document.getElementById("comment-area").value = ""
        loadCards(startIndex, endIndex, incrementIndex, element)
    })
    return incrementIndex
}