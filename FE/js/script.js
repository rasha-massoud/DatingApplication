const workshop_pages = {};

// workshop_pages.base_url = "http://localhost/HospitalFullStack/Hospital_BackEnd/";

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
    let data = new FormData();

    document.getElementById("submit").addEventListener("click", () => {
        const name = document.getElementById("name").value;
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;
        const confirmPassword = document.getElementById("confirmPassword").value;
        const dob = document.getElementById("dob").value;
        const user_type_id = document.getElementById("user_type_id").value;


        const isValidated = checkEntries(name, email, password, confirmPassword, dob, user_type_id);
        if (isValidated) {
            data.append('name', name);
            data.append('email', email);
            data.append('password', password);
            data.append('dob', dob);
            if (user_type_id == "patient") {
                data.append('user_type_id', 1);
            } else if (user_type_id == "employee") {
                data.append('user_type_id', 2);
            } else {
                data.append('user_type_id', 3);
            }

            const get_users_url = workshop_pages.base_url + "registration.php";

            axios({
                "method": "post",
                "url": get_users_url,
                "data": data
            }).then((result) => {
            }).catch((err) => {
                console.error(err);
            });
        }
    });

    const checkEntries = (name, email, password, confirmPassword, dob, user_type_id) => {
        if (!(name && email && password && confirmPassword && dob)) {
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
