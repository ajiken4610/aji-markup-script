## 文法
AMSは階層構造となっている。
階層構造の仕様は以下のようになっている。

- 1つのプログラムは、Paragraphとして定義される。
- Paragraphは、0つ以上のSentenceの配列である。
- Sentenceは0つ以上のWordのチェーンである。
- Wordは以下のオブジェクトの総称である。
    - Variable
    - Invoker
    - Text
    - Paragraph
- Variableは、変数を表す。
- Invokerは、最大で1つのWordを含む。

### Paragraph  
Paragraphは、`{}`でくくって定義する。  
Paragraphに対して呼び出しが行われると、
if `;`で終わっている
    配列のeachのようにParagraphのそれぞれの要素に対して呼び出され，結果の値が入ったParagraphを返す。
else
    最後の値が返る
`{}`内で`;`を用いてSentenceを分ける。

### Sentence
Sentenceに対して呼び出しが行われると、保持しているWordが連鎖的に呼び出され、その結果が返る。  
例えば、以下のようなSentenceがあったとき、  
`AA:BB\CC`
AAにBBが引数として与えられて呼び出され、その結果にたいして\CCを引数として呼び出され、その結果が帰ってくる。  

### Variable
変数は`\(変数名)`として表され、`\(変数名)`は参照を返す。`\(変数名)`に呼び出しを行うと値が帰ってくる。Variableを引数アリで呼び出すと、引数.invokeFinal()が変数に入る。  

### Invoker
引数が1つのWordで表せるときに使う。  
例えば、`\AA:BB`とあったら、変数`AA`にText"BB"が入る。
