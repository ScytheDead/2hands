var Dia_chi_Dich_vu = 'https://secondhandsapp.herokuapp.com';
// var Dia_chi_Dich_vu = 'http://localhost:3000';


// -------------------User--------------------
// -------------------------------------------
// -------------------------------------------
// -------------------------------------------
// -------------------------------------------
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

function getUserAPI(token, id){
    return new Promise((resolve, reject) => {
        var Xu_ly_HTTP = new XMLHttpRequest();
        var Tham_so = `/api/users`;
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

function updateAvatarUserAPI(token, userId, avatar){
    return new Promise((resolve, reject) => {
        var Xu_ly_HTTP = new XMLHttpRequest();
        var Tham_so = `/api/users/avatar`;
        var Dia_chi_Xu_ly = `${Dia_chi_Dich_vu}${Tham_so}/${userId}`;
        Xu_ly_HTTP.open(`PATCH`, Dia_chi_Xu_ly, true);
        Xu_ly_HTTP.setRequestHeader('Content-Type', 'application/json');
        Xu_ly_HTTP.setRequestHeader('Authorization', `huydeptrai ${token}`);
        Xu_ly_HTTP.onload = () => {
            if (Xu_ly_HTTP.readyState === 4)
                if (Xu_ly_HTTP.status === 200)
                    resolve(JSON.parse(Xu_ly_HTTP.responseText));
                else
                    reject(Xu_ly_HTTP.responseText);
        }
        Xu_ly_HTTP.onerror = () => {
            reject(Xu_ly_HTTP.statusText);
        }
        Xu_ly_HTTP.send(JSON.stringify(avatar));
    });
}

function subscribePostAPI(token, userId, post){
    return new Promise((resolve, reject) => {
        var Xu_ly_HTTP = new XMLHttpRequest();
        var Tham_so = `/api/users/subscribe`;
        var Dia_chi_Xu_ly = `${Dia_chi_Dich_vu}${Tham_so}/${userId}`;
        Xu_ly_HTTP.open(`PATCH`, Dia_chi_Xu_ly, true);
        Xu_ly_HTTP.setRequestHeader('Content-Type', 'application/json');
        Xu_ly_HTTP.setRequestHeader('Authorization', `huydeptrai ${token}`);
        Xu_ly_HTTP.onload = () => {
            if (Xu_ly_HTTP.readyState === 4)
                if (Xu_ly_HTTP.status === 200)
                    resolve(JSON.parse(Xu_ly_HTTP.responseText));
                else
                    reject(Xu_ly_HTTP.responseText);
        }
        Xu_ly_HTTP.onerror = () => {
            reject(Xu_ly_HTTP.statusText);
        }
        Xu_ly_HTTP.send(JSON.stringify(post));
    });
}

function getSubscribestUserAPI(token, userId){
    return new Promise((resolve, reject) => {
        var Xu_ly_HTTP = new XMLHttpRequest();
        var Tham_so = `/api/users/subscribes`;
        var Dia_chi_Xu_ly = `${Dia_chi_Dich_vu}${Tham_so}/${userId}`;
        Xu_ly_HTTP.open(`GET`, Dia_chi_Xu_ly, true);
        Xu_ly_HTTP.setRequestHeader('Content-Type', 'application/json');
        Xu_ly_HTTP.setRequestHeader('Authorization', `huydeptrai ${token}`);
        Xu_ly_HTTP.onload = () => {
            if (Xu_ly_HTTP.readyState === 4)
                if (Xu_ly_HTTP.status === 200)
                    resolve(JSON.parse(Xu_ly_HTTP.responseText));
                else
                    reject(Xu_ly_HTTP.responseText);
        }
        Xu_ly_HTTP.onerror = () => {
            reject(Xu_ly_HTTP.statusText);
        }
        Xu_ly_HTTP.send(``);
    });
}


// ----------------Category-------------------
// -------------------------------------------
// -------------------------------------------
// -------------------------------------------
// -------------------------------------------
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
                    reject(Xu_ly_HTTP.responseText);
        }
        Xu_ly_HTTP.onerror = () => {
            reject(Xu_ly_HTTP.statusText);
        }
        Xu_ly_HTTP.send(``);
    });
}

