$(function () {

    var obtainedData;
    var statistics = {};
    var allMembers = [];
    var location = window.location.pathname; // It shows me the url of the current page


    var statistics = {
        "numberRepublicans": 0,
        "repAvgVotesPct": 0,
        "numberDemocrats": 0,
        "demoAvgVotesPct": 0,
        "numberIndependents": 0,
        "indieAvgVotesPct": 0,
        "totalOfReps": 0
    }

    // We need the url to decide which JSON will use on which page, depending on the pathname

    getURL(); //Calling the function that will choose url

    function getURL() { //Declaring the getURL

        var url; //Create the variable

        if (location == "/senate_attendance.html" || location == "/senate_party-loyalty.html") { // if it´s a senate page
            url = "https://nytimes-ubiqum.herokuapp.com/congress/113/senate"; //  Choose senate JSON as url

        } else { // if NO senate page...
            url = "https://nytimes-ubiqum.herokuapp.com/congress/113/house"; // Choose house JSON as url

        }

        loadAllMembers(url);

    }


    function loadAllMembers(url) {

        $.getJSON(url, function (obtainedData) {

            allMembers = obtainedData.results[0].members;
            console.log(allMembers);

            calcStatistics();

            return allMembers;
        });
    }


    function calcStatistics() {

        statistics["totalOfReps"] = allMembers.length;

        //array.filter (callBackFunction,this Arg)

        var repArray = allMembers.filter(function (oneMember) {
            return oneMember.party == "R";
        });
        statistics["numberRepublicans"] = repArray.length;

        var demoArray = allMembers.filter(function (oneMember) {
            return oneMember.party == "D";
        });
        statistics["numberDemocrats"] = demoArray.length;

        var indieArray = allMembers.filter(function (oneMember) {
            return oneMember.party == "I";
        });
        statistics["numberIndependents"] = indieArray.length;

        //DECLARING A FUNCTION TO SUM ALL OF THE VOTES WITH PARTY %s

        function totalVwpPct(total, oneMember) {
            return total + parseFloat(oneMember.votes_with_party_pct);
        }

        var repVotesSum = repArray.reduce(totalVwpPct, 0);
        statistics["repAvgVotesPct"] = (repVotesSum / repArray.length).toFixed(2);

        var demoVotesSum = demoArray.reduce(totalVwpPct, 0);
        statistics["demoAvgVotesPct"] = (demoVotesSum / demoArray.length).toFixed(2);

        var indieVotesSum = indieArray.reduce(totalVwpPct, 0);
        statistics["indieAvgVotesPct"] = (indieVotesSum / indieArray.length).toFixed(2);

        //Create a sorted array of all the percentages VOTES WITH PARTY
        var vwpArray = [];
        for (i = 0; i < allMembers.length; i++) {
            vwpArray.push(allMembers[i]);
            vwpArray.sort(function (a, b) {
                return a.votes_with_party_pct - b.votes_with_party_pct;
            });
        }
        console.log(vwpArray);

        var tenPctOfLength = (allMembers.length * 10) / 100

        //Array of persons who least voted with party:
        var least_loyal_array = [];
        for (i = 0; i < tenPctOfLength; i++) {
            least_loyal_array.push(vwpArray[i]);
        }
        statistics["least_loyal_array"] = least_loyal_array;

        //Array of persons who most voted with party:
        var most_loyal_array = [];
        for (i = allMembers.length - 1; i > allMembers.length - tenPctOfLength - 1; i--) {
            most_loyal_array.push(vwpArray[i]);
        }
        statistics["most_loyal_array"] = most_loyal_array;

        //Create a sorted array of all the MISSED VOTES %s
        var mvArray = [];
        for (i = 0; i < allMembers.length; i++) {
            mvArray.push(allMembers[i]);
            mvArray.sort(function (a, b) {
                return a.missed_votes_pct - b.missed_votes_pct;
            });
        }
        console.log(mvArray);

        //Array of persons who most missed votes:
        var least_engaged_array = [];
        for (i = allMembers.length - 1; i > allMembers.length - tenPctOfLength - 1; i--) {
            least_engaged_array.push(mvArray[i]);
        }
        statistics["least_engaged_array"] = least_engaged_array;

        //Array of persons who least missed votes:
        var most_engaged_array = [];
        for (i = 0; i < tenPctOfLength; i++) {
            most_engaged_array.push(mvArray[i]);
        }
        statistics["most_engaged_array"] = most_engaged_array;

        console.log(statistics);


        fillFirstTable();

        // Which table will be filled depending on the pathname of the current page location

        if (location == "/senate_attendance.html" || location == "/house_attendance.html") {

            fillAttendance(least_engaged_array); // TRYING MUSTASCHE
            fillTable(most_engaged_array, "most_engaged");

        } else {
            fillTable(most_loyal_array, "most_loyal");
            fillTable(least_loyal_array, "least_loyal");
        }
    }


    function fillFirstTable() {

        document.getElementById("number1").innerHTML = statistics.numberRepublicans;
        document.getElementById("number2").innerHTML = statistics.numberDemocrats;
        document.getElementById("number3").innerHTML = statistics.numberIndependents;
        document.getElementById("number4").innerHTML = statistics.totalOfReps;
        document.getElementById("pct1").innerHTML = statistics.repAvgVotesPct;
        document.getElementById("pct2").innerHTML = statistics.demoAvgVotesPct;
        document.getElementById("pct3").innerHTML = statistics.indieAvgVotesPct;

    }

    function fillAttendance(least_engaged_array) {

        var template = $("#data-table-html").html();

        var html = Mustache.render(template, statistics);
        console.log(html);
        $("#least_engaged").html(html);

        if ($("#least_engaged") !== null) {
            $("#least_engaged").html(html);
        }

    }


    function fillTable(array, name) {

        var table = '';

        for (i = 0; i < array.length; i++) {
            table += '<tr>';
            table += '<td><a href=\"' + array[i].url + '\">' + array[i].last_name + ' ' + (array[i].middle_name || '') + ' ' + array[i].first_name + '</a></td>';
            table += '<td>' + ((array[i].total_votes * array[i].votes_with_party_pct) / 100).toFixed(0) + '</td>';
            table += '<td>' + array[i].votes_with_party_pct + '</td>';
            table += '</tr>';
        }
        if (document.getElementById(name) !== null) {
            document.getElementById(name).innerHTML = table;
        }

    }


});
