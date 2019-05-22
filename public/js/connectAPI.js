var Dia_chi_Dich_vu = 'https://secondhandsapp.herokuapp.com';
// var Dia_chi_Dich_vu = 'http://localhost:3000';


// -------------User-------------------
function loginAPI(info) {
    return new Promise((resolve, reject) => {
        var Xu_ly_HTTP = new XMLHttpRequest();
        var Tham_so = `/api/users/login`;
        var Dia_chi_Xu_ly = `${Dia_chi_Dich_vu}${Tham_so}`;
        Xu_ly_HTTP.open(`POST`, Dia_chi_Xu_ly, true);
        Xu_ly_HTTP.setRequestHeader('Content-Type', 'application/json');
        var chuoi_gui = JSON.stringify(info);
        Xu_ly_HTTP.onload = () => {
            if (Xu_ly_HTTP.readyState === 4)
                if (Xu_ly_HTTP.status === 200)
                    resolve(JSON.parse(Xu_ly_HTTP.responseText));
                else
                    reject(Xu_ly_HTTP.statusText);
        }
        Xu_ly_HTTP.onerror = () => {
            reject(Xu_ly_HTTP.statusText);
        }
        Xu_ly_HTTP.send(chuoi_gui);
    });
}

function signupAPI(infoRegister){
    return new Promise((resolve, reject) => {
        var Xu_ly_HTTP = new XMLHttpRequest();
        var Tham_so = `/api/users/signup`;
        var Dia_chi_Xu_ly = `${Dia_chi_Dich_vu}${Tham_so}`;
        Xu_ly_HTTP.open(`POST`, Dia_chi_Xu_ly, true);
        Xu_ly_HTTP.setRequestHeader('Content-Type', 'application/json');
        var chuoi_gui = JSON.stringify(infoRegister);
        Xu_ly_HTTP.onload = () => {
            if (Xu_ly_HTTP.readyState === 4)
                if (Xu_ly_HTTP.status === 201)
                    resolve(JSON.parse(Xu_ly_HTTP.responseText));
                else
                    reject(Xu_ly_HTTP.statusText);
        }
        Xu_ly_HTTP.onerror = () => {
            reject(Xu_ly_HTTP.statusText);
        }
        Xu_ly_HTTP.send(chuoi_gui);
    });
}

function getAllUsersAPI(token){
    return new Promise((resolve, reject) => {
        var Xu_ly_HTTP = new XMLHttpRequest();
        var Tham_so = `/api/users`;
        var Dia_chi_Xu_ly = `${Dia_chi_Dich_vu}${Tham_so}`;
        Xu_ly_HTTP.open(`GET`, Dia_chi_Xu_ly, true);
        Xu_ly_HTTP.setRequestHeader('Content-Type', 'application/json');
        Xu_ly_HTTP.setRequestHeader('Authorization', `huydeptrai ${token}`);
        Xu_ly_HTTP.onload = () => {
            if (Xu_ly_HTTP.readyState === 4)
                if (Xu_ly_HTTP.status === 200)
                    resolve(JSON.parse(Xu_ly_HTTP.responseText));
                else
                    reject(Xu_ly_HTTP.statusText);
        }
        Xu_ly_HTTP.onerror = () => {
            reject(Xu_ly_HTTP.statusText);
        }
        Xu_ly_HTTP.send(``);
    });
}

function deleteAccountUserAPI(token, id){
    return new Promise((resolve, reject) => {
        var Xu_ly_HTTP = new XMLHttpRequest();
        var Tham_so = `/api/users`;
        var Dia_chi_Xu_ly = `${Dia_chi_Dich_vu}${Tham_so}/${id}`;
        Xu_ly_HTTP.open(`DELETE`, Dia_chi_Xu_ly, true);
        Xu_ly_HTTP.setRequestHeader('Content-Type', 'application/json');
        Xu_ly_HTTP.setRequestHeader('Authorization', `huydeptrai ${token}`);
        Xu_ly_HTTP.onload = () => {
            if (Xu_ly_HTTP.readyState === 4)
                if (Xu_ly_HTTP.status === 200)
                    resolve(JSON.parse(Xu_ly_HTTP.responseText));
                else
                    reject(Xu_ly_HTTP.statusText);
        }
        Xu_ly_HTTP.onerror = () => {
            reject(Xu_ly_HTTP.statusText);
        }
        Xu_ly_HTTP.send(``);
    });
}

