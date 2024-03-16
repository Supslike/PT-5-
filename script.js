var main_form = document.getElementById("main-form");
var secondary_form = document.getElementById("secondary-form");
var subjects = document.getElementById("sliding");

let animation_idx = 1
let cur_idx = 0
function g(name) {return document.getElementById(name)}
function a(name) {return document.querySelectorAll("." + name)}

let person = {
    "fname": "",
    "lname": "",
    "gender": "",
    "month": "",
    "transpo": "",
    "description": ""
}

let survey_format = [
    `<fieldset>
    <label for="fname">First Name </label>
    <input name="fname" type="text" id="fname" required placeholder="John">
    <br><br>
    <label for="lname">Last Name </label>
    <input type="text" name="lname" id="lname" required placeholder="Smith">
    <br><br>
    <label for="gender">Gender</label>
    <br>
    <div class="choice-pick">
        <div class="choice-picker">
            <label for="male">Male</label>
            <input class="gender-input" type="radio" value="male" id="male" name="gender-choice">
        </div>
        <div class="choice-picker">
            <label for="female">Female</label>
            <input class="gender-input" type="radio" value="female" id="female" name="gender-choice">
        </div>
    </div>
    <br><br><br><br>
    <div class="button-holder">
        <button type="button" class="but-0" id="previous">Previous</button>
        <button type="button" class="but-1" id="next">Next</button>
    </div>
    
</fieldset>`,
`<fieldset>
<label for="">How do you go to school? </label>
<br>
<div class="choice-pick">
    <div class="choice-picker">
        <label for="walk">Walking</label>
        <input class="transpo-pick" value="walking" type="checkbox" id="walk" name="transpo-pick">
    </div>
    <div class="choice-picker">
        <label for="car">Car</label>
        <input class="transpo-pick" value="driving a car" type="checkbox" id="car" name="transpo-pick">
    </div>
    <div class="choice-picker">
        <label for="bus">Bus</label>
        <input class="transpo-pick" value="taking a bus" type="checkbox" id="bus" name="transpo-pick">
    </div>
    <div class="choice-picker">
        <label for="commute">Commute</label>
        <input class="transpo-pick" value="commuting" type="checkbox" id="commute" name="transpo-pick">
    </div>
</div>
<br><br>
<label for="month">In what month were you born? </label>
<br>
<select name="month" id="birth-month" aria-placeholder="lol">
    <option value="">Please select...</option>
    <option value="january">January</option>
    <option value="february">February</option>
    <option value="march">March</option>
    <option value="april">April</option>
    <option value="may">May</option>
    <option value="june">June</option>
    <option value="july">July</option>
    <option value="august">August</option>
    <option value="september">September</option>
    <option value="october">October</option>
    <option value="november">November</option>
    <option value="december">December</option>
</select>
<br><br>
<label>Please say something about yourself</label>
<textarea id="about-them" cols="30" rows="10"></textarea>
<br><br>
<div class="button-holder">
    <button type="button" class="but-0" id="previous">Previous</button>
    <button type="button" class="but-1" id="next">Next</button>
</div>
</fieldset>`,
`<fieldset>
<label>Are these informations correct?</label>
<br>
<img src="static/{gender}.jpeg" alt="">
<h6>{fname} {lname}</h6>
<br>
<p>A <strong> {{gender}} </strong> person that goes to school by <i>{transpo}</i>. Born in the month of <strong>{month}</strong>, and has a description of: </p>
<br>
<p> - {description}</p>
<br>
<div class="button-holder">
    <button type="button" class="but-0" id="previous">No</button>
    <button type="button" class="but-1" id="next">Yes</button>
</div>
</fieldset>`,
`<fieldset class="thankyou">
<h4 class="reveal">Thank you for submitting! 🎉🎉🎉</h4>
<br><br><br><br>
</br><br>
<div class="button-holder thankyou">
    <button type="button" class="but-0" id="previous" onclick="window.location.reload()">Reset</button>
    <button type="button" class="but-1" onclick="window.location.reload()" id="next">Go Back</button>
</div>
</fieldset>`
]

function next_info(added) {
    let children = subjects.children;
    for (let i = 0; i < children.length; i++) {
        var transformValue = getComputedStyle(children[i]).transform
        var match = transformValue.match(/matrix\(([^,]+),([^,]+),([^,]+),([^,]+),([^,]+),([^,]+)\)/);
        var translateX = parseFloat(match[5]);  
        var translateY = parseFloat(match[6]);
        var newX = translateX + added;
        children[i].style.transform = `matrix(${match[1]}, ${match[2]}, ${match[3]}, ${match[4]}, ${newX}, ${translateY})`;
        children[i].classList = "";
    }
    children[cur_idx-1].classList = "rev";
}

