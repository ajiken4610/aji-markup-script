import Language, { Term } from "lex-bnf";
const { syntax, literal, strlit } = Language;

export interface Word {}
export class Paragraph implements Word {
  sentences: Sentence[];
  returnAll: boolean;
  constructor(sentences: Sentence[], returnAll: boolean) {
    this.returnAll = returnAll;
    this.sentences = sentences;
  }
  toJSON() {
    return {
      [this.constructor.name +
      "(" +
      (this.returnAll ? "RetAll" : "RetLast") +
      ")"]: this.sentences,
    };
  }
}
export class Sentence {
  words: Word[];
  constructor(words: Word[]) {
    this.words = words;
  }
  toJSON() {
    return { [this.constructor.name]: this.words };
  }
}
export class Text implements Word {
  text: string;
  constructor(text: string) {
    this.text = text;
  }
  toJSON() {
    return { [this.constructor.name]: this.text };
  }
}
export class Invoker implements Word {
  toJSON() {
    return this.constructor.name;
  }
}
export class Variable {
  name: string;
  constructor(text: string) {
    this.name = text;
  }
  toJSON() {
    return { [this.constructor.name]: this.name };
  }
}

const defaultContentFunc = (term: Term) => {
  const terms = Array.prototype.concat(...term.contents());
  //   console.log(terms);
  return terms;
};
const ams = new Language([
  syntax("syntax", [["top_level"]], defaultContentFunc),
  syntax("top_level", [["sentences"], ["paragraph"]], defaultContentFunc),
  syntax(
    "paragraph",
    [["all_value_paragraph"], ["last_value_paragraph"]],
    defaultContentFunc
  ),
  syntax(
    "all_value_paragraph",
    [
      [literal("{"), literal("}")],
      [literal("{"), "all_value_sentences", literal("}")],
    ],
    (term: Term) => {
      const noStrings = Array.prototype
        .concat(...term.contents())
        .filter((val: unknown) => typeof val !== "string");
      return new Paragraph(noStrings, true);
    }
  ),
  syntax(
    "last_value_paragraph",
    [
      [literal("{"), literal("}")],
      [literal("{"), "last_value_sentences", literal("}")],
    ],
    (term: Term) => {
      const noStrings = Array.prototype
        .concat(...term.contents())
        .filter((val: unknown) => typeof val !== "string");
      return new Paragraph(noStrings, false);
    }
  ),
  syntax(
    "sentence_and_splitter",
    [["sentence", literal(";")]],
    defaultContentFunc
  ),
  syntax(
    "splitter_and_sentence",
    [[literal(";"), "sentence"]],
    defaultContentFunc
  ),
  syntax(
    "sentences",
    [["all_value_sentences", "last_value_sentences"]],
    defaultContentFunc
  ),
  syntax(
    "all_value_sentences",
    [["sentence_and_splitter*"]],
    defaultContentFunc
  ),
  syntax(
    "last_value_sentences",
    [["sentence", "splitter_and_sentence*"]],
    defaultContentFunc
  ),

  syntax("sentence", [["words"]], (term: Term) => {
    const noStrings = term
      .contents()[0]
      .filter((val: unknown) => typeof val !== "string");
    return noStrings;
  }),
  syntax(
    "words",
    [["word_strlit", "word*"], ["word_strlit"]],
    defaultContentFunc
  ),
  syntax("word_strlit", [["word"], [strlit]], (term: Term) => {
    const text = term.contents()[0];
    return typeof text === "string" ? new Text(text) : text;
  }),
  syntax(
    "word",
    [["paragraph"], ["invoker"], ["variable"]],
    defaultContentFunc
  ),
  syntax("variable", [[literal("\\"), strlit]], (term: Term) => {
    const name: string = term.contents()[1];
    return new Variable(name);
  }),
  syntax("invoker", [[literal(":"), strlit], [literal(":")]], (term: Term) => {
    const text: string = term.contents()[1];
    return text ? new Text(text) : new Invoker();
  }),
]);

export const parseAMS = (src: string) => {
  src = src.replaceAll("\n", "");
  return ams.parse(src);
};

export const getTermStruct = (term: Term, index = 0) => {
  interface Ret {
    [key: string]: string | string[] | Ret | undefined;
    args?: string[];
  }
  const isTerm = (child: any): child is Term => child.elements;
  const ret: Ret = {};
  let i = 0;
  for (const child of term.elements) {
    if (isTerm(child)) {
      ret[child.name + index++] = getTermStruct(child, index);
    } else {
      ret.args || (ret.args = []);
      ret.args[i++] = child._term;
    }
  }
  return ret;
};

export const getTermStructString = (term: Term) => {
  return JSON.stringify(getTermStruct(term), null, 2);
};
