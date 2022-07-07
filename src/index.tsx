import React from 'react';
import { CookiesProvider } from 'react-cookie';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { compose, createStore } from 'redux';

import { AppSetupType } from './models/app.models';
import App from './view/App';
import rootReducer from './view/stores/store';

declare global {
  interface Window {
    RenderApp: (config: AppSetupType) => void;
    __REDUX_DEVTOOLS_EXTENSION_COMPOSE__?: typeof compose;
  }
}

const composeEnhancers = (window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ as typeof compose) || compose;

window.RenderApp = (config: AppSetupType) => {
  const store =
    process.env.NODE_ENV === 'development' ? createStore(rootReducer, composeEnhancers()) : createStore(rootReducer);
  ReactDOM.render(
    <CookiesProvider>
      <Provider store={store}>
        <App config={config} />
      </Provider>
    </CookiesProvider>,
    document.getElementById('root')
  );
};
