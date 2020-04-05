import ApolloClient from "apollo-boost";

const client = new ApolloClient({
    uri: 'https://cnom3x70jk.execute-api.eu-central-1.amazonaws.com/dev/graphql',
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
