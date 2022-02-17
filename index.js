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

const URL = "https://vancouver-db.herokuapp.com/vancouverv1/userRecords";


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
        data.arrests = JSON.parse(data.arrests);
        data.citations = JSON.parse(data.citations);
        console.log('Player Data:', data)

        arrestsLabel.innerHTML = `Arrests: ${data.arrests ? data.arrests.length : '0'}`;
        citationsLabel.innerHTML = `Citations: ${data.citations ? data.citations.length: '0'}`;
        boloLabel.innerHTML = `Bolo: ${data.warrant}`;
        avatarImage.src = `https://www.roblox.com/bust-thumbnail/image?userId=${data.userId}&width=180&height=180&format=png`;
        
        while (arrestsList.children.length > 1) {
            arrestsList.children[arrestsList.children.length - 1].remove();
        }

        while (citationsList.children.length > 1) {
            citationsList.children[citationsList.children.length - 1].remove();
        }

        if (data.arrests.length >= 1) {
            for (let arrestData of data.arrests) {
                let recordElement = recordPreFab.cloneNode(true);
                console.log(arrestData);
                recordElement.innerHTML = `[${arrestData[2]}s] ${arrestData[0]}`;
                recordElement.onclick = function() {
                    let infoAlert = bootstrapInfo(arrestData[1]);
                    document.getElementById('mainDiv').prepend(infoAlert);
                };
                recordElement.hidden = false;
                arrestsList.appendChild(recordElement);
            }
        }

        if (data.citations.length >= 1) {
            for (let citationData of data.citations) {
                let recordElement = recordPreFab.cloneNode(true);
                console.log(citationData);
                recordElement.innerHTML = `[$${citationData[2]}] ${citationData[0]}`;
                recordElement.onclick = function() {
                    let infoAlert = bootstrapInfo(citationData[1]);
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
        console.log('verified event', { key: e.key });
    });
    submitCaptcha.addEventListener('error', (e) => {
        console.log('error event', { error: e.error });
    });
})