
import jwtDecode from 'jwt-decode';
import {EventEmitter} from 'events';
import AppDispatcher from '../dispatchers/AppDispatcher';

const LOGIN_USER = 'LOGIN_USER';
const LOGOUT_USER = 'LOGOUT_USER';

class BaseStore extends EventEmitter {

    constructor() {
        super();
    }

    subscribe(actionSubscribe) {
        this._dispatchToken = AppDispatcher.register(actionSubscribe());
    }

    get dispatchToken() {
        return this._dispatchToken;
    }

    emitChange() {
        this.emit('CHANGE');
    }

    addChangeListener(cb) {
        this.on('CHANGE', cb);
    }

    removeChangeListener(cb) {
        this.removeListener('CHANGE', cb);
    }
}


class LoginStore extends BaseStore {

    constructor() {
        super();
        this.subscribe(() => this._registerToActions.bind(this));
        this._user = null;
        this._jwt = null;
    }

    _registerToActions(action) {
        switch (action.actionType) {
            case LOGIN_USER:
                this._jwt = action.jwt;
                this._user = jwtDecode(this._jwt);
                this.emitChange();
                break;
            case LOGOUT_USER:
                this._user = null;
                this.emitChange();
                break;
            default:
                break;
        }
        ;
    }

    get user() {
        return this._user;
    }

    get jwt() {
        return this._jwt;
    }

    isLoggedIn() {
        return !!this._user;
    }
}

export default new LoginStore();