function addOxfordComma(list) {
    if (list.length === 0) {
        return '';
    } else if (list.length === 1) {
        return list[0];
    } else if (list.length === 2) {
        return list.join(' and ');
    } else {
        let result = '';
        for (let i = 0; i < list.length - 1; i++) {
            result += list[i] + ', ';
        }
        result += 'and ' + list[list.length - 1];
        return result;
    }
}

function validate() {
    let questions = [
        [{'element': g("fname"), "type": 0, "name": "fname"}, {'element': g("lname"), "type": 0, "name": "lname"}, {'element': a("gender-input"), "type": 1, "name": "gender"}],
        [{'element': a("transpo-pick"), "type": 1, "name": "transpo"}, {'element': g("birth-month"), "type": 0, "name": "month"}, {'element': g("about-them"), "type": 0, "name": "description"}],
        []
    ]
    let has_empty = false
    let cur_form = questions[cur_idx - 1]
    for (let i = 0; i < cur_form.length; i++) {
        let has_unchecked = false
        let element = cur_form[i]["element"];
        if (cur_form[i]["type"] == 0) {
            if (element.value == "") {
                has_empty = true
            }
            else {
                person[cur_form[i]["name"]] = element.value;
            }
        } else {
            let chosen = []
            for (let o = 0; o < element.length; o++) {
                if (element[o].checked) {
                    has_unchecked = true;
                    chosen.push(element[o].value) 
                }
            }
            person[cur_form[i]["name"]] = addOxfordComma(chosen)
            if (!has_unchecked) {
                has_empty = true
            }
        }
    }
    return has_empty
}

function capitalizeString(str) {
    return str.replace(/\b\w/g, function(char) {
        return char.toUpperCase();
    });
}

function next_elements(parent) {
    for (let i = 0; i < parent.children.length; i++) {
        parent.removeChild(parent.children[i]);
    }
    parent.innerHTML = survey_format[cur_idx].replace("{fname}", person["fname"])
                                      .replace("{lname}", person["lname"])
                                      .replace(`{{gender}}`, person["gender"])
                                      .replace(`{gender}`, person["gender"])
                                      .replace("{transpo}", person["transpo"])
                                      .replace("{month}", capitalizeString(person["month"]))
                                      .replace("{description}", person["description"]);
    cur_idx++
    listerners()
}

function prev_elements(parent) {
    for (let i = 0; i < parent.children.length; i++) {
        parent.removeChild(parent.children[i]);
    }
    cur_idx -= 2
    parent.innerHTML = survey_format[cur_idx].replace("{fname}", person["fname"])
                                      .replace("{lname}", person["lname"])
                                      .replace(`{gender}`, person["gender"])
                                      .replace(`{{gender}}`, person["gender"])
                                      .replace("{transpo}", person["transpo"])
                                      .replace("{month}", capitalizeString(person["month"]))
                                      .replace("{description}", person["description"]);
    cur_idx++
    listerners()
}

function next() {
    if (animation_idx == 0) {
        if (validate()) {
            alert("Missing fields!")
            return
        }
        next_elements(main_form);
        main_form.classList = "all-form next";
        secondary_form.classList = "all-form prev";
        animation_idx++;
        next_info(-400)
    }
    else {
        if (validate()) {
            alert("Missing fields!")
            return
        }
        next_elements(secondary_form);
        main_form.classList = "all-form prev";
        secondary_form.classList = "all-form next";
        animation_idx--;
        next_info(-400)
    }
}

function prev() {
    if (cur_idx <= 1) {
        return
    }
    if (animation_idx == 0) {
        prev_elements(main_form)
        main_form.classList = "all-form next";
        secondary_form.classList = "all-form prev";
        animation_idx++;
        next_info(400)
    }
    else {
        prev_elements(secondary_form)
        main_form.classList = "all-form prev";
        secondary_form.classList = "all-form next";
        animation_idx--; 
        next_info(400)
    }   
}

function listerners() {
    let u = prev
    for (let i = 0; i < 2; i++) {
        let elements = document.querySelectorAll(".but-" + i)
        for (let o = 0; o < elements.length; o++) {
            elements[o].addEventListener("click", u)
        }
        u = next;
    }
}
    
listerners();
next_elements(main_form)
subjects.children[0].classList = "rev"
next_info(150)