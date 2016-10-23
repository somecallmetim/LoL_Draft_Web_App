$(document).ready(function() {

    var ddragonVersion;
    var champImgUrl;
    var gridColumnArray = ["#imageList1", "#imageList2", "#imageList3", "#imageList4", "#imageList5", "#imageList6", "#imageList7"];
    var champList = {};
    var sortableChampList = [];
    var redPicks = 0;
    var bluePicks = 0;
    var redBans = 0;
    var blueBans = 0;
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
                champName = champName.replace("'", "");
                champName = champName.replace(".", "");
                champName = champName.replace(" ", "");

                var imageFileName = champion.image.full;

                champList[champName] = champion;
                sortableChampList.push(champName)
            })

            sortableChampList.sort();

            var iterator = 0;
            for (var i = 0; i <= sortableChampList.length - 1; i++) {
                var champName = sortableChampList[i];
                var imageFileName = champList[champName].image.full;
                var champIcon;

                champImgUrl = "http://ddragon.leagueoflegends.com/cdn/" + ddragonVersion + "/img/champion/" + imageFileName;

                champIcon = '<img id="' + champName + '"class=\'icon\' src="' + champImgUrl + '" />'
                $(gridColumnArray[iterator]).append(champIcon);

                setIconAsClickable(champName);

                iterator++;
                if (iterator > 6){
                    iterator = 0; 
                }
            };
        }
    })

    interact('.dropzone').dropzone({
        overlap: 0.25,
        ondrop: function (event) {
            //console.log(event.relatedTarget.id);

            var champId = event.relatedTarget.id;
            champId = champId.replace("_New", "");

            $(event.relatedTarget).remove();

            switch (event.target.id) {
                case "blue-side-container":
                    if(bluePicks < 5){
                        getIconImage(champId, "#blue-side-picks");
                        bluePicks++;
                    }else {
                        $("#" + champId).css("opacity", 1);
                        setIconAsClickable(champId);
                    }
                break;
                case "red-side-container":
                    if(redPicks < 5) {
                        getIconImage(champId, "#red-side-picks");
                        redPicks++;
                    }else {
                        $("#" + champId).css("opacity", 1);
                        setIconAsClickable(champId);
                    }
                break;
                case "blue-side-bans-container":
                    if(blueBans < 3){
                        getIconImage(champId, "#blue-side-bans");
                        blueBans++;
                    }else {
                        $("#" + champId).css("opacity", 1);
                        setIconAsClickable(champId);
                    }
                break;
                case "red-side-bans-container":
                    if(redBans < 3){
                        getIconImage(champId, "#red-side-bans");                        
                        redBans++;
                    }else {
                        $("#" + champId).css("opacity", 1);
                        setIconAsClickable(champId);
                    }

                break;
                default:
                break;
            }
    }
    });

    function getIconImage (champId, listToAddId){

        var imageFileName = champList[champId].image.full;
        champImgUrl = "http://ddragon.leagueoflegends.com/cdn/" + ddragonVersion + "/img/champion/" + imageFileName;

        champIcon = '<img id="' + champId + '"class=\'icon\' src="' + champImgUrl + '" />'
        $(listToAddId).append(champIcon);
        
    }

    function setIconAsClickable(champId){
        champId = "#" + champId;
        $(champId).click(function(e){
            var newId = this.id + "_New"
            $(champId).clone().prop('id', newId).appendTo("#champ-select").offset({left:e.pageX,top:e.pageY});


            interact("#" + newId).draggable({
                onmove: dragMoveListener,
            });

            $(champId).css("opacity", 0.5);
            $(champId).off();
        });
    }
    
    function dragMoveListener (event) {
        //console.log(event.type, event.pageX, event.pageY);
        var targetId = "#" + event.target.id;
        //$(targetId).appendTo("#champ-select");
        var target = event.target,
            // keep the dragged position in the data-x/data-y attributes
            x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx,
            y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;
        //console.log(targetId);

        // translate the element
        target.style.webkitTransform =
        target.style.transform =
          'translate(' + x + 'px, ' + y + 'px)';

        // update the posiion attributes
        target.setAttribute('data-x', x);
        target.setAttribute('data-y', y);
    }
});
//debugger;
//console.log(champImgUrl);
//http://ddragon.leagueoflegends.com/cdn/5.2.1/img/champion/