console.log("This is search")

let search = document.getElementById('searchTxt');
search.addEventListener("input", function(){
    
    
    // let inputVal = search.ariaValueMax;

    let inputVal = search.value.toUpperCase();
    // console.log('Input event fired!', inputVal);
    let noteCards = document.getElementsByClassName('noteCard');
    Array.from(noteCards).forEach(function(element){
        let cardTxt = element.getElementsByTagName("p")[0].innerHTML;
        let cartTitle = element.getElementsByTagName("h5")[0].innerHTML;
        // element.style.display = "block";
    //     let regex1 = /[a-zA-Z]$/i;
    // let regex2 = /[0-9a-zA-Z]$/i;

        if(cartTitle.includes(inputVal) || cardTxt.includes(inputVal)){
            element.style.display = "block";
            console.log(cartTitle)
        }
        else{
            element.style.display = "none";
        }
        console.log(cartTitle);
    })
})