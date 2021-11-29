const getGoods=()=>{

    const links=document.querySelectorAll('.navigation-link');
    const sectionTitle=document.querySelector('.section-title');
    const more=document.querySelector('.more');
    
    const renderGoods=(goods, goodsTitle)=>{

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
        });
        sectionTitle.textContent=goodsTitle;
        
    };

    const getData=(value, category)=>{

        // fetch('/db/db.json')
        // .then(function(response){return response.json()})
        // .then(function(data){console.log(data)})
        
        fetch('db/db.json')
        .then(resp=>resp.json())
        .then((data)=>{
            const array=category ? data.filter((item)=>item[category].toLowerCase()===value.toLowerCase()):data;
            localStorage.setItem('goods',JSON.stringify(array));
            
            if (window.location.pathname !== '/goods.html'){
                window.location.href='/goods.html';
                }else{
                    renderGoods(array, value);   
                }
        });
        
    };

    
    links.forEach( (link)=>{

        link.addEventListener('click',(event)=>{
            event.preventDefault();
            const linkValue=link.textContent;
            const linkCategory=link.dataset.field;
            getData(linkValue, linkCategory);
        });

    });

    if (localStorage.getItem('goods')){
        renderGoods(JSON.parse(localStorage.getItem('goods')), 'All'); 
    }
    
    
    if(more){
        
        more.addEventListener(('click'),(e)=>{
            e.preventDefault();
            getData();
        });
        
    }

};
getGoods();
