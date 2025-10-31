export const currentPageReportTemplate = (text = 'TH') => {
    if (text === 'TH') {
        return "กำลังแสดง {first} ถึง {last} จาก {totalRecords} รายการ";
    } else {
        return "Showing {first} to {last} of {totalRecords} products";
    }
};

export const paginatorTemplate = (text = 'EN') => {
    return "FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown";

};

export const rowsPerPageOptions = () => {
    return [5, 10, 25, 50, 100];

};