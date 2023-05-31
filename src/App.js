import './App.css';

import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getDatabase, ref, set, onValue } from "firebase/database";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "firebase/auth";
import * as anychart from 'anychart';
import * as tableexport from 'tableexport';
import * as XLSX from 'xlsx';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBpxOivm7svonRsCsT7rebL6x0TpvaMeqk",
  authDomain: "concertseatbooker.firebaseapp.com",
  databaseURL: "https://concertseatbooker-default-rtdb.firebaseio.com",
  projectId: "concertseatbooker",
  storageBucket: "concertseatbooker.appspot.com",
  messagingSenderId: "889062282272",
  appId: "1:889062282272:web:22b83594bff816ad099845",
  measurementId: "G-VS08KBCG4M"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const database = getDatabase(app);
const auth = getAuth(app);

var CART = [];
function App() {
  return (
      <div id="app">
    <div className="App" id="mainMenu">
      <header className="App-header">
            Concert Seat Booking
          <p></p>
          <button className="book" style={{width: "200px"}} onClick={loadBookingMenu}>Book Now</button>
          <div>
              <p></p>
          </div>
          <button className="book" style={{width: "200px"}} onClick={loadExpensesMenu}>View Profit/Loss</button>
          <div>
              <p></p>
          </div>
          <button className="book" style={{width: "200px"}} onClick={loadEvaluationMenu}>Evaluation</button>
      </header>
    </div>
    <div id="bookingsMenu" className="App" style={{display:"none"}}>
          <header className="App-header">
              <div id="bookings" style={{display:"flex"}}>
                <div id="seats"></div>
                  <div id="booking-info" style={{paddingLeft:"70px"}}></div>
              </div>
          </header>
    </div>

          <div id="expensesMenu" className="App" style={{display:"none"}}>
              <header className="App-header">
                  <div id="login"></div>
                    <div id="expenses"></div>
              </header>
          </div>

          <div id="evaluation" className="App" style={{display:"none"}}>
              <header className="App-header">
                  <div id="evaluate">
                      <h1>Evaluation</h1>
                        <ol style={{textAlign: "left"}}>
                            <li>Total number of tickets available: <b>120</b></li>
                            <li id="goldClassIncome">The income from the gold class tickets is higher than the silver class tickets: <b>True</b> or False</li>
                            <li>The average income from each seat is <b>$13.75</b></li>
                            <li>In case of a sold-out concert, the total income is <b>$1760</b>, and it changes the profit by <b>$740.80</b>.</li>
                        </ol>
                  </div>
              </header>
          </div>

      </div>
    );
}
function keys(obj) {
    return Object.keys(obj);
}
const sortObject = obj => Object.keys(obj).sort().reduce((res, key) => (res[key] = obj[key], res), {});

