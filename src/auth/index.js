

export default class Auth {
    constructor() {
        this.user = null;
        this.needsPasswordChange = false;
    }

    login(loginData, history) {
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
