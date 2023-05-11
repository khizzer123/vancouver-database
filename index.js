let captchaKey;

function bootstrapAlert(message){
    let element = document.createElement("div");
    element.innerHTML = `<div class="alert alert-danger alert-dismissible fade show" role="alert">
    ${message}
    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    </div>`
    return element;
};

function bootstrapInfo(message){
    let element = document.createElement("div");
    element.innerHTML = `<div class="alert alert-info alert-dismissible fade show" role="alert">
    ${message}
    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    </div>`
    return element;
};

const URL = "https://51.195.198.17:443/userRecords";


async function userLookup(username) {
    const results = document.getElementById('results');
    const avatarImage = document.getElementById('avatarImage');
    const usernameLabel = document.getElementById('usernameLabel');
    const arrestsLabel = document.getElementById('arrestsLabel');
    const citationsLabel = document.getElementById('citationsLabel');
    const boloLabel = document.getElementById('boloLabel');
    const recordPreFab = document.getElementById('recordBtn');
    const arrestsList = document.getElementById('arrestsList');
    const citationsList = document.getElementById('citationsList');

    try {
        let data = await fetch(URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                token: captchaKey,
                username: username
            }),
        });
        data = await data.json();

        results.hidden = false;
        usernameLabel.innerHTML = `Username: ${username}`;
/*         data.arrests = JSON.parse(data.arrests);
        data.citations = JSON.parse(data.citations); */
        console.log('Player Data:', data)

        const arrestsLength = data.arrests ? Object.keys(data.arrests).length : '0';
        const citationsLength = data.citations ? Object.keys(data.citations).length : '0';

        arrestsLabel.innerHTML = `Arrests: ${arrestsLength}`;
        citationsLabel.innerHTML = `Citations: ${citationsLength}`;
        boloLabel.innerHTML = `Bolo: ${data.warrant}`;
        //avatarImage.src = `https://www.roblox.com/bust-thumbnail/image?userIds=${data.userId}&width=180&height=180&format=png`;
        
        while (arrestsList.children.length > 1) {
            arrestsList.children[arrestsList.children.length - 1].remove();
        }

        while (citationsList.children.length > 1) {
            citationsList.children[citationsList.children.length - 1].remove();
        }

        if (data.arrests == null) {
            data.arrests = [];
        };
        if (data.citations == null) {
            data.citations = [];
        }

        let arrests = Object.values(data.arrests);
        let citations = Object.values(data.citations);

        function sortByDates(arr) {
            arr.sort((a, b) => {
                const firstDateSplit = a.Date.split('/');
                const secondDateSplit = b.Date.split('/');
    
                const firstDate = new Date(firstDateSplit[2], firstDateSplit[0], firstDateSplit[1]);
                const secondDate = new Date(secondDateSplit[2], secondDateSplit[0], secondDateSplit[1]);
    
                if (firstDate < secondDate) {
                    return -1;
                } else if (firstDate > secondDate) {
                    return 1;
                } else {
                    return 0;
                }
            })
            return arr;
        }
        arrests = sortByDates(arrests);

        if (arrestsLength >= 1) {
            for (let arrestData of arrests) {
                let recordElement = recordPreFab.cloneNode(true);
                recordElement.innerHTML = `[${arrestData.Length}s] ${arrestData.Offences.toString()}`;
                recordElement.onclick = function() {
                    let infoAlert = bootstrapInfo(`DATE: ${arrestData.Date} / DETAILS: ${arrestData.Details} / OFFICER: ${arrestData.Officer} / OFFICER TEAM: ${arrestData.OfficerTeam}`);
                    document.getElementById('mainDiv').prepend(infoAlert);
                };
                recordElement.hidden = false;
                arrestsList.appendChild(recordElement);
            }
        }

        citations = sortByDates(citations);

        if (citationsLength >= 1) {
            for (let citationData of citations) {
                let recordElement = recordPreFab.cloneNode(true);
                recordElement.innerHTML = `[${citationData.Price}] ${citationData.Offences.toString()}`;
                recordElement.onclick = function() {
                    let infoAlert = bootstrapInfo(`DATE: ${citationData.Date} / DETAILS: ${citationData.Details} / OFFICER: ${citationData.Officer} / OFFICER TEAM: ${citationData.OfficerTeam}`);
                    document.getElementById('mainDiv').prepend(infoAlert);
                };
                recordElement.hidden = false;
                citationsList.appendChild(recordElement);
            }
        }

    } catch (error) {
        console.log(error)
        let errorAlert = bootstrapAlert('There was an error with this request. You may have typed the username wrong or the database may not be available. If the Vancouver bot does not work either, please contact Khizzer.');
        document.getElementById('mainDiv').prepend(errorAlert);
    }
}

document.addEventListener('DOMContentLoaded', function(){

    document.getElementById('submitBtn').onclick = function(){
        let input = document.getElementById('usernameInputBox').value
        console.log(input)
        if (captchaKey === undefined) {
            console.log('No captcha key')
            let alert = document.getElementById('errorAlert');
            let alertWrapper = bootstrapAlert('You need to complete the hCaptcha!');
            document.getElementById('mainDiv').prepend(alertWrapper);
        } else {
            userLookup(input);
        }
    }

    const submitCaptcha = document.getElementById('captcha');
    
    submitCaptcha.addEventListener('verified', (e) => {
        captchaKey = e.key;
    });
    submitCaptcha.addEventListener('error', (e) => {
        console.log('error event', { error: e.error });
    });
})