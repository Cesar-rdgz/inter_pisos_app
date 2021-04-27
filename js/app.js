const slides = document.querySelectorAll('.container.top-fold');

setTimeout(() => {
    const spinner = document.querySelector('.window-loader');
    
    spinner.style.transform = 'translateX(-100%)';
    filterproducts();
}, 5000);

sliderReset();
sliderInit();
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

getProducts('products_pisos.json').then(data => {
    renderContent(data);
}).catch(err => {
    console.log('promise rejected:', err);
});


function renderContent(data){

    return new Promise((resolve, reject) => {
        let div = document.querySelector('#product-slider .wrapper');
        const filtersCon =  document.querySelector('.filters .wrapper');

        data.forEach(item => {
            if(!item.id){
                const filtersKeys = Object.values(item.filters);

                filtersKeys.forEach(fil => {
                        const filters = `
                        <a data-query="${fil}" href="#">
                            <span data-query="${fil}">${fil}</span>
                        </a>
                    `;
                    filtersCon.innerHTML += filters;
                });
            }else{
                const html = `
                    <a value="${item.id}" data-query="${item.query}" href="#"><div class="item" style="background-image: url('${item.img}');background-size: cover;background-position: center;">
                        <div value="${item.id}" class="item-img">
                            <p>${item.name}</p>
                        </div>
                    </div></a>
                `;
                div.innerHTML += html;
            }
        });
    });
}

function renderLastContent(data){

    return new Promise((resolve, reject) => {
        let div = document.querySelector('#product-slider .wrapper');
        const filtersCon =  document.querySelector('.filters .wrapper');

        filtersCon.innerHTML = '';

        data.forEach(item => {
            if(!item.id){
                const filtersKeys = Object.values(item.filters);

                filtersKeys.forEach(fil => {
                        const filters = `
                        <a data-query="${fil}" href="#">
                            <span data-query="${fil}">${fil}</span>
                        </a>
                    `;
                    filtersCon.innerHTML += filters;
                });
            }else{
                const html = `
                <a value="${item.id}" data-query="${item.query}" href="#"><div class="item" style="background-image: url('${item.img}');background-size: cover;background-position: center;">
                        <div value="${item.id}" class="item-img">
                            <p>${item.name}</p>
                        </div>
                    </div></a>
                `;
                div.innerHTML += html;
            }
        });
    });
}

function cleanDiv(){
    let div = document.querySelector('#product-slider .wrapper');

    div.innerHTML = '';
}

function selectProduct(){
    const productOptions = document.getElementById('product-options');

    productOptions.addEventListener('change', evt => {
        evt.preventDefault();
        cleanDiv();
        const typeOfProduct = evt.target.value;
        sheet = typeOfProduct;
        getProducts(`products_${typeOfProduct}.json`).then(data => {
            renderLastContent(data);
        }).then(() => {
            filterproducts();
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
        //let imgVariations = Object.values(item.variations);
        //let imgKeys = Object.keys(item.variations);

        const varContainer = document.querySelector('#item-selected-specs .product-variation');

        varContainer.innerHTML = '';

        item.variations.varImgs.forEach(img => {
            const imgIndex = item.variations.varImgs.indexOf(img);

            const html = `
                <div class="var">
                    <img src="${img}" alt="" value="${imgIndex}">
                </div>
            `;
            varContainer.innerHTML += html;
        });
        
        resolve();

    });
}

function contactBtns(item){
    return new Promise((resolve, reject) => {
        const container = document.querySelector('#item-selected-specs .single-item-icons .whatsapp');

        const html = `
            <a href="https://wa.me/524371047297?text=Me%20podrían%20dar%20más%20infomación%20sobre%20el%20${item.query}%20${item.name}"><i class="fab fa-whatsapp"></i></a>
        `;

        container.innerHTML = '';
        container.innerHTML = html;
    });
}

function injectionSecViewContent(item){
    return new Promise((resolve, reject) => {
        const keysfromVar = Object.keys(item.variations);

        const btnsVariations = document.querySelectorAll('.item-selected .product-variation .var img');
        const secView = document.querySelector('.secondary-view');

        btnsVariations.forEach(btn => {
            btn.addEventListener('click', e => {

                const data = e.target.getAttribute('value');
                
                    const injectContainer = document.querySelector('.secondary-view .sec-content-view');

                    const html = `
            
                    <div class="img-content">
                        <img src="${item.variations.varImgs[data]}" alt="">
                    </div>
                    <div class="text-img">
                        <p class="text-sec">${item.variations.varTexts[data]}</p>
                    </div>
            
                    `;
            
                    injectContainer.innerHTML = html;
                    secView.style.left = '50%';
                    closeSecondaryView();
            });
            
        });
    });
}


function closeSecondaryView() {
    const btnForcloseView = document.querySelector('.secondary-view .closed-btn label');

    btnForcloseView.addEventListener('click', () => {
        const secView = document.querySelector('.secondary-view');

        secView.style.left = '1000%';
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
                contactBtns(item);
            }).then(() => {
                injectionSecViewContent(item);
            }).then(() => {
                headerImg.innerHTML = `<img alt="" src="${item.img}">`;
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
            getProducts(`products_${sheet}.json`).then(data => {
                renderDynamicItem(data, idData);
            }).catch(err => {
                console.log('promise rejected:', err);
            });
        }
    });
}

function filterproducts(){
    const fil = document.querySelector('.container.products .filters');

    fil.addEventListener('click', e => {
        e.preventDefault();

        let queryFil = e.target.getAttribute('data-query');

        if(e.target.nodeName === 'A' || e.target.nodeName === 'SPAN' && queryFil === 'Todo'){
            let items = document.querySelectorAll('#product-slider .wrapper a');
            
            if(queryFil === 'Todo'){
                items.forEach(item => {
                    item.style.display = 'block';
                });
            }
        }else if(e.target.nodeName === 'A' || e.target.nodeName === 'SPAN'){

            let items = document.querySelectorAll('#product-slider .wrapper a');

            items.forEach(item => {
                const query = item.getAttribute('data-query');
                if(query.includes(queryFil) !== true){
                    item.style.display = 'none';
                } else if(query.includes(queryFil) === true) {
                    item.style.display = 'block';
                }
            });
        }
    });
}

function sliderInit(){
    slides[0].style.display = 'block';
};

function sliderReset(){
    slides.forEach(slide => {
        slide.style.display = 'none';
    });
}

let counter = 1;

setInterval(() => {
    sliderReset();
    slides[counter].style.display = 'block';
    counter++;
    if(counter >= slides.length){
        counter = 0;
    }
}, 8000);