// const REFRESH_SESSION_MUTATION = gql`
//     mutation RefreshSession($user: RefreshSessionInput!) {
//         refreshSession(user: $user) {
//             email,
//             accessToken,
//             refreshToken
//         }
//     }
// `

export default class Auth {
    constructor() {
        this.user = null;
        this.needsPasswordChange = false;
    }

    login(loginData, history) {
        console.log('login data', loginData)
        if (loginData.needsPasswordChange) {
            this.needsPasswordChange = true;
            return;
        }

        this.user = loginData;

        localStorage.setItem('t4e-token', loginData.accessToken);
        localStorage.setItem('t4e-refresh', loginData.refreshToken);
        localStorage.setItem('t4e-email', loginData.email);

        history.replace('/');
    }

    // static async refreshToken() {
    //     const email = localStorage.getItem('t4e-email');
    //     const token = localStorage.getItem('t4e-refresh');
    //
    //     let newSession = null;
    //
    //     try {
    //         newSession = await client.mutate({
    //             mutation: REFRESH_SESSION_MUTATION,
    //             variables: {
    //                 user: {
    //                     email: email,
    //                     refreshToken: token
    //                 }
    //             }
    //         })
    //     } catch (err) {
    //         console.log('refresh session err', err);
    //     }
    //
    //     if (newSession) {
    //         console.log('new session success', newSession)
    //         return `Bearer ${newSession.refreshSession.accessToken}`
    //     }
    //
    //     return null;
    // }

    isAuthenticated() {
        return !!localStorage.getItem('t4e-token')
    }

    logout(history) {
        this.user = null;

        localStorage.removeItem('t4e-token');
        localStorage.removeItem('t4e-email');
        localStorage.removeItem('t4e-refresh');

        history.replace('/login')
    }
}
