
export default function formatDate(fechaInput) {

    const fecha = new Date(fechaInput)

    const year = fecha.getFullYear();
    let month = fecha.getMonth() + 1;
    let date = fecha.getDate() + 1

    if (month < 10) {
        month = '0' + month;
    }
    if (date < 10) {
        date = '0' + date;
    }
    return (`${date}-${month}-${year}`)

}
