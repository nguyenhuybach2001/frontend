import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { Provider } from "react-redux";
import store from "./store/store.js";
import { ConfigProvider } from 'antd';

createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <ConfigProvider theme={{ hashed: false }}>
      <App />
    </ConfigProvider>
  </Provider>
);
