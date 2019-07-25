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
    let user = decodedJWT(sessionStorage.getItem('token'));
    let listMessagesId = user.messages.map(message => message._id);
    socket.emit('client-offline', { userId: user.id, listMessagesId: listMessagesId});
    console.log(listMessagesId);
    sessionStorage.removeItem('token');
    window.location.href = Dia_chi_Dich_vu;
}


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
