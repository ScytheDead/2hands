// btnCreatePost.onclick = () => {
//     if (sessionStorage.getItem('token') == null) {
//         modalNotificationError(`Cần đăng nhập trước khi đăng tin`);
//         setTimeout(() => {
//             btnLogin.click();
//         }, 1500);
//     } else {
//         window.location = Dia_chi_Dich_vu + '/create-post'
//     }
// }

// btnLogin.onclick = () => {
//     modalLogin.click();
//     changedFormLogin('login');
// }

// showModalRegister.onclick = () => {
//     if (document.getElementById("showModalRegister").textContent === 'Đăng nhập') {
//         document.getElementById("showModalRegister").value = 'Đăng ký';
//         changedFormLogin('login');
//     } else if (document.getElementById("showModalRegister").textContent === 'Đăng ký tài khoản') {
//         document.getElementById("showModalRegister").value = 'Đăng nhập';
//         changedFormLogin('register');
//     }
// }

// Handle login & register
// submitLogin.onclick = async () => {
//     var info = {
//         phoneNumber: TH_phoneNumber.value,
//         password: TH_password.value
//     }

//     if (document.getElementById("modalTitle").textContent == 'Đăng nhập') {
//         await loginAPI(info)
//             .then(result => {
//                 if (result.message == 'Auth successful') { //Auth successful
//                     XL_Login(result);
//                 }
//             })
//             .catch(err => {
//                 TH_errorMessage.className = `errorMessage`;
//                 if (err == 'Internal Server Error') {
//                     TH_errorMessage.innerHTML = `Số điện thoại này không tồn tại.`

//                 } else if (err == 'Unauthorized') {
//                     TH_errorMessage.innerHTML = `Số điện thoại hoặc mật khẩu không đúng, vui lòng đăng nhập lại.`
//                 }
//             })
//     } else if (document.getElementById("modalTitle").textContent == 'Đăng ký') {
//         await signupAPI(info)
//             .then(result => {
//                 if (result.message == 'User created') {
//                     TH_errorMessage.className = `successMessage`;
//                     TH_errorMessage.innerHTML = `Đăng ký thành công.`
//                 }
//             })
//             .catch(err => {
//                 if (err == 'Conflict') {
//                     TH_errorMessage.className = `errorMessage`;
//                     TH_errorMessage.innerHTML = `Số điện thoại này đã tồn tại.`
//                 } else if (err == 'Internal Server Error') {
//                     TH_errorMessage.className = `errorMessage`;
//                     TH_errorMessage.innerHTML = `Số điện thoại này không hợp lệ.`
//                 }
//             });
//     }
// }

function XL_Login(result) {
    var infoUser = decodedJWT(result.token);
    if (!infoUser.status) {
        TH_errorMessage.className = `errorMessage`;
        TH_errorMessage.innerHTML = `Tài khoản này hiện đang bị khóa. Vui lòng đăng nhập lại sau.`
    } else {
        showDropDown(infoUser);
        btnLogin.classList.add(`d-none`);
        sessionStorage.setItem('token', result.token);
        //TH_close_modal_login.click();

        // Notification success
        //modalNotificationSuccess(`Đăng nhập thành công`)
    }
}

function XL_Logout() {
    sessionStorage.removeItem('token');
    window.location.href = Dia_chi_Dich_vu
}

// function showDropDown(info) {
//     TH_dropdown_all.classList.remove('d-none');
//     var chuoi_HTMLConDropDown = `<button id="TH_profile" class="dropdown-item" href="#">
//     <i class="fa fa-user-circle fa-2x float-left"></i></i>&nbsp;<h5 id="TH_name">${info.name == null ? info.phoneNumber : (info.name == "" ? info.phoneNumber : info.name)}</h5> <h6 id="TH_txt_QLTK"> Quản lý tài khoản</h6>
// </button>
// <div class="dropdown-divider"></div>
// <button id="TH_save_posts" class="dropdown-item" href="#">
//     <h6><i class="fa fa-heart-o fa-2x"></i>&nbsp; Các tin đã lưu</h6>
// </button>`
//     if (info.isAdmin || info.isEmployee) {
//         chuoi_HTMLConDropDown += `<div class="dropdown-divider"></div>
//         <button id="TH_admin" class="dropdown-item" onclick="window.location.href = '${Dia_chi_Dich_vu}/admin'">
//         <i class="fa fa-user-secret fa-2x float-left"></i>&nbsp;<h6 id="TH_txt_QT"> Quản trị</h6>
//         </button>`
//     }

//     chuoi_HTMLConDropDown += `<div class="dropdown-divider"></div>
// <button id="TH_logout" onclick="XL_Logout()" class="dropdown-item" href="#">
// <i class="fa fa-sign-out fa-2x float-left"></i>&nbsp;<h6 id="TH_txt_logout"> Đăng xuất</h6>
// </button>`
//     TH_dropdown.innerHTML = chuoi_HTMLConDropDown;
// }


