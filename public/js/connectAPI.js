var Dia_chi_Dich_vu = 'https://secondhandsapp.herokuapp.com';

function login(info) {
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

function signup(infoRegister){
    return new Promise((resolve, reject) => {
        var Xu_ly_HTTP = new XMLHttpRequest();
        var Tham_so = `/api/users/signup`;
        var Dia_chi_Xu_ly = `${Dia_chi_Dich_vu}${Tham_so}`;
        Xu_ly_HTTP.open(`POST`, Dia_chi_Xu_ly, true);
        Xu_ly_HTTP.setRequestHeader('Content-Type', 'application/json');
        var chuoi_gui = JSON.stringify(infoRegister);
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