import React from 'react';

const ButtonOffset = () => {
    return (
        <section className="buttons-pages-component">

            <button className="triangle-buttons">
                <div className="triangle-buttons__triangle triangle-buttons__triangle--l"></div>
            </button>            
            <p className='page-number'>Página número 3 de x</p>
            <button className="triangle-buttons">
                <div className="triangle-buttons__triangle triangle-buttons__triangle--r"></div>
            </button>

        </section>
    );
}

export default ButtonOffset;
