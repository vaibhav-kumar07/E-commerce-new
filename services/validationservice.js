
function validateName(name) {
    const regex = /^[a-zA-Z0-9\s-]*$/;
    if (regex.test(name)) {
        return true;
    } else if (emailRegex.test(email)) {
        return true;
    }
    else {
        return false;
    }
}


function validateEmail(email) {
    const emailRegex = /^(?!.*[<>]).*[\w+\-.]+@[a-zA-Z0-9\-]+(\.[a-zA-Z]{2,})+$/
    if (emailRegex.test(email)) {
        return true
    } else {
        return false
    }
}
module.exports = { validateEmail, validateName }