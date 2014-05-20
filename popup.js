//Default standard api call
var overflowQuery = 'https://api.stackexchange.com/2.2/questions/featured?page=1&pagesize=5&order=desc&sort=creation&site=stackoverflow&filter=!bBWADrkxawWHyW';

/**
Makes the api request for the bounties we are interested in
*/
function requestBounties(query) {
   var req = new XMLHttpRequest();
   req.open("GET", query, true);
   req.onreadystatechange = function() {
       if (req.readyState == 4) {
           var bounties = JSON.parse(req.responseText);
           showBounties(bounties);
       }
   }
   req.send();
}

/**
Load any prefences and used that to to invoke a query to get the bounties we are interested in
*/
function loadBounties() {
    var status = document.getElementById('status');
    status.textContent = 'Loading Data....';


    chrome.storage.sync.get({
        bountyTags: ''
        }, function(items) {
            var query = overflowQuery;
            var bountyTags = items.bountyTags;
            //If there is a tag let's add it to the query
            if (bountyTags && bountyTags != '') {
                query = query + '&tagged=' + items.bountyTags;
            }
            status.textContent = '';
            requestBounties(query);
    });
}

/*
Function to create a div to hold a label to a value
*/
function createLabelDiv(label, color, value) {
        var div = document.createElement('div');
        div.style.paddingTop = "5px";
        div.style.paddingRight = "15px";
        div.style.fontWeight = "bold";
        div.appendChild(document.createTextNode(label));
        var font = document.createElement("font");
        font.style.color = color;
        font.appendChild(document.createTextNode(value));
        div.appendChild(font);
        return div;
}

/*
This method is for actually rendering popup.html with the appropriate data
*/
function showBounties(bounties) {
    //loop through each item and create a ui element for it
    for (var i in bounties.items) {
        var bounty = bounties.items[i];

        //Create Div
        var div = document.createElement('div');
        div.style.backgroundColor = "#FFEFC6";
        div.style.border = "1px solid";
        div.style.boxShadow = "3px 3px 1px #888888";
        div.style.padding = "5px 5px";

        //Create link for issue
        var title = bounty.title;
        var link = document.createElement('a');
        var linkText = document.createTextNode(title);
        link.appendChild(linkText);
        link.title = title;
        link.href = bounty.link;
        link.onclick = function (event) {
            //Left mouse only since using the middle mouse opens the link already
            if (event.which == 1) {
                chrome.tabs.create({active: true, url: this.href});
            }
        };

        div.appendChild(link);

        div.appendChild(document.createElement('br'));

        //Create Bounty
        var bountyDiv = createLabelDiv("Bounty: ", "green", bounty.bounty_amount);
        div.appendChild(bountyDiv);

        //Create Answer Count
        var color = "red";
        if (bounty.is_answered) {
            color = "green";
        }
        var answerDiv = createLabelDiv("Answer Count: ", color, bounty.answer_count);
        div.appendChild(answerDiv);

        document.body.appendChild(div);
        document.body.appendChild(document.createElement('br'));
    }
}

document.addEventListener('DOMContentLoaded', function () {
    loadBounties();
});