function loadEvaluationMenu() {
    onValue(ref(database, 'bookedSeats/'), (snapshot) => {
        var seats = snapshot.val();
        if (seats == null || seats == undefined) {
            seats = [];
        }
        var _profit = {};
        for (var i = 0; i < seats.length; i++) {
            var seat = seats[i];
            if (_profit[seat.ID[0]] == undefined || _profit[seat.ID[0]] == null) {
                _profit[seat.ID[0]] = [];
            }
            if (_profit[seat.ID[0]].indexOf(seat.ID.substring(1)) == -1) {
                _profit[seat.ID[0]].push(seat.ID.substring(1));
            }
        }
        // check if there are any letters with out arrays
        var letters = ["A", "B", "C", "D", "E", "F", "G", "H"];
        for (var i = 0; i < letters.length; i++) {
            if (_profit[letters[i]] == undefined || _profit[letters[i]] == null) {
                _profit[letters[i]] = [];
            }
        }
        if (((_profit['A'].length + _profit['B'].length) * 20 > ((_profit['C'].length + _profit['D'].length) * 15))) {
            document.getElementById("goldClassIncome").innerHTML = "The income from the gold class tickets is higher than the silver class tickets: <b>True</b> or False";
        }
        else {
            document.getElementById("goldClassIncome").innerHTML = "The income from the gold class tickets is higher than the silver class tickets: True or <b>False</b>";
        }
        document.getElementById("mainMenu").style.display = "none";
        document.getElementById("evaluation").style.display = "block";
        var back = document.createElement("button");
        back.innerHTML = "Back";
        back.style.width = "100px";
        back.style.height = "25px";
        back.style.fontSize = "12px";
        back.style.marginRight = "10px";
        back.style.marginBottom = "10px";
        back.onclick = function () {
            window.location.reload();
        }
        back.className = "book";
        document.getElementById("evaluate").appendChild(back);
    });
}
function loadExpensesMenu() {
    var title = document.createElement("h1");
    title.innerHTML = "Login";
    title.style.marginBottom = "10px";
    title.style.marginTop = "10px";
    title.style.fontSize = "40px";
    title.style.fontFamily = "Arial";
    title.style.color = "white";
    title.style.textAlign = "center";

    var usernameLogin = document.createElement("input");
    usernameLogin.placeholder = "Email";
    usernameLogin.id = "usernameLogin";
    usernameLogin.style.width = "200px";
    usernameLogin.style.height = "25px";
    usernameLogin.style.fontSize = "20px";
    usernameLogin.style.marginRight = "10px";
    usernameLogin.style.marginBottom = "10px";

    var passwordLogin = document.createElement("input");
    passwordLogin.placeholder = "Password";
    passwordLogin.id = "passwordLogin";
    passwordLogin.style.width = "200px";
    passwordLogin.style.height = "25px";
    passwordLogin.style.fontSize = "20px";
    passwordLogin.style.marginRight = "10px";
    passwordLogin.style.marginBottom = "10px";
    //set input to password
    passwordLogin.type = "password";

    var loginButton = document.createElement("button");
    loginButton.innerHTML = "Login";
    loginButton.style.width = "100px";
    loginButton.style.height = "25px";
    loginButton.style.fontSize = "20px";
    loginButton.style.marginRight = "10px";
    loginButton.style.marginBottom = "10px";
    loginButton.onclick = function () {
        // do firebase auth
        var username = usernameLogin.value;
        var password = passwordLogin.value;
        // sign in and alert the user if there is an error
        signInWithEmailAndPassword(auth, username, password).then((userCredential) => {
            // Signed in
            var user = userCredential.user;
            console.log(user);
            usernameLogin.remove();
            passwordLogin.remove();
            loginButton.remove();
            backButton.remove();
            var elements = document.getElementsByTagName("br");
            for (var i = 0; i < elements.length; i++) {
                elements[i].remove();
            }
            title.innerHTML = "Expenses";


            function updateTable() {
                if (document.getElementById("expensesTable") != null){
                    document.getElementById("expensesTable").remove();
                }
                var table = document.createElement("table");
                table.style.width = "100%";
                table.style.border = "1px solid black";
                table.style.borderCollapse = "collapse";
                table.style.marginBottom = "10px";
                table.style.marginTop = "10px";
                table.style.fontSize = "20px";
                table.style.fontFamily = "Arial";
                table.style.color = "white";
                table.style.textAlign = "center";
                table.id = "expensesTable";
                document.getElementById("expenses").appendChild(table);

                while (table.rows.length > 0) {
                    table.deleteRow(0);
                }
                onValue(ref(database, 'Expenses/'), (snapshot) => {
                    var products = snapshot.val();

                    var rowHeadings = keys(products[keys(products)[0]]);
                    rowHeadings.push("Total")
                    rowHeadings.push("Delete");

                    var row = table.insertRow();
                    for (var i = 0; i < rowHeadings.length; i++) {
                        var cell = row.insertCell();
                        cell.innerHTML = rowHeadings[i];
                        cell.style.border = "1px solid black";
                    }

                    for (var i = 0; i < keys(products).length; i++) {
                        var productInfo = products[keys(products)[i]];
                        var row = table.insertRow();
                        for (var j = 0; j < rowHeadings.length; j++) {
                            var cell = row.insertCell();
                            if (rowHeadings[j] == "Delete") {
                                var deleteButton = document.createElement("button");
                                deleteButton.innerHTML = "Delete";
                                deleteButton.style.width = "100%";
                                deleteButton.style.height = "25px";
                                deleteButton.style.fontSize = "20px";
                                deleteButton.className = "book";
                                deleteButton.onclick = function () {
                                    // remove row from table
                                    // check how many rows are left
                                    // if 1 row left, remove table
                                    var row = this.parentNode.parentNode;
                                    var table = row.parentNode;
                                    var rowAmount = table.rows.length;
                                    if (rowAmount > 2) {
                                        table.removeChild(row);
                                    }
                                    else {
                                        alert("You cannot delete the last row");
                                    }
                                }
                                cell.appendChild(deleteButton);
                            }
                            else if (rowHeadings[j] == "Total") {
                                console.log(productInfo);
                                var total = "$" + productInfo["Price"].replace("$", "") * productInfo["Quantity"];
                                cell.innerHTML = total;
                                cell.style.border = "1px solid black";
                            }
                            else {
                                var input = document.createElement("input");
                                input.value = productInfo[rowHeadings[j]];
                                cell.appendChild(input);
                                cell.style.border = "1px solid black";
                                // if the input is changed, update the total
                                input.onchange = function () {
                                    var row = this.parentNode.parentNode;
                                    var table = row.parentNode;
                                    var rowAmount = table.rows.length;
                                    var total = 0;

                                    var price = row.cells[1].childNodes[0].value.replace("$", "");
                                    var quantity = row.cells[2].childNodes[0].value;
                                    total = price * quantity;

                                    row.cells[3].innerHTML = "$" + total;
                                }
                            }
                        }
                    }
                    if (document.getElementById("addNewRow") != null){
                        document.getElementById("addNewRow").remove();
                    }
                    var addNewRow = document.createElement("button");
                    addNewRow.innerHTML = "Add New Product";
                    addNewRow.style.width = "100%";
                    addNewRow.style.height = "25px";
                    addNewRow.style.fontSize = "20px";
                    addNewRow.style.marginRight = "10px";
                    addNewRow.style.marginBottom = "10px";
                    addNewRow.onclick = function () {
                        row = table.insertRow();
                        for (var j = 0; j < rowHeadings.length; j++) {
                            var cell = row.insertCell();
                            if (rowHeadings[j] == "Delete") {
                                var deleteButton = document.createElement("button");
                                deleteButton.innerHTML = "Delete";
                                deleteButton.style.width = "100%";
                                deleteButton.style.height = "25px";
                                deleteButton.style.fontSize = "20px";
                                deleteButton.className = "book";
                                deleteButton.onclick = function () {
                                    // remove row from table
                                    // check how many rows are left
                                    // if 1 row left, remove table
                                    var row = this.parentNode.parentNode;
                                    var table = row.parentNode;
                                    var rowAmount = table.rows.length;
                                    if (rowAmount > 2) {
                                        table.removeChild(row);
                                    }
                                    else {
                                        alert("You cannot delete the last row");
                                    }
                                }
                                cell.appendChild(deleteButton);
                            }
                            else if (rowHeadings[j] == "Total") {
                                console.log(productInfo);
                                var total = "N/A";
                                cell.innerHTML = total;
                                cell.style.border = "1px solid black";
                            }
                            else {
                                var input = document.createElement("input");
                                input.value = "";
                                cell.appendChild(input);
                                cell.style.border = "1px solid black";
                            }
                        }
                    }
                    addNewRow.id = "addNewRow";
                    addNewRow.className = "book";

                    document.getElementById("expenses").appendChild(addNewRow);
                    if (document.getElementById("updateButton") != null){
                        document.getElementById("updateButton").remove();
                    }
                    var updateButton = document.createElement("button");
                    updateButton.innerHTML = "Update Expenses List";
                    updateButton.style.width = "100%";
                    updateButton.style.height = "25px";
                    updateButton.style.fontSize = "20px";
                    updateButton.style.marginRight = "10px";
                    updateButton.style.marginBottom = "10px";
                    updateButton.id = "updateButton";
                    updateButton.onclick = function () {
                        var table = document.getElementById("expensesTable");
                        var rows = table.rows;
                        var expenses = {};
                        for (var i = 1; i < rows.length; i++) {
                            var row = rows[i];
                            var cells = row.cells;
                            var expense = {};
                            for (var j = 0; j < cells.length; j++) {
                                var cell = cells[j];
                                var input = cell.children[0];
                                if (rowHeadings[j] != "Delete" && rowHeadings[j] != "Total") {
                                    expense[rowHeadings[j]] = input.value;
                                }
                            }
                            expenses[i] = expense;
                        }
                        set(ref(database, 'Expenses/'), expenses);
                        updateTable();
                    }
                    updateButton.className = "book";
                    document.getElementById("expenses").appendChild(updateButton);


                    if (document.getElementById("profitTitle") != null){
                        document.getElementById("profitTitle").remove();
                    }
                    var profitTitle = document.createElement("h1");
                    profitTitle.style.marginBottom = "10px";
                    profitTitle.style.marginTop = "10px";
                    profitTitle.style.fontSize = "40px";
                    profitTitle.style.fontFamily = "Arial";
                    profitTitle.style.color = "white";
                    profitTitle.style.textAlign = "center";
                    profitTitle.innerHTML = "Revenue";
                    profitTitle.id = "profitTitle";
                    document.getElementById("expenses").appendChild(profitTitle);

                    if (document.getElementById("profitTable") != null){
                        document.getElementById("profitTable").remove();
                    }
                    var profitTable = document.createElement("table");
                    profitTable.style.width = "100%";
                    profitTable.style.border = "1px solid black";
                    profitTable.style.borderCollapse = "collapse";
                    profitTable.style.marginBottom = "10px";
                    profitTable.style.marginTop = "10px";
                    profitTable.style.fontSize = "20px";
                    profitTable.style.fontFamily = "Arial";
                    profitTable.style.color = "white";
                    profitTable.style.textAlign = "center";
                    profitTable.id = "profitTable";
                    document.getElementById("expenses").appendChild(profitTable);

                    onValue(ref(database, 'bookedSeats/'), (snapshot) => {
                        var seats = snapshot.val();
                        if (seats == null || seats == undefined) {
                            seats = [];
                        }
                        var _profit = {};
                        for (var i = 0; i < seats.length; i++) {
                            var seat = seats[i];
                            if (_profit[seat.ID[0]] == undefined || _profit[seat.ID[0]] == null) {
                                _profit[seat.ID[0]] = [];
                            }
                            if (_profit[seat.ID[0]].indexOf(seat.ID.substring(1)) == -1) {
                                _profit[seat.ID[0]].push(seat.ID.substring(1));
                            }
                        }

                        // sort profit alphabetically by the keys
                        var profit = sortObject(_profit);
                        console.log(profit);

                        var profitTableHeadings = ["Row", "Amount of Seats Booked", "Price per Seat", "Total"];
                        var heading = profitTable.insertRow();
                        for (var i = 0; i < profitTableHeadings.length; i++) {
                            var cell = heading.insertCell();
                            cell.style.border = "1px solid black";
                            cell.innerHTML = profitTableHeadings[i];
                        }

                        for (var i = 0; i < keys(profit).length; i++) {
                            var row = profitTable.insertRow();
                            var _row = row.insertCell();
                            var amtOfSeats = row.insertCell();
                            var price = row.insertCell();
                            var total = row.insertCell();
                            amtOfSeats.style.border = "1px solid black";
                            price.style.border = "1px solid black";
                            total.style.border = "1px solid black";
                            _row.style.border = "1px solid black";
                            _row.innerHTML = keys(profit)[i]
                            amtOfSeats.innerHTML = profit[keys(profit)[i]].length;
                            price.innerHTML = "$" + SeatIDToPrice(keys(profit)[i]);
                            total.innerHTML = "$" + (SeatIDToPrice(keys(profit)[i]) * profit[keys(profit)[i]].length);

                        }

                        if (document.getElementById("_profitTitle") != null) {
                            document.getElementById("_profitTitle").remove();
                        }
                        var _profitTitle = document.createElement("h1");
                        _profitTitle.style.marginBottom = "10px";
                        _profitTitle.style.marginTop = "10px";
                        _profitTitle.style.fontSize = "40px";
                        _profitTitle.style.fontFamily = "Arial";
                        _profitTitle.style.color = "white";
                        _profitTitle.style.textAlign = "center";
                        _profitTitle.innerHTML = "Profit / Loss";
                        _profitTitle.id = "_profitTitle";
                        document.getElementById("expenses").appendChild(_profitTitle);

                        var _profit = document.createElement("p");
                        var _loss = document.createElement("p");
                        var _total = document.createElement("p");

                        _profit.style.color = "green";
                        _loss.style.color = "red";

                        var profitAmt = 0;
                        var lossAmt = 0;
                        for (var i = 0; i < keys(profit).length; i++) {
                            profitAmt += SeatIDToPrice(keys(profit)[i]) * profit[keys(profit)[i]].length;
                        }

                        // iterate through the table of expenses and add up the total
                        var rows = document.getElementById("expensesTable").rows;
                        for (var i = 1; i < rows.length; i++) {
                            var row = rows[i];
                            var cells = row.cells;
                            var total = cells[cells.length - 2].innerHTML;
                            console.log(total)
                            if (total != "N/A" && total != "Total" && total != "" && total != "NaN" && total != undefined) {
                                lossAmt += parseFloat(total.replace("$", ""));
                            }
                        }
                        // convert the lossAmt and PROFIT To decimals
                        lossAmt = lossAmt.toFixed(2);
                        profitAmt = profitAmt.toFixed(2);

                        if (profitAmt - lossAmt > 0) {
                            _total.style.color = "green";
                        } else if (profitAmt - lossAmt < 0) {
                            _total.style.color = "red";
                        }

                        _profit.innerHTML = "$" + profitAmt;
                        _loss.innerHTML = "$" + lossAmt;
                        _total.innerHTML = "$" + (profitAmt - lossAmt).toFixed(2);

                        var between = document.createElement("p");
                        between.innerHTML = " - ";
                        between.style.color = "white";

                        var b2 = document.createElement("p");
                        b2.innerHTML = " = ";
                        b2.style.color = "white";

                        between.style.marginLeft = "10px";
                        between.style.marginRight = "10px";
                        b2.style.marginLeft = "10px";
                        b2.style.marginRight = "10px";

                        console.log(profitAmt);
                        console.log(lossAmt);

                        if (document.getElementById("holderDiv") != null) {
                            document.getElementById("holderDiv").remove();
                        }
                        var holderDiv = document.createElement("div");
                        holderDiv.style.display = "flex";
                        holderDiv.style.justifyContent = "center";
                        holderDiv.style.alignItems = "center";
                        holderDiv.id = "holderDiv";
                        holderDiv.appendChild(_profit);
                        holderDiv.appendChild(between);
                        holderDiv.appendChild(_loss);
                        holderDiv.appendChild(b2);
                        holderDiv.appendChild(_total);
                        document.getElementById("expenses").appendChild(holderDiv);
// make a pie chart with each row and its profits
                        var ctx = document.createElement("div");
                        ctx.id = "container";
                        ctx.style.width = "100%";
                        ctx.style.height = "400px";
                        document.getElementById("expenses").appendChild(ctx);
                        // convert profit to a list with each row and its profits
                        var _profit = {};
                        for (var i = 0; i < seats.length; i++) {
                            var seat = seats[i];
                            if (_profit[seat.ID[0]] == undefined || _profit[seat.ID[0]] == null) {
                                _profit[seat.ID[0]] = [];
                            }
                            if (_profit[seat.ID[0]].indexOf(seat.ID.substring(1)) == -1) {
                                _profit[seat.ID[0]].push(seat.ID.substring(1));
                            }
                        }
                        var profitList = [];
                        for (var i = 0; i < keys(_profit).length; i++) {
                            console.log(keys(_profit)[i]);
                            var row = keys(_profit)[i];
                            var amount = _profit[keys(_profit)[i]].length;
                            var price = SeatIDToPrice(keys(_profit)[i]);
                            var total = amount * price;
                            profitList.push({
                                "x": row,
                                "value": total,
                                "AmountofSeats": amount,
                                "PriceperSeat": price,
                                "TotalPrice": total
                            });
                        }
                        var chart = anychart.pie();
                        chart.background().enabled(true);
                        chart.background().fill("#282c34 1");
                        chart.tooltip().format("Row: {%x}\nAmount of Seats Booked: {%AmountofSeats}\nRevenue per Seat: ${%PriceperSeat}\nTotal Revenue: ${%TotalPrice}");
                        var labels = chart.labels();
                        labels.fontColor("white");
                        chart.title("Revenue per Row");
                        chart.title().fontColor("white");
                        // make the legand color white
                        chart.legend().fontColor("white");
                        chart.legend().itemsFormat("Row {%x}");
                        chart.data(profitList);
                        chart.container("container");
                        chart.sort("asc");
                        chart.labels().position("outside");
                        chart.sort("asc");
                        chart.connectorStroke({color: "white", thickness: 2, dash:"2 2"});
                        chart.draw();


                        var table = document.getElementById("expensesTable");
                        var rows = table.rows;
                        var expenses = {};
                        for (var i = 1; i < rows.length; i++) {
                            var row = rows[i];
                            var cells = row.cells;
                            var expense = {};
                            for (var j = 0; j < cells.length; j++) {
                                var cell = cells[j];
                                var input = cell.children[0];
                                if (rowHeadings[j] != "Delete" && rowHeadings[j] != "Total") {
                                    expense[rowHeadings[j]] = input.value;
                                }
                            }
                            expenses[i] = expense;
                        }
                        var expensesList = []
                        for (var i = 1; i < keys(expenses).length; i++) {
                            let e = expenses[i];
                            expensesList.push({
                                "x": e.Name,
                                "value": e.Price.replace("$", "") * e.Quantity,
                                "price": e.Price.replace("$", ""),
                                "quantity": e.Quantity,
                                "total": e.Price.replace("$", "") * e.Quantity
                            })
                        }
                        var ctx = document.createElement("div");
                        ctx.id = "container2";
                        ctx.style.width = "100%";
                        ctx.style.height = "400px";
                        document.getElementById("expenses").appendChild(ctx);

                        var chart2 = anychart.pie();
                        chart2.background().enabled(true);
                        chart2.background().fill("#282c34 1");
                        chart2.tooltip().format("Product: {%x}\nCost per item: ${%price}\nQuantity: ${%quantity}\nTotal Cost: ${%total}");
                        var labels = chart2.labels();
                        labels.fontColor("white");
                        chart2.title("Expenses per Item");
                        chart2.title().fontColor("white");
                        // make the legand color white
                        chart2.legend().fontColor("white");
                        chart2.legend().itemsFormat("{%x}");
                        chart2.data(expensesList);
                        chart2.container("container2");
                        chart2.sort("asc");
                        chart2.labels().position("outside");
                        chart2.sort("asc");
                        chart2.connectorStroke({color: "white", thickness: 2, dash:"2 2"});
                        chart2.draw();

                        var exportCsv = document.createElement("button");
                        exportCsv.innerHTML = "Export XLSX";
                        exportCsv.style.width = "100px";
                        exportCsv.style.height = "25px";
                        exportCsv.style.fontSize = "12px";
                        exportCsv.style.marginRight = "10px";
                        exportCsv.style.marginBottom = "10px";
                        exportCsv.className = "book";
                        exportCsv.onclick = function () {
                            var csv = "Expenses,Product,Price per Unit,Quantity,Total\n";
                            var rows = document.getElementById("expensesTable").rows;
                            for (var i = 1; i < rows.length; i++) {
                                var row = rows[i];
                                var cells = row.cells;
                                var productName = cells[0].children[0].value;
                                var price = cells[1].children[0].value;
                                var amount = cells[2].children[0].value;
                                var total = price.replace("$", "") * amount;
                                csv += "," + productName + "," + price + "," + amount + ",$" + total + "\n";
                            }
                            csv += "\n\nRevenue,Row,Amount of Seats Booked,Price per Seat,Total\n";
                            for (var i = 0; i < keys(profit).length; i++) {
                                var row = keys(profit)[i];
                                var amount = profit[keys(profit)[i]].length;
                                var price = SeatIDToPrice(keys(profit)[i]);
                                var total = amount * price;
                                csv += "," + row + "," + amount + ",$" + price + ",$" + total + "\n";
                            }

                            csv += "\n\nRevenue, Expenses, Profit\n";
                            csv += "$" + profitAmt + ",$" + lossAmt + ",$" + (profitAmt - lossAmt).toFixed(2) + "\n";
                            var c = csv.split("\n");
                            var arr = []
                            for (var i = 0; i < c.length; i++) {
                                arr.push(c[i].split(","));
                            }
                            var workbook = XLSX.utils.book_new();
                            var ws = XLSX.utils.aoa_to_sheet(arr);
                            XLSX.utils.book_append_sheet(workbook, ws, "Results");
                            XLSX.writeFile(workbook, 'out.xlsx', {type: 'file'});
                        }
                        document.getElementById("expenses").appendChild(exportCsv);

                        var back = document.createElement("button");
                        back.innerHTML = "Back";
                        back.style.width = "100px";
                        back.style.height = "25px";
                        back.style.fontSize = "12px";
                        back.style.marginRight = "10px";
                        back.style.marginBottom = "10px";
                        back.onclick = function () {
                            window.location.reload();
                        }
                        back.className = "book";
                        document.getElementById("expenses").appendChild(back);



                    });



                });
            }
            updateTable();




        })
            .catch((error) => {
                var errorCode = error.code;
                var errorMessage = error.message;
                alert(errorMessage);
            });
    }
    loginButton.className = "book";

    var backButton = document.createElement("button");
    backButton.innerHTML = "Back";
    backButton.style.width = "100px";
    backButton.style.height = "25px";
    backButton.style.fontSize = "20px";
    backButton.style.marginRight = "10px";
    backButton.style.marginBottom = "10px";
    backButton.onclick = function () {
        window.location.reload();
    }
    backButton.className = "book";

    document.getElementById("mainMenu").style.display = "none";
    document.getElementById("expensesMenu").style.display = "block";
    document.getElementById("login").appendChild(title);
    document.getElementById("login").appendChild(document.createElement("br"));
    document.getElementById("login").appendChild(usernameLogin);
    document.getElementById("login").appendChild(document.createElement("br"));
    document.getElementById("login").appendChild(passwordLogin);
    document.getElementById("login").appendChild(document.createElement("br"));
    document.getElementById("login").appendChild(loginButton);
    document.getElementById("login").appendChild(backButton);
}

