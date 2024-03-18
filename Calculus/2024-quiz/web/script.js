function createAndAppendElement(parent, tag, attributes = {}) {
    const element = document.createElement(tag);

    // class 
    if (attributes.class) {
        attributes.class.split(" ").forEach(className => element.classList.add(className));
        delete attributes.class;  // delete class in attributes
    }
    // dataset
    if (attributes.dataset) {
        Object.keys(attributes.dataset).forEach(key => element.dataset[key] = attributes.dataset[key]);
        delete attributes.dataset;  // delete dataset in attributes
    }
    // other attributes
    Object.keys(attributes).forEach(key => element[key] = attributes[key]);

    parent.appendChild(element);
    return element;
}

document.addEventListener('DOMContentLoaded', function() {
    const quizContainer = document.getElementById('quiz-container');
    const cardDoms = [];
    for (let i = 0; i < config.quizs.length;++i) {
        const file_name = config.quizs[i].split(".")[0];
        if(`${file_name}.pdf`.endsWith("solution.pdf")) continue;
        console.log(file_name)
        const card = createAndAppendElement(quizContainer, 'div', { class: 'card', id: file_name });
        const title = createAndAppendElement(card, 'h3', { textContent: `Calculus Quiz ${i}` });
        const quizBtn = createAndAppendElement(card, 'a', {
            'href': './../' + `${file_name}.pdf`,
            'textContent': 'Quiz',
            'class': 'button',
            'target': '_blank'
        });
        cardDoms.push(card);
    }

    for (let i = 0; i < cardDoms.length;++i) {
        const cardDom = cardDoms[i];
        const file_name = cardDom.id;
        const solutionBtn = createAndAppendElement(cardDom, 'a', {
            'href': './../' +  `${file_name}-solution.pdf`,
            'textContent': 'Solution',
            'class': 'button',
            'target': '_blank'
        });

        if(!config.quizs.includes(`${file_name}-solution.pdf`)){
            solutionBtn.classList.add("not-exist");
            solutionBtn.href = "";
        }
    }



    //  others
    const othersContainer = document.getElementById('others-container');
    config.others.forEach(file => {
        let card = createAndAppendElement(othersContainer, 'div', { 'class': 'card' });
        
        createAndAppendElement(card, 'h3', { 'textContent': file.split('.pdf')[0] });
        createAndAppendElement(card, 'a', {
            'href': './../' + file,
            'textContent': 'Open File',
            'class': 'button',
            'target': '_blank'
        });
    });
});





