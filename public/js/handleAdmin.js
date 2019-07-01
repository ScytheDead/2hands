function messageError(err) {
    if (err == 'Unauthorized') {
        sessionStorage.removeItem('token');
        TH_dropdown.innerHTML = ``;
        toastError(`Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại`);
        setTimeout(() => {
            window.location = Dia_chi_Dich_vu;
        }, 1500);
    } else if (err == 'Not Found') {
        toastError(`Cập nhật hình ảnh thất bại !`);
    } else if (err == 'Not Found Image') {
        toastError(`Xin vui lòng chọn hình ảnh !`);
    }else if (err == 'Internal Server Error') {
        toastError(`Tạo mới thất bại !`);
    } else if (err == 'This category have still contains classify') {
        toastError(`Chuyên mục này vẫn còn chứa thể loại bên trong !`);
    } else if (err == 'This category have still contains producer') {
        toastError(`Chuyên mục này vẫn còn chứa nhà sản xuất bên trong !`);
    } else if (err == 'This classify have still contains producer') {
        toastError(`Thể loại này vẫn còn chứa nhà sản xuất bên trong !`);
    } else if (err == 'Wrong file format') {
        toastError(`Sai định dạng hình ảnh !`);
    } else if (err == 'request entity too large') {
        toastError(`Dung lượng ảnh vượt mức quy định !`);
    } else if (err == 'Category validation failed: title: Path `title` is required.') {
        toastError(`Tiêu đề không được trống !`);
    } else if (err == 'Category validation failed: title: title too short') {
        toastError(`Tiêu đề ít nhất 5 ký tự !`);
    } else if (err == 'Category validation failed: title: title too long') {
        toastError(`Tiêu đề tối đa 100 ký tự !`);
    } else if (err == 'The title already exists') {
        toastError(`Tiêu đề này đã được sử dụng. Xin vui lòng chọn tiêu đề khác !`);
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
    } else if (result.message == 'Created producer successful') {
        modelTitleThongBao.innerHTML = `Tạo mới nhà sản xuất thành công`;
    } else if (result.message == 'Producer deleted') {
        modelTitleThongBao.innerHTML = `Xóa nhà sản xuất thành công`;
    } else if (result.message == 'Producer image updated') {
        modelTitleThongBao.innerHTML = `Cập nhật hình ảnh thành công`;
    } else if (result.message == 'Producer updated') {
        modelTitleThongBao.innerHTML = `Cập nhật nhà sản xuất thành công`;
    } else if (result.message == 'Post accepted') {
        modelTitleThongBao.innerHTML = `Tin đã được duyệt thành công`;
    } else if (result.message == 'Post rejected') {
        modelTitleThongBao.innerHTML = `Tin đã được từ chối thành công`;
    } 
 
    modal_ThongBao.click();
    setTimeout(() => {
        Tat_Thong_bao.click();
    }, 1500);
}

function toastError(toastDisplayError) {
    modelTitleThongBao.innerHTML = toastDisplayError;
    modelTitleThongBao.classList.remove('text-success');
    modelTitleThongBao.classList.add('text-danger');
    modal_ThongBao.click();
    setTimeout(() => {
        Tat_Thong_bao.click();
    }, 2000);
}