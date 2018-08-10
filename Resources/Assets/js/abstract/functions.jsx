function expand(str, control = "fast") {
    $(str).slideToggle(control);
}

function toggleView(str, control = "fast") {
    var classname = document.querySelector(str);
    classname.replace(str, str + "--active");
    $(str).slideToggle(control);
}

export {toggleView,expand};