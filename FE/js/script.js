const workshop_pages = {};

workshop_pages.base_url = "http://127.0.0.1:8000/api/v0.0.0/user/";

workshop_pages.getAPI = async (api_url) => {
    try {
        return await axios(api_url);
    } catch (error) {
        console.log("Error from GET API");
    }
}

workshop_pages.postAPI = async (api_url, api_data, api_token = null) => {
    try {
        return await axios.post(
            api_url,
            api_data,
            {
                headers: {
                    'Authorization': "token " + api_token
                }
            }
        )
    } catch (error) {
        console.log("Error from POST API");
    }
}

workshop_pages.loadFor = (page) => {
    eval("workshop_pages.load_" + page + "();");
}

workshop_pages.load_registration = async () => {
    const get_users_url = workshop_pages.base_url + "registration";

    document.getElementById("submit").addEventListener("click", () => {
        const name = document.getElementById("name").value;
        const phone_number = document.getElementById("phone_number").value;
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;
        const confirmPassword = document.getElementById("confirmPassword").value;
        const dob = document.getElementById("dob").value;
        const gender_id = document.getElementById("gender_id").value;
        const location = document.getElementById("location").value;
        const biography = document.getElementById("biography").value;
        const profile = document.getElementById("profile").value;

        const isValidated = checkEntries(name, email, password, confirmPassword, phone_number, location, biography, profile);
        if (isValidated) {
            const registrationformData = new FormData();
            registrationformData.append('name', name);
            registrationformData.append('phone_number', phone_number);
            registrationformData.append('email', email);
            registrationformData.append('password', password);
            registrationformData.append('dob', dob);
            registrationformData.append('gender_id', gender_id);
            registrationformData.append('location', location);
            registrationformData.append('biography', biography);
            registrationformData.append('profile', profile);

            workshop_pages.postAPI(get_users_url, registrationformData)
                .then(response)
                .catch(error => {
                    console.error(error);
                });
        }
    });

    const checkEntries = (name, email, password, confirmPassword, phone_number, location, biography, profile) => {
        if (!(name && email && password && confirmPassword && phone_number && location && biography && profile)) {
            return false;
        }

        else if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
            return false;
        }

        else if (password != confirmPassword) {
            return false;
        }
        else {
            const decimal = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,15}$/;
            return password.match(decimal) ? true : false;
        }
    }
}

workshop_pages.load_login = async () => {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    let loginformData = new FormData();
    loginformData.append('email', email);
    loginformData.append('password', password);

    const get_logins_url = workshop_pages.base_url + "login";
    workshop_pages.postAPI(get_logins_url, loginformData)
    .then(response)
    .catch(error => {
        console.error(error);
    });
}
