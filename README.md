# Contents
1. [Overview of Approach](#Overview-of-Approach)
2. [Development Environment](#Development-Environment)
3. [Hosting](#Hosting)
4. [Firebase](#Firebase)
3. [Documentation](#Documentation)
    1. [Code](#Code)
        1. [Main Menu](#Main-Menu)
        2. [Booking Menu](#Booking-Menu)
        3. [Expenses Menu](#Expenses-Menu)
        4. [Evaluation Menu](#Evaluation)
1. [Database](#Database)
   1. [Database Structure](#Structure)
   2. [Database Functions](#Database-Functions)
      1. [Get Requests](#Get-Requests)
      2. [Set Requests](#Set-Requests)
3. [Authentication](#Authentication)
   1. [Login](#Login)
   2. [Admin Login](#admin-login)
5. [Charts](#Charts)
    1. [Modules](#Modules)
   2. [Code](#Code)
      1. [Expenses Chart](#Expenses-Chart)
      2. [Profit Chart](#Bookings-Chart)
3. [Dynamic Formatting](#Dynamic-Formatting)

   
# Overview of Approach
I used JavaScript integrated with google firebase to make the program. The program allows you to view the booking menu and an admin menu to see the profit and loss projections. In the booking menu the user can view the rows of seats and select which ones they would like to book. When the user has selected the seats, they want they can view their cart and a popup will appear in the middle of the screen. This will show each seat and the price of it and a button to confirm the booking. If the user presses the checkout button the seats booked will be added to an external database hosted at firebase so they cannot be booked again. There will also be a back button on the view cart menu to close the popup and book more seats. On the main menu there is another option for Perth Modern School Admins to view the total profit and loss projections and to add, remove or change expenses for the night. The script generates two pie charts, one for the expenses to provide a visual aid to see the expenses. The other pie chart will display the profits per row to show how much profit each class of seats are making the school. The evaluation button on the main screen will show the evaluation as specified in the task sheet. The majority of the questions are conditional, depending on the current state of the database. The program will query the database (this may take a bit of time) and show the results. 

# Development Environment
I developed this program in Pycharm Professional react-js environment. I used the react-js environment because i have previously developed in vanilla javascript and would like to try something new. 
React is a JavaScript library created by Facebook. It is a User Interface (UI) library. It is used as a tool for building UI components.

For a quick start guide you can see [What is React (w3schools.com)](https://www.w3schools.com/whatis/whatis_react.asp).

As part of me learning this new framework for web apps I have noted down some pros and cons of using React.

Pros:
- React is easy to learn the basics of
- React is fast
- React makes it easy to create interactive UIs
- React uses virtual DOM which is a JavaScript object. This will improve apps performance since it is faster.
- React can be used on the client and server side
- React can be used to create mobile applications (React Native)

Cons:
- React is complex and has a high learning curve
- React is slow for large applications
- React does not support IE8 and lower
- React is a view layer only, so you still need to integrate it with other technologies to get a complete tooling set for development
- React's library is very large

# Hosting
I hosted the website on firebase. I used firebase because it is free and easy to use. I also used firebase because it is easy to integrate with react-js. Firebase provides free hosting with the domain name.web.app. I currently have it hosted at [concertseatbooker.web.app](https://concertseatbooker.web.app/).

# Firebase
I used firebase to integrate a realtime database with my react-js app. To use it all you have to do is insert the following code at the start of your javascript script if you have the node modules installed. I also used it to intergrate authentication into the admin page.

```javascript
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getDatabase, ref, set, onValue } from "firebase/database";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "firebase/auth";

```
If you don't have them installed you can install them by running this npm command if you have node.js installed

```bash
npm install firebase
```

If you don't want to install anything you can import it from the web using the following code

```javascript
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.0.2/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.0.2/firebase-analytics.js";
import { getDatabase, ref, set, onValue } from "https://www.gstatic.com/firebasejs/9.0.2/firebase-database.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/9.0.2/firebase-auth.js";
```

See [firebase.google.com](https://firebase.google.com/docs/web/setup) for more setup information.


To use firebase you need to create a config. This is found in the project settings in the firebase console. You can then copy and paste the config into your script. You can then initialise the app using the following code

```javascript
// Your web app's Firebase configuration
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
```

The configuration used is the config for my firebase project. You can use your own config by creating a firebase project and copying the config from the project settings.
The app variable is used to initialise each component of the final application. The database variable is used to access the realtime database. The auth variable is used to access the authentication service.
Analytics is used to track the usage of the app. I did not use this in my app because it is not required.


For application to this web app see [Database](#Database) and [Authentication](#Authentication) documentation.

For the JavaScript docs see [firebase.google.com/docs](https://firebase.google.com/docs/reference/js).

# Documentation
## Code
### Main Menu
```javascript
function App() {
  return (
      <div id="app" onLoad={onload}>
          <header className="App-header">

              <div id="main">
    <div className="App" id="mainMenu">
          <img src={process.env.PUBLIC_URL + "/logo.png"} alt="logo" />
          <h2>
            Concert Seat Booking
          </h2>
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
    </div>
    <div id="bookingsMenu" className="App" style={{display:"none"}}>
              <div id="bookings" style={{display:"flex"}}>
                <div id="seats"></div>
                  <div id="booking-info" style={{paddingLeft:"70px"}}></div>
              </div>
    </div>

          <div id="expensesMenu" className="App" style={{display:"none"}}>
                  <div id="login"></div>
                    <div id="expenses"></div>
          </div>

          <div id="evaluation" className="App" style={{display:"none"}}>
                  <div id="evaluate">
                      <h1>Evaluation</h1>
                        <ol style={{textAlign: "left"}}>
                            <li id="tickets">Total number of tickets available: <b>120</b></li>
                            <li id="goldClassIncome">The income from the gold class tickets is higher than the silver class tickets: <b>True</b> or False</li>
                            <li>The average income from each seat is <b>$13.75</b></li>
                            <li>In case of a sold-out concert, the total income is <b>$1760</b>, and it changes the profit by <b>$740.80</b>.</li>
                        </ol>
                  </div>
          </div>
              </div>

          </header>
            <div id="notes">

            </div>
      </div>

    );
}
```
This function returns the main menu HTML structure to react-js and appends it to the root of the app. This allows the menu to be displayed. The only element that remains visible at start up is the div with the id "App". All other elements have the style 
```css
display: none;
```
This hides the elements from the user until they are needed. The main menu has three buttons, one to load the booking menu, one to load the expenses menu and one to load the evaluation menu. The buttons have an onclick event that calls a function to load the menu. The main menu also has a div with the id "bookingsMenu" and "expensesMenu" and "evaluation". These divs are hidden at startup and are displayed when the user clicks the button. The divs are displayed by setting the style of the div to 
```css
display: block;
```

### Booking Menu
```javascript
function loadBookingMenu() {

    document.getElementById("bookingsMenu").style.display = "block";
    document.getElementById("mainMenu").style.display = "none";
    onload();
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

    onload();
}
```
This code queries the database to find the seats that have not been booked and if they haven't it allows the user to select them.

### Expenses Menu
```javascript
function loadExpensesMenu() {
    onload();
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

                        onload();

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
```
This code queries the database and finds the expenses that have been inputed and loads them into the table to be edited. It also generates a revenue table showing the revenue from each row as well as making a chart for each table.

### Evaluation
```javascript
function loadEvaluationMenu() {
    onload();
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
        // get the total number of tickets booked
        var total = 0;
        for (var i = 0; i < letters.length; i++) {
            total += _profit[letters[i]].length;
        }

        // get the average income from each seat booked

        document.getElementById("tickets").innerHTML = "Total number of tickets available: <b>" + (120 - total) + "</b>";
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
```
This code generates the evaluation as specified in the assessment document.
# Database
## Structure
The database is structured as follows
```json
{
  "Expenses": [
    null,
    {
      "Name": "Tea Bags (100)",
      "Price": "$4.50",
      "Quantity": "2"
    },
    {
      "Name": "Coffee (500 gm)",
      "Price": "$21",
      "Quantity": "1"
    },
    {
      "Name": "Milk full cream (3 Lt)",
      "Price": "$4.80",
      "Quantity": "1"
    },
    {
      "Name": "Milk - Skim (2 Lt)",
      "Price": "$3.00",
      "Quantity": "1"
    },
    {
      "Name": "Soft drink cans (24)",
      "Price": "$18",
      "Quantity": "5"
    },
    {
      "Name": "Ice bags",
      "Price": "$6.00",
      "Quantity": "2"
    },
    {
      "Name": "Assorted biscuits (22 per pack)",
      "Price": "$4.30",
      "Quantity": "8"
    },
    {
      "Name": "Cupcakes (12 per pack)",
      "Price": "$14",
      "Quantity": "10"
    }
  ],
  "bookedSeats": [
    {
      "ID": "A9"
    },
    {
      "ID": "A8"
    },
    {
      "ECT": "MORE"
    }
  ]
}
```
I use this particular structure because it is easy to read and is easy to reference. The expenses are stored in an array of objects. Each object has a name, price and quantity. The booked seats are stored in an array of objects. Each object has an ID. The ID is the seat ID.
## Database Functions
### Get Requests
```javascript
onValue(ref(database, 'path/to/location/in/database'), (snapshot) => {});
```

### Set Requests
```javascript
set(ref(database, 'path/to/location/in/database'), objectToSetTo);
```

# Authentication
## Login
```javascript
function login() {
    var email = document.getElementById("email").value;
    var password = document.getElementById("password").value;
    signInWithEmailAndPassword(auth, email, password).then((userCredential) => {
        // Signed in 
        var user = userCredential.user;
        document.getElementById("login").style.display = "none";
        document.getElementById("mainMenu").style.display = "block";
        // ...
    })
        .catch((error) => {
            var errorCode = error.code;
            var errorMessage = error.message;
            alert("Error: " + errorMessage);
        });
}
```

The above code logs in the user using built in firebase authentication using the email and password specified.

## Admin Login
Email: admin@admin.com

Password: password1

# Charts
## Modules
- [Anychart.js](https://www.npmjs.com/package/anychart)
- [Anychart-react](https://www.npmjs.com/package/anychart-react)
- [React](https://www.npmjs.com/package/react)
## Code
### Expenses Chart
```javascript
var chart = anychart.pie();
chart.background().enabled(true);
chart.background().fill("#282c34 1");
chart.tooltip().format("Row: {%x}\nAmount of Seats Booked: {%AmountofSeats}\nRevenue per Seat: ${%PriceperSeat}\nTotal Revenue: ${%TotalPrice}");
var labels = chart.labels();
labels.fontColor("white");
chart.title("Revenue per Row");
chart.title().fontColor("white");
chart.legend().fontColor("white");
chart.legend().itemsFormat("Row {%x}");
chart.data(profitList);
chart.container("container");
chart.sort("asc");
chart.labels().position("outside");
chart.sort("asc");
chart.connectorStroke({color: "white", thickness: 2, dash:"2 2"});
chart.draw();
```
This code creates a pie chart and sets the background to transparent. It also sets the tooltip to display the row, amount of seats booked, revenue per seat and total revenue. The labels are set to white. The title is set to "Revenue per Row" and the legend is set to white. The data is set to the profitList array. The chart is drawn to the div with the id "container". The chart is sorted in ascending order and the labels are positioned outside the pie chart. The connector stroke is set to white, thickness to 2 and dash to "2 2".

### Bookings Chart
```javascript
var chart = anychart.pie();
chart.background().enabled(true);
chart.background().fill("#282c34 1");
chart.tooltip().format("Product: {%x}\nCost per item: ${%price}\nQuantity: ${%quantity}\nTotal Cost: ${%total}");
var labels = chart.labels();
labels.fontColor("white");
chart.title("Revenue per Row");
chart.title().fontColor("white");
chart.legend().fontColor("white");
chart.legend().itemsFormat("{%x}");
chart.data(profitList);
chart.container("container");
chart.sort("asc");
chart.labels().position("outside");
chart.sort("asc");
chart.connectorStroke({color: "white", thickness: 2, dash:"2 2"});
chart.draw();
```
The code used to create this chart is exactly the same as to create the expenses chart.

# Dynamic Formatting
```javascript
function onload() {
    // scale the page to fit the screen
    var scale = Math.min(
        window.screen.width / document.body.scrollWidth,
        window.screen.height / document.body.scrollHeight
    );
    console.log(window.screen.width, document.body.scrollWidth, window.screen.height, document.body.scrollHeight);

    if (window.screen.width < (1000)) {
        document.getElementById("main").style.transform = "scale(" + scale + ")";
        document.getElementById("main").style.transformOrigin = "center top";
    }
    // load the main menu

    if (document.getElementById("bookingsMenu").style.display == "block") {
        if (scale < 1) {
            document.getElementById("bookings").style.display = "block";
        }

    }
}
```
This method is called every time new elements are introduced or the current elements on the screen change. It scales the page to fit within the bounds of the current screen the user has. The way this words is that it divides the window screen width and height by the document scroll width and height (the length that extends off the screen). The Math.min() method returns the lowest number out of the numbers provided, this means it selects the scale that effects the page the most. 