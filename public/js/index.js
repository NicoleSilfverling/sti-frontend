age()

function age(){
    var xhr = new XMLHttpRequest()
    xhr.open("GET", "http://localhost:3001/football")
    //xhr.open("GET", "/js/data.json")
    xhr.onload = function(){
        var data = JSON.parse(this.response)
        createTable(data)
    }
    xhr.send()
}

function createTable(data){
    var appElement = document.getElementById("app")
    var aTable = document.createElement("table")
    appElement.appendChild(aTable)
    console.log(data[0])
    aTable.appendChild(createRow(data[0].name, data[0].points, data[0].logo))
    aTable.appendChild(createRow(data[1].name, data[1].points, data[1].logo))
    aTable.appendChild(createRow(data[2].name, data[2].points, data[2].logo))
    aTable.appendChild(createRow(data[3].name, data[3].points, data[3].logo))
}

function createRow(name, points, url){
    var aRow = document.createElement("tr") 
    aRow.appendChild(createImageCell(url))
    aRow.appendChild(createCell(name))
    aRow.appendChild(createCell(points))   
    return aRow
}

function createCell(content){
    var aCell = document.createElement("td")
    aCell.innerHTML = content
    return aCell;
}

function createImageCell(url){
    var aCell = document.createElement("td")
    var anImage = document.createElement("img")
    anImage.src=url
    anImage.classList.add("tableLogo")
    aCell.appendChild(anImage)
    return aCell;
}