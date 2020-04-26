import ApolloClient from "apollo-boost";

const client = new ApolloClient({
    uri: process.env.REACT_APP_GRAPHQL_BACKEND_URI,
    request: (operation) => {
        const token = localStorage.getItem('t4e-token');
        operation.setContext({
            headers: {
                authorization: token ? `Bearer ${token}` : null
            }
        })
    }
});

export default client;
