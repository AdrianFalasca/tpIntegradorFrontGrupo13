const form_login = document.getElementById("form-login");

form_login.addEventListener("submit", e => {
    e.preventDefault();
    const name = form_login.name.value.trim();
    
    sessionStorage.setItem("userName", name);
    window.location.replace("index.html");
});
