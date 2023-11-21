import React from 'react'
import ReactDOM from 'react-dom/client'
import {Provider} from 'react-redux';
import App from './App.jsx'
import './index.css'
import MainContext from "./context/mainContext";


import {createStore} from 'redux';

import rootReducer from './mriviewer/store/Store';

const store = createStore(rootReducer,
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <Provider store={store}>
            <MainContext>
                <App/>
            </MainContext>
        </Provider>,
    </React.StrictMode>,
)
