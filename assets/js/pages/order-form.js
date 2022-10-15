(function () {
    "use strict";

    function getCookie(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
    }
    const url = new URL(window.location.href);
    if (url.searchParams.get('id')) {
        fetch(`https://dash.mercurycloud.fr:8000/api/products/${url.searchParams.get('id')}?uuid=${getCookie("uuid")}&token=${getCookie("token")}`)
            .then(function (response) {
                return response.json();
            })
            .then(function (json) {
                console.log(json)
                if (json.error === false) {
                    if (json.data.id == 404) {
                        window.location.replace("/dashboard/errors/error404.html");
                    }
                } else {
                    window.location.replace("/dashboard/errors/error500.html");
                }
            })
    } else {
        window.location.replace("/dashboard/errors/error404.html");
    }

    async function postData(url = '', data = {}) {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        return response.json()
    }

    var form1
    var form2
    var form

    /*---------------------------------------------------------------------
        Fieldset
    -----------------------------------------------------------------------*/

    let currentTab = 0;
    const ActiveTab = (n) => {
        if (n == 0) {
            document.getElementById("account").classList.add("active");
            document.getElementById("account").classList.remove("done");
            document.getElementById("personal").classList.remove("done");
            document.getElementById("personal").classList.remove("active");
        }
        if (n == 1) {
            form1 = {
                "cycle": document.getElementById("cycle-fac").value,
                "srv_name": document.getElementById("srv-name").value,
                "srv_type": 1,
                "srv_nest": 2,
                "db_sup": document.getElementById("db-sup").value,
                "bkp_sup": document.getElementById("bkp-sup").value
            }
            fetch(`https://dash.mercurycloud.fr:8000/api/users/${getCookie('uuid')}?uuid=${getCookie('uuid')}&token=${getCookie('token')}&id=${getCookie('uuid')}`)
                .then(function (response) {
                    return response.json();
                })
                .then(function (json) {
                    console.log(json)
                    if (json.error === false) {
                        document.getElementById("first-name").value = json.data.first_name
                        document.getElementById("last-name").value = json.data.last_name
                        document.getElementById("mail").value = json.data.mail
                        document.getElementById("tel").value = json.data.tel
                        document.getElementById("address-1").value = json.data.address_1
                        document.getElementById("address-2").value = json.data.address_2
                        document.getElementById("city").value = json.data.city
                        document.getElementById("zip").value = json.data.zip
                        document.getElementById("country").value = json.data.country
                        document.getElementById("state").value = json.data.state
                    }
                    document.getElementById("account").classList.add("done");
                    document.getElementById("personal").classList.add("active");
                    document.getElementById("personal").classList.remove("done");
                    document.getElementById("payment").classList.remove("active");
                    document.getElementById("payment").classList.remove("done");
                    document.getElementById("confirm").classList.remove("done");
                    document.getElementById("confirm").classList.remove("active");
                    if (document.getElementById("first-name").value.length > 2) {
                        document.getElementById("first-name").classList.remove('is-invalid')
                        document.getElementById("first-name").classList.add('is-valid')

                    } else {
                        document.getElementById("first-name").classList.remove('is-valid')
                        document.getElementById("first-name").classList.add('is-invalid')
                        document.getElementById("first-name").value = ""

                    }


                    if (document.getElementById("last-name").value.length > 2) {
                        document.getElementById("last-name").classList.remove('is-invalid')
                        document.getElementById("last-name").classList.add('is-valid')

                    } else {
                        document.getElementById("last-name").classList.remove('is-valid')
                        document.getElementById("last-name").classList.add('is-invalid')
                        document.getElementById("last-name").value = ""

                    }


                    if (document.getElementById("mail").value.length > 2) {
                        document.getElementById("mail").classList.remove('is-invalid')
                        document.getElementById("mail").classList.add('is-valid')

                    } else {
                        document.getElementById("mail").classList.remove('is-valid')
                        document.getElementById("mail").classList.add('is-invalid')
                        document.getElementById("mail").value = ""

                    }


                    if (document.getElementById("tel").value.length == 12 && document.getElementById("tel").value.match(/[0-9]/gi) != null && document.getElementById("tel").value.includes("+", 0) == true) {
                        document.getElementById("tel").classList.remove('is-invalid')
                        document.getElementById("tel").classList.add('is-valid')

                    } else {
                        document.getElementById("tel").classList.remove('is-valid')
                        document.getElementById("tel").classList.add('is-invalid')
                        document.getElementById("tel").value = ""

                    }



                    if (document.getElementById("address-1").value.length > 2) {
                        document.getElementById("address-1").classList.remove('is-invalid')
                        document.getElementById("address-1").classList.add('is-valid')

                    } else {
                        document.getElementById("address-1").classList.remove('is-valid')
                        document.getElementById("address-1").classList.add('is-invalid')
                        document.getElementById("address-1").value = ""

                    }


                    if (document.getElementById("city").value.length > 2) {
                        document.getElementById("city").classList.remove('is-invalid')
                        document.getElementById("city").classList.add('is-valid')

                    } else {
                        document.getElementById("city").classList.remove('is-valid')
                        document.getElementById("city").classList.add('is-invalid')
                        document.getElementById("city").value = ""

                    }


                    if (document.getElementById("zip").value.length == 5 && /^\d+$/.test(document.getElementById("zip").value) == true) {
                        document.getElementById("zip").classList.remove('is-invalid')
                        document.getElementById("zip").classList.add('is-valid')

                    } else {
                        document.getElementById("zip").classList.remove('is-valid')
                        document.getElementById("zip").classList.add('is-invalid')
                        document.getElementById("zip").value = ""

                    }


                    if (document.getElementById("country").value > 0) {
                        document.getElementById("country").classList.remove('is-invalid')
                        document.getElementById("country").classList.add('is-valid')

                    } else {
                        document.getElementById("country").classList.remove('is-valid')
                        document.getElementById("country").classList.add('is-invalid')
                        document.getElementById("country").value = ""

                    }


                    if (document.getElementById("state").value.length > 2) {
                        document.getElementById("state").classList.remove('is-invalid')
                        document.getElementById("state").classList.add('is-valid')

                    } else {
                        document.getElementById("state").classList.remove('is-valid')
                        document.getElementById("state").classList.add('is-invalid')
                        document.getElementById("state").value = ""

                    }

                })
        }
        if (n == 2) {
            form2 = {
                "first_name": document.getElementById("first-name").value,
                "last_name": document.getElementById("last-name").value,
                "mail": document.getElementById("mail").value,
                "tel": document.getElementById("tel").value,
                "address_1": document.getElementById("address-1").value,
                "address_2": document.getElementById("address-2").value,
                "city": document.getElementById("city").value,
                "zip": document.getElementById("zip").value,
                "country": document.getElementById("country").value,
                "state": document.getElementById("state").value
            }
            document.getElementById("account").classList.add("done");
            document.getElementById("personal").classList.add("done");
            document.getElementById("payment").classList.add("active");
            document.getElementById("payment").classList.remove("done");
            document.getElementById("confirm").classList.remove("done");
            document.getElementById("confirm").classList.remove("active");

        }
        if (n == 3) {
            document.getElementById("account").classList.add("done");
            document.getElementById("personal").classList.add("done");
            document.getElementById("payment").classList.add("done");
            document.getElementById("confirm").classList.add("active");
            document.getElementById("confirm").classList.remove("done");
        }
    }
    const showTab = (n) => {
        var x = document.getElementsByTagName("fieldset");
        x[n].style.display = "block";
        console.log(n);
        ActiveTab(n);

    }
    const nextBtnFunction = (n) => {
        var x = document.getElementsByTagName("fieldset");
        x[currentTab].style.display = "none";
        currentTab = currentTab + n;
        showTab(currentTab);
    }

    const nextbtn = document.querySelectorAll('.next')
    Array.from(nextbtn, (nbtn) => {
        nbtn.addEventListener('click', function () {
            console.log("tab " + currentTab)
            if (currentTab == 0) {
                var ok = 0
                var no = 0
                if (document.getElementById('cycle-fac').value > 0) {
                    document.getElementById('cycle-fac').classList.remove('is-invalid')
                    document.getElementById('cycle-fac').classList.add('is-valid')
                    ok++
                } else {
                    document.getElementById('cycle-fac').classList.remove('is-valid')
                    document.getElementById('cycle-fac').classList.add('is-invalid')
                    document.getElementById('cycle-fac').value = "0"
                    no++
                }

                if (document.getElementById('srv-name').value.length > 2) {
                    document.getElementById('srv-name').classList.remove('is-invalid')
                    document.getElementById('srv-name').classList.add('is-valid')
                    ok++
                } else {
                    document.getElementById('srv-name').classList.remove('is-valid')
                    document.getElementById('srv-name').classList.add('is-invalid')
                    document.getElementById('srv-name').value = ""
                    no++
                }

                if (ok == 2 && no == 0) {
                    nextBtnFunction(1);
                }
            }
            if (currentTab == 1) {
                var ok = 0
                var no = 0
                if (document.getElementById("first-name").value.length > 2) {
                    document.getElementById("first-name").classList.remove('is-invalid')
                    document.getElementById("first-name").classList.add('is-valid')
                    ok++
                } else {
                    document.getElementById("first-name").classList.remove('is-valid')
                    document.getElementById("first-name").classList.add('is-invalid')
                    document.getElementById("first-name").value = ""
                    no++
                }


                if (document.getElementById("last-name").value.length > 2) {
                    document.getElementById("last-name").classList.remove('is-invalid')
                    document.getElementById("last-name").classList.add('is-valid')
                    ok++
                } else {
                    document.getElementById("last-name").classList.remove('is-valid')
                    document.getElementById("last-name").classList.add('is-invalid')
                    document.getElementById("last-name").value = ""
                    no++
                }


                if (document.getElementById("mail").value.length > 2) {
                    document.getElementById("mail").classList.remove('is-invalid')
                    document.getElementById("mail").classList.add('is-valid')
                    ok++
                } else {
                    document.getElementById("mail").classList.remove('is-valid')
                    document.getElementById("mail").classList.add('is-invalid')
                    document.getElementById("mail").value = ""
                    no++
                }


                if (document.getElementById("tel").value.length == 12 && document.getElementById("tel").value.match(/[0-9]/gi) != null && document.getElementById("tel").value.includes("+", 0) == true) {
                    document.getElementById("tel").classList.remove('is-invalid')
                    document.getElementById("tel").classList.add('is-valid')
                    ok++
                } else {
                    document.getElementById("tel").classList.remove('is-valid')
                    document.getElementById("tel").classList.add('is-invalid')
                    document.getElementById("tel").value = ""
                    no++
                }



                if (document.getElementById("address-1").value.length > 2) {
                    document.getElementById("address-1").classList.remove('is-invalid')
                    document.getElementById("address-1").classList.add('is-valid')
                    ok++
                } else {
                    document.getElementById("address-1").classList.remove('is-valid')
                    document.getElementById("address-1").classList.add('is-invalid')
                    document.getElementById("address-1").value = ""
                    no++
                }


                if (document.getElementById("city").value.length > 2) {
                    document.getElementById("city").classList.remove('is-invalid')
                    document.getElementById("city").classList.add('is-valid')
                    ok++
                } else {
                    document.getElementById("city").classList.remove('is-valid')
                    document.getElementById("city").classList.add('is-invalid')
                    document.getElementById("city").value = ""
                    no++
                }


                if (document.getElementById("zip").value.length == 5 && /^\d+$/.test(document.getElementById("zip").value) == true) {
                    document.getElementById("zip").classList.remove('is-invalid')
                    document.getElementById("zip").classList.add('is-valid')
                    ok++
                } else {
                    document.getElementById("zip").classList.remove('is-valid')
                    document.getElementById("zip").classList.add('is-invalid')
                    document.getElementById("zip").value = ""
                    no++
                }


                if (document.getElementById("country").value > 0) {
                    document.getElementById("country").classList.remove('is-invalid')
                    document.getElementById("country").classList.add('is-valid')
                    ok++
                } else {
                    document.getElementById("country").classList.remove('is-valid')
                    document.getElementById("country").classList.add('is-invalid')
                    document.getElementById("country").value = ""
                    no++
                }


                if (document.getElementById("state").value.length > 2) {
                    document.getElementById("state").classList.remove('is-invalid')
                    document.getElementById("state").classList.add('is-valid')
                    ok++
                } else {
                    document.getElementById("state").classList.remove('is-valid')
                    document.getElementById("state").classList.add('is-invalid')
                    document.getElementById("state").value = ""
                    no++
                }


                if (ok > 2 && no == 0) {
                    nextBtnFunction(1);
                }
            }
            if (currentTab == 2) {
                form = { "product_id": url.searchParams.get('id'), "srv_info": form1, "user_info": form2 }
                console.log(form)
                postData(`https://dash.mercurycloud.fr:8000/api/services?uuid=${getCookie("uuid")}&token=${getCookie("token")}`, form).then(data => {
                    console.log(data)
                    if (data.error == false) {
                        nextBtnFunction(1);
                    } else {
                        if (data.code == 403) {
                            console.log('[ERROR] ' + data);
                            window.location.replace("/dashboard/auth/sign-in.html");
                        } else {
                            if (data.code == 404) {
                                console.log('[ERROR] ' + data);
                                window.location.replace("/dashboard/auth/sign-in.html");
                            } else {
                                window.location.replace("/dashboard/errors/error500.html");
                            }
                        }
                    }
                })
            }
        })
    });

    const prebtn = document.querySelectorAll('.previous')
    Array.from(prebtn, (pbtn) => {
        pbtn.addEventListener('click', function () {
            nextBtnFunction(-1);
        })
    });

})()