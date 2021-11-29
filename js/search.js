search=()=>{

const input=document.querySelector('.search-block > input');
const searchBtn=document.querySelector('.search-block > button');

const renderGoods=(goods)=>{
        const goodsContainer=document.querySelector('.long-goods-list');
        goodsContainer.innerHTML='';
        goods.forEach(good=>{
        let  {id, img, name, label, description, price, category, gender, offer}=good;
        const cardDiv=document.createElement('div');
        cardDiv.classList.add("col-lg-3");
        cardDiv.classList.add("col-sm-6");
        cardDiv.innerHTML=`
            <div class="goods-card">
                <span class="label ${label? null:'d-none'}">${label}</span>
                <img src="db/${img}" alt="image:${name}" class="goods-image">
                <h3 class="goods-title">${name}</h3>
                <p class="goods-description">${description}</p>
                <button class="button goods-card-btn add-to-cart" data-id="${id}">
                    <span class="button-price">$${price}</span>
                </button>
			</div>
        `;
        goodsContainer.append(cardDiv);
        const addToCartBtn=document.querySelector('.add-to-cart');
        });
    };

        const getData=(value )=>{

                fetch('/db/db.json')
                .then(resp=>resp.json())
                .then((data)=>{
                        const array=data.filter((item)=>item.name.toLowerCase().includes(value.toLowerCase()));
                        localStorage.setItem('goods',JSON.stringify(array));
                        if (window.location.pathname !== './goods.html'){
                        window.location.href='./goods.html';
                        }else{renderGoods(array);  }
                });
        };

        searchBtn.addEventListener('click',()=> getData(input.value));

}
search();