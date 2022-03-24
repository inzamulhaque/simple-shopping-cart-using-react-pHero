import React, { useEffect, useState } from 'react';
import { addToDb, getStoredCart } from '../../utilities/fakedb';
import Cart from '../cart/Cart';
import Product from '../product/Product';
import './shop.css';

const Shop = () => {
    const [products, setProducts] = useState([]);
    const [cart, setCart] = useState([]);

    useEffect(() => {
        fetch("products.json")
            .then(res => res.json())
            .then(data => setProducts(data));
    }, []);

    useEffect(() => {
        const storedCart = getStoredCart();
        const savedCart = [];
        for (const id in storedCart) {
            const addedProduct = products.find(product => product.id === id);
            if (addedProduct) {
                const quantity = storedCart[id];
                addedProduct.quantity = quantity;
                savedCart.push(addedProduct);
            }
        }
        setCart([...cart, ...savedCart]);
    }, [products]);

    const handleAddToCart = (product) => {
        product.quantity += 1;
        const exists = cart.find(cartProduct => cartProduct.id === product.id);
        if (!exists) {
            setCart([...cart, product]);
        } else {
            const restProducts = cart.filter(cartProduct => cartProduct.id !== product.id);
            setCart([...restProducts, product]);
        }

        addToDb(product.id);
    }

    return (
        <div className='shop-container'>
            <div className="products-container">
                {
                    products.map(product => <Product handleClick={handleAddToCart} product={product} key={product.id} />)
                }
            </div>
            <div className="cartContainer">
                <Cart cart={cart} />
            </div>
        </div>
    );
};

export default Shop;