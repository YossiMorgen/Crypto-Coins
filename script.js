$("button").click( function(){
    if($(this).next().text() === ""){
        $(this).next().text(`Lorem ipsum dolor sit amet consectetur adipisicing elit. Optio dolorum error autem accusantiu`).hide().slideDown(300)
    }else{
        $(this).next().slideUp().text("")
    }
})


