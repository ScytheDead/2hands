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
    } else if (err == 'Not Found') {
        btnCloseModalUpload.click();

        modelTitleThongBao.innerHTML = `Cập nhật hình ảnh thất bại !`
        modelTitleThongBao.classList.remove('text-success');
        modelTitleThongBao.classList.add('text-danger');
        modal_ThongBao.click();
        setTimeout(() => {
            Tat_Thong_bao.click();
        }, 1500);
    } else if (err == 'Internal Server Error') {
        modelTitleThongBao.innerHTML = `Tạo mới thất bại !`
        modelTitleThongBao.classList.remove('text-success');
        modelTitleThongBao.classList.add('text-danger');
        modal_ThongBao.click();
        setTimeout(() => {
            Tat_Thong_bao.click();
        }, 1500);
    } else if (err == 'This category have still contains classify') {
        modelTitleThongBao.innerHTML = `Chuyên mục này vẫn còn chứa thể loại bên trong !`
        modelTitleThongBao.classList.remove('text-success');
        modelTitleThongBao.classList.add('text-danger');
        modal_ThongBao.click();
        setTimeout(() => {
            Tat_Thong_bao.click();
        }, 2000);
    } else if (err == 'This category have still contains producer') {
        modelTitleThongBao.innerHTML = `Chuyên mục này vẫn còn chứa nhà sản xuất bên trong !`
        modelTitleThongBao.classList.remove('text-success');
        modelTitleThongBao.classList.add('text-danger');
        modal_ThongBao.click();
        setTimeout(() => {
            Tat_Thong_bao.click();
        }, 2000);
    }
}

function messageSuccess(result) {
    modelTitleThongBao.classList.remove('text-danger');
    modelTitleThongBao.classList.add('text-success');

    if (result.message == 'User deleted') {
        modelTitleThongBao.innerHTML = `Xóa tài khoản thành công`;
    } else if (result.message == 'User updated') {
        modelTitleThongBao.innerHTML = `Cập nhật tài khoản thành công`;
    } else if (result.message == 'Category deleted') {
        modelTitleThongBao.innerHTML = `Xóa chuyên mục thành công`;
    } else if (result.message == 'Category image updated') {
        modelTitleThongBao.innerHTML = `Cập nhật hình ảnh thành công`;
    } else if (result.message == 'Category updated') {
        modelTitleThongBao.innerHTML = `Cập nhật chuyên mục thành công`;
    } else if (result.message == 'Created category successful') {
        modelTitleThongBao.innerHTML = `Tạo mới chuyên mục thành công`;
    } else if (result.message == 'Users avatar updated') {
        modelTitleThongBao.innerHTML = `Cập nhật ảnh đại diện thành công`;
    } else if (result.message == 'Classify deleted') {
        modelTitleThongBao.innerHTML = `Xóa thể loại thành công`;
    } else if (result.message == 'Created classify successful') {
        modelTitleThongBao.innerHTML = `Tạo mới thể loại thành công`;
    } else if (result.message == 'Classify image updated') {
        modelTitleThongBao.innerHTML = `Cập nhật hình ảnh thành công`;
    } else if (result.message == 'Classify updated') {
        modelTitleThongBao.innerHTML = `Cập nhật thể loại thành công`;
    }

    modal_ThongBao.click();
    setTimeout(() => {
        Tat_Thong_bao.click();
    }, 1500);
}