import ReactDOM from 'react-dom/client'
import { BrowserRouter } from "react-router";
// import { store, persistor } from "./store/store.js";
// import { Provider } from "react-redux";
// import { PersistGate } from "reduxjs-toolkit-persist/integration/react";
import App from './App/App.jsx'
import './scss/index.scss'

// ReactDOM.createRoot(document.getElementById("root")).render(
//   <Provider store={store}>
//     <PersistGate loading={null} persistor={persistor}>
//       <App />
//     </PersistGate>
//   </Provider>
// );

ReactDOM.createRoot(document.getElementById("root")).render(
    <BrowserRouter>
        <App />
    </BrowserRouter>
);
