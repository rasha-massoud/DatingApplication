const workshop_pages = {};

workshop_pages.base_url = "http://127.0.0.1:8000/api/v0.0.0/";

workshop_pages.getAPI = async (api_url, api_token = null) => {
    try {
        return await axios(
            api_url,
            {
                headers: {
                    'Authorization': "Bearer " + api_token
                }
            }
        );
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
                localStorage.setItem('user_id', response.data.user.id);
                localStorage.setItem('token', response.data.authorisation.token);
                localStorage.setItem('gender_id', response.data.user.gender_id);
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
                .then(response=>{
                })
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

workshop_pages.load_navigate = async () => {

    window.onload = function () {
        const categories = document.getElementById("ItemsRowsGrouping")

        const get_users_url = workshop_pages.base_url + "users";
        const api_token = localStorage.getItem('token');

        const navigateformData = new FormData();
        const gender_id = localStorage.getItem('gender_id');

        navigateformData.append('gender_id', gender_id)

        workshop_pages.postAPI(get_users_url, navigateformData, api_token)
            .then((response) => {
                const users = response.data.users;
                users.forEach(user => {
                    const html = `
                    <div class="ItemsRowsGrouping">
                        <div class="Items">
                            <img src="${user.profile}" id="imageGet"/>
                            <h3 class="rowData" id="nameGet">${user.name}</h3>
                            <h3 class="rowData" id="emailGet">${user.email}</h3>
                            <h3 class="rowData" id="phoneNumberGet">${user.phone_number}</h3>
                            <h3 class="rowData" id="biographyGet">${user.biography}</h3>
                            <h3 class="rowData" id="locationGet">${user.location}</h3>
                            <h3 class="rowData" id="dobGet">${user.dob}</h3>
                            <button class="acceptButtons" id=${user.id}>A<br>C<br>C<br>E<br>P<br>T</button>
                            <button class="blockButtons" id=${user.id}>B<br>L<br>O<br>C<br>K</button>
                        </div>
                    </div>
                    `;
                    categories.insertAdjacentHTML("beforeend", html);
                });

                const acceptButtonsArray = document.querySelectorAll(".acceptButtons");
                acceptButtonsArray.forEach(button => {
                    button.addEventListener("click", function (e) {
                        const user_id = localStorage.getItem('user_id');
                        const acceptformData = new FormData();
                        acceptformData.append('user_id', user_id);
                        acceptformData.append('favorite_user_id', e.target.id);
                        const api_token = localStorage.getItem('token');

                        const get_accept_url = workshop_pages.base_url + "accept";

                        workshop_pages.postAPI(get_accept_url, acceptformData, api_token)
                            .then(response)
                            .catch(error => {
                                console.error(error);
                            });
                    });
                });

                const blockButtonsArray = document.querySelectorAll(".blockButtons");
                blockButtonsArray.forEach(button => {
                    button.addEventListener("click", function (e) {
                        const user_id = localStorage.getItem('user_id');
                        const blockformData = new FormData();
                        blockformData.append('user_id', user_id);
                        blockformData.append('blocked_user_id', e.target.id);
                        const api_token = localStorage.getItem('token');

                        const get_block_url = workshop_pages.base_url + "block";

                        workshop_pages.postAPI(get_block_url, blockformData, api_token)
                            .then(response)
                            .catch(error => {
                                console.error(error);
                            });
                    });
                });
            })
            .catch(error => {
                console.error(error);
            });
    }
}

workshop_pages.load_filter = async () => {
    document.getElementById("filter").addEventListener("click", () => {
        const categories = document.getElementById("ItemsRowsGrouping")

        const category = document.getElementById("category").value;
        const filter_search = document.getElementById("filter_search").value;

        const filterformData = new FormData();
        filterformData.append('category', category);
        filterformData.append('filter_search', filter_search);

        const get_filter_url = workshop_pages.base_url + "filter";
        const api_token = localStorage.getItem('token');

        workshop_pages.postAPI(get_filter_url, filterformData, api_token)
            .then((response) => {
                const users = response.data.users;
                users.forEach(user => {
                    const html = `
                    <div class="ItemsRowsGrouping">
                        <div class="Items">
                            <img src="${user.profile}" id="imageGet"/>
                            <h3 class="rowData" id="nameGet">${user.name}</h3>
                            <h3 class="rowData" id="emailGet">${user.email}</h3>
                            <h3 class="rowData" id="phoneNumberGet">${user.phone_number}</h3>
                            <h3 class="rowData" id="biographyGet">${user.biography}</h3>
                            <h3 class="rowData" id="locationGet">${user.location}</h3>
                            <h3 class="rowData" id="dobGet">${user.dob}</h3>
                            <button class="acceptButtons" id=${user.id}>A<br>C<br>C<br>E<br>P<br>T</button>
                            <button class="blockButtons" id=${user.id}>B<br>L<br>O<br>C<br>K</button>
                        </div>
                    </div>
                    `;
                    categories.insertAdjacentHTML("beforeend", html);
                });
                const acceptButtonsArray = document.querySelectorAll(".acceptButtons");
                acceptButtonsArray.forEach(button => {
                    button.addEventListener("click", function (e) {
                        const user_id = localStorage.getItem('user_id');
                        const acceptformData = new FormData();
                        acceptformData.append('user_id', user_id);
                        acceptformData.append('favorite_user_id', e.target.id);
                        const api_token = localStorage.getItem('token');

                        const get_accept_url = workshop_pages.base_url + "accept";

                        workshop_pages.postAPI(get_accept_url, acceptformData, api_token)
                            .then(response)
                            .catch(error => {
                                console.error(error);
                            });
                    });
                });

                const blockButtonsArray = document.querySelectorAll(".blockButtons");
                blockButtonsArray.forEach(button => {
                    button.addEventListener("click", function (e) {
                        const user_id = localStorage.getItem('user_id');
                        const blockformData = new FormData();
                        blockformData.append('user_id', user_id);
                        blockformData.append('blocked_user_id', e.target.id);
                        const api_token = localStorage.getItem('token');

                        const get_block_url = workshop_pages.base_url + "block";

                        workshop_pages.postAPI(get_block_url, blockformData, api_token)
                            .then(response)
                            .catch(error => {
                                console.error(error);
                            });
                    });
                });
            })
            .catch(error => {
                console.error(error);
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
                const user = response.data.users;
                if (user == null) {
                    const html = `
                    <div class="ItemsRowsGrouping">
                        <div class="Items">
                            <h2 class="rowData">User not found!</h2>
                        </div>
                    </div>
                    `;
                    categories.insertAdjacentHTML("beforeend", html);
                }
                else {
                    const html = `
                    <div class="Items">
                        <img src="${user.profile}" id="imageGet" />
                        <h2 class="rowData" id="nameGet">${user.name}</h2>
                        <h2 class="rowData" id="emailGet">${user.email}</h2>
                        <h2 class="rowData" id="phoneNumberGet">${user.phone_number}</h2>
                        <h2 class="rowData" id="biographyGet">${user.biography}</h2>
                        <h2 class="rowData" id="locationGet">${user.location}</h2>
                        <h2 class="rowData" id="dobGet">${user.dob}</h2>
                    </div>
                    `;
                    categories.insertAdjacentHTML("beforeend", html);
                }
            })
            .catch(error => {
                console.error(error);
            });
    });
}

workshop_pages.load_profile = async () => {
    const get_profile_url = workshop_pages.base_url + "profile";

    document.getElementById("update").addEventListener("click", () => {
        const optional_profile1 = document.getElementById("optional_profile1").value;
        const optional_profile2 = document.getElementById("optional_profile2").value;
        const optional_profile3 = document.getElementById("optional_profile3").value;

        const profileformData = new FormData();
        const user_id = localStorage.getItem('user_id');

        profileformData.append('user_id', user_id);
        profileformData.append('optional_profile1', optional_profile1);
        profileformData.append('optional_profile2', optional_profile2);
        profileformData.append('optional_profile3', optional_profile3);

        const api_token = localStorage.getItem('token');

        workshop_pages.postAPI(get_profile_url, profileformData, api_token)
            .then(response)
            .catch(error => {
                console.error(error);
            });
    });
}

workshop_pages.load_favorites = async () => {
    window.onload = function () {
        const categories = document.getElementById("ItemsRowsGrouping")

        const get_favoriteList_url = workshop_pages.base_url + "favoriteList";
        const api_token = localStorage.getItem('token');

        const favListformData = new FormData();
        const user_id = localStorage.getItem('user_id');
        favListformData.append('user_id', user_id);

        workshop_pages.postAPI(get_favoriteList_url, favListformData, api_token)
            .then((response) => {
                const favorites = response.data.favoriteUsers;
                favorites.forEach(favorite => {
                    const html = `
                        <div class="Items">
                            <img src="${favorite.profile}" id="imageGet" />
                            <h2 class="rowData" id="nameGet">${favorite.name}</h2>
                            <h2 class="rowData" id="emailGet">${favorite.email}</h2>
                            <h2 class="rowData" id="phoneNumberGet">${favorite.phone_number}</h2>
                            <h2 class="rowData" id="biographyGet">${favorite.biography}</h2>
                            <h2 class="rowData" id="locationGet">${favorite.location}</h2>
                            <h2 class="rowData" id="dobGet">${favorite.dob}</h2>
                        </div>
                `;
                    categories.insertAdjacentHTML("beforeend", html);
                });
            })
            .catch(error => {
                console.error(error);
            });
    }
}

workshop_pages.load_blocks = async () => {
    window.onload = function () {
        const categories = document.getElementById("ItemsRowsGrouping")

        const get_blockList_url = workshop_pages.base_url + "blockList";
        const api_token = localStorage.getItem('token');

        const blockListformData = new FormData();
        const user_id = localStorage.getItem('user_id');
        blockListformData.append('user_id', user_id);

        workshop_pages.postAPI(get_blockList_url, blockListformData, api_token)
            .then((response) => {
                const blocks = response.data.blockedUsers;
                blocks.forEach(block => {
                    const html = `
                    <div class="Items">
                        <img src="${block.profile}" id="imageGet" />
                        <h2 class="rowData" id="nameGet">${block.name}</h2>
                        <h2 class="rowData" id="emailGet">${block.email}</h2>
                        <h2 class="rowData" id="phoneNumberGet">${block.phone_number}</h2>
                        <h2 class="rowData" id="biographyGet">${block.biography}</h2>
                        <h2 class="rowData" id="locationGet">${block.location}</h2>
                        <h2 class="rowData" id="dobGet">${block.dob}</h2>
                    </div>
                    `;
                    categories.insertAdjacentHTML("beforeend", html);
                });
            })
            .catch(error => {
                console.error(error);
            });
    }
}

workshop_pages.load_recover = async () => {
    const get_recover_url = workshop_pages.base_url + "recover";

    document.getElementById("submit").addEventListener("click", () => {
        const hobby = document.getElementById("hobby").value;
        const dog = document.getElementById("dog").value;

        const api_token = localStorage.getItem('token');

        const recoverformData = new FormData();
        const user_id = localStorage.getItem('user_id');

        recoverformData.append('user_id', user_id);
        recoverformData.append('hobby', hobby);
        recoverformData.append('dog', dog);

        workshop_pages.postAPI(get_recover_url, recoverformData, api_token)
            .then(response)
            .catch(error => {
                console.error(error);
            });
    });
}

workshop_pages.load_forgetPass = async () => {
    const get_forget_url = workshop_pages.base_url + "forget";

    document.getElementById("submit").addEventListener("click", () => {
        const email = document.getElementById("email").value;
        const hobby = document.getElementById("hobby").value;
        const dog = document.getElementById("dog").value;

        const recoverformData = new FormData();
        const user_id = localStorage.getItem('user_id');

        recoverformData.append('email', email);
        recoverformData.append('hobby', hobby);
        recoverformData.append('dog', dog);

        workshop_pages.postAPI(get_forget_url, recoverformData)
            .then(response => {

            })
            .catch(error => {
                console.error(error);
            });
    });
}

workshop_pages.load_notification = async () => {
    window.onload = function () {
        const categories = document.getElementById("ItemsRowsGrouping")

        const get_notificationList_url = workshop_pages.base_url + "notificationList";
        const api_token = localStorage.getItem('token');

        const notificationListformData = new FormData();
        const user_id = localStorage.getItem('user_id');
        notificationListformData.append('user_id', user_id);

        workshop_pages.postAPI(get_notificationList_url, notificationListformData, api_token)
            .then((response) => {
                console.log(response);
                const notifications = response.data.notifications;
                const userNotifications = response.data.userNotifications;

                const combinedNotifications = notifications.map((notification, index) => Object.assign({}, notification, userNotifications[index]));

                combinedNotifications.forEach(combinedNotification => {
                    const html = `
                        <div class="Items">
                            <img src="${combinedNotification.profile}" id="imageGet" />
                            <h2 class="rowData" id="nameGet">${combinedNotification.name}</h2>
                            <h2 class="rowData" id="emailGet">${combinedNotification.email}</h2>
                            <h2 class="rowData" id="phoneNumberGet">${combinedNotification.phone_number}</h2>
                            <h2 class="rowData" id="biographyGet">${combinedNotification.biography}</h2>
                            <h2 class="rowData" id="locationGet">${combinedNotification.location}</h2>
                            <h2 class="rowData" id="dobGet">${combinedNotification.dob}</h2>
                            <h2 class="rowData" id="actionGet">${combinedNotification.action}</h2>
                        </div>
                `;
                    categories.insertAdjacentHTML("beforeend", html);
                });
            })
            .catch(error => {
                console.error(error);
            });
    }
}