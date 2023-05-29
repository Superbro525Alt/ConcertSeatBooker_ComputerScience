import './App.css';

import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getDatabase, ref, set, onValue } from "firebase/database";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "firebase/auth";

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
          <button className="book" style={{width: "200px"}} onClick={loadExpensesMenu}>View Expenses</button>
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
                    <div id="expenses"></div>
              </header>
          </div>

      </div>
  );
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
            title.innerHTML = "Expenses";
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

            var rowHeadings = ["Type", "Cost", "Amount"]
            var items = {"Tea Bags": {"Price": 4.5, "Quantity":2}}

        })
            .catch((error) => {
                var errorCode = error.code;
                var errorMessage = error.message;
                alert(errorMessage);
            });
    }
    loginButton.className = "book";
    document.getElementById("mainMenu").style.display = "none";
    document.getElementById("expensesMenu").style.display = "block";
    document.getElementById("expenses").appendChild(title);
    document.getElementById("expenses").appendChild(document.createElement("br"));
    document.getElementById("expenses").appendChild(usernameLogin);
    document.getElementById("expenses").appendChild(document.createElement("br"));
    document.getElementById("expenses").appendChild(passwordLogin);
    document.getElementById("expenses").appendChild(document.createElement("br"));
    document.getElementById("expenses").appendChild(loginButton);
}
function loadBookingMenu() {
    document.getElementById("bookingsMenu").style.display = "block";
    document.getElementById("mainMenu").style.display = "none";
    var stage = document.createElement("div");
    stage.style.width = "620px";
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
        for (var j = 0; j<16; j++) {
            if (j === 8) {
                let seat = document.createElement("p");
                seat.style.width = "25px";
                seat.style.height = "25px";
                row.appendChild(seat);
            } else {
                let seat = document.createElement("button");
                seat.style.width = "40px";
                seat.style.height = "25px";
                seat.innerHTML = numberToAlphabet(i) + (j+1);
                seat.onclick = function() {bookSeat(this.innerHTML)};
                seat.disabled = true;
                seat.id = numberToAlphabet(i) + (j+1);
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
    seatPricesListC.innerHTML = "Row E or F: $10";
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
