let iconCart = document.querySelector('.iconCart');
let cart = document.querySelector('.cart');
let container = document.querySelector('.container');
let close = document.querySelector('.close');

iconCart.addEventListener('click', () => {
    if (cart.style.right === '-100%') {
        cart.style.right = '0';
        container.style.transform = 'translateX(-400px)';
    } else {
        cart.style.right = '-100%';
        container.style.transform = 'translateX(0)';
    }
});

close.addEventListener('click', () => {
    cart.style.right = '-100%';
    container.style.transform = 'translateX(0)';
});

let products = null;
//get data from file json
fetch('product.json')
    .then(response => response.json())
    .then(data => {
        products = data;
        addDataToHTML();
    });

//show data in list html
function addDataToHTML() {
    //remove default data in HTML
    let listProductHTML = document.querySelector('.listProduct');
    listProductHTML.innerHTML = '';

    // add new data
    if (products != null) {
        products.forEach(product => {
            let newProduct = document.createElement('div');
            newProduct.classList.add('item');
            newProduct.innerHTML = `<img src="${product.image}" alt=""><h2>${product.name}</h2><div class="price">$${product.price}</div><button onclick="addCart(${product.id})">Add to Cart</button>`;
            listProductHTML.appendChild(newProduct);
        });
    }
}

let listCart = [];
// and I get cookie data cart
function checkCart() {
    var cookieValue = document.cookie
        .split('; ')
        .find(row => row.startsWith('listCart='));
    if (cookieValue) {
        listCart = JSON.parse(cookieValue.split('=')[1]);
    }
}
checkCart();

function addCart(idProduct) {
    let productCopy = JSON.parse(JSON.stringify(products));
    // if this product is not in the cart
    if (!listCart[idProduct]) {
        let dataProduct = productCopy.filter(product => product.id === idProduct)[0];
        // add data product in cart
        listCart[idProduct] = dataProduct;
        listCart[idProduct].quantity = 1;
    } else {
        // if this product is already in the cart
        // I just increased the quantity
        listCart[idProduct].quantity++;
    }
    // I will save data cart in a cookie
    // to save this data cart when I turn off the computer
    let timeSave = "expires=Sun, 31 Dec 2023 23:59:59 UTC";
    document.cookie = "listCart=" + JSON.stringify(listCart) + "; " + timeSave + "; path=/";
    addCartToHTML();
}

function addCartToHTML() {
    //clear default data
    let listCartHTML = document.querySelector('.listCart');
    listCartHTML.innerHTML = '';

    let totalHTML = document.querySelector('.totalQuantity');
    let totalQuantity = 0;

    if (listCart) {
        for (let productId in listCart) {
            if (listCart[productId]) {
                let product = listCart[productId];
                let newCart = document.createElement('div');
                newCart.classList.add('item');
                newCart.innerHTML = `<img src="${product.image}" alt=""><h2>${product.name}</h2><div class="price">$${product.price}</div><div class="quantity">${product.quantity}</div>`;
                listCartHTML.appendChild(newCart);
                totalQuantity += product.quantity;
            }
        }
    }

    totalHTML.textContent = totalQuantity;
}

addCartToHTML();
