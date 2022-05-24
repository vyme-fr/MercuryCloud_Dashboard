(function () {
    "use strict";

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
    
    let currentTab =0;
    const ActiveTab=(n)=>{
        if(n==0){
            document.getElementById("account").classList.add("active");
            document.getElementById("account").classList.remove("done");
            document.getElementById("personal").classList.remove("done");
            document.getElementById("personal").classList.remove("active");
        }
        if(n==1){
            form1 = {
                "cycle": document.getElementById("cycle-fac").value,
                "srv-name": document.getElementById("srv-name").value,
                "db-sup": document.getElementById("db-sup").value,
                "bkp-sup": document.getElementById("bkp-sup").value
            }
            document.getElementById("account").classList.add("done");
            document.getElementById("personal").classList.add("active");
            document.getElementById("personal").classList.remove("done");
            document.getElementById("payment").classList.remove("active");
            document.getElementById("payment").classList.remove("done");
            document.getElementById("confirm").classList.remove("done");
            document.getElementById("confirm").classList.remove("active");
        }
        if(n==2){
            form2 = {
                "first-name": document.getElementById("first-name").value,
                "last-name": document.getElementById("last-name").value,
                "mail": document.getElementById("mail").value,
                "tel": document.getElementById("tel").value,
                "address-1": document.getElementById("address-1").value,
                "address-2": document.getElementById("address-2").value,
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
        if(n==3){
            var form_array = []
            form_array.push(form1)
            form_array.push(form2)
            form = {"order": form_array}
            console.log(form)
            postData('http://localhost:400/api/order-form', form).catch(function(error) {
                console.log('[ERROR] ' + error.message);
                location.href = "../errors/error500.html";

            })
            document.getElementById("account").classList.add("done");
            document.getElementById("personal").classList.add("done");
            document.getElementById("payment").classList.add("done");
            document.getElementById("confirm").classList.add("active");
            document.getElementById("confirm").classList.remove("done");


        }
    } 
    const showTab=(n)=>{
        var x = document.getElementsByTagName("fieldset");
        x[n].style.display = "block";
        console.log(n);
        ActiveTab(n);
       
    }
    const nextBtnFunction= (n) => {
        var x = document.getElementsByTagName("fieldset");
        x[currentTab].style.display = "none";
        currentTab = currentTab + n;
        showTab(currentTab);
    }
    
    const nextbtn= document.querySelectorAll('.next')
    Array.from(nextbtn, (nbtn) => {
    nbtn.addEventListener('click',function()
    {
        if (currentTab == 0) {
            var ok = 0
            var no = 0
            if(document.getElementById('cycle-fac').value > 0) {
                document.getElementById('cycle-fac').classList.remove('is-invalid')
                document.getElementById('cycle-fac').classList.add('is-valid')
                ok++
            } else {
                document.getElementById('cycle-fac').classList.remove('is-valid')
                document.getElementById('cycle-fac').classList.add('is-invalid')
                document.getElementById('cycle-fac').value = "0"
                no++
            }

            if(document.getElementById('srv-name').value.length > 2) {
                document.getElementById('srv-name').classList.remove('is-invalid')
                document.getElementById('srv-name').classList.add('is-valid')
                ok++
            } else {
                document.getElementById('srv-name').classList.remove('is-valid')
                document.getElementById('srv-name').classList.add('is-invalid')
                document.getElementById('srv-name').value = ""
                no++
            }

            if(ok ==2 && no == 0) {
                nextBtnFunction(1);
            }
        }
        if (currentTab == 1) {
            var ok = 0
            var no = 0
            if(document.getElementById("first-name").value.length > 2) {
                document.getElementById("first-name").classList.remove('is-invalid')
                document.getElementById("first-name").classList.add('is-valid')
                ok++
            } else {
                document.getElementById("first-name").classList.remove('is-valid')
                document.getElementById("first-name").classList.add('is-invalid')
                document.getElementById("first-name").value = ""
                no++
            }


            if(document.getElementById("last-name").value.length > 2) {
                document.getElementById("last-name").classList.remove('is-invalid')
                document.getElementById("last-name").classList.add('is-valid')
                ok++
            } else {
                document.getElementById("last-name").classList.remove('is-valid')
                document.getElementById("last-name").classList.add('is-invalid')
                document.getElementById("last-name").value = ""
                no++
            }


            if(document.getElementById("mail").value.length > 2) {
                document.getElementById("mail").classList.remove('is-invalid')
                document.getElementById("mail").classList.add('is-valid')
                ok++
            } else {
                document.getElementById("mail").classList.remove('is-valid')
                document.getElementById("mail").classList.add('is-invalid')
                document.getElementById("mail").value = ""
                no++
            }


            if(document.getElementById("tel").value.length > 2) {
                document.getElementById("tel").classList.remove('is-invalid')
                document.getElementById("tel").classList.add('is-valid')
                ok++
            } else {
                document.getElementById("tel").classList.remove('is-valid')
                document.getElementById("tel").classList.add('is-invalid')
                document.getElementById("tel").value = ""
                no++
            }


            if(document.getElementById("address-1").value.length > 2) {
                document.getElementById("address-1").classList.remove('is-invalid')
                document.getElementById("address-1").classList.add('is-valid')
                ok++
            } else {
                document.getElementById("address-1").classList.remove('is-valid')
                document.getElementById("address-1").classList.add('is-invalid')
                document.getElementById("address-1").value = ""
                no++
            }


            if(document.getElementById("city").value.length > 2) {
                document.getElementById("city").classList.remove('is-invalid')
                document.getElementById("city").classList.add('is-valid')
                ok++
            } else {
                document.getElementById("city").classList.remove('is-valid')
                document.getElementById("city").classList.add('is-invalid')
                document.getElementById("city").value = ""
                no++
            }


            if(document.getElementById("zip").value.length > 2) {
                document.getElementById("zip").classList.remove('is-invalid')
                document.getElementById("zip").classList.add('is-valid')
                ok++
            } else {
                document.getElementById("zip").classList.remove('is-valid')
                document.getElementById("zip").classList.add('is-invalid')
                document.getElementById("zip").value = ""
                no++
            }


            if(document.getElementById("country").value > 0) {
                document.getElementById("country").classList.remove('is-invalid')
                document.getElementById("country").classList.add('is-valid')
                ok++
            } else {
                document.getElementById("country").classList.remove('is-valid')
                document.getElementById("country").classList.add('is-invalid')
                document.getElementById("country").value = ""
                no++
            }


            if(document.getElementById("state").value.length > 2) {
                document.getElementById("state").classList.remove('is-invalid')
                document.getElementById("state").classList.add('is-valid')
                ok++
            } else {
                document.getElementById("state").classList.remove('is-valid')
                document.getElementById("state").classList.add('is-invalid')
                document.getElementById("state").value = ""
                no++
            }
            

            if(ok > 2 && no == 0) {
                nextBtnFunction(1);
            }
        }
    })
});

// previousbutton

const prebtn= document.querySelectorAll('.previous')
    Array.from(prebtn, (pbtn) => {
    pbtn.addEventListener('click',function()
    {
        nextBtnFunction(-1);
    })
});
    
})()