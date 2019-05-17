var Dia_chi_Dich_vu = 'https://secondhandsapp.herokuapp.com'
btnLogin.onclick = () => {
    modalLogin.click();
    changedFormLogin('login');
}

btnRegister.onclick = () => {
    modalLogin.click();
    changedFormLogin('register');
}


function changedFormLogin(status) {
    if (status === 'login') {
        modalTitle.innerHTML = 'Đăng nhập';
        showModalRegister.innerHTML = 'Đăng ký';
        submitLogin.innerHTML = 'Đăng nhập';
        TH_errorMessage.className = ``;
        TH_errorMessage.innerHTML = ``
    } else {
        modalTitle.innerHTML = 'Đăng ký';
        showModalRegister.innerHTML = 'Đăng nhập';
        submitLogin.innerHTML = 'Đăng ký';
        TH_errorMessage.className = ``;
        TH_errorMessage.innerHTML = ``
    }
}

showModalRegister.onclick = () => {
    console.log(document.getElementById("showModalRegister").textContent)
    if (document.getElementById("showModalRegister").textContent === 'Đăng nhập') {
        document.getElementById("showModalRegister").value = 'Đăng ký';
        changedFormLogin('login');
    } else {
        document.getElementById("showModalRegister").value = 'Đăng nhập';
        changedFormLogin('register');
    }
}

submitLogin.onclick = () => {
    var info = {
        phoneNumber: TH_phoneNumber.value,
        password: TH_password.value
    }

    if (document.getElementById("modalTitle").textContent == 'Đăng nhập') {
        var result = login(info);
        if(result.message == 'Auth successful'){    //Auth successful
            var infoUser = JSON.parse(atob(result.token.split('.')[1]));
            console.log(infoUser);
            var contentName = document.createElement('h1');
            contentName.innerHTML = `Chào ${infoUser.name}`;
            TH_form_login_register.innerHTML = ``;
            TH_form_login_register.appendChild(contentName);
            TH_logout.className = `nav-link btn text-light btn-danger ml-5`;
            TH_errorMessage.className = ``
            TH_close_modal_login.click();
        }else{
            TH_errorMessage.className = `errorMessage`;
            TH_errorMessage.innerHTML = `Số điện thoại hoặc mật khẩu không đúng, vui lòng đăng nhập lại.`
        }
       
    } else {
        alert('ddang ky')
    }
}


function login(info) {
    var Du_lieu = {}
    var Xu_ly_HTTP = new XMLHttpRequest();
    var Tham_so = `/api/users/login`;
    var Dia_chi_Xu_ly = `${Dia_chi_Dich_vu}${Tham_so}`;
    Xu_ly_HTTP.open(`POST`, Dia_chi_Xu_ly, false);
    Xu_ly_HTTP.setRequestHeader('Content-Type', 'application/json');
    var chuoi_gui = JSON.stringify(info);
    Xu_ly_HTTP.send(chuoi_gui);
    var Chuoi_JSON = Xu_ly_HTTP.responseText
    if (Chuoi_JSON != ``)
        Du_lieu = JSON.parse(Chuoi_JSON);
    return Du_lieu;
}