function showDropDown(info) {
    let chuoi_HTMLConDropDown = `<div class="dropdown" id ="dropdownId" >
        <button id="btnName" class="btn btn-primary dropdown-toggle" type="button" data-toggle="dropdown">${info.name == null ? info.phoneNumber : (info.name == "" ? info.phoneNumber : info.name)}
                <span class="caret"></span></button>
        <ul class="dropdown-menu">
            <li><a href="/user" class="bg-primary"><i class="fa fa-user-circle fa-2x"></i>&nbsp; Quản lý tài khoản</a></li>
            <li><a href="/posts" class="bg-primary"><i class="fa fa-newspaper-o fa-2x"></i>&nbsp; Quản lý tin đăng</a></li>
            <li><a href="/subscribes" class="bg-primary"><i class="fa fa-heart fa-2x"></i>&nbsp; Các tin đã lưu</a></li>`

    if (info.isAdmin || info.isEmployee) {
        chuoi_HTMLConDropDown += ` <li><a href="/admin" class="bg-primary"><i class="fa fa-user-secret fa-2x"></i>&nbsp; Quản trị</a></li>`;
    }

    chuoi_HTMLConDropDown += `<li><a href="#" class="bg-primary" onclick="XL_Logout()"><i class="fa fa-sign-out fa-2x"></i>&nbsp; Đăng xuất</a></li>
        </ul>
    </div>`;

    return chuoi_HTMLConDropDown;
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

function modalNotificationError(message) {
    modelTitleThongBao.innerHTML = message;
    modelTitleThongBao.classList.remove('text-success');
    modelTitleThongBao.classList.add('text-danger');
    modal_ThongBao.click();
    setTimeout(() => {
        Tat_Thong_bao.click();
    }, 1500);
}

function modalNotificationSuccess(message) {
    modelTitleThongBao.classList.remove('text-danger')
    modelTitleThongBao.classList.add('text-success')
    modelTitleThongBao.innerHTML = message;
    modal_ThongBao.click();
    setTimeout(() => {
        Tat_Thong_bao.click();
    }, 1500);
}

function decodedJWT(tokenEncoded) {
    let infoUser = JSON.parse(atob(tokenEncoded.split('.')[1]));
    return infoUser;
}

function getDateFormat(dateISO) {
    var date = new Date(dateISO);
    return `${date.getDate()}-${(date.getMonth()+1)}-${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`
}

function getBase64(file) {
    return new Promise((resolve, reject) => {
        if (file !== undefined) {
            var reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = async () => {
                resolve(reader.result);
            };
            reader.onerror = async (error) => {
                reject(error);
            };
        } else {
            reject('Not Found Image');
        }
    });
}

async function asyncGetBase64(image) {
    return await getBase64(image);
}

async function getListBase64(listImage) {
    return await Promise.all(listImage.map(image => asyncGetBase64(image)));
}

function Tao_Chuoi_The_hien_So_nguyen_duong(So_nguyen) {
    var Chuoi_The_hien = ""
    var Chuoi_So_nguyen = So_nguyen.toString()
    var So_Ky_so = Chuoi_So_nguyen.length
    if (So_Ky_so % 3 == 0) {
        for (var Chi_so = 0; Chi_so < Chuoi_So_nguyen.length; Chi_so++) {
            Chuoi_The_hien += Chuoi_So_nguyen[Chi_so]
            if (Chi_so % 3 == 2 && Chi_so < Chuoi_So_nguyen.length - 1)
                Chuoi_The_hien += "."
        }
    } else if (So_Ky_so % 3 == 1) {
        Chuoi_The_hien = Chuoi_So_nguyen[0]
        if (So_Ky_so > 1)
            Chuoi_The_hien += "."
        Chuoi_So_nguyen = Chuoi_So_nguyen.slice(1)
        for (var Chi_so = 0; Chi_so < Chuoi_So_nguyen.length; Chi_so++) {
            Chuoi_The_hien += Chuoi_So_nguyen[Chi_so]
            if (Chi_so % 3 == 2 && Chi_so < Chuoi_So_nguyen.length - 1)
                Chuoi_The_hien += "."

        }
    } else if (So_Ky_so % 3 == 2) {
        Chuoi_The_hien = Chuoi_So_nguyen[0] + Chuoi_So_nguyen[1]
        if (So_Ky_so > 2)
            Chuoi_The_hien += "."
        Chuoi_So_nguyen = Chuoi_So_nguyen.slice(2)
        for (var Chi_so = 0; Chi_so < Chuoi_So_nguyen.length; Chi_so++) {
            Chuoi_The_hien += Chuoi_So_nguyen[Chi_so]
            if (Chi_so % 3 == 2 && Chi_so < Chuoi_So_nguyen.length - 1)
                Chuoi_The_hien += "."
        }
    }
    return Chuoi_The_hien
}

function showToast(contentToast) {
    toast.classList.add('show');
    toast.innerHTML = contentToast;
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

function change_alias(alias) {
    var str = alias;
    str = str.toLowerCase();
    str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
    str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
    str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
    str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
    str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
    str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
    str = str.replace(/đ/g, "d");
    str = str.replace(/!|@|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\.|\:|\;|\'|\"|\&|\#|\[|\]|~|\$|_|`|-|{|}|\||\\/g, " ");
    str = str.replace(/ + /g, " ");
    str = str.trim();
    return str;
}

function shortString(title, lengthShow) {
    let titleShow = '';
    if (title.length > lengthShow) {
        for (let i = 0; i <= lengthShow; i++) {
            titleShow += title[i];
        }
        return titleShow + '...';
    }
    return title;
}