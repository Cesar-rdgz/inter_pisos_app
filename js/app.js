/*$(document).ready(function(){
$("#product-slider").owlCarousel({
    items: 10,
    itemsDestop:[1199,2],
    itemsDestopSmall:[980,2],
    itemsMobile:[700,1.7],
    pagination:false,
    navigation:true,
    navigationText:["",""],
    autoPlay:true
});
});*/

selectProduct();
responsiveMenu();
responsiveItem();
closeProductSpecs();

let sheet = 'pisos';
let numOwlItems = 20;

const getProducts =  (resource) => {
    return new Promise((resolve, reject) => {
        const request = new XMLHttpRequest();

        request.addEventListener('readystatechange', () => {
            if(request.readyState === 4 && request.status === 200){
                const data = JSON.parse(request.responseText);
                numOwlItems = data.length;
                resolve(data);
            }else if(request.readyState === 4){
                reject('error getting resources');
            }
        });
    
        request.open('GET', resource);
        request.send();
    });
};

getProducts('../json/products_pisos.json').then(data => {
    renderContent(data);
}).then(() => {
    owlInit();
}).catch(err => {
    console.log('promise rejected:', err);
});


function renderContent(data){

    return new Promise((resolve, reject) => {
        let div = document.getElementById('product-slider');

        data.forEach(item => {
            const html = `
                <a value="${item.id}" href="#"><div class="item" style="background-image: url('${item.img}');background-size: cover;background-position: center;">
                    <div value="${item.id}" class="item-img">
                        <p>${item.name}</p>
                    </div>
                </div></a>
            `;
            div.innerHTML += html;
        });
    });
}

function renderLastContent(data){

    return new Promise((resolve, reject) => {
        let div = document.querySelector('#product-slider .owl-wrapper');

        data.forEach(item => {
            const html = `
            <div class="owl-item" style="width: 171px;"><a value="${item.id}" href="#"><div class="item" style="background-image: url('${item.img}');background-size: cover;background-position: center;">
                    <div value="${item.id}" class="item-img">
                        <p>${item.name}</p>
                    </div>
                </div></a>
            </div>
            `;
            div.innerHTML += html;
        });
    });
}

function owlInit(){
    $("#product-slider").owlCarousel({
        items: numOwlItems,
        itemsDesktop:[1199,2],
        itemsDesktopSmall:[980,2],
        itemsMobile:[700,1.7],
        pagination:false,
        navigation:true,
        navigationText:["",""],
        autoPlay:false
    });
}

function restartOwl(){
    owl = $("#product-slider").data('owlCarousel');
    owl.jumpTo(0);
}

function cleanDiv(){
    let div = document.querySelector('#product-slider .owl-wrapper');

    div.innerHTML = '';
}

function selectProduct(){
    const productOptions = document.getElementById('product-options');

    productOptions.addEventListener('change', evt => {
        evt.preventDefault();
        cleanDiv();
        const typeOfProduct = evt.target.value;
        sheet = typeOfProduct;
        getProducts(`../json/products_${typeOfProduct}.json`).then(data => {
            renderLastContent(data);
        }).then(() => {
            restartOwl();
        }).catch(err => {
            console.log('promise rejected:', err);
        });
    });
}

function responsiveMenu(){
    const hamburger = document.getElementById('btn-toggle');
    const linksNav = document.querySelector('.nav-container .nav-links')

    hamburger.addEventListener('change', evt => {
        if(evt.target.checked === true){
            linksNav.style.transform = 'translate(0%)';
        } else {
            linksNav.style.transform = 'translate(-100%)';
        }
    });
}

function drawingProductVar(item){
    return new Promise((resolve, reject) => {
        let imgVariations = Object.values(item.variations);

        const varContainer = document.querySelector('#item-selected-specs .product-variation');

        varContainer.innerHTML = '';

        imgVariations.forEach(img => {
            const html = `
                <div class="var">
                    <img src="${img}" alt="">
                </div>
            `;
            varContainer.innerHTML += html;
        });
        
        resolve();

    });
}

function drawingIdeals(item){
    return new Promise((resolve, reject) => {
        let idealTexts = Object.keys(item.uses);
        let idealIcons = Object.values(item.uses);

        const nameDiv = document.querySelector('#item-selected-specs .main-item-title');
        const div = document.querySelector('#item-selected-specs .ideal-icons');
        const typeProdDiv = document.querySelector('#item-selected-specs .main-item-title.type');

        nameDiv.innerHTML = '';
        div.innerHTML = '';
        typeProdDiv.innerHTML = '';

        nameDiv.innerHTML = item.name;
        typeProdDiv.innerHTML = item.type;

        let i = 0;
        idealTexts.forEach(text => {
            const html = `
                <div class="ideal-item">
                    ${idealIcons[i]}
                    <span>${text}</span>
                </div>
                `;
            div.innerHTML += html;
            i++;
        });
        resolve();
    });
}

function renderDynamicItem(data, id){
    const idNumber = Number(id);
    const headerImg = document.querySelector('.container.products .item-selected .item-selected-img');
    const specsContainer = document.querySelector('.container.products .item-selected');

    data.forEach(item => {
        if(item.id === idNumber){
            drawingIdeals(item).then(() => {
                drawingProductVar(item);
            }).then(() => {
                headerImg.innerHTML = `<img alt="" src="../${item.img}">`;
                specsContainer.style.transform = "translateY(0%)";
            });
        } 
    });
}


function closeProductSpecs(){
    const closeDisplay = document.getElementById('close-item');
    const specsContainer = document.querySelector('.container.products .item-selected');

    closeDisplay.addEventListener('change', evt => {
        specsContainer.style.transform = "translateY(100%)";
    });
}


function responsiveItem(){
    const productView = document.querySelector('#product-slider');
    const itemDisplay = document.querySelector('.container.products .item-selected');

    productView.addEventListener('click', evt => {
        evt.preventDefault();
        const idData = evt.target.parentElement.getAttribute('value');
        if(idData){
            getProducts(`../products_${sheet}.json`).then(data => {
                renderDynamicItem(data, idData);
            }).catch(err => {
                console.log('promise rejected:', err);
            });
        }
    });
}