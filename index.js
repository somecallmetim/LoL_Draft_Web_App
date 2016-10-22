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
                var champId = "#" + champName;
                var champIcon;

                champImgUrl = "http://ddragon.leagueoflegends.com/cdn/" + ddragonVersion + "/img/champion/" + imageFileName;

                champIcon = '<img id="' + champName + '"class=\'icon\' src="' + champImgUrl + '" />'
                $(gridColumnArray[iterator]).append(champIcon);

                // interact("#" + champName)
                //     .draggable({
                //         onmove: dragMoveListener
                //     }
                // );

                $(champId).click(function(e){
                    var championID = "#" + this.id;
                    var newId = this.id + "_New"
                    $(championID).clone().prop('id', newId).appendTo("#champ-select").offset({left:e.pageX,top:e.pageY});
                    interact("#" + newId).draggable({
                        onmove: dragMoveListener
                    });

                    $(championID).css("opacity", 0.5);
                    $(championID).off();
                });

                iterator++;
                if (iterator > 6){
                    iterator = 0; 
                }
            };
        }
    })

    interact('dropzone').dropzone({
        overlap: 0.75
    });
    
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