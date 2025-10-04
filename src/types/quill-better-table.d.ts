declare module 'quill-better-table' {
  import { Quill } from 'quill';

  interface BetterTableModule {
    insertTable(rows: number, columns: number): void;
  }

  interface QuillBetterTableStatic {
    keyboardBindings: any;
  }

  const QuillBetterTable: QuillBetterTableStatic;
  export default QuillBetterTable;
}

declare module 'quill-better-table/dist/quill-better-table.css';