function getCategoryAPI(id){
    return new Promise((resolve, reject) => {
        var Xu_ly_HTTP = new XMLHttpRequest();
        var Tham_so = `/api/categories`;
        var Dia_chi_Xu_ly = `${Dia_chi_Dich_vu}${Tham_so}/${id}`;
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

function createCategoryAPI(token, infoCategory) {
    return new Promise((resolve, reject) => {
        var Xu_ly_HTTP = new XMLHttpRequest();
        var Tham_so = `/api/categories`;
        var Dia_chi_Xu_ly = `${Dia_chi_Dich_vu}${Tham_so}`;
        Xu_ly_HTTP.open(`POST`, Dia_chi_Xu_ly, true);
        Xu_ly_HTTP.setRequestHeader('Content-Type', 'application/json');
        Xu_ly_HTTP.setRequestHeader('Authorization', `huydeptrai ${token}`);
        Xu_ly_HTTP.onload = () => {
            if (Xu_ly_HTTP.readyState === 4)
                if (Xu_ly_HTTP.status === 201)
                    resolve(JSON.parse(Xu_ly_HTTP.responseText));
                else 
                    reject(Xu_ly_HTTP.responseText);     
        }
        Xu_ly_HTTP.onerror = () => {
            reject(Xu_ly_HTTP.statusText);
        }
        Xu_ly_HTTP.send(JSON.stringify(infoCategory));
    });
}

function updateCategoryAPI(token, id, updateCategory){
    return new Promise((resolve, reject) => {
        var Xu_ly_HTTP = new XMLHttpRequest();
        var Tham_so = `/api/categories`;
        var Dia_chi_Xu_ly = `${Dia_chi_Dich_vu}${Tham_so}/${id}`;
        Xu_ly_HTTP.open(`PATCH`, Dia_chi_Xu_ly, true);
        Xu_ly_HTTP.setRequestHeader('Content-Type', 'application/json');
        Xu_ly_HTTP.setRequestHeader('Authorization', `huydeptrai ${token}`);
        Xu_ly_HTTP.onload = () => {
            if (Xu_ly_HTTP.readyState === 4)
                if (Xu_ly_HTTP.status === 200)
                    resolve(JSON.parse(Xu_ly_HTTP.responseText));
                else 
                    reject(Xu_ly_HTTP.responseText);     
        }
        Xu_ly_HTTP.onerror = () => {
            reject(Xu_ly_HTTP.statusText);
        }
        Xu_ly_HTTP.send(JSON.stringify(updateCategory));
    });
}

function updateImageCategoryAPI(token, id, base64Image){
    return new Promise((resolve, reject) => {
        var Xu_ly_HTTP = new XMLHttpRequest();
        var Tham_so = `/api/categories/image`;
        var Dia_chi_Xu_ly = `${Dia_chi_Dich_vu}${Tham_so}/${id}`;
        Xu_ly_HTTP.open(`PATCH`, Dia_chi_Xu_ly, true);
        Xu_ly_HTTP.setRequestHeader('Content-Type', 'application/json');
        Xu_ly_HTTP.setRequestHeader('Authorization', `huydeptrai ${token}`);
        Xu_ly_HTTP.onload = () => {
            if (Xu_ly_HTTP.readyState === 4)
                if (Xu_ly_HTTP.status === 200)
                    resolve(JSON.parse(Xu_ly_HTTP.responseText));
                else
                    reject(Xu_ly_HTTP.responseText);
        }
        Xu_ly_HTTP.onerror = () => {
            reject(Xu_ly_HTTP.responseText);
        }
        Xu_ly_HTTP.send(JSON.stringify(base64Image));
    });
}

// ----------------Classify-------------------
// -------------------------------------------
// -------------------------------------------
// -------------------------------------------
// -------------------------------------------
function getAllClassifyAPI(){
    return new Promise((resolve, reject) => {
        var Xu_ly_HTTP = new XMLHttpRequest();
        var Tham_so = `/api/classifies/`;
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

function getClassifyAPI(id){
    return new Promise((resolve, reject) => {
        var Xu_ly_HTTP = new XMLHttpRequest();
        var Tham_so = `/api/classifies`;
        var Dia_chi_Xu_ly = `${Dia_chi_Dich_vu}${Tham_so}/${id}`;
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

function getClassifiesByCategoryAPI(CategoryId){
    return new Promise((resolve, reject) => {
        var Xu_ly_HTTP = new XMLHttpRequest();
        var Tham_so = `/api/classifies/category`;
        var Dia_chi_Xu_ly = `${Dia_chi_Dich_vu}${Tham_so}/${CategoryId}`;
        Xu_ly_HTTP.open(`GET`, Dia_chi_Xu_ly, true);
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

function createClassifyAPI(token, infoClassify) {
    return new Promise((resolve, reject) => {
        var Xu_ly_HTTP = new XMLHttpRequest();
        var Tham_so = `/api/classifies`;
        var Dia_chi_Xu_ly = `${Dia_chi_Dich_vu}${Tham_so}`;
        Xu_ly_HTTP.open(`POST`, Dia_chi_Xu_ly, true);
        Xu_ly_HTTP.setRequestHeader('Content-Type', 'application/json');
        Xu_ly_HTTP.setRequestHeader('Authorization', `huydeptrai ${token}`);
        Xu_ly_HTTP.onload = () => {
            if (Xu_ly_HTTP.readyState === 4)
                if (Xu_ly_HTTP.status === 201)
                    resolve(JSON.parse(Xu_ly_HTTP.responseText));
                else 
                    reject(Xu_ly_HTTP.responseText);     
        }
        Xu_ly_HTTP.onerror = () => {
            reject(Xu_ly_HTTP.statusText);
        }
        Xu_ly_HTTP.send(JSON.stringify(infoClassify));
    });
}

function deleteClassifyAPI(token, id){
    return new Promise((resolve, reject) => {
        var Xu_ly_HTTP = new XMLHttpRequest();
        var Tham_so = `/api/classifies`;
        var Dia_chi_Xu_ly = `${Dia_chi_Dich_vu}${Tham_so}/${id}`;
        Xu_ly_HTTP.open(`DELETE`, Dia_chi_Xu_ly, true);
        Xu_ly_HTTP.setRequestHeader('Content-Type', 'application/json');
        Xu_ly_HTTP.setRequestHeader('Authorization', `huydeptrai ${token}`);
        Xu_ly_HTTP.onload = () => {
            if (Xu_ly_HTTP.readyState === 4)
                if (Xu_ly_HTTP.status === 200)
                    resolve(JSON.parse(Xu_ly_HTTP.responseText));
                else
                    reject(Xu_ly_HTTP.responseText);
        }
        Xu_ly_HTTP.onerror = () => {
            reject(Xu_ly_HTTP.statusText);
        }
        Xu_ly_HTTP.send(``);
    });
}

function updateImageClassifyAPI(token, id, base64Image){
    return new Promise((resolve, reject) => {
        var Xu_ly_HTTP = new XMLHttpRequest();
        var Tham_so = `/api/classifies/image`;
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
        Xu_ly_HTTP.send(JSON.stringify(base64Image));
    });
}

function updateClassifyAPI(token, id, updateClassify){
    return new Promise((resolve, reject) => {
        var Xu_ly_HTTP = new XMLHttpRequest();
        var Tham_so = `/api/classifies`;
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
        Xu_ly_HTTP.send(JSON.stringify(updateClassify));
    });
}

// ----------------Producer-------------------
// -------------------------------------------
// -------------------------------------------
// -------------------------------------------
// -------------------------------------------
function getAllProducerAPI(){
    return new Promise((resolve, reject) => {
        var Xu_ly_HTTP = new XMLHttpRequest();
        var Tham_so = `/api/producers/`;
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

function getProducerAPI(id){
    return new Promise((resolve, reject) => {
        var Xu_ly_HTTP = new XMLHttpRequest();
        var Tham_so = `/api/producers`;
        var Dia_chi_Xu_ly = `${Dia_chi_Dich_vu}${Tham_so}/${id}`;
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

function getProducerByCategoryAPI(CategoryId){
    return new Promise((resolve, reject) => {
        var Xu_ly_HTTP = new XMLHttpRequest();
        var Tham_so = `/api/producers/category`;
        var Dia_chi_Xu_ly = `${Dia_chi_Dich_vu}${Tham_so}/${CategoryId}`;
        Xu_ly_HTTP.open(`GET`, Dia_chi_Xu_ly, true);
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

function getProducersByClassifyAPI(classifyId){
    return new Promise((resolve, reject) => {
        var Xu_ly_HTTP = new XMLHttpRequest();
        var Tham_so = `/api/producers/classify`;
        var Dia_chi_Xu_ly = `${Dia_chi_Dich_vu}${Tham_so}/${classifyId}`;
        Xu_ly_HTTP.open(`GET`, Dia_chi_Xu_ly, true);
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

function createProducerAPI(token, infoClassify) {
    return new Promise((resolve, reject) => {
        var Xu_ly_HTTP = new XMLHttpRequest();
        var Tham_so = `/api/producers`;
        var Dia_chi_Xu_ly = `${Dia_chi_Dich_vu}${Tham_so}`;
        Xu_ly_HTTP.open(`POST`, Dia_chi_Xu_ly, true);
        Xu_ly_HTTP.setRequestHeader('Content-Type', 'application/json');
        Xu_ly_HTTP.setRequestHeader('Authorization', `huydeptrai ${token}`);
        Xu_ly_HTTP.onload = () => {
            if (Xu_ly_HTTP.readyState === 4)
                if (Xu_ly_HTTP.status === 201)
                    resolve(JSON.parse(Xu_ly_HTTP.responseText));
                else 
                    reject(Xu_ly_HTTP.responseText);     
        }
        Xu_ly_HTTP.onerror = () => {
            reject(Xu_ly_HTTP.statusText);
        }
        Xu_ly_HTTP.send(JSON.stringify(infoClassify));
    });
}

function deleteProducerAPI(token, id){
    return new Promise((resolve, reject) => {
        var Xu_ly_HTTP = new XMLHttpRequest();
        var Tham_so = `/api/producers`;
        var Dia_chi_Xu_ly = `${Dia_chi_Dich_vu}${Tham_so}/${id}`;
        Xu_ly_HTTP.open(`DELETE`, Dia_chi_Xu_ly, true);
        Xu_ly_HTTP.setRequestHeader('Content-Type', 'application/json');
        Xu_ly_HTTP.setRequestHeader('Authorization', `huydeptrai ${token}`);
        Xu_ly_HTTP.onload = () => {
            if (Xu_ly_HTTP.readyState === 4)
                if (Xu_ly_HTTP.status === 200)
                    resolve(JSON.parse(Xu_ly_HTTP.responseText));
                else
                    reject(Xu_ly_HTTP.responseText);
        }
        Xu_ly_HTTP.onerror = () => {
            reject(Xu_ly_HTTP.statusText);
        }
        Xu_ly_HTTP.send(``);
    });
}

function updateImageProducerAPI(token, id, base64Image){
    return new Promise((resolve, reject) => {
        var Xu_ly_HTTP = new XMLHttpRequest();
        var Tham_so = `/api/producers/image`;
        var Dia_chi_Xu_ly = `${Dia_chi_Dich_vu}${Tham_so}/${id}`;
        Xu_ly_HTTP.open(`PATCH`, Dia_chi_Xu_ly, true);
        Xu_ly_HTTP.setRequestHeader('Content-Type', 'application/json');
        Xu_ly_HTTP.setRequestHeader('Authorization', `huydeptrai ${token}`);
        Xu_ly_HTTP.onload = () => {
            if (Xu_ly_HTTP.readyState === 4)
                if (Xu_ly_HTTP.status === 200)
                    resolve(JSON.parse(Xu_ly_HTTP.responseText));
                else
                    reject(Xu_ly_HTTP.responseText);
        }
        Xu_ly_HTTP.onerror = () => {
            reject(Xu_ly_HTTP.statusText);
        }
        Xu_ly_HTTP.send(JSON.stringify(base64Image));
    });
}

function updateProducerAPI(token, id, updateProducer){
    return new Promise((resolve, reject) => {
        var Xu_ly_HTTP = new XMLHttpRequest();
        var Tham_so = `/api/producers`;
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
        Xu_ly_HTTP.send(JSON.stringify(updateProducer));
    });
}


// ----------------Post-------------------
// -------------------------------------------
// -------------------------------------------
// -------------------------------------------
// -------------------------------------------

function getPostsWaitingAPI(token){
    return new Promise((resolve, reject) => {
        var Xu_ly_HTTP = new XMLHttpRequest();
        var Tham_so = `/api/posts/waiting`;
        var Dia_chi_Xu_ly = `${Dia_chi_Dich_vu}${Tham_so}`;
        Xu_ly_HTTP.open(`GET`, Dia_chi_Xu_ly, true);
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

function getPostsAcceptAPI(token){
    return new Promise((resolve, reject) => {
        var Xu_ly_HTTP = new XMLHttpRequest();
        var Tham_so = `/api/posts/accept`;
        var Dia_chi_Xu_ly = `${Dia_chi_Dich_vu}${Tham_so}`;
        Xu_ly_HTTP.open(`GET`, Dia_chi_Xu_ly, true);
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

function getPostsRejectAPI(token){
    return new Promise((resolve, reject) => {
        var Xu_ly_HTTP = new XMLHttpRequest();
        var Tham_so = `/api/posts/reject`;
        var Dia_chi_Xu_ly = `${Dia_chi_Dich_vu}${Tham_so}`;
        Xu_ly_HTTP.open(`GET`, Dia_chi_Xu_ly, true);
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

function createPostAPI(token, infoPostCreate){
    return new Promise((resolve, reject) => {
        var Xu_ly_HTTP = new XMLHttpRequest();
        var Tham_so = `/api/posts`;
        var Dia_chi_Xu_ly = `${Dia_chi_Dich_vu}${Tham_so}`;
        Xu_ly_HTTP.open(`POST`, Dia_chi_Xu_ly, true);
        Xu_ly_HTTP.setRequestHeader('Content-Type', 'application/json');
        Xu_ly_HTTP.setRequestHeader('Authorization', `huydeptrai ${token}`);
        Xu_ly_HTTP.onload = () => {
            if (Xu_ly_HTTP.readyState === 4)
                if (Xu_ly_HTTP.status === 201)
                    resolve(JSON.parse(Xu_ly_HTTP.responseText));
                else 
                    reject(Xu_ly_HTTP.responseText);     
        }
        Xu_ly_HTTP.onerror = () => {
            reject(Xu_ly_HTTP.statusText);
        }
        Xu_ly_HTTP.send(JSON.stringify(infoPostCreate));
    });
}

function acceptPostAPI(token, id) {
    return new Promise((resolve, reject) => {
        var Xu_ly_HTTP = new XMLHttpRequest();
        var Tham_so = `/api/posts/accept`;
        var Dia_chi_Xu_ly = `${Dia_chi_Dich_vu}${Tham_so}/${id}`;
        Xu_ly_HTTP.open(`PATCH`, Dia_chi_Xu_ly, true);
        Xu_ly_HTTP.setRequestHeader('Content-Type', 'application/json');
        Xu_ly_HTTP.setRequestHeader('Authorization', `huydeptrai ${token}`);
        Xu_ly_HTTP.onload = () => {
            if (Xu_ly_HTTP.readyState === 4)
                if (Xu_ly_HTTP.status === 200)
                    resolve(JSON.parse(Xu_ly_HTTP.responseText));
                else 
                    reject(Xu_ly_HTTP.responseText);     
        }
        Xu_ly_HTTP.onerror = () => {
            reject(Xu_ly_HTTP.statusText);
        }
        Xu_ly_HTTP.send(``);
    });
}

function rejectPostAPI(token, id) {
    return new Promise((resolve, reject) => {
        var Xu_ly_HTTP = new XMLHttpRequest();
        var Tham_so = `/api/posts/reject`;
        var Dia_chi_Xu_ly = `${Dia_chi_Dich_vu}${Tham_so}/${id}`;
        Xu_ly_HTTP.open(`PATCH`, Dia_chi_Xu_ly, true);
        Xu_ly_HTTP.setRequestHeader('Content-Type', 'application/json');
        Xu_ly_HTTP.setRequestHeader('Authorization', `huydeptrai ${token}`);
        Xu_ly_HTTP.onload = () => {
            if (Xu_ly_HTTP.readyState === 4)
                if (Xu_ly_HTTP.status === 200)
                    resolve(JSON.parse(Xu_ly_HTTP.responseText));
                else 
                    reject(Xu_ly_HTTP.responseText);     
        }
        Xu_ly_HTTP.onerror = () => {
            reject(Xu_ly_HTTP.statusText);
        }
        Xu_ly_HTTP.send(``);
    });
}

function hidePostAPI(token, id) {
    return new Promise((resolve, reject) => {
        var Xu_ly_HTTP = new XMLHttpRequest();
        var Tham_so = `/api/posts/hide`;
        var Dia_chi_Xu_ly = `${Dia_chi_Dich_vu}${Tham_so}/${id}`;
        Xu_ly_HTTP.open(`PATCH`, Dia_chi_Xu_ly, true);
        Xu_ly_HTTP.setRequestHeader('Authorization', `huydeptrai ${token}`);
        Xu_ly_HTTP.onload = () => {
            if (Xu_ly_HTTP.readyState === 4)
                if (Xu_ly_HTTP.status === 200)
                    resolve(JSON.parse(Xu_ly_HTTP.responseText));
                else 
                    reject(Xu_ly_HTTP.responseText);     
        }
        Xu_ly_HTTP.onerror = () => {
            reject(Xu_ly_HTTP.statusText);
        }
        Xu_ly_HTTP.send(``);
    });
}

function showPostAPI(token, id) {
    return new Promise((resolve, reject) => {
        var Xu_ly_HTTP = new XMLHttpRequest();
        var Tham_so = `/api/posts/show`;
        var Dia_chi_Xu_ly = `${Dia_chi_Dich_vu}${Tham_so}/${id}`;
        Xu_ly_HTTP.open(`PATCH`, Dia_chi_Xu_ly, true);
        Xu_ly_HTTP.setRequestHeader('Authorization', `huydeptrai ${token}`);
        Xu_ly_HTTP.onload = () => {
            if (Xu_ly_HTTP.readyState === 4)
                if (Xu_ly_HTTP.status === 200)
                    resolve(JSON.parse(Xu_ly_HTTP.responseText));
                else 
                    reject(Xu_ly_HTTP.responseText);     
        }
        Xu_ly_HTTP.onerror = () => {
            reject(Xu_ly_HTTP.statusText);
        }
        Xu_ly_HTTP.send(``);
    });
}

function priorityPostAPI(token, id) {
    return new Promise((resolve, reject) => {
        var Xu_ly_HTTP = new XMLHttpRequest();
        var Tham_so = `/api/posts/priority`;
        var Dia_chi_Xu_ly = `${Dia_chi_Dich_vu}${Tham_so}/${id}`;
        Xu_ly_HTTP.open(`PATCH`, Dia_chi_Xu_ly, true);
        Xu_ly_HTTP.setRequestHeader('Authorization', `huydeptrai ${token}`);
        Xu_ly_HTTP.onload = () => {
            if (Xu_ly_HTTP.readyState === 4)
                if (Xu_ly_HTTP.status === 200)
                    resolve(JSON.parse(Xu_ly_HTTP.responseText));
                else 
                    reject(Xu_ly_HTTP.responseText);     
        }
        Xu_ly_HTTP.onerror = () => {
            reject(Xu_ly_HTTP.statusText);
        }
        Xu_ly_HTTP.send(``);
    });
}

function getDetailPostAPI(id){
    return new Promise((resolve, reject) => {
        var Xu_ly_HTTP = new XMLHttpRequest();
        var Tham_so = `/api/posts`;
        var Dia_chi_Xu_ly = `${Dia_chi_Dich_vu}${Tham_so}/${id}`;
        Xu_ly_HTTP.open(`GET`, Dia_chi_Xu_ly, true);
        Xu_ly_HTTP.setRequestHeader('Content-Type', 'application/json');
        Xu_ly_HTTP.onload = () => {
            if (Xu_ly_HTTP.readyState === 4)
                if (Xu_ly_HTTP.status === 200)
                    resolve(JSON.parse(Xu_ly_HTTP.responseText));
                else 
                    reject(Xu_ly_HTTP.responseText);     
        }
        Xu_ly_HTTP.onerror = () => {
            reject(Xu_ly_HTTP.statusText);
        }
        Xu_ly_HTTP.send(``);
    });
}

function getPostsAcceptByCategoryAPI(idCategory){
    return new Promise((resolve, reject) => {
        var Xu_ly_HTTP = new XMLHttpRequest();
        var Tham_so = `/api/posts/accept/category`;
        var Dia_chi_Xu_ly = `${Dia_chi_Dich_vu}${Tham_so}/${idCategory}`;
        Xu_ly_HTTP.open(`GET`, Dia_chi_Xu_ly, true);
        Xu_ly_HTTP.setRequestHeader('Content-Type', 'application/json');
        Xu_ly_HTTP.onload = () => {
            if (Xu_ly_HTTP.readyState === 4)
                if (Xu_ly_HTTP.status === 200)
                    resolve(JSON.parse(Xu_ly_HTTP.responseText));
                else 
                    reject(Xu_ly_HTTP.responseText);     
        }
        Xu_ly_HTTP.onerror = () => {
            reject(Xu_ly_HTTP.statusText);
        }
        Xu_ly_HTTP.send(``);
    });
}

function getPostsAcceptByClassifyAPI(idClassify){
    return new Promise((resolve, reject) => {
        var Xu_ly_HTTP = new XMLHttpRequest();
        var Tham_so = `/api/posts/accept/classify`;
        var Dia_chi_Xu_ly = `${Dia_chi_Dich_vu}${Tham_so}/${idClassify}`;
        Xu_ly_HTTP.open(`GET`, Dia_chi_Xu_ly, true);
        Xu_ly_HTTP.setRequestHeader('Content-Type', 'application/json');
        Xu_ly_HTTP.onload = () => {
            if (Xu_ly_HTTP.readyState === 4)
                if (Xu_ly_HTTP.status === 200)
                    resolve(JSON.parse(Xu_ly_HTTP.responseText));
                else 
                    reject(Xu_ly_HTTP.responseText);     
        }
        Xu_ly_HTTP.onerror = () => {
            reject(Xu_ly_HTTP.statusText);
        }
        Xu_ly_HTTP.send(``);
    });
}

function getPostsAcceptByProducerAPI(idProducer){
    return new Promise((resolve, reject) => {
        var Xu_ly_HTTP = new XMLHttpRequest();
        var Tham_so = `/api/posts/accept/producer`;
        var Dia_chi_Xu_ly = `${Dia_chi_Dich_vu}${Tham_so}/${idProducer}`;
        Xu_ly_HTTP.open(`GET`, Dia_chi_Xu_ly, true);
        Xu_ly_HTTP.setRequestHeader('Content-Type', 'application/json');
        Xu_ly_HTTP.onload = () => {
            if (Xu_ly_HTTP.readyState === 4)
                if (Xu_ly_HTTP.status === 200)
                    resolve(JSON.parse(Xu_ly_HTTP.responseText));
                else 
                    reject(Xu_ly_HTTP.responseText);     
        }
        Xu_ly_HTTP.onerror = () => {
            reject(Xu_ly_HTTP.statusText);
        }
        Xu_ly_HTTP.send(``);
    });
}

function getPostsAcceptByPriorityAPI(){
    return new Promise((resolve, reject) => {
        var Xu_ly_HTTP = new XMLHttpRequest();
        var Tham_so = `/api/posts/accept/priority`;
        var Dia_chi_Xu_ly = `${Dia_chi_Dich_vu}${Tham_so}`;
        Xu_ly_HTTP.open(`GET`, Dia_chi_Xu_ly, true);
        Xu_ly_HTTP.setRequestHeader('Content-Type', 'application/json');
        Xu_ly_HTTP.onload = () => {
            if (Xu_ly_HTTP.readyState === 4)
                if (Xu_ly_HTTP.status === 200)
                    resolve(JSON.parse(Xu_ly_HTTP.responseText));
                else 
                    reject(Xu_ly_HTTP.responseText);     
        }
        Xu_ly_HTTP.onerror = () => {
            reject(Xu_ly_HTTP.statusText);
        }
        Xu_ly_HTTP.send(``);
    });
}

function getPostWaitingByUserAPI(token, idUser){
    return new Promise((resolve, reject) => {
        var Xu_ly_HTTP = new XMLHttpRequest();
        var Tham_so = `/api/posts/user/waiting`;
        var Dia_chi_Xu_ly = `${Dia_chi_Dich_vu}${Tham_so}/${idUser}`;
        Xu_ly_HTTP.open(`GET`, Dia_chi_Xu_ly, true);
        Xu_ly_HTTP.setRequestHeader('Content-Type', 'application/json');
        Xu_ly_HTTP.setRequestHeader('Authorization', `huydeptrai ${token}`);
        Xu_ly_HTTP.onload = () => {
            if (Xu_ly_HTTP.readyState === 4)
                if (Xu_ly_HTTP.status === 200)
                    resolve(JSON.parse(Xu_ly_HTTP.responseText));
                else 
                    reject(Xu_ly_HTTP.responseText);     
        }
        Xu_ly_HTTP.onerror = () => {
            reject(Xu_ly_HTTP.statusText);
        }
        Xu_ly_HTTP.send(``);
    });
}

function getPostPostingByUserAPI(token, idUser){
    return new Promise((resolve, reject) => {
        var Xu_ly_HTTP = new XMLHttpRequest();
        var Tham_so = `/api/posts/user/posting`;
        var Dia_chi_Xu_ly = `${Dia_chi_Dich_vu}${Tham_so}/${idUser}`;
        Xu_ly_HTTP.open(`GET`, Dia_chi_Xu_ly, true);
        Xu_ly_HTTP.setRequestHeader('Content-Type', 'application/json');
        Xu_ly_HTTP.setRequestHeader('Authorization', `huydeptrai ${token}`);
        Xu_ly_HTTP.onload = () => {
            if (Xu_ly_HTTP.readyState === 4)
                if (Xu_ly_HTTP.status === 200)
                    resolve(JSON.parse(Xu_ly_HTTP.responseText));
                else 
                    reject(Xu_ly_HTTP.responseText);     
        }
        Xu_ly_HTTP.onerror = () => {
            reject(Xu_ly_HTTP.statusText);
        }
        Xu_ly_HTTP.send(``);
    });
}

function getPostRejectByUserAPI(token, idUser){
    return new Promise((resolve, reject) => {
        var Xu_ly_HTTP = new XMLHttpRequest();
        var Tham_so = `/api/posts/user/reject`;
        var Dia_chi_Xu_ly = `${Dia_chi_Dich_vu}${Tham_so}/${idUser}`;
        Xu_ly_HTTP.open(`GET`, Dia_chi_Xu_ly, true);
        Xu_ly_HTTP.setRequestHeader('Content-Type', 'application/json');
        Xu_ly_HTTP.setRequestHeader('Authorization', `huydeptrai ${token}`);
        Xu_ly_HTTP.onload = () => {
            if (Xu_ly_HTTP.readyState === 4)
                if (Xu_ly_HTTP.status === 200)
                    resolve(JSON.parse(Xu_ly_HTTP.responseText));
                else 
                    reject(Xu_ly_HTTP.responseText);     
        }
        Xu_ly_HTTP.onerror = () => {
            reject(Xu_ly_HTTP.statusText);
        }
        Xu_ly_HTTP.send(``);
    });
}

function getPostHiddentByUserAPI(token, idUser){
    return new Promise((resolve, reject) => {
        var Xu_ly_HTTP = new XMLHttpRequest();
        var Tham_so = `/api/posts/user/hide`;
        var Dia_chi_Xu_ly = `${Dia_chi_Dich_vu}${Tham_so}/${idUser}`;
        Xu_ly_HTTP.open(`GET`, Dia_chi_Xu_ly, true);
        Xu_ly_HTTP.setRequestHeader('Authorization', `huydeptrai ${token}`);
        Xu_ly_HTTP.onload = () => {
            if (Xu_ly_HTTP.readyState === 4)
                if (Xu_ly_HTTP.status === 200)
                    resolve(JSON.parse(Xu_ly_HTTP.responseText));
                else 
                    reject(Xu_ly_HTTP.responseText);     
        }
        Xu_ly_HTTP.onerror = () => {
            reject(Xu_ly_HTTP.statusText);
        }
        Xu_ly_HTTP.send(``);
    });
}

function getPostPriorityByUserAPI(token, idUser){
    return new Promise((resolve, reject) => {
        var Xu_ly_HTTP = new XMLHttpRequest();
        var Tham_so = `/api/posts/user/priority`;
        var Dia_chi_Xu_ly = `${Dia_chi_Dich_vu}${Tham_so}/${idUser}`;
        Xu_ly_HTTP.open(`GET`, Dia_chi_Xu_ly, true);
        Xu_ly_HTTP.setRequestHeader('Authorization', `huydeptrai ${token}`);
        Xu_ly_HTTP.onload = () => {
            if (Xu_ly_HTTP.readyState === 4)
                if (Xu_ly_HTTP.status === 200)
                    resolve(JSON.parse(Xu_ly_HTTP.responseText));
                else 
                    reject(Xu_ly_HTTP.responseText);     
        }
        Xu_ly_HTTP.onerror = () => {
            reject(Xu_ly_HTTP.statusText);
        }
        Xu_ly_HTTP.send(``);
    });
}

function deletePostAPI(token, id){
    return new Promise((resolve, reject) => {
        var Xu_ly_HTTP = new XMLHttpRequest();
        var Tham_so = `/api/posts`;
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

function updatePostAPI(token, id, updatePost){
    return new Promise((resolve, reject) => {
        var Xu_ly_HTTP = new XMLHttpRequest();
        var Tham_so = `/api/posts`;
        var Dia_chi_Xu_ly = `${Dia_chi_Dich_vu}${Tham_so}/${id}`;
        Xu_ly_HTTP.open(`PATCH`, Dia_chi_Xu_ly, true);
        Xu_ly_HTTP.setRequestHeader('Content-Type', 'application/json');
        Xu_ly_HTTP.setRequestHeader('Authorization', `huydeptrai ${token}`);
        Xu_ly_HTTP.onload = () => {
            if (Xu_ly_HTTP.readyState === 4)
                if (Xu_ly_HTTP.status === 200)
                    resolve(JSON.parse(Xu_ly_HTTP.responseText));
                else
                    reject(Xu_ly_HTTP.responseText);
        }
        Xu_ly_HTTP.onerror = () => {
            reject(Xu_ly_HTTP.statusText);
        }
        Xu_ly_HTTP.send(JSON.stringify(updatePost));
    });
}

function searchPostAPI(searchPost){
    return new Promise((resolve, reject) => {
        var Xu_ly_HTTP = new XMLHttpRequest();
        var Tham_so = `/api/posts/search`;
        var Dia_chi_Xu_ly = `${Dia_chi_Dich_vu}${Tham_so}`;
        Xu_ly_HTTP.open(`POST`, Dia_chi_Xu_ly, true);
        Xu_ly_HTTP.setRequestHeader('Content-Type', 'application/json');
        Xu_ly_HTTP.onload = () => {
            if (Xu_ly_HTTP.readyState === 4)
                if (Xu_ly_HTTP.status === 200)
                    resolve(JSON.parse(Xu_ly_HTTP.responseText));
                else
                    reject(Xu_ly_HTTP.responseText);
        }
        Xu_ly_HTTP.onerror = () => {
            reject(Xu_ly_HTTP.statusText);
        }
        Xu_ly_HTTP.send(JSON.stringify(searchPost));
    });
}


// ----------------City-------------------
// -------------------------------------------
// -------------------------------------------
// -------------------------------------------
// -------------------------------------------
function getAllCityAPI(){
    return new Promise((resolve, reject) => {
        var Xu_ly_HTTP = new XMLHttpRequest();
        var Tham_so = `/api/cities/`;
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
function getCityAPI(id){
    return new Promise((resolve, reject) => {
        var Xu_ly_HTTP = new XMLHttpRequest();
        var Tham_so = `/api/cities`;
        var Dia_chi_Xu_ly = `${Dia_chi_Dich_vu}${Tham_so}/${id}`;
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


// ----------------Message-------------------
// -------------------------------------------
// -------------------------------------------
// -------------------------------------------
// -------------------------------------------

function createMessageAPI(token, infoMessage){
    return new Promise((resolve, reject) => {
        var Xu_ly_HTTP = new XMLHttpRequest();
        var Tham_so = `/api/messages`;
        var Dia_chi_Xu_ly = `${Dia_chi_Dich_vu}${Tham_so}`;
        Xu_ly_HTTP.open(`POST`, Dia_chi_Xu_ly, true);
        Xu_ly_HTTP.setRequestHeader('Content-Type', 'application/json');
        Xu_ly_HTTP.setRequestHeader('Authorization', `huydeptrai ${token}`);
        Xu_ly_HTTP.onload = () => {
            if (Xu_ly_HTTP.readyState === 4)
                if (Xu_ly_HTTP.status === 201 || Xu_ly_HTTP.status === 200)
                    resolve(JSON.parse(Xu_ly_HTTP.responseText));
                else
                    reject(Xu_ly_HTTP.responseText);
        }
        Xu_ly_HTTP.onerror = () => {
            reject(Xu_ly_HTTP.statusText);
        }
        Xu_ly_HTTP.send(JSON.stringify(infoMessage));
    });
}

function getMessageAPI(token, idMessage) {
    return new Promise((resolve, reject) => {
        var Xu_ly_HTTP = new XMLHttpRequest();
        var Tham_so = `/api/messages`;
        var Dia_chi_Xu_ly = `${Dia_chi_Dich_vu}${Tham_so}/${idMessage}`;
        Xu_ly_HTTP.open(`GET`, Dia_chi_Xu_ly, true);
        Xu_ly_HTTP.setRequestHeader('Content-Type', 'application/json');
        Xu_ly_HTTP.setRequestHeader('Authorization', `huydeptrai ${token}`);
        Xu_ly_HTTP.onload = () => {
            if (Xu_ly_HTTP.readyState === 4)
                if (Xu_ly_HTTP.status === 200)
                    resolve(JSON.parse(Xu_ly_HTTP.responseText));
                else
                    reject(Xu_ly_HTTP.responseText);
        }
        Xu_ly_HTTP.onerror = () => {
            reject(Xu_ly_HTTP.statusText);
        }
        Xu_ly_HTTP.send(``);
    });
}

function getAllMessageUserAPI(token, idUser) {
    return new Promise((resolve, reject) => {
        var Xu_ly_HTTP = new XMLHttpRequest();
        var Tham_so = `/api/messages/user`;
        var Dia_chi_Xu_ly = `${Dia_chi_Dich_vu}${Tham_so}/${idUser}`;
        Xu_ly_HTTP.open(`GET`, Dia_chi_Xu_ly, true);
        Xu_ly_HTTP.setRequestHeader('Content-Type', 'application/json');
        Xu_ly_HTTP.setRequestHeader('Authorization', `huydeptrai ${token}`);
        Xu_ly_HTTP.onload = () => {
            if (Xu_ly_HTTP.readyState === 4)
                if (Xu_ly_HTTP.status === 200)
                    resolve(JSON.parse(Xu_ly_HTTP.responseText));
                else
                    reject(Xu_ly_HTTP.responseText);
        }
        Xu_ly_HTTP.onerror = () => {
            reject(Xu_ly_HTTP.statusText);
        }
        Xu_ly_HTTP.send(``);
    });
}