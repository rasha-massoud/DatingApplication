const workshop_pages = {};

workshop_pages.base_url = "http://127.0.0.1:8000/api/v0.0.0/";

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
                    'Authorization': "Bearer " + api_token
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
    const get_users_url = workshop_pages.base_url + "register";

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
    document.getElementById("login").addEventListener("click", () => {
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;
        const loginformData = new FormData();
        loginformData.append('email', email);
        loginformData.append('password', password);

        const get_logins_url = workshop_pages.base_url + "login";
        workshop_pages.postAPI(get_logins_url, loginformData)
            .then((response) => {
                localStorage.setItem('token', response.data.authorisation.token);
                console.log(response);
                if (response.data.status == "success") {
                    window.location.href = '/datingApp/FE/navigate.html';
                }
            })
            .catch(error => {
                console.error(error);
            });
    });
}

workshop_pages.load_edit = async () => {
    const get_edit_url = workshop_pages.base_url + "edit";

    document.getElementById("submit").addEventListener("click", () => {
        const email = document.getElementById("email").value;
        const phone_number = document.getElementById("phone_number").value;
        const password = document.getElementById("password").value;
        const confirmPassword = document.getElementById("confirmPassword").value;
        const location = document.getElementById("location").value;
        const biography = document.getElementById("biography").value;
        const profile = document.getElementById("profile").value;

        const isValidated = checkEntries(email, password, confirmPassword, phone_number, location, biography, profile);
        if (isValidated) {
            const editformData = new FormData();
            editformData.append('email', email);
            editformData.append('phone_number', phone_number);
            editformData.append('password', password);
            editformData.append('location', location);
            editformData.append('biography', biography);
            editformData.append('profile', profile);
            const api_token = localStorage.getItem('token');
            workshop_pages.postAPI(get_edit_url, editformData, api_token)
                .then(response)
                .catch(error => {
                    console.error(error);
                });
        }
    });

    const checkEntries = (email, password, confirmPassword, phone_number, location, biography, profile) => {
        if (!(email && password && confirmPassword && phone_number && location && biography && profile)) {
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

workshop_pages.load_filter = async () => {
    document.getElementById("submit").addEventListener("click", () => {
        const category = document.getElementById("category").value;
        const filter_search = document.getElementById("filter_search").value;

        const filterformData = new FormData();
        filterformData.append('category', category);
        filterformData.append('filter_search', filter_search);

        const get_search_url = workshop_pages.base_url + "filter";
        const api_token = localStorage.getItem('token');

        const categories = document.getElementById("ItemsRowsGrouping")

        workshop_pages.postAPI(get_search_url, filterformData, api_token)
            .then((response) => {
                const users = response.data;
                users.forEach(user => {
                    const html = `
                    <div class="ItemsRowsGrouping">
                        <div class="Items">
                            <img src="${user.profile}" id="imageGet"/>
                            <h2 id="nameGet">${user.name}</h2>
                            <h2 id="emailGet">${user.email}</h2>
                            <h2 id="phoneNumberGet">${user.phone_number}</h2>
                            <h2 id="biographyGet">${user.biography}</h2>
                            <h2 id="locationGet">${user.location}</h2>
                            <h2 id="dobGet">${user.dob}</h2>
                            <button class="acceptButtons" id=${user.id}>Accept</button>
                        </div>
                    </div>
                    `;
                    categories.insertAdjacentHTML("beforeend", html);

                });
            })
            .catch(error => {
                console.error(error);
            });

        const accptBUTNARRAY = document.querySelectorAll(".acceptButtons");
        accptBUTNARRAY.forEach(butnnnn => {
            butnnnn.addEventListener("click", function = (e) => {
                console.log(e.target.id);
                e.target.id ;
                //TO BE SEND TO THE BACKEND LA SHOUF LA MEEN SEWA ACCEPT 
            });
        });
    });
}

workshop_pages.load_search = async () => {
    document.getElementById("search").addEventListener("click", () => {
        const name = document.getElementById("name").value;

        const searchformData = new FormData();
        searchformData.append('name', name);

        const get_search_url = workshop_pages.base_url + "search";
        const api_token = localStorage.getItem('token');

        const categories = document.getElementById("ItemsRowsGrouping")

        workshop_pages.postAPI(get_search_url, searchformData, api_token)
            .then((response) => {
                const users = response.data;
                users.forEach(user => {
                    const html = `
                    <div class="ItemsRowsGrouping">
                        <div class="Items">
                            <img src="${user.profile}" id="imageGet"/>
                            <h2 id="nameGet">${user.name}</h2>
                            <h2 id="emailGet">${user.email}</h2>
                            <h2 id="phoneNumberGet">${user.phone_number}</h2>
                            <h2 id="biographyGet">${user.biography}</h2>
                            <h2 id="locationGet">${user.location}</h2>
                            <h2 id="dobGet">${user.dob}</h2>
                        </div>
                    </div>
                    `;
                    categories.insertAdjacentHTML("beforeend", html);

                });
            })
            .catch(error => {
                console.error(error);
            });
    });
}