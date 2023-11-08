console.log("This is search")

let search = document.getElementById('adminSearch');
search.addEventListener("input", function () {
    let inputVal = search.value.trim().toUpperCase();
    let inputWords = inputVal.split(/\s+/);

    let nameSearchRows = document.querySelectorAll('.nameSearch');

    nameSearchRows.forEach(function (row) {
        let nameCell = row.querySelector('.name');
        let nameContent = nameCell.textContent.toUpperCase().replace(/ +/g, "");

        let showRow = inputWords.every(word => nameContent.includes(word));

        row.style.display = showRow ? "table-row" : "none";
    });
});



let filterName = document.getElementById('filterName')

filterName.addEventListener("change", function () {
    let filterVal = filterName.value
    console.log(filterVal)

    if (filterVal === "Name") {
        search.addEventListener("input", function () {
            let inputVal = search.value.trim().toLowerCase();
            let inputWords = inputVal.split(/\s+/);

            let nameSearchRows = document.querySelectorAll('.nameSearch');

            nameSearchRows.forEach(function (row) {
                let nameCell = row.querySelector('.name');
                let nameContent = nameCell.textContent.toLowerCase().replace(/ +/g, "");

                let showRow = inputWords.every(word => nameContent.includes(word));

                row.style.display = showRow ? "table-row" : "none";
            });
        });
    }
    else if (filterVal === "Email-id") {
        search.addEventListener("input", function () {
            let inputVal = search.value.trim().toLowerCase();
            let inputWords = inputVal.split(/\s+/);

            let nameSearchRows = document.querySelectorAll('.nameSearch');

            nameSearchRows.forEach(function (row) {
                let nameCell = row.querySelector('.email');
                let nameContent = nameCell.textContent.toLowerCase().replace(/ +/g, "");
                let showRow = inputWords.every(word => nameContent.includes(word));

                row.style.display = showRow ? "table-row" : "none";
            })
        })
    }
    else if (filterVal === "Package Name") {
        search.addEventListener("input", function () {
            let inputVal = search.value.trim().toLowerCase();
            let inputWords = inputVal.split(/\s+/);

            let nameSearchRows = document.querySelectorAll('.nameSearch');

            nameSearchRows.forEach(function (row) {
                let nameCell = row.querySelector('.packageName');
                let nameContent = nameCell.textContent.toLowerCase().replace(/ +/g, "");
                let showRow = inputWords.every(word => nameContent.includes(word));

                row.style.display = showRow ? "table-row" : "none";
            })
        })
    }
    else if (filterVal === "Phone") {
        search.addEventListener("input", function () {
            let inputVal = search.value.trim().toLowerCase();
            let inputWords = inputVal.split(/\s+/);

            let nameSearchRows = document.querySelectorAll('.nameSearch');

            nameSearchRows.forEach(function (row) {
                let nameCell = row.querySelector('.phone');
                let nameContent = nameCell.textContent.toLowerCase().replace(/ +/g, "");
                let showRow = inputWords.every(word => nameContent.includes(word));

                row.style.display = showRow ? "table-row" : "none";
            })
        })
    }
    else if (filterVal === "Date") {
        search.addEventListener("input", function () {
            let inputVal = search.value.trim().toLowerCase();
            let inputWords = inputVal.split(/\s+/);

            let nameSearchRows = document.querySelectorAll('.nameSearch');

            nameSearchRows.forEach(function (row) {
                let nameCell = row.querySelector('.date');
                let nameContent = nameCell.textContent.toLowerCase().replace(/ +/g, "");
                let showRow = inputWords.every(word => nameContent.includes(word));

                row.style.display = showRow ? "table-row" : "none";
            })
        })
    }
    else if (filterVal === "City") {
        search.addEventListener("input", function () {
            let inputVal = search.value.trim().toLowerCase();
            let inputWords = inputVal.split(/\s+/);

            let nameSearchRows = document.querySelectorAll('.nameSearch');

            nameSearchRows.forEach(function (row) {
                let nameCell = row.querySelector('.city');
                let nameContent = nameCell.textContent.toLowerCase().replace(/ +/g, "");
                let showRow = inputWords.every(word => nameContent.includes(word));

                row.style.display = showRow ? "table-row" : "none";
            })
        })
    }
})



let adminEventSearch = document.getElementById('adminEventSearch');

adminEventSearch.addEventListener("input", function () {
    let inputVal1 = adminEventSearch.value.trim().toLowerCase();
    console.log(inputVal1);
    let inputWords1 = inputVal1.split(/\s+/);

    let eventSearchRows = document.querySelectorAll('.eventSearch');
    

    eventSearchRows.forEach(function (row) {
        let eventCell = row.querySelector('.eventName');
        let eventContent = eventCell.textContent.toLowerCase().replace(/ +/g, "");
        let showEventRow = inputWords1.every(word => eventContent.includes(word));

        row.style.display = showEventRow ? "table-row" : "none";
    })
})


let adminCommentSearch = document.getElementById('adminCommentSearch');

adminCommentSearch.addEventListener("input", function () {
    let inputVal2 = adminCommentSearch.value.trim().toLowerCase();
    let inputWords2 = inputVal2.split(/\s+/);

    let commentSearchRows = document.querySelectorAll('.commentSearch');
    

    commentSearchRows.forEach(function (row) {
        let commentCell = row.querySelector('.commentName');
        let commentContent = commentCell.textContent.toLowerCase().replace(/ +/g, "");
        let showCommentRow = inputWords2.every(word => commentContent.includes(word));

        row.style.display = showCommentRow ? "table-row" : "none";
    })
})










