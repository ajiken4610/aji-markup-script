declare module "lex-bnf" {
  export interface Token {
    _term: string;
    _type: string;
  }
  export interface Term {
    elements: (Term | Token)[];
    name: string;
    contents: () => any[];
  }
  export default class Language {
    constructor(syntaxes: unknown[]);
    static syntax(
      name: string,
      terms: string[][],
      termFunction?: (term: Term) => any
    ): unknown;
    static literal(literal: string): string;
    static strlit: string;
    static lex: (value: string) => string;
    parse(string: string): Term;
    tokenize(string: string): Token[];
  }
}
