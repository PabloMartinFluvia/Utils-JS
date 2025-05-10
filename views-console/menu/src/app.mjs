import { Console } from "console-mpds";


// options
export class Option {
    static console = new Console();

    #title;

    constructor(title) {
        this.#title = title;
    }

    interact() {}

    write(position) {
        Option.console.writeln(`${position}. ${this.#title}`);
    }

}

export class QuitOption extends Option{

    #executed;

    constructor() {
        super(`Exit`);
        this.#executed = false;
    }

    interact() {
        this.#executed = true;
    }

    isQuitExecuted() {
        return this.#executed;
    }
}

// menus
export class Menu {
    #title
    #options

    constructor(title) {
        this.#title = title;
        this.clearOptions_();
    }

    interact() {
        this.setupOptions_();
        this.executeOption_();
    }

    setupOptions_() {}; // abstract

    addOption_(option) {
        this.#options.push(option);
    }

    executeOption_() {
        this.#write();
        this.#readOption();
    }

    hasOption_(option) {
        return this.#options.includes(option);
    }

    clearOptions_() {
        this.#options = [];
    }

    #write() {
        Option.console.writeln(`---${this.#title}--`);
        for (let i = 0; i < this.#options.length; i++) {
            this.#options[i].write(i+1);
        }
    }

    #readOption() {
        let index;
        let valid;
        do {
            index = Option.console.readNumber(`Enter Option :`) - 1;
            valid = 0 <= index && index < this.#options.length;
            if (!valid) {
                Option.console.writeln(`Error: value must be [1 - ${this.#options.length}]`);
            }
        } while (!valid);
        this.#options[index].interact();
    }

}

export class QuitMenu extends Menu{

    #quitOption;

    constructor(title) {
        super(title);
        this.#quitOption = new QuitOption();
    }

    setupOptions_() {  
        this.setupModelOptions_();
        if (!this.hasOption_(this.#quitOption)) {
            this.addOption_(this.#quitOption);  
        }            
    }

    setupModelOptions_(){} // abstract

    isQuitExecuted_() {
        return this.#quitOption.isQuitExecuted();
    }
}

export class DynamicIterativeMenu extends QuitMenu {
    constructor(title) {
        super(title);
    }

    interact() {                        
        do {
            this.executeIteration_();
        } while (!this.isQuitExecuted_());
    }

    executeIteration_() {
        this.clearOptions_();
        this.setupOptions_();
        this.executeOption_();
    }

    setupModelOptions_(){} // abstract 
}

export class StaticIterativeMenu extends DynamicIterativeMenu {

    constructor(title) {
        super(title);
    }

    interact() {
        this.setupOptions_();                
        super.interact();
    }

    executeIteration_() {
        this.executeOption_();
    }

    setupModelOptions_(){} // abstract    
}

//////////////////// Following code as implementation example ////////////////


// Model

/*
class Model {
    #name;
    #adress;
    #tasks;

    constructor() {
        this.#name = `Bertan`;
        this.#adress = `Under the bridge, USA`;
        this.#tasks = ["clean house", "book fly", "repair car", "buy medicine", "call mom"];
    }

    set name(name) {
        this.#name = name;
    }

    get details() {
        let msg = `name: ${this.#name}\n`;
        msg += `adress: ${this.#adress}\n`;
        msg += `tasks: ${this.#tasks}`
        return msg;
    }

    get tasks() {
        return this.#tasks;
    }

    priorizeTask(index) {
        if (index !== 0) {
            const prev = this.#tasks[index - 1];
            this.#tasks[index - 1] = this.#tasks[index];
            this.#tasks[index] = prev;
        } 
    }

}

// Model's options

class ModelOption extends Option{
    #model;

    constructor(model, title) {
        super(title);
        this.#model = model;
    }

    interact() {}; // abstract

    get model_() {
        return this.#model;
    }
}

class UpdateNameModelOption extends ModelOption{

    constructor(model) {
        super(model, `Change Name`)
    }

    interact() {        
        this.model_.name = Option.console.readString(`Enter name:`);
    }

}

class ShowDetailsModelOption extends ModelOption{

    constructor(model) {
        super(model, `Show Details`)
    }

    interact() {     
        Option.console.writeln(this.model_.details);
    }

}

class ShowTasksModelOption extends ModelOption{

    constructor(model) {
        super(model, `Show Tasks`)
    }

    interact() {     
        for (let task of this.model_.tasks) {
            Option.console.writeln(`- ${task}`);
        }
    }

}

class PriorizeTaskModelOption extends ModelOption {
    #index;

    constructor(model, index) {
        super(model, `Priorize: ${model.tasks[index]}`);
        this.#index = index;
    }

    interact() {
        this.model_.priorizeTask(this.#index);               
    }
}

// Model's menus

class MenuModel extends Menu{
    #model

    constructor(model) {
        super(`NoDynamic_NoIterative_NoQuitOption_MenuModel`);
        this.#model = model;
    }

    setupOptions_() {
        this.addOption_(new UpdateNameModelOption(this.#model));
        this.addOption_(new ShowDetailsModelOption(this.#model));
    }

}

new MenuModel(new Model).interact();

class QuitMenuModel extends QuitMenu {
    #model

    constructor(model) {
        super(`NoDynamic_NoIterative_QuitOption_QuitMenuModel`);
        this.#model = model;
    }

    setupModelOptions_() {
        this.addOption_(new UpdateNameModelOption(this.#model));
        this.addOption_(new ShowDetailsModelOption(this.#model));
    }
}

new QuitMenuModel(new Model).interact();

class DynamicIterativeMenuModel extends DynamicIterativeMenu {
    #model

    constructor(model) {
        super(`Dynamic_Iterative_QuitOption_DynamicIterativeMenuModel`);
        this.#model = model;
    }

    setupModelOptions_() {
        for (let i = 0; i < this.#model.tasks.length; i++) {
            this.addOption_(new PriorizeTaskModelOption(this.#model, i));
        }
    }
}

// Model option wich inits a submenu

class PriorizeTasksModelOption extends ModelOption {    

    constructor(model) {
        super(model, `Priorize tasks`);        
    }

    interact() {
        new DynamicIterativeMenuModel(this.model_).interact();     
    }
}

// Model menu with a submenu

class WithSubMenusStaticIterativeMenuModel extends StaticIterativeMenu {
    #model

    constructor(model) {
        super(`WithSubMenu_NoDynamic_Iterative_QuitOption_WithSubMenusStaticIterativeMenuModel`);
        this.#model = model;
    }

    setupModelOptions_() {        
        this.addOption_(new ShowTasksModelOption(this.#model));
        this.addOption_(new PriorizeTasksModelOption(this.#model));
        this.addOption_(new ShowDetailsModelOption(this.#model));
    }
}

new WithSubMenusStaticIterativeMenuModel(new Model).interact();

*/


