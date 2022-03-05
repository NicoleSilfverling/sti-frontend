const UPDATE_FIRST = 0;
const UPDATE_INTERVAL = 5000;

setTimeout(age,UPDATE_FIRST)

//age()

function age(){
    var xhr = new XMLHttpRequest()
    xhr.open("GET", "http://localhost:3001/highscores");
    //xhr.open("GET", "https://nicole-backend.herokuapp.com/highscores");

    //xhr.open("GET", "/js/data.json")
    xhr.onload = function(){
        var data = JSON.parse(this.response)
        createTable(data)
        //setTimeout(age,UPDATE_INTERVAL);
    }
    xhr.send()
}



function createTable(data){
    var appElement = document.getElementById("app")
    var aTable = document.createElement("table")
    appElement.appendChild(aTable)
    
    for (let i = 0; i < 5; i++) {
        aTable.appendChild(createRow(data[i].user, data[i].score))  
        console.log(data[i].user +" " + data[i].score)
         
    }
}

function createRow(user, points){
    var aRow = document.createElement("tr") 
    aRow.appendChild(createCell(user))
    aRow.appendChild(createCell(points))   
    return aRow
}



function createCell(content){
    var aCell = document.createElement("td")
    aCell.innerHTML = content
    return aCell;
}





