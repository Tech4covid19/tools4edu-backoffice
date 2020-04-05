export default class Auth {
    login(accessToken, history) {
        localStorage.setItem('t4e-token', accessToken);
        history.replace('/');
    }

    isAuthenticated() {
        return !!localStorage.getItem('t4e-token')
    }

    logout(history) {
        localStorage.removeItem('t4e-token');
        history.replace('/login')
    }
}
