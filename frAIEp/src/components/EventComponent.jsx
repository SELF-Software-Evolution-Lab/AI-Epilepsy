import React from 'react';

const EventComponent = ({event}) => {
    return (
        <section className='event-section'>
        <section className='event-info'>
            <ul className='event-ul'>
                <li className='event-li'>Nombre</li>
                <li className='event-li'>Fecha</li>
                <li className='event-li'> Tipo de evento:</li>
                <li className='event-li'>Personal:</li>
            </ul>

        </section>
           
           
            <button className='event-detail-button'>Ver detalle</button>
        </section>
    );
}

export default EventComponent;
