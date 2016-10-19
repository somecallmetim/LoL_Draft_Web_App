$(document).ready(function() {

    var ddragonVersion;
    var champImgUrl;
    $.ajax({
        url:"https://global.api.pvp.net/api/lol/static-data/na/v1.2/versions?api_key=8de9b045-bbd0-4c39-9a8f-c4dfd32e157b",
        datatype: "json",
        success: function(response){
            ddragonVersion = response[0];
            //console.log(ddragonVersion);
        },
        error: function(error){
            console.log(error)
        }
    })

    $.ajax({
        url: "https://global.api.pvp.net/api/lol/static-data/na/v1.2/champion?champData=image&api_key=8de9b045-bbd0-4c39-9a8f-c4dfd32e157b",
        datatype: "json",
        success: function(response){
            $.each(response.data, function(index, champion){
                //debugger;
                champImgUrl = "http://ddragon.leagueoflegends.com/cdn/" + ddragonVersion + "/img/champion/" + champion.image.full;
                //console.log(champImgUrl);
                $("#imageList").append('<img id="' + champion + '" src="' + champImgUrl + '" />');
            })
        }
    })
});

//http://ddragon.leagueoflegends.com/cdn/5.2.1/img/champion/