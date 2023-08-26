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
       window.open('?Recherche=' + recherche.value, '_self');
}
function onViewVideo(id, urlStream){
  window.open('/video?id='+id+'&urlStream=' + urlStream);
}