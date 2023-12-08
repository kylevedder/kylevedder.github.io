
const sort_by_arr2 = (arr1, arr2) => arr1
  .map((item, index) => [arr2[index], item]) // add the args to sort by
  .sort(([arg1], [arg2]) => arg2 - arg1) // sort by the args
  .map(([, item]) => item); // extract the sorted items

function MySearch() {
    var category = document.getElementsByName("category_menu")[0].value;
    var minSpeed = document.getElementById("sliderOutput1").value;
    // parse minSpeed to Number
    minSpeed = parseFloat(minSpeed);

    var maxSpeed = document.getElementById("sliderOutput2").value;
    // parse maxSpeed to Number
    maxSpeed = parseFloat(maxSpeed);

    console.log("Category:", category, "Min Speed:", minSpeed, "Max Speed:", maxSpeed);
    console.log("Category type:", typeof category, "Min Speed type:", typeof minSpeed, "Max Speed type:", typeof maxSpeed);

    admit_any_category = (category === "");
    
    var entries_found = 0;
    alphabetical_id_counts = [];
    for (var i = 0; i < alphabetical_ids.length; i++) {
        var json_blob = json_count_lookup[alphabetical_ids[i]];
        // console.log("JSON blob:", json_blob);
        category_dictionary = {};
        if (admit_any_category) {
            category_dictionary = mergeAllCategories(json_blob);
        } else {
            category_dictionary = fetchCategory(json_blob, category);
        }

        var points_in_range = categoryDictionaryInSpeedRange(category_dictionary, minSpeed, maxSpeed);
        if (points_in_range > 0) {
            document.getElementById(alphabetical_ids[i]).style.display = "block";
            entries_found += 1;
        } else {
            document.getElementById(alphabetical_ids[i]).style.display = "none";
        }
        alphabetical_id_counts.push(points_in_range);
    }
    // Argsort the alphabetical_ids by alphabetical_id_counts
    sorted_ids = sort_by_arr2(alphabetical_ids, alphabetical_id_counts);

    rearrangeIdsByOrder(sorted_ids);

    console.log("Number of entries found:", entries_found);
    document.getElementById("num_found").innerText = entries_found;
}

function rearrangeIdsByOrder(ids_order) {
    // Rearrange the entries in the entries div
    for (var i = 0; i < ids_order.length; i++) {
        var entry = document.getElementById(ids_order[i]);
        
    }
}

function categoryDictionaryInSpeedRange(category_dictionary, minSpeed, maxSpeed) {
    // The category dictionary is a Dict[str, int]
    // The minSpeed and maxSpeed are floating point numbers
    // This function returns sum of the values within the range [minSpeed, maxSpeed]

    // Get the keys of the category dictionary
    var keys = Object.keys(category_dictionary);
    // Initialize the sum to 0
    var sum = 0;
    // For each key in the category dictionary
    for (var i = 0; i < keys.length; i++) {
        // If the key is within the range [minSpeed, maxSpeed]
        if (parseFloat(keys[i]) >= minSpeed && parseFloat(keys[i]) <= maxSpeed) {
            // Add the value of the key to the sum
            sum += category_dictionary[keys[i]];
        }
    }
    return sum;
}

    

// function mergeCategoryEntries(list_dicts) {
//     // The list of dictionaries is a list of Dict[str, int]
//     // This function produces a Dict[str, int] where the keys are the keys of the inner dictionaries

//     // Get the keys of the inner dictionaries
//     var inner_keys = Object.keys(list_dicts[0]);
//     // Initialize the merged dictionary
//     var merged_dictionary = {};
//     // For each key in the inner dictionaries
//     for (var i = 0; i < inner_keys.length; i++) {
//         // Initialize the value of the key in the merged dictionary to 0
//         merged_dictionary[inner_keys[i]] = 0;
//     }

//     // For each dictionary in the list of dictionaries
//     for (var i = 0; i < list_dicts.length; i++) {
//         // For each key in the inner dictionaries
//         for (var j = 0; j < inner_keys.length; j++) {
//             // Add the value of the key in the json blob to the value of the key in the merged dictionary
//             merged_dictionary[inner_keys[j]] += list_dicts[i][inner_keys[j]];
//         }
//     }
//     return merged_dictionary;
// }

function mergeAllCategories(json_blob) {
    // The json blob is a Dict[str, Dict[str, str]] 
    // This function produces a Dict[float, int] where the keys are the keys of the inner dictionaries

    // Get the keys of the inner dictionaries
    var inner_keys = Object.keys(json_blob[Object.keys(json_blob)[0]]);
    // Map the inner keys to floating point numbers
    inner_keys = inner_keys.map(Number);
    // Initialize the merged dictionary
    var merged_dictionary = {};
    // For each key in the inner dictionaries
    for (var i = 0; i < inner_keys.length; i++) {
        // Initialize the value of the key in the merged dictionary to 0
        merged_dictionary[inner_keys[i]] = 0;
    }

    // For each key in the json blob
    for (var key in json_blob) {
        // For each key in the inner dictionaries
        for (var i = 0; i < inner_keys.length; i++) {
            // Add the value of the key in the json blob to the value of the key in the merged dictionary
            num = parseFloat(json_blob[key][inner_keys[i]]);
            if (!isNaN(num)) {
                merged_dictionary[inner_keys[i]] += num;
            }
        }
    }
    return merged_dictionary;

}

