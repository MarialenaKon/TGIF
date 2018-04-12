var myTable = document.getElementById('new_table'); // Get my table and store it in a variable 
var repCheckbox = document.getElementById('R'); //Get the Republican checkbox and store it in a variable
var demoCheckbox = document.getElementById('D'); // Get the Democrat checkbox and store it in a variable
var indieCheckbox = document.getElementById('I')
var stateSelect = document.getElementById('state-filter'); // Get the state selection and store it in a variable

var allMembers = data.results[0].members; // Accessing memmbers in the Json data and storing it in a variable

fillTable(allMembers, ["R", "D", "I"], "all"); // Calling the fillTable function, declared below

repCheckbox.addEventListener('change', filtersChanged);
demoCheckbox.addEventListener('change', filtersChanged);
indieCheckbox.addEventListener('change', filtersChanged);
stateSelect.addEventListener('change', filtersChanged);

//Declaring the fillTable function
function fillTable(people, partyFilterArray, stateFilterText) {

    var tableContent = ''; // Create a new table
    for (var i = 0; i < people.length; i++) {
        var person = people[i]; // New variable for every person, who is a value in an array 
        if (isVisible(person, partyFilterArray, stateFilterText)) {
            tableContent += '<tr>';
            tableContent += '<td class=\"text-left\"><a href=\"' + person.url + '\">' + person.last_name + ' ' + (person.middle_name || '') + ' ' + person.first_name + '</a></td>';
            tableContent += '<td>' + person.party + '</td>';
            tableContent += '<td>' + person.state + '</td>';
            tableContent += '<td>' + person.seniority + '</td>';
            tableContent += '<td>' + person.votes_with_party_pct + '%' + '</td>';
            tableContent += '</tr>';
        }

    }
    myTable.innerHTML = tableContent; // Insert the new HTML content in myTable variable
    //Table headers
    document.getElementById("new_table").innerHTML += '<thead><tr><th>Full Name</th><th class = \"text-center\">Party Affiliation</th><th class = \"text-center\">State</th><th class = \"text-center\">Seniority</th><th class = \"text-center\">% Votes with Party</th></tr></thead>';
}



function isVisible(somePerson, partyFilterInfo, stateFilterInfo) {
    var stateFilter = stateFilterInfo == 'all' || somePerson.state == stateFilterInfo;

    var partyFilter = partyFilterInfo.length == 0 || partyFilterInfo.includes(somePerson.party);

    var finalDecision = stateFilter && partyFilter;

    return finalDecision;
}

function filtersChanged() {
    // Party filters
    var partyFilter = [];
    if (repCheckbox.checked) {

        partyFilter.push('R');
    }
    if (demoCheckbox.checked) {
        partyFilter.push('D');
    }
    if (indieCheckbox.checked) {
        partyFilter.push('I');
    }
    // State filter
    var stateSelection = stateSelect.value;

    console.log(partyFilter);
    console.log(stateSelection);

    fillTable(allMembers, partyFilter, stateSelection);
}
