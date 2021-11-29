cart=()=>{

    const cartBtn=document.querySelector('.button-cart');
    const cart=document.getElementById('modal-cart');
    const closeBtn=document.querySelector('.modal-close');
    const goodsContainer=document.querySelector('.long-goods-list');
    const cartTable=document.querySelector('.cart-table__goods');
    const modalForm=document.querySelector('.modal-form');
    const total=document.querySelector('.card-table__total');
    const customerInputs=document.querySelectorAll('.modal-input');
    const customerErrorSpan=document.querySelectorAll('.customer-error');
    const orderSuccessModal=document.querySelector('.modal-order-success');

    const addToCart=(id)=>{
        const goodsArray=JSON.parse(localStorage.getItem('goods'));   
                const clickedGood=goodsArray.find(good => good.id===id);
                const cartArray=(localStorage.getItem('cart'))?JSON.parse(localStorage.getItem('cart')):[];
                if (cartArray.some(good=>good.id===id)){
                    cartArray.map(good=>{
                        if (good.id===clickedGood.id){
                            good.count++;
                        }
                        return good;
                    });
                }
                else{
                    clickedGood.count=1;
                    cartArray.push(clickedGood);
                } 
                localStorage.setItem('cart', JSON.stringify(cartArray));
                renderCart(JSON.parse(localStorage.getItem('cart')));
    };
    
    const deleteCartItem=(id)=>{
        const cartArray=JSON.parse(localStorage.getItem('cart'));
        const newCartArray=cartArray.filter(good =>  {return good.id !== id;});
        localStorage.setItem('cart', JSON.stringify(newCartArray));
        renderCart(JSON.parse(localStorage.getItem('cart')));
    };

    const incCartItem=(id)=>{
        const cartArray=JSON.parse(localStorage.getItem('cart'));
        const newCartArray=cartArray.map(good =>  {if(good.id === id) good.count++;return good;});
        localStorage.setItem('cart', JSON.stringify(newCartArray));
        renderCart(JSON.parse(localStorage.getItem('cart')));
    };

    const decCartItem=(id)=>{
        const cartArray=JSON.parse(localStorage.getItem('cart'));
        const newCartArray=cartArray.map(good =>{
            if(good.id === id){
                if (good.count>0){
                    good.count--;
                }
            }
            return good;
        });
        localStorage.setItem('cart', JSON.stringify(newCartArray));
        renderCart(JSON.parse(localStorage.getItem('cart')));
    };
    
    const renderCart=(goodsArray)=>{
        
        cartTable.innerHTML='';
        goodsArray.forEach((good)=>{
            if (good.count !==0) {
                cartRow=document.createElement('tr');
                cartRow.innerHTML=`
                <td>${good.name}</td>
                            <td>${good.price}$</td>
                            <td><button class="cart-btn-minus"">-</button></td>
                            <td>${good.count}</td>
                            <td><button class=" cart-btn-plus"">+</button></td>
                            <td>${+good.price*+good.count}$</td>
                            <td><button class="cart-btn-delete"">x</button></td>
                `;
                cartTable.append(cartRow);
                cartRow.addEventListener('click',(e)=>{
                    if (e.target.classList.contains('cart-btn-minus')) {
                        decCartItem(good.id);
                    }else if(e.target.classList.contains('cart-btn-plus')){
                        incCartItem(good.id);
                    }else if (e.target.classList.contains('cart-btn-delete')){
                        deleteCartItem(good.id);   
                    }
                });
            }           
        });
        let initialValue=0;
        let totalSum= goodsArray.reduce((accumulator, currentValue) => accumulator + currentValue.price*currentValue.count, initialValue);      
        total.textContent=totalSum+'$';
        customerErrorSpan.forEach((errorSpan) =>{
            if (errorSpan.textContent){errorSpan.innerHTML='';}
        });
    };

    const checkCustomer=()=>{
        if(! (( /^[A-Za-zА-Яа-я]+$/ ).test(customerInputs[0].value) )){
            customerInputs[0].focus();
            customerErrorSpan[0].innerText='enter your name';  
            return false;
        }else 
            if ( ! (/^\d[\d\(\)\ -]{3,14}/).test(customerInputs[1].value) ) {
                customerInputs[1].focus();
                customerErrorSpan[1].innerText='enter phone number';  
                return false;
        }else {
            return true;}
    };
    
    const sendForm=()=>{

        if (localStorage.getItem('cart')) {
            if (checkCustomer()) {
            const cartArray=localStorage.getItem('cart')?JSON.parse(localStorage.getItem('cart')):[];
            fetch('https://jsonplaceholder.typicode.com/posts',{
                method:'POST',
                body:JSON.stringify({
                    cart:cartArray,
                    name:customerInputs[0].value ,
                    phone:customerInputs[1].value,
                })
            }).then(()=>{
                cart.style.display='';
                orderSuccessModal.style.display='flex';
                localStorage.removeItem('cart');
                customerInputs.forEach((customerInput) =>{customerInput.value='';});
            });
        } 
        }         
    };

    customerInputs.forEach((input, index) =>{
        input.addEventListener('input',()=>{
            if (customerErrorSpan[index].textContent)
            {customerErrorSpan[index].innerHTML='';}
        })
    });

    modalForm.addEventListener('submit',(e)=>{
        e.preventDefault();
        sendForm();
    });

    cartBtn.addEventListener('click', ()=>{
        renderCart(localStorage.getItem('cart')?JSON.parse(localStorage.getItem('cart')):[]);
        cart.style.display='flex';
    });
    
    closeBtn.addEventListener('click',()=>{
        cart.style.display='';
    });

    cart.addEventListener('click',(event)=>{

        if (event.target.classList.contains('overlay')){cart.style.display='';}
    });

    orderSuccessModal.addEventListener('click',()=>{ orderSuccessModal.style.display='';});   

    if(goodsContainer){
        
        goodsContainer.addEventListener(('click'),(event)=>{
            if (event.target.closest('.add-to-cart')){
                const addToCartBtn=event.target.closest('.add-to-cart');
                const goodId=addToCartBtn.dataset.id; 
                addToCart(goodId);
            }
        });
    }    
}
cart();