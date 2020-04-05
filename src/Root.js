import React from 'react';
import App from './App';
import { ApolloProvider } from '@apollo/react-hooks';
import client from './apollo'
import {BrowserRouter} from "react-router-dom";

export default function Root() {
    return (
        <ApolloProvider client={client}>
            <BrowserRouter>
                <App/>
            </BrowserRouter>
        </ApolloProvider>
    )
}
