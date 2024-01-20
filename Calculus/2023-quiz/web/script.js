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
    var quizContainer = document.getElementById('quiz-container');
    var othersContainer = document.getElementById('others-container');

    //  quiz
    for (let i = 0; i < config.quizs.length; i += 2) {
        let card = createAndAppendElement(quizContainer, 'div', { 'class': 'card' });
        
        createAndAppendElement(card, 'h3', { 'textContent': `Calculus Quiz ${i / 2}` });
        createAndAppendElement(card, 'a', {
            'href': './../' + config.quizs[i],
            'textContent': 'Quiz',
            'class': 'button',
            'target': '_blank'
        });
        createAndAppendElement(card, 'a', {
            'href': './../' + config.quizs[i + 1],
            'textContent': 'Solution',
            'class': 'button',
            'target': '_blank'
        });
    }

    //  others
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