function SeatIDToPrice(ID) {
    switch (ID[0]) {
        case "A":
            return 20;
        case "B":
            return 20;
        case "C":
            return 15;
        case "D":
            return 15;
        case "E":
            return 10;
        case "F":
            return 10;
        case "G":
            return 10;
        case "H":
            return 10;


    }
}

function loadBookingMenu() {
    document.getElementById("bookingsMenu").style.display = "block";
    document.getElementById("mainMenu").style.display = "none";
    var stage = document.createElement("div");
    stage.style.width = "660px";
    stage.style.height = "75px";
    stage.style.border = "3px solid black";
    stage.style.fontSize = "40px";
    stage.innerHTML = "Stage";
    document.getElementById("seats").appendChild(stage);
    document.getElementById("seats").appendChild(document.createElement("br"));

    for (var i = 0; i<8;i++) {
        var row = document.createElement("div");
        row.style.display = "flex"
        document.getElementById("seats").appendChild(row);
        var first = true;
        for (var j = 0; j<17; j++) {
            if (j === 8) {
                let seat = document.createElement("p");
                seat.style.width = "25px";
                seat.style.height = "25px";
                row.appendChild(seat);
                if (first) {
                    first = false;
                }
            } else {
                let seat = document.createElement("button");
                seat.style.width = "40px";
                seat.style.height = "25px";
                if (first) {
                    seat.innerHTML = numberToAlphabet(i) + (j + 1);
                }
                else {
                    seat.innerHTML = numberToAlphabet(i) + (j);
                }
                seat.onclick = function() {bookSeat(this.innerHTML)};
                seat.disabled = true;
                if (first) {
                    seat.id = numberToAlphabet(i) + (j + 1);
                }
                else {
                    seat.id = numberToAlphabet(i) + (j);
                }
                onValue(ref(database, 'bookedSeats/'), (snapshot) => {
                   var  __seats = snapshot.val();
                   if (__seats == "") {
                       var _seats = []
                   }
                   else {
                       var _seats = [];
                       for (var _seat in __seats) {
                            _seats.push(__seats[_seat].ID);
                       }
                   }

                   console.log(numberToAlphabet(i) + (j+1));
                   if (!_seats.includes(seat.innerHTML)) {

                       seat.disabled = false;
                   }
                });

                row.appendChild(seat);
            }
        }

    }

    var bookinginfoheading = document.createElement("h1");
    bookinginfoheading.innerHTML = "Booking Information";
    document.getElementById("booking-info").appendChild(bookinginfoheading);
    var seatPrices = document.createElement("div");
    var headings = document.createElement("h2");
    headings.innerHTML = "Seat Prices";
    seatPrices.appendChild(headings);
    var seatPricesListA = document.createElement("p");
    seatPricesListA.innerHTML = "Row A or B: $20";
    seatPrices.appendChild(seatPricesListA);
    var seatPricesListB = document.createElement("p");
    seatPricesListB.innerHTML = "Row C or D: $15";
    seatPrices.appendChild(seatPricesListB);
    var seatPricesListC = document.createElement("p");
    seatPricesListC.innerHTML = "Row E, F, G or H: $10";
    seatPrices.appendChild(seatPricesListC);

    document.getElementById("booking-info").appendChild(seatPrices);

    var viewCart = document.createElement("button");
    viewCart.innerHTML = "View Cart";
    viewCart.className = "book";
    viewCart.style.width = "200px";

    viewCart.onclick = function() {_viewCart()};
    document.getElementById("booking-info").appendChild(viewCart);

    var back = document.createElement("button");
    back.innerHTML = "Back";
    back.className = "book";
    back.style.width = "200px";
    back.onclick = function() {window.location.reload()};
    document.getElementById("booking-info").appendChild(back);



}

