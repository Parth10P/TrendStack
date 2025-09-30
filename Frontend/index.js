import { registerRootComponent } from 'expo';

import App from './App';
import {PaperProvider } from 'react-native-paper';
function Main(){
    return (
        <PaperProvider>
        <App />
        </PaperProvider>
    )
}

registerRootComponent(Main);
