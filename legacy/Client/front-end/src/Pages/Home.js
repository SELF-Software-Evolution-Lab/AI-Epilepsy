import axios from 'axios';
import React,{useState} from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {

    const [error, setError] = useState(null);
    const [search, setSearch] = useState('');

    const handleChange = (e) => {
        const inputString = e.target.value;
        setSearch(inputString);
        if (inputString) {
          if (!inputString.trim().length) {
            setError('No es posible enviar un campo vacío.');
          } else if (inputString.trim().length < 10) {
            setError('No se permite ingresar texto con menos de 10 caracteres.');
          } else {
            setError(null);
          }
        }
      };
    const navigation = useNavigate();

    function handleSubmit(event) {
        event.preventDefault()
        if(search===''){
            setError('Por favor ingrese una búsqueda')
        }
        navigation('/patients',{ state:search})
    }

    return (
        <div className='logo-search-container'>
            <img className="logo-image" src="icons/plogo.png"></img>
            <form className='search-bar-container' onSubmit={handleSubmit} >
            <input
                className='search-bar'
                type="number"
                placeholder="Buscar paciente por documento de identidad"
                onChange={handleChange}
                value={search} />
            <button className='search-button' disabled={!!error||search===''}>Buscar</button>
            </form>
            {error ? <p className='search-bar-error'>{error}</p>: <></>}
            
        </div>
    );
}

export default Home;