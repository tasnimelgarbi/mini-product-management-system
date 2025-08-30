import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, deleteDoc, doc, updateDoc } 
  from "https://www.gstatic.com/firebasejs/10.13.1/firebase-firestore.js";
import { firebaseConfig } from "./firebase.js";

// init
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

let name = document.getElementById("name");
let price = document.getElementById("price");
let taxes = document.getElementById("taxes");
let amount = document.getElementById("amount"); 
let discount = document.getElementById("discount");
let total = document.getElementById("total");
let category = document.getElementById("category"); 
let submit = document.getElementById("submit");
let mood = "create";
let tmpId = null;

//get total
function getTotal(){
    if(price.value!=""){
        let result = (+price.value + +taxes.value ) - +discount.value; 
        total.innerHTML=result;
        total.style.background="#008000ff";
    }
    else{
        total.innerHTML="";
        total.style.background="#a00d02ff";
    }
}
window.getTotal = getTotal;

//create or update product
submit.onclick = async function(){
    let newPro = {
        name:name.value,
        price:price.value,
        taxes:taxes.value,
        amount:amount.value,   
        discount:discount.value,
        total:total.innerHTML,
        category:category.value,
    };

    // Validation
    if(name.value.trim() === "") {
        alert("The name is required!");
        name.focus();
        return;
    }
    if(price.value.trim() === "" || isNaN(price.value) || +price.value < 0) {
        alert("Enter a positive number for the price!");
        price.focus();
        return;
    }
    if(category.value.trim() === "") {
        alert("Category is required!");
        category.focus();
        return;
    }
    if(taxes.value !== "" && (+taxes.value < 0 || isNaN(taxes.value))) {
        alert("Enter a valid tax!");
        taxes.focus();
        return;
    }
    if(amount.value === "" || (+amount.value < 0 || isNaN(amount.value))) {
        alert("Enter a valid amount or leave it blank!");
        amount.focus();
        return;
    }
    if(discount.value !== "" && (+discount.value < 0 || isNaN(discount.value))) {
        alert("Enter a valid discount or leave it blank!");
        discount.focus();
        return;
    }

    if(mood === "create"){
        await addDoc(collection(db, "products"), newPro);
    }else{
        await updateDoc(doc(db,"products", tmpId), newPro);
        mood = "create";
        submit.innerHTML="Create";
    }
    
    clearData();
    showData();
}

//clear inputs
function clearData(){
    name.value="";
    price.value="";
    taxes.value="";
    amount.value="";   
    discount.value="";
    total.innerHTML="";
    category.value="";
}

//show data
async function showData(){
    getTotal();
    let table = "";
    const snapshot = await getDocs(collection(db, "products"));
    let i = 1;
    snapshot.forEach((docSnap)=>{
        let data = docSnap.data();
        table += `
        <tr>
            <td>${i++}</td>
            <td>${data.name}</td>
            <td>${data.price}</td>
            <td>${data.taxes}</td>
            <td>${data.amount}</td> 
            <td>${data.discount}</td>
            <td>${data.total}</td>
            <td>${data.category}</td>
            <td><button onclick="updateData('${docSnap.id}','${data.name}','${data.price}','${data.taxes}','${data.amount}','${data.discount}','${data.category}')">update</button></td>
            <td><button onclick="deleteData('${docSnap.id}')">delete</button></td>
        </tr>
        `;
    });
    document.getElementById("tbody").innerHTML=table;

    let btnDelete = document.getElementById("deletAll");
    if(snapshot.size > 0){
        btnDelete.innerHTML = `<button onclick="deleteAll()">delete All (${snapshot.size})</button>`;
    } else {
        btnDelete.innerHTML = "";
    }
}
showData();

//delete
window.deleteData = async function(id){
    if(confirm("Are you sure to delete this?")){ 
        await deleteDoc(doc(db,"products",id));
        showData();
    }
}

//delete all
window.deleteAll = async function(){
    if(confirm("Are you sure to delete all?")){ 
        const snapshot = await getDocs(collection(db,"products"));
        for(const docSnap of snapshot.docs){
            await deleteDoc(doc(db,"products", docSnap.id));
        }
        showData();
    }
}

//update
window.updateData = function(id,n,p,t,a,d,c){
    name.value = n;
    price.value = p;
    taxes.value = t;
    amount.value = a; 
    discount.value = d;
    category.value = c;
    getTotal();
    submit.innerHTML="update";
    mood = "update";
    tmpId = id;
    scroll({
        top:0,
        behavior:"smooth",
    })
}

//search
let searchMood = "name"; // global
window.getSearchMood = function(id){
    let search = document.getElementById("search");
    if(id == "searchName"){
        searchMood = "name";
    } else {
        searchMood = "category";
    }
    search.placeholder = "Search By " + searchMood;
    search.focus();
    search.value = "";
    showData();
}

// search data
window.searchData = async function(value){
    let table = "";
    const snapshot = await getDocs(collection(db,"products"));
    let i = 1;
    snapshot.forEach((docSnap)=>{
        let data = docSnap.data();
        if(searchMood == "name"){
            if(data.name.toLowerCase().includes(value.toLowerCase())){
                table += rowHtml(docSnap.id, data, i++);
            }
        }else{
            if(data.category.toLowerCase().includes(value.toLowerCase())){
                table += rowHtml(docSnap.id, data, i++);
            }
        }
    });
    document.getElementById("tbody").innerHTML = table;
}

function rowHtml(id,data,i){
    return `
        <tr>
            <td>${i}</td>
            <td>${data.name}</td>
            <td>${data.price}</td>
            <td>${data.taxes}</td>
            <td>${data.amount}</td>
            <td>${data.discount}</td>
            <td>${data.total}</td>
            <td>${data.category}</td>
            <td><button onclick="updateData('${id}','${data.name}','${data.price}','${data.taxes}','${data.amount}','${data.discount}','${data.category}')">update</button></td>
            <td><button onclick="deleteData('${id}')">delete</button></td>
        </tr>
    `;
}

//scroll to top
let scrollTopBtn = document.getElementById("scrollTopBtn");
window.onscroll = function(){
    if(this.scrollY >= 200){
        scrollTopBtn.style.display = "block";
    } else {
        scrollTopBtn.style.display = "none";
    }
}
scrollTopBtn.onclick = function(){
    scroll({
        top:0,
        behavior:"smooth",
    })
}