function fetchCategory(json_blob, category) {
    // The json blob is a Dict[str, Dict[str, str]] 
    // The category is a string in the outer dictionary
    entries_str_keys_values = json_blob[category];
    // Convert the values of the entries dictionary to floating point numbers while keeping the keys.
    // Keep as a dictionary
    entries_float_keys_values = {};
    for (var key in entries_str_keys_values) {
        entries_float_keys_values[parseFloat(key)] = parseFloat(entries_str_keys_values[key]);
    }
    return entries_float_keys_values;    
}


function setupMinMaxSliders(json_blob) {
    // Get the first entry in the JSON blob
    var first_key_values = json_blob[Object.keys(json_blob)[0]];
    // Fixed values for the sliders are the keys of the first entry in the JSON blob
    var fixedValues = Object.keys(first_key_values);
    // Convert the fixed values to floating point numbers
    fixedValues = fixedValues.map( function(x) { return parseFloat(x); } );
    // Sort the fixed values in ascending order
    fixedValues.sort((a, b) => a - b);
    // Append to "fixedValues" the value of positive infinity
    fixedValues.push(Infinity);

    console.log(fixedValues)

    minFixedValues = fixedValues.slice(0, fixedValues.length - 1);
    maxFixedValues = fixedValues.slice(1, fixedValues.length);

    // var fixedValues = [10, 20, 30, 40, 50]; // Your fixed set of values

    // Function to update output
    function updateOutputMin(slider, output) {
        output.value = minFixedValues[slider.value];
    }

    function updateOutputMax(slider, output) {
        output.value = maxFixedValues[slider.value];
    }

    // Get slider elements
    var sliderMin = document.getElementById('fixedValueSlider1');
    var outputMin = document.getElementById('sliderOutput1');
    var sliderMax = document.getElementById('fixedValueSlider2');
    var outputMax = document.getElementById('sliderOutput2');

    // Set the number of fixed values to be the number of entries in the fixedValues array
    sliderMin.max = minFixedValues.length - 1;
    sliderMax.max = maxFixedValues.length - 1;
    // Set the value min slider to 0, and the max slider to the last index of the fixedValues array
    sliderMin.value = 0;
    sliderMax.value = maxFixedValues.length;

    // Update logic for Min slider
    sliderMin.oninput = function() {
        if (parseInt(sliderMin.value) > parseInt(sliderMax.value)) {
            sliderMax.value = sliderMin.value;
            updateOutputMax(sliderMax, outputMax);
        }
        updateOutputMin(sliderMin, outputMin);
    };

    // Update logic for Max slider
    sliderMax.oninput = function() {
        if (parseInt(sliderMax.value) < parseInt(sliderMin.value)) {
            sliderMin.value = sliderMax.value;
            updateOutputMin(sliderMin, outputMin);
        }
        updateOutputMax(sliderMax, outputMax);
    };

    // Initialize outputs
    updateOutputMin(sliderMin, outputMin);
    updateOutputMax(sliderMax, outputMax);
}

// Get the id of every div inside the entries div
var entries_str_keys_values = document.getElementsByClassName("entries")[0];
var alphabetical_ids = [];
for (var i = 0; i < entries_str_keys_values.children.length; i++) {
    alphabetical_ids.push(entries_str_keys_values.children[i].id);
}
document.getElementById("num_found").innerText = alphabetical_ids.length;

// Function to load JSON data
function loadJSON(path) {
    return fetch(path).then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok for ' + path);
        }
        return response.json();
    });
}

// Load the JSON files in parallel and store them in json_lookup
var json_count_lookup = {};
var jsonPromises = alphabetical_ids.map(id => {
    var json_path = "./val_data/" + id + "/category_count.json";
    return loadJSON(json_path).then(json => {
        json_count_lookup[id] = json;
    }).catch(error => {
        console.error('Failed to load ' + json_path, error);
    });
});

Promise.all(jsonPromises).then(() => {
    console.log('All JSON files loaded', json_count_lookup);
    // You can now use json_lookup as needed
});

// Update the entries of the "category_menu" form to be the keys of dictionary stored in the first id in json_lookup
function updateCategoryMenu(json_blob) {
    var category_menu = document.getElementsByName("category_menu")[0];
    var category_keys = Object.keys(json_blob);
    // Sort the keys alphabetically
    category_keys.sort();
    for (var i = 0; i < category_keys.length; i++) {
        var option = document.createElement("option");
        option.value = category_keys[i];
        option.text = category_keys[i];
        category_menu.appendChild(option);
    }
}
// Wait for the promise of the first JSON file to be loaded before updating the category menu
jsonPromises[0].then(() => {
    json_blob = json_count_lookup[alphabetical_ids[0]]
    updateCategoryMenu(json_blob);
    setupMinMaxSliders(json_blob);
});