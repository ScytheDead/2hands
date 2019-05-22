
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
    } else if (result.message == 'Category deleted') {
        modelTitleThongBao.innerHTML = `Xóa chuyên mục tin thành công`;
    } else if (result.message == 'Category image updated') {
        modelTitleThongBao.innerHTML = `Cập nhật hình ảnh thành công`;
    } 
    
    modal_ThongBao.click();
    setTimeout(() => {
        Tat_Thong_bao.click();
    }, 1500);
}