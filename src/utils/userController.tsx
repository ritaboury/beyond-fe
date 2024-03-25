import { userRegisterData, userLoginData, userEditData, userDeleteData } from './dataClasses';

function loginUser(data : userLoginData, token : string = '') : Promise<any> {


    console.log(data);
    console.log('login');
    localStorage.setItem('token', token);

    localStorage.setItem('isGoogle', data.isGoogle.toString());

    data.password = btoa(data.password);
    data.password = data.password.replace(/=/g, '');
    data.password = "111" + data.password + "111";

        return fetch(`https://mtzozkro4lldxudald2pa5gti40yufxq.lambda-url.ca-central-1.on.aws/?email=${data.email}&password=${data.password}&isGoogle=${data.isGoogle}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'access_token': token
            }
        })
            .then(response => response.json())
            .then(data => {
                console.log(data);
                // return the data
                return data;
            })
            .catch(error => {
                console.error(error);
                // handle any errors
                throw error;
            });
}

function registerUser(userData: userRegisterData) : Promise<any> {

    console.log(userData);
    console.log('register');

    userData.password = btoa(userData.password);
    userData.password = userData.password.replace(/=/g, '');
    userData.password = "111" + userData.password + "111";


    return fetch('https://f4t2beecot3ujq6hwv7pveczzq0nqocq.lambda-url.ca-central-1.on.aws/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData)
        })
            .then(response => response.json())
            .then(data => {
                // Process the response data
                console.log(data);
                return data;
            })
            .catch(error => {
                // Handle any errors
                console.error(error);
                throw error;
            });
}

async function editUser(data: userEditData): Promise<any> {

    console.log(data);
    console.log('edit user');

    let isGoog = localStorage.getItem('isGoogle');
    let isGoogle = isGoog === 'true' ? true : false;

    if(isGoogle) {
        let Edata = {
            error: 'Google users cannot edit their profile'
        }   
        return Promise.resolve(Edata);
    }

    console.log(data);

    let headers = new Headers({
        'Content-Type': 'application/json'
    });

    

    if (data.isGoogle) {
        let token = localStorage.getItem('token');
        headers.append('Authorization', `Bearer ${token}`);
    } else {
        headers.append('Password', data.password);
    }

    const url = new URL(`https://myembg75opgf4gylftxdq2uwba0ghbxb.lambda-url.ca-central-1.on.aws/`);

    return fetch(url, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(data => {
        console.log(data);
        return data;
    })
    .catch(error => {
        console.error(error);
        throw error;
    });
}

async function deleteUser(data: userDeleteData ) {
    console.log('delete user', data);

    let headers = new Headers({
        'Content-Type': 'application/json'
    });

    data.password = btoa(data.password);
    data.password = data.password.replace(/=/g, '');
    data.password = "111" + data.password + "111";

    if (data.isGoogle) {
        headers.append('Authorization', `Bearer ${data.access_token}`);
    } else {
        headers.append('Password', data.password);
    }

    const url = new URL('https://pqzthzbhkepcvdwlrx7zvpgsaa0mjfqq.lambda-url.ca-central-1.on.aws/');
    url.searchParams.append('email', data.email);
    if (!data.isGoogle) {
        url.searchParams.append('password', data.password);
    }

    return fetch(url, {
        method: 'DELETE',
        headers: headers
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        console.log('User deleted:', data);
        return data;
    })
    .catch(error => {
        console.error('Error deleting user:', error);
        throw error;
    });
}

export { loginUser, registerUser, editUser, deleteUser };