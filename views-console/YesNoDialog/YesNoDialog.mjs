import { Console } from "console-mpds";

export class YesNoDialog {

    static #AFFIRMATIVE = `y`;
    static #NEGATIVE = `n`;    
    #answer;

    read(question) {
        const console = new Console();
        let ok;
        do {
            const SUFFIX = `? (` +
                YesNoDialog.#AFFIRMATIVE + `/` +
                YesNoDialog.#NEGATIVE + `): `;
            this.#answer = console.readString((question ?? "") + SUFFIX);
            ok = this.isAffirmative() || this.#isNegative();
            if (!ok) {
                const ERROR = `The value must be ${YesNoDialog.#AFFIRMATIVE} or ${YesNoDialog.#NEGATIVE}`;
                console.writeln(ERROR);
            }
        } while (!ok);
    }

    isAffirmative() {
        return this.#getAnswer() === YesNoDialog.#AFFIRMATIVE;
    }

    #isNegative() {
        return this.#getAnswer() === YesNoDialog.#NEGATIVE;
    }

    #getAnswer() {
        return this.#answer.toLowerCase()[0];
    }
}