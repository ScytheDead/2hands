

console.log(sessionStorage)
if (sessionStorage.getItem('token') != null) {
    var user = decodedJWT(sessionStorage.getItem('token'));
    showDropDown(user.name);
    btnLogin.classList.add(`d-none`);
}

btnLogin.onclick = () => {
    modalLogin.click();
    changedFormLogin('login');
}

function changedFormLogin(status) {
    if (status === 'login') {
        modalTitle.innerHTML = 'Đăng nhập';
        showModalRegister.innerHTML = 'Đăng ký tài khoản';
        submitLogin.innerHTML = 'Đăng nhập';
        TH_errorMessage.className = ``;
        TH_errorMessage.innerHTML = ``;
    } else if (status === 'register') {
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
    } else if (document.getElementById("showModalRegister").textContent === 'Đăng ký tài khoản') {
        document.getElementById("showModalRegister").value = 'Đăng nhập';
        changedFormLogin('register');
    }
}

// Handle login & register
submitLogin.onclick = async () => {
    var info = {
        phoneNumber: TH_phoneNumber.value,
        password: TH_password.value
    }

    if (document.getElementById("modalTitle").textContent == 'Đăng nhập') {
        var result = await login(info);
        if (result.message == 'Auth successful') { //Auth successful
            XL_Login(result);
        } else {
            TH_errorMessage.className = `errorMessage`;
            TH_errorMessage.innerHTML = `Số điện thoại hoặc mật khẩu không đúng, vui lòng đăng nhập lại.`
        }

    } else if(document.getElementById("modalTitle").textContent == 'Đăng ký'){
        var result = await signup(info);
        if (result.message == 'User created') {
            TH_errorMessage.className = `successMessage`;
            TH_errorMessage.innerHTML = `Đăng ký thành công.`
        } else if (result.message == 'Phone number exists'){
            TH_errorMessage.className = `errorMessage`;
            TH_errorMessage.innerHTML = `Số điện thoại này đã tồn tại.`
        }
        else {
            TH_errorMessage.className = `errorMessage`;
            TH_errorMessage.innerHTML = `Số điện thoại này không hợp lệ.`
        }
    }
}

function XL_Login(result) {
    var infoUser = decodedJWT(result.token);
    showDropDown(infoUser.name);
    btnLogin.classList.add(`d-none`);
    sessionStorage.setItem('token', result.token);
    TH_close_modal_login.click();

    // Notification success
    modelTitleThongBao.innerHTML = `Đăng nhập thành công`
    modal_ThongBao.click();
    setTimeout(() => {
        Tat_Thong_bao.click();
    }, 1500);
}

function XL_Logout() {
    sessionStorage.removeItem('token');
    btnLogin.classList.remove('d-none');
    TH_dropdown_all.classList.add('d-none');
    TH_dropdown.innerHTML = ``;
}

function showDropDown(nameUser) {
    TH_dropdown_all.classList.remove('d-none');
    var chuoi_HTMLConDropDown = `<button id="TH_profile" class="dropdown-item" href="#">
    <i class="fal fa-user-circle fa-2x float-left"></i>&nbsp;<h5 id="TH_name">${nameUser}</h5> <h6 id="TH_txt_QLTK"> Quản lý tài khoản</h6>
</button>
<div class="dropdown-divider"></div>
<button id="TH_save_posts" class="dropdown-item" href="#">
    <h6><i class="fal fa-heart fa-2x"></i>&nbsp; Các tin đã lưu</h6>
</button>
<div class="dropdown-divider"></div>
<button id="TH_admin" class="dropdown-item" href="#">
    <i class="fal fa-user-secret fa-2x float-left"></i>&nbsp;<h6 id="TH_txt_QT"> Quản trị</h6>
</button>
<div class="dropdown-divider"></div>
<button id="TH_logout" onclick="XL_Logout()" class="dropdown-item" href="#">
   <i class="fal fa-sign-out-alt fa-2x float-left"></i>&nbsp;<h6 id="TH_txt_logout"> Đăng xuất</h6>
</button>`
    TH_dropdown.innerHTML = chuoi_HTMLConDropDown;
}

function decodedJWT(tokenEncoded) {
    var infoUser = JSON.parse(atob(tokenEncoded.split('.')[1]));
    return infoUser;
}