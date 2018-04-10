const form = document.querySelector('form');
const input = document.querySelector('input');
const button = document.querySelector('button');
const ul = document.querySelector('ul');
// Creates li with appended elements, appends to ul 
function createLI(text, doneOrRegret) {
	const li = document.createElement('li');
	const p = document.createElement('p');
	p.textContent = text;

	const removeButton = document.createElement('span');
	removeButton.className = 'spanButton';
	removeButton.textContent = 'Remove';

	const doneButton = document.createElement('span');
	doneButton.className = 'spanButton doneButton';
	doneButton.textContent = doneOrRegret;

	li.appendChild(p);
	li.appendChild(removeButton);
	li.appendChild(doneButton);

	ul.appendChild(li);
	saveData();
	return li;
}
// Check if there is local storage
// For each recreates the li with textContent and appends doneMarker if done is true 
if (localStorage['localData']) {
	let allTasks = JSON.parse(localStorage['localData']);
	allTasks.forEach(object=>{
		let button = '';
		const toDo = object.toDo;

		if (object.done){
			button =  'Regret';
			const li = createLI(toDo, button);
			insertDoneMarker(li);
			
		} else {
			button =  'Done';
			const li = createLI(toDo, button);
		}
	})
}
//Inserts doneMarker before first span
function insertDoneMarker(li) {
	const doneThing = document.createElement('span');
	const spanButton = li.querySelector('.spanButton');
	doneThing.textContent = '\u2713';
	li.insertBefore(doneThing, spanButton)
}
// Checks if li is marked as done, if so isDone = true
// Grabs the innerHTML of the p element
// Pushes the data to lisToSave
// Repeats for every li, then saves to localStorage 			
var localData;
function saveData(){
	const listItems = document.querySelectorAll('li');
	let lisToSave = [];
	for (let i = 0; i < listItems.length; i ++) {
		let listItem = listItems[i];
		let isDone;
 		//Checks if doneButton is pressed
		if(listItem.querySelector('.doneButton').innerText == 'Done'){
			isDone = false;
		}else{
			isDone = true;
		}
		//Pushes the "to-do" and isDone boolean in an object to task
		lisToSave.push({
			'toDo' : listItem.querySelector('p').innerHTML,
			'done' : isDone
		});

	}
	localStorage['localData'] = JSON.stringify(lisToSave);
};

form.addEventListener('submit', (e) => {
	e.preventDefault();
	if (input.value == "") {
		alert('Enter a thing that you need to do!');

	} else {
		const text = input.value;
		createLI(text, 'Done');
		input.value = "";
		saveData();
	}
});

ul.addEventListener('click', (e) => {
	if(e.target.tagName != 'SPAN') return;
	const li = e.target.parentNode;
	const ul = li.parentNode;
	const action = e.target.textContent;
	const nameAction = {
		Remove: () => {
			ul.removeChild(li);
			saveData();
		},
		Done: () => {
			insertDoneMarker(li);
			e.target.textContent = 'Regret';
      		saveData();
		},
		Regret: () => {
			const doneThing = li.querySelector('span');
			doneThing.remove();
			e.target.textContent = 'Done';
			saveData();
		}
	}
	nameAction[action]();
});