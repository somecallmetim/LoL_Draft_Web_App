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
    var isAnIconActive = false;

    //retrieves current ddragon version
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

    //gets all champ icons from Riot's API
    $.ajax({
        url: "https://global.api.pvp.net/api/lol/static-data/na/v1.2/champion?champData=image&api_key=8de9b045-bbd0-4c39-9a8f-c4dfd32e157b",
        datatype: "json",
        success: function(response){
            
            $.each(response.data, function(index, champion){
                var champName = champion.name;
                //remove chars that are undesirable in champion names
                champName = champName.replace("'", "");
                champName = champName.replace(".", "");
                champName = champName.replace(" ", "");

                champList[champName] = champion;
                sortableChampList.push(champName)
            })

            //put champs in alphabetical order
            sortableChampList.sort();

            var iterator = 0;

            //iterate through all champs, add image to main champ list, set as clickable
            for (var i = 0; i <= sortableChampList.length - 1; i++) {
                var champName = sortableChampList[i];

                placeIconImageInList(champName, gridColumnArray[iterator], false);

                setMainIconAsClickable(champName);

                //keeps track of which column each icon should go in
                iterator++;
                if (iterator > 6){
                    iterator = 0; 
                }
            };
        }
    })

    //handles drop logic for picks and bans utilizing interact.js library ('.dropzone' denotes an html class)
    interact('.dropzone').dropzone({
        //sets overlap required to activate the dropzone listener
        overlap: 0.25,

        ondrop: function (event) {

            //gets id of champ being dropped
            var champId = event.relatedTarget.id;
            //removes the temporary icon that was being dragged
            removeIcon(event.relatedTarget.id);

            //gets us the champ id we need to retrieve appropriate icon
            champId = champId.replace("_TempIcon", "");

            //determines where the temp icon was dropped and creates a new icon in the appropriate list
            switch (event.target.id) {
                case "blue-side-container":
                    //ensures no side can pick more than 5 champs
                    if(bluePicks < 5){
                        placeIconImageInList(champId, "#blue-side-picks", true);
                        setPickBanIconAsClickable(champId + "_PickBanIcon", "blue-side-container");
                        bluePicks++;
                        $("#" + champId).css("opacity", 0.33);
                        $("#" + champId).off();
                    }else {
                        //resets main champ list icon if too many champs already have been placed here
                        $("#" + champId).css("opacity", 1);
                    }
                break;
                case "red-side-container":
                    //ensures no side can pick more than 5 champs
                    if(redPicks < 5) {
                        placeIconImageInList(champId, "#red-side-picks", true);
                        setPickBanIconAsClickable(champId + "_PickBanIcon", "red-side-container");
                        redPicks++;
                        $("#" + champId).css("opacity", 0.33);
                        $("#" + champId).off();
                    }else {
                        //resets main champ list icon if too many champs already have been placed here
                        $("#" + champId).css("opacity", 1);
                    }
                break;
                case "blue-side-bans-container":
                    //ensures no side gets more than 3 bans
                    if(blueBans < 3){
                        placeIconImageInList(champId, "#blue-side-bans", true);
                        setPickBanIconAsClickable(champId + "_PickBanIcon", "blue-side-bans-container");
                        blueBans++;
                        $("#" + champId).css("opacity", 0.33);
                        $("#" + champId).off();
                    }else {
                        //resets main champ list icon if too many champs already have been placed here
                        $("#" + champId).css("opacity", 1);
                    }
                break;
                case "red-side-bans-container":
                    //ensures no side gets more than 3 bans
                    if(redBans < 3){
                        placeIconImageInList(champId, "#red-side-bans", true);
                        setPickBanIconAsClickable(champId + "_PickBanIcon", "red-side-bans-container");
                        redBans++;
                        $("#" + champId).css("opacity", 0.33);
                        $("#" + champId).off();
                    }else {
                        //resets main champ list icon if too many champs already have been placed here
                        $("#" + champId).css("opacity", 1);
                    }

                break;
                default:
                break;
            }
            
        }
    });

    //retrieves an icon image, puts it on webpage, and gives it an appropriate unique id
    function placeIconImageInList (champId, listToAddId, isPickOrBan){

        var imageFileName = champList[champId].image.full;
        var champIcon;
        champImgUrl = "http://ddragon.leagueoflegends.com/cdn/" + ddragonVersion + "/img/champion/" + imageFileName;

        if(isPickOrBan){
            var champTitle = champId;
            champId = champId + "_PickBanIcon";
            champIcon = '<img id="' + champId + '"class="icon masterTooltip" title="' + champTitle +'" src="' + champImgUrl + '" />'
        }else {
            champIcon = '<img id="' + champId + '"class="icon masterTooltip" title="' + champId +'" src="' + champImgUrl + '" />'
        }


        $(listToAddId).append(champIcon); 
    }

    //removes icon, sets global icon active flag to false, removes any key listeners from the document
    function removeIcon(champId) {
        isAnIconActive = false;
        var champId = "#" + champId;
        $(champId).remove();
        $(document).off();
    }

    //sets an icon as clickable and adds key listener for main champ list
    function setMainIconAsClickable(champId){
        champId = "#" + champId;
        $(champId).click(function(e){
            //makes sure there isn't an icon that has been clicked and left in an unresolved state
            //this way you don't end up with several selected icons at once
            if(!isAnIconActive){
                isAnIconActive = true;
                //sets up new temporary icon id
                var newId = this.id + "_TempIcon"
                //clones the icon that was clicked, gives it tempId, places it slightly offset from the original
                $(champId).clone().prop('id', newId).appendTo("#champ-select").offset({left:e.pageX,top:e.pageY});

                //makes the temp icon draggable
                interact("#" + newId).draggable({
                    onmove: dragMoveListener,
                    onend: function(event){
                        //removes temp icon at the end of it's "drag" regardless of what else happens
                        removeIcon(event.target.id);
                    }
                });

                //allows user to to deselect current icon by hitting the esc key
                $(document).keydown(function(e){
                    if(e.keyCode == 27){ // escape key maps to keycode `27`
                        removeIcon(newId);
                    }
                })
            }
        });
    }

    //sets an icon as clickable in the pick or ban lists
    function setPickBanIconAsClickable(champId, assignedList) {
        var jChampId = "#" + champId;

        $(jChampId).click(function(e){
            if(!isAnIconActive){
                isAnIconActive = true;
                $(jChampId).css("opacity", 0.6);
                $(jChampId).attr("title", "Press ENTER to remove or ESC to cancel");
                //onclick add keylistener to doc that allows user to either remove or deselect the icon
                $(document).keydown(function(e){
                    if(e.keyCode == 27){ // escape key maps to keycode `27`
                        $(jChampId).css("opacity", 1);
                        $(jChampId).attr("title", champId);
                        isAnIconActive = false;
                    }else if(e.keyCode == 13){ // enter key maps to keycode `13`
                        var originalChamp = champId.replace("_PickBanIcon", "");
                        removeIcon(champId);
                        isAnIconActive = false;
                        //decriment appropriate variable to allow more picks/bans to be added
                        switch (assignedList) {
                            case "blue-side-container":
                                bluePicks--;
                                break;
                            case "red-side-container":
                                redPicks--;
                                break;
                            case "blue-side-bans-container":
                                blueBans--;
                                break;
                            case "red-side-bans-container":
                                redBans--;
                                break;
                            default:
                                break;
                        }
                        //reset icon in main champ list so it may once again be selected
                        $("#" + originalChamp).css("opacity", 1);
                        setMainIconAsClickable(originalChamp);
                    }
                })
            }
        });
    }

    //allows a selected icon to be dragged about
    function dragMoveListener (event) {
        var target = event.target,
            // keep the dragged position in the data-x/data-y attributes
            x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx,
            y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;


        // translate the element
        target.style.webkitTransform =
        target.style.transform =
          'translate(' + x + 'px, ' + y + 'px)';

        // update the posiion attributes
        target.setAttribute('data-x', x);
        target.setAttribute('data-y', y);
    }

    //adds tooltip to icons
    $('.masterTooltip').hover(function(){
        // Hover over code
        var title = $(this).attr('title');
        $(this).data('tipText', title).removeAttr('title');
        $('<p class="tooltip"></p>')
        .text(title)
        .appendTo('body')
        .fadeIn('slow');
    }, function() {
        // Hover out code
        $(this).attr('title', $(this).data('tipText'));
        $('.tooltip').remove();
    }).mousemove(function(e) {
        var mousex = e.pageX + 20; //Get X coordinates
        var mousey = e.pageY + 10; //Get Y coordinates
        $('.tooltip')
        .css({ top: mousey, left: mousex })
    });
});
//debugger;
//console.log(champImgUrl);
//http://ddragon.leagueoflegends.com/cdn/5.2.1/img/champion/