function _viewCart() {
    var cartHolder = document.createElement("div");
    cartHolder.style.position = "absolute";
    cartHolder.style.zIndex = "9";
    cartHolder.style.width = "1140px";
    cartHolder.style.height = "600px";
    cartHolder.style.border = "3px solid black";
    cartHolder.style.paddingTop = "20px";
    cartHolder.style.backgroundColor = "#282c34";
    cartHolder.style.overflow = "auto";
    document.getElementById("bookings").appendChild(cartHolder);

    var cartHeading = document.createElement("h1");
    cartHeading.innerHTML = "Cart";
    cartHolder.appendChild(cartHeading);


    if (CART.length != 0) {
        for (var seat in CART) {
            var seatInfo = document.createElement("p");
            seatInfo.innerHTML = "Seat ID: " + CART[seat].seatID + " | Price: $" + CART[seat].price;
            cartHolder.appendChild(seatInfo);
        }
    }
    else {
        var noSeats = document.createElement("p");
        noSeats.innerHTML = "Nothing in Cart";
        cartHolder.appendChild(noSeats);
    }
    var cancel = document.createElement("button");
    cancel.innerHTML = "Cancel";
    cancel.className = "book";
    cancel.style.width = "150px";
    if (CART.length != 0) {
        cancel.style.marginRight = "10px";
    }
    cancel.onclick = function() {cartHolder.remove()};

    var checkout = document.createElement("button");
    checkout.innerHTML = "Checkout";
    checkout.className = "book";
    checkout.style.width = "150px";
    checkout.onclick = function() {_checkout(cartHolder)};

    cartHolder.appendChild(cancel);
    if (CART.length != 0) {
        cartHolder.appendChild(checkout);
    }

}
function _checkout(cart) {
    onValue(ref(database, 'bookedSeats/'), (snapshot) => {
        var _seats = snapshot.val();
        if (_seats == "") {
            _seats = [];
        }
        var _CART = [];
        for (seat in CART) {
            _CART.push(CART[seat].seatID);
        }
        console.log(CART)
        var CART_COPY = CART;
        for (var seat in _seats) {
            if (_CART.includes(_seats[seat].ID)) {
                CART.splice(_CART.indexOf(_seats[seat].ID), 1);
            }
        }
        console.log(CART);
        console.log(CART_COPY);
        if (CART_COPY.length != CART.length) {
            var cartHolder = document.createElement("div");
            cartHolder.style.position = "absolute";
            cartHolder.style.zIndex = "9";
            cartHolder.style.width = "1140px";
            cartHolder.style.height = "600px";
            cartHolder.style.border = "3px solid black";
            cartHolder.style.paddingTop = "20px";
            cartHolder.style.backgroundColor = "#282c34";
            var title = document.createElement("h1");
            title.innerHTML = "Items Were Removed From Your Cart Due To Them Being Booked By Someone Else";
            document.getElementById("bookings").appendChild(cartHolder);
            for (seat in CART_COPY) {
                if (!CART.includes(CART_COPY[seat])) {
                    var seatInfo = document.createElement("p");
                    seatInfo.innerHTML = "Seat ID: " + CART_COPY[seat].seatID + " | Price: $" + CART_COPY[seat].price;
                    cartHolder.appendChild(seatInfo);
                }
            }
            var cancel = document.createElement("button");
            cancel.innerHTML = "Cancel";
            cancel.className = "book";
            cancel.style.width = "150px";
            cancel.onclick = function() {cartHolder.remove()};
            cartHolder.appendChild(cancel);

        }
        else {
            onValue(ref(database, "bookedSeats"), (snapshot) => {
                var _seats = snapshot.val();
                if (_seats == "") {
                    _seats = [];
                }
                for (seat in CART) {
                    _seats.push({"ID": CART[seat].seatID});
                }
                set(ref(database, "bookedSeats"), _seats).then(() => {
                    cart.remove();
                    CART = [];
                    window.location.reload();
                    return 0;
                });


            });
        }
    });
}
function bookSeat(seatID) {
    var price;
    if (seatID[0] === "A" || seatID[0] === "B") {
        price = 20;
        console.log("A or B")
    }
    else if (seatID[0] === "C" || seatID[0] === "D") {
        price = 15;
    }
    else {
        price = 10;
    }

    var confirmAddToCart = document.createElement("div");
    confirmAddToCart.style.position = "absolute";
    confirmAddToCart.style.zIndex = "9";
    confirmAddToCart.style.width = "1140px";
    confirmAddToCart.style.height = "600px";
    confirmAddToCart.style.border = "3px solid black";
    confirmAddToCart.style.paddingTop = "20px";
    confirmAddToCart.style.backgroundColor = "#282c34";


    var confirmAddToCartHeading = document.createElement("h1");
    confirmAddToCartHeading.innerHTML = "Confirm Booking";
    confirmAddToCart.appendChild(confirmAddToCartHeading);
    var seatIDText = document.createElement("h2");
    seatIDText.innerHTML = "You are booking seat: " + seatID;
    confirmAddToCart.appendChild(seatIDText);
    var priceText = document.createElement("h2");
    priceText.innerHTML = "The price of this seat is: $" + price;
    confirmAddToCart.appendChild(priceText);
    var confirm = document.createElement("button");
    confirm.style.width = "150px";
    confirm.style.height = "50px";
    confirm.innerHTML = "Add to Cart";
    confirm.onclick = function() {
        CART.push({seatID: seatID, price: price});
        // make seat button green and disabled
        var seat = document.getElementById(seatID);
        seat.style.backgroundColor = "green";
        seat.style.color = "white";
        seat.style.borderColor = "green";
        seat.disabled = true;

        confirmAddToCart.remove();
    }
    confirm.className = "book";
    confirm.style.marginRight = "20px";
    confirmAddToCart.appendChild(confirm);
    var cancel = document.createElement("button");
    cancel.style.width = "150px";
    cancel.style.height = "50px";
    cancel.innerHTML = "Cancel";
    cancel.onclick = function() {confirmAddToCart.remove()};
    cancel.className = "book";
    cancel.style.marginLeft = "20px";
    confirmAddToCart.appendChild(cancel);
    document.getElementById("bookings").appendChild(confirmAddToCart);
}
function numberToAlphabet(num) {
    switch(num) {
        case 0:
            return "A";
        case 1:
            return "B";
        case 2:
            return "C";
        case 3:
            return "D";
        case 4:
            return "E";
        case 5:
            return "F";
        case 6:
            return "G";
        case 7:
            return "H";

    }
}
export default App;