function updateAccountUserAPI(token, id, updateUser){
    return new Promise((resolve, reject) => {
        var Xu_ly_HTTP = new XMLHttpRequest();
        var Tham_so = `/api/users`;
        var Dia_chi_Xu_ly = `${Dia_chi_Dich_vu}${Tham_so}/${id}`;
        Xu_ly_HTTP.open(`PATCH`, Dia_chi_Xu_ly, true);
        Xu_ly_HTTP.setRequestHeader('Content-Type', 'application/json');
        Xu_ly_HTTP.setRequestHeader('Authorization', `huydeptrai ${token}`);
        Xu_ly_HTTP.onload = () => {
            if (Xu_ly_HTTP.readyState === 4)
                if (Xu_ly_HTTP.status === 200)
                    resolve(JSON.parse(Xu_ly_HTTP.responseText));
                else
                    reject(Xu_ly_HTTP.statusText);
        }
        Xu_ly_HTTP.onerror = () => {
            reject(Xu_ly_HTTP.statusText);
        }
        Xu_ly_HTTP.send(JSON.stringify(updateUser));
    });
}


// ----------------Category-------------------
function getAllCategoriesAPI(){
    return new Promise((resolve, reject) => {
        var Xu_ly_HTTP = new XMLHttpRequest();
        var Tham_so = `/api/categories/`;
        var Dia_chi_Xu_ly = `${Dia_chi_Dich_vu}${Tham_so}`;
        Xu_ly_HTTP.open(`GET`, Dia_chi_Xu_ly, true);
        Xu_ly_HTTP.setRequestHeader('Content-Type', 'application/json');
        Xu_ly_HTTP.onload = () => {
            if (Xu_ly_HTTP.readyState === 4)
                if (Xu_ly_HTTP.status === 200)
                    resolve(JSON.parse(Xu_ly_HTTP.responseText));
                else
                    reject(Xu_ly_HTTP.statusText);
        }
        Xu_ly_HTTP.onerror = () => {
            reject(Xu_ly_HTTP.statusText);
        }
        Xu_ly_HTTP.send(``);
    });
}

function deleteCategoryAPI(token, id){
    return new Promise((resolve, reject) => {
        var Xu_ly_HTTP = new XMLHttpRequest();
        var Tham_so = `/api/categories`;
        var Dia_chi_Xu_ly = `${Dia_chi_Dich_vu}${Tham_so}/${id}`;
        Xu_ly_HTTP.open(`DELETE`, Dia_chi_Xu_ly, true);
        Xu_ly_HTTP.setRequestHeader('Content-Type', 'application/json');
        Xu_ly_HTTP.setRequestHeader('Authorization', `huydeptrai ${token}`);
        Xu_ly_HTTP.onload = () => {
            if (Xu_ly_HTTP.readyState === 4)
                if (Xu_ly_HTTP.status === 200)
                    resolve(JSON.parse(Xu_ly_HTTP.responseText));
                else
                    reject(Xu_ly_HTTP.statusText);
        }
        Xu_ly_HTTP.onerror = () => {
            reject(Xu_ly_HTTP.statusText);
        }
        Xu_ly_HTTP.send(``);
    });
}

function getCategoryAPI(token, id){
    return new Promise((resolve, reject) => {
        var Xu_ly_HTTP = new XMLHttpRequest();
        var Tham_so = `/api/categories`;
        var Dia_chi_Xu_ly = `${Dia_chi_Dich_vu}${Tham_so}/${id}`;
        Xu_ly_HTTP.open(`GET`, Dia_chi_Xu_ly, true);
        Xu_ly_HTTP.setRequestHeader('Content-Type', 'application/json');
        Xu_ly_HTTP.setRequestHeader('Authorization', `huydeptrai ${token}`);
        Xu_ly_HTTP.onload = () => {
            if (Xu_ly_HTTP.readyState === 4)
                if (Xu_ly_HTTP.status === 200)
                    resolve(JSON.parse(Xu_ly_HTTP.responseText));
                else
                    reject(Xu_ly_HTTP.statusText);
        }
        Xu_ly_HTTP.onerror = () => {
            reject(Xu_ly_HTTP.statusText);
        }
        Xu_ly_HTTP.send(``);
    });
}

function updateImageCategoryAPI(token, id, formData){
    return new Promise((resolve, reject) => {
        var Xu_ly_HTTP = new XMLHttpRequest();
        var Tham_so = `/api/categories/image`;
        var Dia_chi_Xu_ly = `${Dia_chi_Dich_vu}${Tham_so}/${id}`;
        Xu_ly_HTTP.open(`PATCH`, Dia_chi_Xu_ly, true);
        Xu_ly_HTTP.setRequestHeader('Authorization', `huydeptrai ${token}`);
        Xu_ly_HTTP.onload = () => {
            if (Xu_ly_HTTP.readyState === 4)
                if (Xu_ly_HTTP.status === 200)
                    resolve(JSON.parse(Xu_ly_HTTP.responseText));
                else
                    reject(Xu_ly_HTTP.statusText);
        }
        Xu_ly_HTTP.onerror = () => {
            reject(Xu_ly_HTTP.statusText);
        }
        Xu_ly_HTTP.send(formData);
    });
}