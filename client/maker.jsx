const helper = require('./helper.js');
const React = require('react');
const ReactDOM = require('react-dom');

const handleDomo = (e) => {
    e.preventDefault();
    helper.hideError();

    const name = e.target.querySelector('#domoName').value;
    const age = e.target.querySelector('#domoAge').value;
    const color = e.target.querySelector('#domoColor').value;


    if (!name || !age || !color) {
        helper.handleError('All fields are required');
        return false;
    }

    helper.sendPost(e.target.action, { name, age, color }, loadDomosFromServer);

    let namesDisplay = document.querySelector('#domosNames').textContent;
    let justNames = namesDisplay.split(": ").pop();

    namesDisplay.textContent = "[Out Of Date!]Domo names in Alphatbetical Order: " + justNames;

    return false;
};
const newButton = () => {
    let domos = document.querySelector('.domoList').querySelectorAll('.domo');
    let namesDisplay = document.querySelector('#domosNames');

    let domoNames = [];



    for (let d = 0; d < domos.length; d++) {
        let nameString = domos[d].querySelector('.domoName').textContent.toLowerCase();
        let namePop = nameString.split(": ").pop();
        domoNames.push(namePop);
    }

    let orderedNames = domoNames.sort();
    const capitalizedNames = orderedNames.map(name => name.charAt(0).toUpperCase() + name.slice(1));

    namesDisplay.textContent = `Current Domo names in Alphabetical order: ${capitalizedNames}`;



}

const DomoForm = (props) => {
    return (
        <form id="domoForm"
            onSubmit={handleDomo}
            name='domoForm'
            action='/maker'
            method="POST"
            className='domoForm'>
            <label htmlFor="name">Name:</label>
            <input type="text" name="name" id="domoName" placeholder='Domo Name' />
            <label htmlFor="age">Age:</label>
            <input type="number" name="age" id="domoAge" min="0" />
            <label htmlFor="color">Color:</label>
            <input type="text" name="color" id="domoColor" placeholder='Domo Color' />
            <input type="submit" value="Make Domo" className='makeDomoSubmit' />

            <button type="button" onClick={newButton}>Get names in alphabetical order</button>
        </form>
    );
};

const DomoAgeList = (props) => {
    if (props.domos.length === 0) {
        return (
            <div className='domoList'>
                <h3 className="emptyDomo">No Domos Yet!</h3>
            </div>
        );
    };

    console.log(props.domos);

}

const DomoList = (props) => {
    if (props.domos.length === 0) {
        return (
            <div className='domoList'>
                <h3 className="emptyDomo">No Domos Yet!</h3>
            </div>
        );
    }

    const domoNodes = props.domos.map(domo => {
        return (
            <div key={domo._id} className="domo">
                <img src="/assets/img/domoface.jpeg" alt="domo" className='domoFace' />
                <h3 className="domoName">Name: {domo.name}</h3>
                <h3 className="domoAge">Age: {domo.age}</h3>
                <h3 className="domoColor">Color: {domo.color}</h3>
            </div>
        );
    });
    return (
        <div className="domoList">
            {domoNodes}
        </div>
    );
};

const loadDomosFromServer = async () => {
    const response = await fetch('/getDomos');
    const data = await response.json();


    ReactDOM.render(
        <DomoList domos={data.domos} />,
        document.getElementById('domos')
    );
    if (data) {
        newButton();
    }
};

const init = () => {
    ReactDOM.render(<DomoForm />,
        document.getElementById('makeDomo')
    );

    ReactDOM.render(
        <DomoList domos={[]} />,
        document.getElementById('domos')
    );
    loadDomosFromServer();
}

window.onload = init;