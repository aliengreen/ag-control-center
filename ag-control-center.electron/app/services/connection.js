import { Service } from './service'
import request from 'request';
import { builtinModules } from 'module';

/** Location Search Service Class */
export class Connection extends Service {

    constructor(props = {}) {
        super(props);
        this.host = "https://admin-dev.aliengreen.ge";
        this.accessToken = null;
        if(props.host) {
            this.host = props.host;
        }

    }

    requestServer(options) {
        return new Promise((resolve, reject) => {
      
            request(options, (error, response, body) => {
                if (response === undefined && error !== undefined) {
                    let res = {
                        statusCode: 501,
                        statusMessage: 'Connection error'
                    };
                    reject(res);
                    this.triggerEvent('error', res);
                } else {
                    if (response.statusCode < 200 || response.statusCode > 300) {
                        reject(response, response.statusCode);
                        this.triggerEvent('error', response);
                    } else {
                        if (body.access_token !== undefined && options.url.slice(-6) == '/login') {
                            this.accessToken = body.access_token;
                            this.setCookie('accessToken', this.accessToken, 3);
                        }
                        resolve(body, response.statusCode);
                    }
                }
            });
        });
    }

    login(email, password) {

        var param = {
            email: email,
            password: password
        };

        let options = {
            url: this.host + "/auth/login",
            method: "POST",
            json: true,
            body: param
        };

        return this.requestServer(options);
    }

    pretend(uuid) {
        var param = {
            uuid: uuid
        };

        let options = {
            headers: {
                'Authorization': "Bearer " + this.accessToken
            },
            url: this.host + "/api/pretend_user",
            method: "POST",
            json: true,
            body: param
        };

        return this.requestServer(options);
    }

    userList(search, offset, limit, order, order_by) {

        var param = {
            order: order,
            order_by: order_by,
            offset: offset,
            limit: limit,
            search: search
        };

        let options = {
            headers: {
                'Authorization': "Bearer " + this.accessToken
            },
            url: this.host + "/api/users",
            method: "GET",
            json: true,
            qs: param
        };

        return this.requestServer(options);

    }

    paymentList(search, status, offset, limit, order, order_by) {

        var param = {
            order: order,
            order_by: order_by,
            offset: offset,
            limit: limit,
            search: search,
            status: status
        };

        let options = {
            headers: {
                'Authorization': "Bearer " + this.accessToken
            },
            url: this.host + "/api/payments",
            method: "GET",
            json: true,
            qs: param
        };

        return this.requestServer(options);

    }

    getPayment(order_id) {

        var param = {
            order_id: order_id
        };

        let options = {
            headers: {
                'Authorization': "Bearer " + this.accessToken
            },
            url: this.host + "/api/payment",
            method: "GET",
            json: true,
            qs: param
        };

        return this.requestServer(options);

    }

    paymentAccept(order_id) {

        var param = {
            order_id: order_id,
            send_email: false
        };

        let options = {
            headers: {
                'Authorization': "Bearer " + this.accessToken
            },
            url: this.host + "/api/payments_accept",
            method: "POST",
            json: true,
            body: param
        };

        return this.requestServer(options);

    }

    paymentCancel(order_id) {

        var param = {
            order_id: order_id
        };

        let options = {
            headers: {
                'Authorization': "Bearer " + this.accessToken
            },
            url: this.host + "/api/payments_stop",
            method: "POST",
            json: true,
            body: param
        };

        return this.requestServer(options);

    }
    
    paymentDelivered(order_id) {

        var param = {
            order_id: order_id
        };

        let options = {
            headers: {
                'Authorization': "Bearer " + this.accessToken
            },
            url: this.host + "/api/payments_delivered",
            method: "POST",
            json: true,
            body: param
        };

        return this.requestServer(options);

    }

    userSessions(uuid) {

        var param = {
            uuid: uuid
        };

        let options = {
            headers: {
                'Authorization': "Bearer " + this.accessToken
            },
            url: this.host + "/api/user/sessions",
            method: "GET",
            json: true,
            qs: param
        };

        return this.requestServer(options);

    }

    getUserByUUID(uuid) {

        var param = {
            uuid: uuid
        };

        let options = {
            headers: {
                'Authorization': "Bearer " + this.accessToken
            },
            url: this.host + "/api/user",
            method: "GET",
            json: true,
            qs: param
        };

        return this.requestServer(options);
    }


    getDeviceByEUI64(eui64) {

        var param = {
            eui64: eui64
        };

        let options = {
            headers: {
                'Authorization': "Bearer " + this.accessToken
            },
            url: this.host + "/api/device",
            method: "GET",
            json: true,
            qs: param
        };

        return this.requestServer(options);
    }


    userModify(operation, uuid) {

        var param = {
            uuid: uuid,
            operation: operation
        };

        let options = {
            headers: {
                'Authorization': "Bearer " + this.accessToken
            },
            url: this.host + "/api/user/modify",
            method: "POST",
            json: true,
            body: param
        };

        return this.requestServer(options);
    }

    userUpdate(user) {

        let options = {
            headers: {
                'Authorization': "Bearer " + this.accessToken
            },
            url: this.host + "/api/user/update",
            method: "POST",
            json: true,
            body: user
        };

        return this.requestServer(options);
    }

    userDelete(params, uuid) {

        let param = {
            uuid: uuid,
            action: params.action,
        }

        let options = {
            headers: {
                'Authorization': "Bearer " + this.accessToken
            },
            url: this.host + "/api/user/delete",
            method: "POST",
            json: true,
            body: param
        };

        return this.requestServer(options);
    }
    
    userUpdatePassword(passwrod, uuid) {

        let param = {
            uuid: uuid,
            passwrod: passwrod.newpassword,
        }

        let options = {
            headers: {
                'Authorization': "Bearer " + this.accessToken
            },
            url: this.host + "/api/user/resetpwd",
            method: "POST",
            json: true,
            body: param
        };

        return this.requestServer(options);
    }

    userDevices(email) {

        var param = {
            email: email
        };

        let options = {
            headers: {
                'Authorization': "Bearer " + this.accessToken
            },
            url: this.host + "/api/user/devices",
            method: "GET",
            json: true,
            qs: param
        };

        return this.requestServer(options);
    }

    deviceUpdate(device) {

        let options = {
            headers: {
                'Authorization': "Bearer " + this.accessToken
            },
            url: this.host + "/api/device/update",
            method: "POST",
            json: true,
            body: device
        };

        return this.requestServer(options);
    }

    hasAccessToken() {
        this.accessToken = this.getCookie('accessToken');
        return (this.accessToken !== null);
    }

    setCookie(cname, cvalue, exhours) {
        var d = new Date();
        d.setTime(d.getTime() + (exhours * 60 * 60 * 1000));
        var expires = "expires=" + d.toUTCString();
        document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
    }

    getCookie(cname) {
        var name = cname + "=";
        var ca = document.cookie.split(';');
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) == ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(name) == 0) {
                return c.substring(name.length, c.length);
            }
        }
        return null;
    }

}