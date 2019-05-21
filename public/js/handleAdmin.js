function goAllUserAdmin(){
    window.location = Dia_chi_Dich_vu + '/admin/user';
}

function goHomeAdmin(){
    window.location = Dia_chi_Dich_vu + '/admin';
}

async function showAllUsers() {
    var token = sessionStorage.getItem('token');
    await getAllUsers(token)
        .then(listUser => {
            var chuoi_HTML = `<h3 class="text-primary mt-2">Danh sách tài khoản (Tổng: ${listUser.count})</h3>
        <table class="table mt-3" style="">
            <thead>
                <tr>
                    <th>SĐT</th>
                    <th>Họ tên</th>
                    <th>Địa chỉ</th>
                    <th>Hình</th>
                    <th>Facebook</th>
                    <th>Email</th>
                    <th>Giới tính</th>
                    <th>Loại tài khoản</th>
                    <th>Ngày tham gia</th>
                    <th>Trạng thái</th>
                    <th>Ghi chú</th>
                    <th>Thao tác</th>
                </tr>
            </thead>
            <tbody> `
            listUser.users.forEach(user => {
                chuoi_HTML += `<tr>
                <td scope="row">${user.phoneNumber}</td>
                <td>${user.name == null ? "" : user.name}</td>
                <td>${user.address == null ? "" :  user.address}</td>
                <td><img src="${Dia_chi_Dich_vu}/${user.avatar}" width="70" height="70"/></td>
                <td>${user.facebook == null ? "" :  user.facebook}</td>
                <td>${user.email == null ? "" :  user.email}</td>
                <td>${user.gender == null ? "" : (user.gender == 1 ? "Nam" : "Nữ")}</td>
                `
                if(user.isAdmin) chuoi_HTML += `<td>Admin</td>` 
                else if(user.isEmployee) chuoi_HTML += `<td>Nhân viên</td>` 
                else chuoi_HTML += `<td>Người dùng</td>` 

                chuoi_HTML += `<td>${getDateFormat(user.createdAt)}</td>
                <td>${user.status == true ? "Hoạt động" :  "Khóa"}</td>
                <td>${user.note == null ? "" :  user.note}</td>
                <td><button class="btn btn-outline-success" onclick="window.location='${Dia_chi_Dich_vu}/user/${user.id}0301${sessionStorage.getItem('token')}'">Sửa</button>
                    <button class="btn btn-outline-danger mt-2" onclick="deleteUser('${sessionStorage.getItem('token')}', '${user.id}')">Xóa</button>
                </td>
            </tr>`
            })

            chuoi_HTML += ` </tbody>
                        </table>`
            controlAdmin.innerHTML = ``;
            controlAdmin.innerHTML = chuoi_HTML;
        })
        .catch(err => {
            messageError(err);
        });
}

function showAllCategories(){
    var token = sessionStorage.getItem('token');
    await getAllCategories()
        .then(listCategories => {
            console.log(listCategories);
            var chuoi_HTML = `<h3 class="text-primary mt-2">Danh sách chuyên mục tin (Tổng: ${listCategories.count})</h3>
        <table class="table mt-3" style="">
            <thead>
                <tr>
                    <th>Hình</th>
                    <th>Tiêu đề</th>
                    <th>Ngày tạo</th>
                    <th>Lần cập nhật gần nhất</th>
                    <th>Ghi chú</th>
                    <th>Thao tác</th>
                </tr>
            </thead>
            <tbody> `
            listCategories.users.forEach(user => {
                chuoi_HTML += `<tr>
                <td scope="row">${user.phoneNumber}</td>
                <td>${user.name == null ? "" : user.name}</td>
                <td>${user.address == null ? "" :  user.address}</td>
                <td><img src="${Dia_chi_Dich_vu}/${user.avatar}" width="70" height="70"/></td>
                <td>${user.facebook == null ? "" :  user.facebook}</td>
                <td>${user.email == null ? "" :  user.email}</td>
                <td>${user.gender == null ? "" : (user.gender == 1 ? "Nam" : "Nữ")}</td>
                `
                if(user.isAdmin) chuoi_HTML += `<td>Admin</td>` 
                else if(user.isEmployee) chuoi_HTML += `<td>Nhân viên</td>` 
                else chuoi_HTML += `<td>Người dùng</td>` 

                chuoi_HTML += `<td>${getDateFormat(user.createdAt)}</td>
                <td>${user.status == true ? "Hoạt động" :  "Khóa"}</td>
                <td>${user.note == null ? "" :  user.note}</td>
                <td><button class="btn btn-outline-success" onclick="window.location='${Dia_chi_Dich_vu}/user/${user.id}0301${sessionStorage.getItem('token')}'">Sửa</button>
                    <button class="btn btn-outline-danger mt-2" onclick="deleteUser('${sessionStorage.getItem('token')}', '${user.id}')">Xóa</button>
                </td>
            </tr>`
            })

            chuoi_HTML += ` </tbody>
                        </table>`
            controlAdmin.innerHTML = ``;
            controlAdmin.innerHTML = chuoi_HTML;
        })
        .catch(err => {
            messageError(err);
        });
}

async function deleteUser(token, id) {
    deleteAccountUser(token, id)
        .then(result => {
            messageSuccess(result);
            showAllUsers();
        })
        .catch(err => {
            messageError(err);
        });
}

function messageError(err) {
    if (err == 'Unauthorized') {
        sessionStorage.removeItem('token');
        TH_dropdown.innerHTML = ``;

        modelTitleThongBao.innerHTML = `Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại`
        modelTitleThongBao.classList.remove('text-success');
        modelTitleThongBao.classList.add('text-danger');
        modal_ThongBao.click();
        setTimeout(() => {
            window.location = Dia_chi_Dich_vu;
        }, 1500);
    }
}

function messageSuccess(result) {
    if (result.message == 'User deleted') {
        modelTitleThongBao.innerHTML = `Xóa tài khoản thành công`;
    } else if (result.message == 'User updated') {
        modelTitleThongBao.innerHTML = `Cập nhật tài khoản thành công`;
    }
    modal_ThongBao.click();
    setTimeout(() => {
        Tat_Thong_bao.click();
    }, 1500);
}