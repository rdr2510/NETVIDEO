const style = window.getComputedStyle(document.querySelector('body'));
const theme = {
  primary: style.getPropertyValue('--primary'),
  secondary: style.getPropertyValue('--secondary'),
  success: style.getPropertyValue('--success'),
  info: style.getPropertyValue('--info'),
  warning: style.getPropertyValue('--warning'),
  danger: style.getPropertyValue('--danger'),
  light: style.getPropertyValue('--light'),
  dark: style.getPropertyValue('--dark'),
};

function onClavierDown(recherche){
    if(event.key === 'Enter') {
        window.open('?Recherche=' + recherche.value, '_self');        
    }
}
function onRecherche (){
       const recherche= document.querySelector('#recherche');
       window.open('/?Recherche=' + recherche.value, '_self');
}
function onViewVideo(id, urlStream){
  window.open('/video?id='+id+'&urlStream=' + urlStream);
}

(() => {
  'use strict'

  // Fetch all the forms we want to apply custom Bootstrap validation styles to
  const forms = document.querySelectorAll('.needs-validation')

  // Loop over them and prevent submission
  Array.from(forms).forEach(form => {
    form.addEventListener('submit', event => {
      if (!form.checkValidity()) {
          event.preventDefault();
          event.stopPropagation();
          /*let myform = document.getElementById("form-upload");

          let formData = new FormData(myform);

          fetch("http://localhost:8080/upload/data", {method: "POST", body: formData}).then((response) => {
              if (!response.ok) {
                  throw new Error("network returns error");
              }
              return response.json();
          }).then((resp) => {
              let respdiv = document.createElement("pre");
              respdiv.innerHTML = JSON.stringify(resp, null, 2);
              myform.replaceWith(respdiv);
              console.log("resp from server ", resp);
          }).catch((error) => {
              // Handle error
              console.log("error ", error);
          });*/
      }

      form.classList.add('was-validated')
    }, false)
  })
})()