$(document).ready(function() {

    var ddragonVersion;
    var champImgUrl;
    var gridColumnArray = ["#imageList1", "#imageList2", "#imageList3", "#imageList4", "#imageList5", "#imageList6", "#imageList7"];
    var champList = {};
    var sortableChampList = [];
    $.ajax({
        url:"https://global.api.pvp.net/api/lol/static-data/na/v1.2/versions?api_key=8de9b045-bbd0-4c39-9a8f-c4dfd32e157b",
        datatype: "json",
        success: function(response){
            ddragonVersion = response[0];        
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
                var champName = champion.name;
                var imageFileName = champion.image.full;

                champList[champName] = champion;
                sortableChampList.push(champName)
            })

            sortableChampList.sort();
            console.log(sortableChampList);
            var iterator = 0;
            for (var i = 0; i <= sortableChampList.length - 1; i++) {
                var champName = sortableChampList[i];

                var imageFileName = champList[champName].image.full;

                champImgUrl = "http://ddragon.leagueoflegends.com/cdn/" + ddragonVersion + "/img/champion/" + imageFileName;
                $(gridColumnArray[iterator]).append('<img id="' + champName + '"class=\'icon\' src="' + champImgUrl + '" />');

                iterator++;
                if (iterator > 6){
                    iterator = 0; 
                }
            };
        }
    })

});
//debugger;
//console.log(champImgUrl);
//http://ddragon.leagueoflegends.com/cdn/5.2.1/img/champion/